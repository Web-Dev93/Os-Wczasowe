import { pgTable, text, serial, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { roomsTable } from "./rooms";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => roomsTable.id, { onDelete: "set null" }),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  checkIn: date("check_in", { mode: "string" }).notNull(),
  checkOut: date("check_out", { mode: "string" }).notNull(),
  guestsCount: integer("guests_count").notNull().default(1),
  childrenCount: integer("children_count").notNull().default(0),
  message: text("message"),
  status: text("status").notNull().default("pending"),
  type: text("type").notNull().default("inquiry"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
