import { pgTable, text, serial, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  capacity: integer("capacity").notNull().default(2),
  pricePerNight: real("price_per_night").notNull().default(0),
  minNights: integer("min_nights").notNull().default(1),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  coverPhotoUrl: text("cover_photo_url"),
  amenities: text("amenities").array().notNull().default([]),
});

export const insertRoomSchema = createInsertSchema(roomsTable).omit({ id: true });
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof roomsTable.$inferSelect;

export const roomPhotosTable = pgTable("room_photos", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => roomsTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertRoomPhotoSchema = createInsertSchema(roomPhotosTable).omit({ id: true });
export type InsertRoomPhoto = z.infer<typeof insertRoomPhotoSchema>;
export type RoomPhoto = typeof roomPhotosTable.$inferSelect;
