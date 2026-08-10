import nodemailer, { type Transporter } from "nodemailer";
import { logger } from "./logger";

/**
 * Wysyłka e-mail. Obsługiwane są dwa kanały, sprawdzane w tej kolejności:
 *
 * 1. Resend (HTTP API) — zalecany dla serwera, lepsza dostarczalność niż
 *    SMTP z adresu VPS-a i bez hasła do prywatnego konta Google.
 *      RESEND_API_KEY — klucz z resend.com
 *      MAIL_FROM      — nadawca; bez zweryfikowanej domeny użyj
 *                       "onboarding@resend.dev" (dociera na adres, na który
 *                       założono konto Resend)
 *      MAIL_TO        — odbiorca powiadomień
 *
 * 2. SMTP (nodemailer) — np. Gmail z hasłem aplikacji:
 *      SMTP_USER, SMTP_PASS, opcjonalnie SMTP_HOST / SMTP_PORT / SMTP_TO
 *
 * Gdy żaden kanał nie jest skonfigurowany, wysyłka jest pomijana —
 * zgłoszenia i tak zapisują się w bazie, więc nic nie ginie.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function isMailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY || !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getMailRecipient(): string | null {
  return process.env.MAIL_TO || process.env.SMTP_TO || process.env.SMTP_USER || null;
}

function getMailSender(): string {
  return process.env.MAIL_FROM || process.env.SMTP_USER || "onboarding@resend.dev";
}

// ── Resend ────────────────────────────────────────────────────────────────

async function sendViaResend(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Strony dla Ośrodków <${getMailSender()}>`,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { sent: false, error: `Resend HTTP ${res.status}: ${body.slice(0, 300)}` };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── SMTP ──────────────────────────────────────────────────────────────────

let cachedTransport: Transporter | null = null;

function getTransport(): Transporter | null {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  if (cachedTransport) return cachedTransport;

  const port = Number(process.env.SMTP_PORT || 465);
  cachedTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return cachedTransport;
}

async function sendViaSmtp(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
  const transport = getTransport();
  if (!transport) return { sent: false, error: "SMTP nieskonfigurowany" };

  try {
    await transport.sendMail({
      from: `"Strony dla Ośrodków" <${process.env.SMTP_USER}>`,
      to: opts.to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ err }, "SMTP: nie udało się wysłać e-maila");
    return { sent: false, error: message };
  }
}

// ── API modułu ────────────────────────────────────────────────────────────

export async function sendMail(opts: {
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
  const to = getMailRecipient();
  if (!to) {
    return { sent: false, error: "Brak adresu odbiorcy (MAIL_TO)" };
  }

  if (process.env.RESEND_API_KEY) {
    const result = await sendViaResend({ ...opts, to });
    if (result.sent) return result;
    // Resend padł — spróbuj SMTP, jeśli jest skonfigurowany
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      logger.warn({ err: result.error }, "Resend nie zadziałał, próbuję SMTP");
      return sendViaSmtp({ ...opts, to });
    }
    logger.error({ err: result.error }, "Nie udało się wysłać e-maila przez Resend");
    return result;
  }

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return sendViaSmtp({ ...opts, to });
  }

  return { sent: false, error: "Poczta nieskonfigurowana (brak RESEND_API_KEY ani SMTP_USER/SMTP_PASS)" };
}
