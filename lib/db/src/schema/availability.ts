import { pgTable, text, serial, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { roomsTable } from "./rooms";

export const availabilityTable = pgTable("availability", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => roomsTable.id, { onDelete: "cascade" }),
  dateFrom: date("date_from", { mode: "string" }).notNull(),
  dateTo: date("date_to", { mode: "string" }).notNull(),
  status: text("status").notNull().default("blocked"),
  note: text("note"),
});

export const insertAvailabilitySchema = createInsertSchema(availabilityTable).omit({ id: true });
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type Availability = typeof availabilityTable.$inferSelect;
