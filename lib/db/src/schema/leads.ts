import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";

/**
 * Zapytania ze strony sprzedażowej (formularz "Napisz do nas").
 * Zapisujemy każde zgłoszenie w bazie ZANIM spróbujemy wysłać e-mail —
 * dzięki temu żaden kontakt nie przepada, nawet gdy poczta jest
 * nieskonfigurowana albo chwilowo nie działa.
 */
export const landingLeadsTable = pgTable("landing_leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  /** Czy udało się wysłać powiadomienie e-mail */
  emailSent: boolean("email_sent").notNull().default(false),
  /** Treść błędu, jeśli wysyłka się nie powiodła (do diagnozy) */
  emailError: text("email_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type LandingLead = typeof landingLeadsTable.$inferSelect;
export type InsertLandingLead = typeof landingLeadsTable.$inferInsert;
