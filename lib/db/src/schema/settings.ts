import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  resortName: text("resort_name").notNull().default("Ośrodek Nadmorski"),
  tagline: text("tagline"),
  description: text("description"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  whatsapp: text("whatsapp"),
  facebook: text("facebook"),
  logoUrl: text("logo_url"),
  heroImageUrl: text("hero_image_url"),
  theme: text("theme").notNull().default("professional"),
  bookingMode: text("booking_mode").notNull().default("both"),
  checkInTime: text("check_in_time").default("14:00"),
  checkOutTime: text("check_out_time").default("10:00"),
  adminPassword: text("admin_password").notNull().default("admin123"),
  bookingComIcalUrl: text("booking_com_ical_url"),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;
