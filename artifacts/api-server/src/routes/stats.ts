import { Router, type IRouter } from "express";
import { and, eq, count, desc, isNull } from "drizzle-orm";
import { db, roomsTable, bookingsTable } from "@workspace/db";
import { AdminGetStatsResponse } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const notDeleted = isNull(bookingsTable.deletedAt);
  const [totalRoomsRow] = await db.select({ count: count() }).from(roomsTable);
  const [activeRoomsRow] = await db.select({ count: count() }).from(roomsTable).where(eq(roomsTable.isActive, true));
  const [totalBookingsRow] = await db.select({ count: count() }).from(bookingsTable).where(notDeleted);
  const [pendingRow] = await db.select({ count: count() }).from(bookingsTable).where(and(eq(bookingsTable.status, "pending"), notDeleted));
  const [confirmedRow] = await db.select({ count: count() }).from(bookingsTable).where(and(eq(bookingsTable.status, "confirmed"), notDeleted));
  const [cancelledRow] = await db.select({ count: count() }).from(bookingsTable).where(and(eq(bookingsTable.status, "cancelled"), notDeleted));

  const recentRaw = await db.select().from(bookingsTable).where(notDeleted).orderBy(desc(bookingsTable.createdAt)).limit(5);
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
