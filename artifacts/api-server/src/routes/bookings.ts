import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookingsTable, roomsTable } from "@workspace/db";
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
router.post("/inquiries", async (req, res): Promise<void> => {
  const parsed = SubmitInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const toDateStr = (v: unknown) =>
    v instanceof Date ? v.toISOString().slice(0, 10) : (v as string);
  const [booking] = await db.insert(bookingsTable).values({
    roomId: parsed.data.roomId ?? null,
    guestName: parsed.data.guestName,
    guestEmail: parsed.data.guestEmail,
    guestPhone: parsed.data.guestPhone,
    checkIn: toDateStr(parsed.data.checkIn),
    checkOut: toDateStr(parsed.data.checkOut),
    guestsCount: parsed.data.guestsCount,
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
  let query = db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
  if (params.success && params.data.status) {
    const all = await db.select().from(bookingsTable).where(eq(bookingsTable.status, params.data.status)).orderBy(bookingsTable.createdAt);
    const enriched = await enrichBookings(all);
    res.json(AdminListBookingsResponse.parse(enriched));
    return;
  }
  const all = await query;
  const enriched = await enrichBookings(all);
  res.json(AdminListBookingsResponse.parse(enriched));
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
  const [updated] = await db.update(bookingsTable).set(parsed.data).where(eq(bookingsTable.id, params.data.id)).returning();
  if (!updated) {
    res.status(404).json({ error: "Rezerwacja nie znaleziona" });
    return;
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
  await db.delete(bookingsTable).where(eq(bookingsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
