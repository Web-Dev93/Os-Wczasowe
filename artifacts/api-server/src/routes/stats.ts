import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, roomsTable, bookingsTable } from "@workspace/db";
import { AdminGetStatsResponse } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [totalRoomsRow] = await db.select({ count: count() }).from(roomsTable);
  const [activeRoomsRow] = await db.select({ count: count() }).from(roomsTable).where(eq(roomsTable.isActive, true));
  const [totalBookingsRow] = await db.select({ count: count() }).from(bookingsTable);
  const [pendingRow] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "pending"));
  const [confirmedRow] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "confirmed"));
  const [cancelledRow] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "cancelled"));

  const recentRaw = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt).limit(5);
  const recentBookings = recentRaw.map((b) => ({
    ...b,
    roomName: null,
    createdAt: b.createdAt.toISOString(),
  }));

  res.json(
    AdminGetStatsResponse.parse({
      totalRooms: totalRoomsRow?.count ?? 0,
      activeRooms: activeRoomsRow?.count ?? 0,
      totalBookings: totalBookingsRow?.count ?? 0,
      pendingBookings: pendingRow?.count ?? 0,
      confirmedBookings: confirmedRow?.count ?? 0,
      cancelledBookings: cancelledRow?.count ?? 0,
      recentBookings,
    })
  );
});

export default router;
