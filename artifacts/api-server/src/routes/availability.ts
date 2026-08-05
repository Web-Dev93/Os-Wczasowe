import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, availabilityTable } from "@workspace/db";
import {
  GetAvailabilityQueryParams,
  GetAvailabilityResponse,
  AdminListAvailabilityQueryParams,
  AdminListAvailabilityResponse,
  AdminCreateAvailabilityBody,
  AdminCreateAvailabilityResponse,
  AdminDeleteAvailabilityParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

// Public
router.get("/availability", async (req, res): Promise<void> => {
  const params = GetAvailabilityQueryParams.safeParse(req.query);
  if (params.success && params.data.roomId) {
    const blocks = await db.select().from(availabilityTable).where(eq(availabilityTable.roomId, params.data.roomId));
    res.json(GetAvailabilityResponse.parse(blocks));
    return;
  }
  const blocks = await db.select().from(availabilityTable);
  res.json(GetAvailabilityResponse.parse(blocks));
});

// Admin
router.get("/admin/availability", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminListAvailabilityQueryParams.safeParse(req.query);
  if (params.success && params.data.roomId) {
    const blocks = await db.select().from(availabilityTable).where(eq(availabilityTable.roomId, params.data.roomId));
    res.json(AdminListAvailabilityResponse.parse(blocks));
    return;
  }
  const blocks = await db.select().from(availabilityTable);
  res.json(AdminListAvailabilityResponse.parse(blocks));
});

router.post("/admin/availability", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminCreateAvailabilityBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const toDateStr = (v: unknown) =>
    v instanceof Date ? v.toISOString().slice(0, 10) : (v as string);
  const [block] = await db.insert(availabilityTable).values({
    roomId: parsed.data.roomId,
    dateFrom: toDateStr(parsed.data.dateFrom),
    dateTo: toDateStr(parsed.data.dateTo),
    status: parsed.data.status,
    note: parsed.data.note,
  }).returning();
  res.status(201).json(AdminCreateAvailabilityResponse.parse(block));
});

router.delete("/admin/availability/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminDeleteAvailabilityParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(availabilityTable).where(eq(availabilityTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
