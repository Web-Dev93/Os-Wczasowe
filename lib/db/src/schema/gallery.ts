import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryPhotosTable = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertGalleryPhotoSchema = createInsertSchema(galleryPhotosTable).omit({ id: true });
export type InsertGalleryPhoto = z.infer<typeof insertGalleryPhotoSchema>;
export type GalleryPhoto = typeof galleryPhotosTable.$inferSelect;
