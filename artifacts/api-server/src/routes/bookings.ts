import { Router, type IRouter } from "express";
import { and, eq, gt, lt, like, isNull } from "drizzle-orm";
import { db, bookingsTable, roomsTable, availabilityTable } from "@workspace/db";
import {
  SubmitInquiryBody,
  SubmitInquiryResponse,
  AdminListBookingsQueryParams,
  AdminListBookingsResponse,
  AdminGetBookingParams,
  AdminGetBookingResponse,
  AdminUpdateBookingParams,
  AdminUpdateBookingBody,
  AdminUpdateBookingResponse,
  AdminDeleteBookingParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { publicFormLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

async function enrichBooking(booking: typeof bookingsTable.$inferSelect) {
  let roomName: string | null = null;
  if (booking.roomId) {
    const [room] = await db.select({ name: roomsTable.name }).from(roomsTable).where(eq(roomsTable.id, booking.roomId));
    roomName = room?.name ?? null;
  }
  return {
    ...booking,
    roomName,
    createdAt: booking.createdAt.toISOString(),
  };
}

/** Marker in availability notes tying an auto-created block to its booking. */
function bookingBlockNote(bookingId: number, guestName: string): string {
  return `[rezerwacja #${bookingId}] ${guestName}`;
}

/** True if the room has a blocking availability entry overlapping [checkIn, checkOut). */
async function hasDateConflict(roomId: number, checkIn: string, checkOut: string): Promise<boolean> {
  const conflicts = await db
    .select({ id: availabilityTable.id })
    .from(availabilityTable)
    .where(
      and(
        eq(availabilityTable.roomId, roomId),
        eq(availabilityTable.status, "blocked"),
        lt(availabilityTable.dateFrom, checkOut),
        gt(availabilityTable.dateTo, checkIn),
      ),
    )
    .limit(1);
  return conflicts.length > 0;
}

async function enrichBookings(bookings: (typeof bookingsTable.$inferSelect)[]) {
  const rooms = await db.select({ id: roomsTable.id, name: roomsTable.name }).from(roomsTable);
  const roomMap = new Map(rooms.map((r) => [r.id, r.name]));
  return bookings.map((b) => ({
    ...b,
    roomName: b.roomId ? (roomMap.get(b.roomId) ?? null) : null,
    createdAt: b.createdAt.toISOString(),
  }));
}

// Public
router.post("/inquiries", publicFormLimiter, async (req, res): Promise<void> => {
  const parsed = SubmitInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const toDateStr = (v: unknown) =>
    v instanceof Date ? v.toISOString().slice(0, 10) : (v as string);

  // Konkretny pokój + zajęty termin → odrzucamy od razu, zamiast przyjmować
  // zapytanie, na które i tak trzeba by odpowiedzieć odmownie.
  if (parsed.data.roomId) {
    const conflict = await hasDateConflict(
      parsed.data.roomId,
      toDateStr(parsed.data.checkIn),
      toDateStr(parsed.data.checkOut),
    );
    if (conflict) {
      res.status(409).json({ error: "Wybrany termin jest już zajęty dla tego pokoju." });
      return;
    }
  }

  const [booking] = await db.insert(bookingsTable).values({
    roomId: parsed.data.roomId ?? null,
    guestName: parsed.data.guestName,
    guestEmail: parsed.data.guestEmail,
    guestPhone: parsed.data.guestPhone,
    checkIn: toDateStr(parsed.data.checkIn),
    checkOut: toDateStr(parsed.data.checkOut),
    guestsCount: parsed.data.guestsCount,
    childrenCount: parsed.data.childrenCount ?? 0,
    message: parsed.data.message ?? null,
    type: parsed.data.type ?? "inquiry",
    status: "pending",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any).returning();
  const enriched = await enrichBooking(booking);
  res.status(201).json(SubmitInquiryResponse.parse(enriched));
});

// Admin
router.get("/admin/bookings", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminListBookingsQueryParams.safeParse(req.query);
  const notDeleted = isNull(bookingsTable.deletedAt);
  if (params.success && params.data.status) {
    const all = await db.select().from(bookingsTable).where(and(eq(bookingsTable.status, params.data.status), notDeleted)).orderBy(bookingsTable.createdAt);
    const enriched = await enrichBookings(all);
    res.json(AdminListBookingsResponse.parse(enriched));
    return;
  }
  const all = await db.select().from(bookingsTable).where(notDeleted).orderBy(bookingsTable.createdAt);
  const enriched = await enrichBookings(all);
  res.json(AdminListBookingsResponse.parse(enriched));
});

// Admin: eksport wszystkich (nieusunietych) rezerwacji do CSV.
// Uwaga: trasa musi byc zarejestrowana przed /admin/bookings/:id.
router.get("/admin/bookings/export.csv", requireAdmin, async (_req, res): Promise<void> => {
  const all = await db.select().from(bookingsTable).where(isNull(bookingsTable.deletedAt)).orderBy(bookingsTable.createdAt);
  const enriched = await enrichBookings(all);

  const esc = (v: unknown): string => {
    const s = v == null ? "" : String(v);
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const header = [
    "ID", "Gość", "Email", "Telefon", "Pokój", "Przyjazd", "Wyjazd",
    "Dorośli", "Dzieci", "Status", "Typ", "Wiadomość", "Notatki", "Utworzono",
  ];
  const rows = enriched.map((b) => [
    b.id, b.guestName, b.guestEmail, b.guestPhone, b.roomName ?? "Dowolny",
    b.checkIn, b.checkOut, b.guestsCount, b.childrenCount, b.status, b.type,
    b.message ?? "", b.adminNotes ?? "", b.createdAt,
  ].map(esc).join(";"));

  // BOM, żeby Excel poprawnie rozpoznał UTF-8 (polskie znaki)
  const csv = "﻿" + [header.join(";"), ...rows].join("\r\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="rezerwacje_${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});

router.get("/admin/bookings/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminGetBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, params.data.id));
  if (!booking) {
    res.status(404).json({ error: "Rezerwacja nie znaleziona" });
    return;
  }
  const enriched = await enrichBooking(booking);
  res.json(AdminGetBookingResponse.parse(enriched));
});

router.put("/admin/bookings/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminUpdateBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = AdminUpdateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [before] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, params.data.id));
  const [updated] = await db.update(bookingsTable).set(parsed.data).where(eq(bookingsTable.id, params.data.id)).returning();
  if (!updated) {
    res.status(404).json({ error: "Rezerwacja nie znaleziona" });
    return;
  }

  // Potwierdzenie rezerwacji blokuje termin w kalendarzu automatycznie;
  // cofnięcie potwierdzenia (anulowanie/powrót do oczekującej) zdejmuje
  // tylko blokady utworzone przez ten mechanizm (rozpoznawane po nocie).
  if (updated.roomId) {
    const marker = `[rezerwacja #${updated.id}]%`;
    if (updated.status === "confirmed" && before?.status !== "confirmed") {
      const alreadyBlocked = await db
        .select({ id: availabilityTable.id })
        .from(availabilityTable)
        .where(and(eq(availabilityTable.roomId, updated.roomId), like(availabilityTable.note, marker)))
        .limit(1);
      if (alreadyBlocked.length === 0) {
        await db.insert(availabilityTable).values({
          roomId: updated.roomId,
          dateFrom: updated.checkIn,
          dateTo: updated.checkOut,
          status: "blocked",
          note: bookingBlockNote(updated.id, updated.guestName),
        });
      }
    } else if (updated.status !== "confirmed" && before?.status === "confirmed") {
      await db
        .delete(availabilityTable)
        .where(and(eq(availabilityTable.roomId, updated.roomId), like(availabilityTable.note, marker)));
    }
  }

  const enriched = await enrichBooking(updated);
  res.json(AdminUpdateBookingResponse.parse(enriched));
});

router.delete("/admin/bookings/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminDeleteBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  // Miękkie usunięcie — rekord zostaje w bazie (odzyskiwalny SQL-em),
  // a ewentualna auto-blokada terminu z potwierdzenia jest zdejmowana.
  const [removed] = await db
    .update(bookingsTable)
    .set({ deletedAt: new Date() })
    .where(eq(bookingsTable.id, params.data.id))
    .returning();
  if (removed?.roomId) {
    await db
      .delete(availabilityTable)
      .where(and(eq(availabilityTable.roomId, removed.roomId), like(availabilityTable.note, `[rezerwacja #${removed.id}]%`)));
  }
  res.sendStatus(204);
});

export default router;
