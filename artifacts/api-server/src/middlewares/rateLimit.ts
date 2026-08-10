import rateLimit from "express-rate-limit";

/** Guards public, unauthenticated form endpoints (contact/booking inquiries) from spam/bots. */
export const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Zbyt wiele zgłoszeń. Spróbuj ponownie później." },
});
