import nodemailer, { type Transporter } from "nodemailer";
import { logger } from "./logger";

/**
 * Wysyłka e-mail przez SMTP (domyślnie Gmail).
 * Konfiguracja przez zmienne środowiskowe:
 *   SMTP_USER  — konto nadawcy (np. adres Gmail)
 *   SMTP_PASS  — hasło aplikacji (App Password), NIE zwykłe hasło do konta
 *   SMTP_TO    — adres odbiorcy powiadomień (domyślnie SMTP_USER)
 *   SMTP_HOST / SMTP_PORT — opcjonalnie, dla innego dostawcy niż Gmail
 *
 * Gdy SMTP_USER/SMTP_PASS nie są ustawione, wysyłka jest pomijana —
 * zgłoszenia i tak zapisują się w bazie, więc nic nie ginie.
 */

let cached: Transporter | null = null;

export function isMailConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getMailRecipient(): string | null {
  return process.env.SMTP_TO || process.env.SMTP_USER || null;
}

function getTransport(): Transporter | null {
  if (!isMailConfigured()) return null;
  if (cached) return cached;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);

  cached = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
  });
  return cached;
}

export async function sendMail(opts: {
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
  const transport = getTransport();
  const to = getMailRecipient();

  if (!transport || !to) {
    return { sent: false, error: "SMTP nie jest skonfigurowany (brak SMTP_USER/SMTP_PASS)" };
  }

  try {
    await transport.sendMail({
      from: `"Strony dla Ośrodków" <${process.env.SMTP_USER}>`,
      to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ err }, "Nie udało się wysłać e-maila");
    return { sent: false, error: message };
  }
}
