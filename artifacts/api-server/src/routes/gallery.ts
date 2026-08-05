import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, galleryPhotosTable } from "@workspace/db";
import {
  ListGalleryResponse,
  AdminListGalleryResponse,
  AdminAddGalleryPhotoBody,
  AdminAddGalleryPhotoResponse,
  AdminDeleteGalleryPhotoParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

// Public
router.get("/gallery", async (_req, res): Promise<void> => {
  const photos = await db.select().from(galleryPhotosTable).orderBy(galleryPhotosTable.sortOrder);
  res.json(ListGalleryResponse.parse(photos));
});

// Admin
router.get("/admin/gallery", requireAdmin, async (_req, res): Promise<void> => {
  const photos = await db.select().from(galleryPhotosTable).orderBy(galleryPhotosTable.sortOrder);
  res.json(AdminListGalleryResponse.parse(photos));
});

router.post("/admin/gallery", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminAddGalleryPhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const existing = await db.select().from(galleryPhotosTable);
  const [photo] = await db.insert(galleryPhotosTable).values({
    url: parsed.data.url,
    caption: parsed.data.caption,
    sortOrder: existing.length,
  }).returning();
  res.status(201).json(AdminAddGalleryPhotoResponse.parse(photo));
});

router.delete("/admin/gallery/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminDeleteGalleryPhotoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(galleryPhotosTable).where(eq(galleryPhotosTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
