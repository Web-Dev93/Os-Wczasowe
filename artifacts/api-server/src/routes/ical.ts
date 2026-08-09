import { Router, type IRouter } from "express";
import { db, bookingsTable, availabilityTable, settingsTable, roomsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import dns, { type LookupAddress } from "node:dns";

const router: IRouter = Router();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format date as iCal DATE value: YYYYMMDD */
function toIcalDate(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

/** Format Date object as iCal DATETIME (UTC): YYYYMMDDTHHMMSSZ */
function toIcalDateTimeUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
}

function escapeIcal(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/** Convert raw iCal date token (YYYYMMDD or YYYYMMDDTHHMMSSZ) to ISO date string */
function icalTokenToIso(raw: string): string {
  const d = raw.replace(/T.*/, "");
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

/** Returns true if the given IPv4 or IPv6 address is private/reserved. */
function isPrivateIp(ip: string): boolean {
  // IPv6 loopback and link-local
  if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") return true;
  if (/^fe80:/i.test(ip)) return true;
  if (/^fc[0-9a-f]{2}:/i.test(ip)) return true;
  if (/^fd[0-9a-f]{2}:/i.test(ip)) return true;

  // IPv4-mapped IPv6 (::ffff:a.b.c.d) — extract the v4 part
  const v4mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  const ipv4 = v4mapped ? v4mapped[1] : ip;

  if (!/^\d+\.\d+\.\d+\.\d+$/.test(ipv4)) return false; // unknown format, let it through

  const parts = ipv4.split(".").map(Number);
  const [a, b] = parts;

  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) || // link-local / metadata
    (a === 100 && b >= 64 && b <= 127) // CGNAT
  );
}

/**
 * Validate that a URL is safe to use for server-side fetch:
 * - Must be HTTPS
 * - Host must be in the Booking.com / calendar-provider allowlist
 * - All resolved IPs must be public (DNS-level SSRF protection)
 */
async function assertSafeUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Nieprawidłowy URL.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("URL musi używać protokołu HTTPS.");
  }

  const host = parsed.hostname.toLowerCase();

  // Allowlist: only recognized calendar provider domains
  const allowedHosts = [
    "admin.booking.com",
    "www.booking.com",
    "booking.com",
    "ics.teamup.com",
    "calendar.google.com",
    "outlook.live.com",
    "outlook.office.com",
    "airbnb.com",
    "www.airbnb.com",
    "vrbo.com",
    "www.vrbo.com",
    "homeaway.com",
    "www.homeaway.com",
  ];

  const isAllowed = allowedHosts.some(
    (h) => host === h || host.endsWith(`.${h}`),
  );
  if (!isAllowed) {
    throw new Error(
      `Host „${host}" nie jest dozwolony. Dozwolone: Booking.com, Airbnb, VRBO, Google Calendar, Outlook.`,
    );
  }

  // Resolve all DNS addresses and reject if any resolves to a private range
  let addresses: LookupAddress[];
  try {
    addresses = await new Promise<LookupAddress[]>((resolve, reject) => {
      dns.lookup(host, { all: true }, (err, addrs) => {
        if (err) reject(err);
        else resolve(addrs as LookupAddress[]);
      });
    });
  } catch {
    throw new Error(`Nie można rozwiązać adresu DNS dla hosta „${host}".`);
  }

  for (const { address } of addresses) {
    if (isPrivateIp(address)) {
      throw new Error(
        `Host „${host}" rozwiązuje się do niedozwolonego adresu IP (${address}).`,
      );
    }
  }

  return parsed;
}

// ---------------------------------------------------------------------------
// GET /api/ical — public occupancy calendar (no PII)
// ---------------------------------------------------------------------------

/**
 * Exports confirmed bookings as iCal for import in Booking.com channel manager.
 * Only exports occupancy windows — NO guest PII (no names, emails, phones, messages).
 */
router.get("/ical", async (req, res): Promise<void> => {
  const bookings = await db
    .select({
      id: bookingsTable.id,
      checkIn: bookingsTable.checkIn,
      checkOut: bookingsTable.checkOut,
      status: bookingsTable.status,
    })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "confirmed"));

  const domain = req.hostname || "osrodek.local";
  const now = toIcalDateTimeUtc(new Date());

  const events = bookings.map((b) => {
    return [
      "BEGIN:VEVENT",
      `UID:booking-${b.id}@${domain}`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${toIcalDate(b.checkIn)}`,
      `DTEND;VALUE=DATE:${toIcalDate(b.checkOut)}`,
      `SUMMARY:${escapeIcal("Zajęte")}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
    ].join("\r\n");
  });

  // Also export availability blocks (already blocked dates)
  const blocks = await db
    .select({
      id: availabilityTable.id,
      dateFrom: availabilityTable.dateFrom,
      dateTo: availabilityTable.dateTo,
      note: availabilityTable.note,
    })
    .from(availabilityTable)
    .where(eq(availabilityTable.status, "blocked"));

  // Deduplicate by date range so we don't repeat per-room blocks
  const seenRanges = new Set<string>();
  const blockEvents = blocks
    .filter((bl) => {
      const key = `${bl.dateFrom}:${bl.dateTo}`;
      if (seenRanges.has(key)) return false;
      seenRanges.add(key);
      return true;
    })
    .map((bl) =>
      [
        "BEGIN:VEVENT",
        `UID:block-${bl.id}@${domain}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${toIcalDate(bl.dateFrom)}`,
        `DTEND;VALUE=DATE:${toIcalDate(bl.dateTo)}`,
        `SUMMARY:${escapeIcal(bl.note ?? "Zablokowane")}`,
        `STATUS:CONFIRMED`,
        "END:VEVENT",
      ].join("\r\n"),
    );

  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Osrodek Nadmorski//Booking Calendar//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Rezerwacje Ośrodka",
    "X-WR-TIMEZONE:Europe/Warsaw",
    ...events,
    ...blockEvents,
    "END:VCALENDAR",
  ].join("\r\n");

  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="rezerwacje.ics"');
  res.send(calendar);
});

