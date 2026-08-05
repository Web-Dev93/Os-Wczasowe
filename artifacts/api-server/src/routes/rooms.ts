import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, roomsTable, roomPhotosTable } from "@workspace/db";
import {
  ListRoomsResponse,
  GetRoomParams,
  GetRoomResponse,
  AdminListRoomsResponse,
  AdminCreateRoomBody,
  AdminCreateRoomResponse,
  AdminGetRoomParams,
  AdminGetRoomResponse,
  AdminUpdateRoomParams,
  AdminUpdateRoomBody,
  AdminUpdateRoomResponse,
  AdminDeleteRoomParams,
  AdminAddRoomPhotoParams,
  AdminAddRoomPhotoBody,
  AdminAddRoomPhotoResponse,
  AdminDeleteRoomPhotoParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

async function getRoomWithPhotos(id: number) {
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, id));
  if (!room) return null;
  const photos = await db.select().from(roomPhotosTable).where(eq(roomPhotosTable.roomId, id)).orderBy(roomPhotosTable.sortOrder);
  return { ...room, photos };
}

async function getAllRoomsWithPhotos(activeOnly = false) {
  const rooms = activeOnly
    ? await db.select().from(roomsTable).where(eq(roomsTable.isActive, true)).orderBy(roomsTable.sortOrder)
    : await db.select().from(roomsTable).orderBy(roomsTable.sortOrder);
  const allPhotos = await db.select().from(roomPhotosTable).orderBy(roomPhotosTable.sortOrder);
  return rooms.map((r) => ({
    ...r,
    photos: allPhotos.filter((p) => p.roomId === r.id),
  }));
}

// Public
router.get("/rooms", async (_req, res): Promise<void> => {
  const rooms = await getAllRoomsWithPhotos(true);
  res.json(ListRoomsResponse.parse(rooms));
});

router.get("/rooms/:id", async (req, res): Promise<void> => {
  const params = GetRoomParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const room = await getRoomWithPhotos(params.data.id);
  if (!room) {
    res.status(404).json({ error: "Pokój nie znaleziony" });
    return;
  }
  res.json(GetRoomResponse.parse(room));
});

// Admin
router.get("/admin/rooms", requireAdmin, async (_req, res): Promise<void> => {
  const rooms = await getAllRoomsWithPhotos(false);
  res.json(AdminListRoomsResponse.parse(rooms));
});

router.post("/admin/rooms", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminCreateRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [room] = await db.insert(roomsTable).values(parsed.data).returning();
  const roomWithPhotos = { ...room, photos: [] };
  res.status(201).json(AdminCreateRoomResponse.parse(roomWithPhotos));
});

router.get("/admin/rooms/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminGetRoomParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const room = await getRoomWithPhotos(params.data.id);
  if (!room) {
    res.status(404).json({ error: "Pokój nie znaleziony" });
    return;
  }
  res.json(AdminGetRoomResponse.parse(room));
});

router.put("/admin/rooms/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminUpdateRoomParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = AdminUpdateRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [updated] = await db.update(roomsTable).set(parsed.data).where(eq(roomsTable.id, params.data.id)).returning();
  if (!updated) {
    res.status(404).json({ error: "Pokój nie znaleziony" });
    return;
  }
  const photos = await db.select().from(roomPhotosTable).where(eq(roomPhotosTable.roomId, updated.id));
  res.json(AdminUpdateRoomResponse.parse({ ...updated, photos }));
});

router.delete("/admin/rooms/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminDeleteRoomParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(roomsTable).where(eq(roomsTable.id, params.data.id));
  res.sendStatus(204);
});

router.post("/admin/rooms/:id/photos", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminAddRoomPhotoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = AdminAddRoomPhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const existingPhotos = await db.select().from(roomPhotosTable).where(eq(roomPhotosTable.roomId, params.data.id));
  const [photo] = await db.insert(roomPhotosTable).values({
    roomId: params.data.id,
    url: parsed.data.url,
    caption: parsed.data.caption,
    sortOrder: existingPhotos.length,
  }).returning();
  res.status(201).json(AdminAddRoomPhotoResponse.parse(photo));
});

router.delete("/admin/rooms/:id/photos/:photoId", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminDeleteRoomPhotoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(roomPhotosTable).where(eq(roomPhotosTable.id, params.data.photoId));
  res.sendStatus(204);
});

export default router;