// ---------------------------------------------------------------------------
// POST /api/admin/ical-import — import Booking.com calendar → availability blocks
// ---------------------------------------------------------------------------

router.post("/admin/ical-import", requireAdmin, async (req, res): Promise<void> => {
  // Resolve iCal URL: body.url > saved settings
  const bodyUrl =
    typeof req.body?.url === "string" && req.body.url.trim() !== ""
      ? req.body.url.trim()
      : null;

  const settingsRows = await db.select().from(settingsTable).limit(1);
  const savedUrl = settingsRows[0]?.bookingComIcalUrl ?? null;
  const rawUrl = bodyUrl ?? savedUrl;

  if (!rawUrl) {
    res.status(400).json({
      error: "Brak URL kalendarza iCal. Skonfiguruj go w Ustawieniach.",
    });
    return;
  }

  // Validate URL (SSRF protection — includes DNS resolution check)
  let validatedUrl: URL;
  try {
    validatedUrl = await assertSafeUrl(rawUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
    return;
  }

  // Fetch the calendar — no redirects to prevent open-redirect SSRF
  let icalText: string;
  try {
    const response = await fetch(validatedUrl.toString(), {
      headers: { "User-Agent": "OsrodekNadmorski/1.0" },
      signal: AbortSignal.timeout(10_000),
      redirect: "error",
    });
    if (!response.ok) {
      res.status(502).json({
        error: `Nie można pobrać kalendarza: HTTP ${response.status}`,
      });
      return;
    }
    icalText = await response.text();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(502).json({ error: `Błąd pobierania kalendarza: ${msg}` });
    return;
  }

  // Parse VEVENT blocks
  interface ParsedEvent {
    start: string;
    end: string;
    summary: string;
  }
  const events: ParsedEvent[] = [];
  const vevents = icalText.split("BEGIN:VEVENT").slice(1);

  for (const block of vevents) {
    const getVal = (key: string): string | null => {
      const m = block.match(new RegExp(`${key}(?:;[^:]*)?:([^\r\n]+)`));
      return m ? m[1].trim() : null;
    };

    const rawStart = getVal("DTSTART");
    const rawEnd = getVal("DTEND");
    const summary = getVal("SUMMARY") ?? "Booking.com";

    if (!rawStart || !rawEnd) continue;

    const start = icalTokenToIso(rawStart);
    const end = icalTokenToIso(rawEnd);

    // Sanity-check dates
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) continue;
    if (end <= start) continue;

    events.push({ start, end, summary });
  }

  if (events.length === 0) {
    res.json({ ok: true, eventsFound: 0, blocksWritten: 0 });
    return;
  }

  // Get all active rooms to attach blocks to
  const rooms = await db
    .select({ id: roomsTable.id })
    .from(roomsTable)
    .where(eq(roomsTable.isActive, true));

  if (rooms.length === 0) {
    res.json({
      ok: true,
      eventsFound: events.length,
      blocksWritten: 0,
      warning: "Brak aktywnych pokoi — dodaj pokoje w panelu aby importować blokady.",
    });
    return;
  }

  // Idempotent upsert: delete existing Booking.com blocks, insert fresh ones
  const NOTE_TAG = "booking.com-import";

  for (const room of rooms) {
    await db
      .delete(availabilityTable)
      .where(
        and(
          eq(availabilityTable.roomId, room.id),
          eq(availabilityTable.note, NOTE_TAG),
        ),
      );
  }

  const toInsert = events.flatMap((ev) =>
    rooms.map((room) => ({
      roomId: room.id,
      dateFrom: ev.start,
      dateTo: ev.end,
      status: "blocked" as const,
      note: NOTE_TAG,
    })),
  );

  await db.insert(availabilityTable).values(toInsert);

  res.json({
    ok: true,
    eventsFound: events.length,
    blocksWritten: toInsert.length,
    rooms: rooms.length,
  });
});

export default router;
