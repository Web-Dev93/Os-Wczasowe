import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, landingLeadsTable } from "@workspace/db";
import { publicFormLimiter } from "../middlewares/rateLimit";
import { sendMail, isMailConfigured, getMailRecipient } from "../lib/mailer";

const router: IRouter = Router();

/** Zabezpieczenie przed wstrzyknięciem HTML w treść maila */
function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(d: { name: string; email: string; phone: string; message?: string }): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 16px;font-weight:600;color:#475569;width:150px;border-bottom:1px solid #e2e8f0;vertical-align:top;">${label}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">${value}</td>
    </tr>`;

  return `<html><body style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#222;">
  <div style="background:linear-gradient(135deg,#0e7490,#0369a1);border-radius:12px;padding:24px 28px;margin-bottom:24px;">
    <h1 style="color:#fff;margin:0;font-size:22px;">Nowe zapytanie ze strony</h1>
    <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Ktoś jest zainteresowany zakupem strony dla ośrodka.</p>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    ${row("Imię / obiekt", esc(d.name))}
    ${row("E-mail", `<a href="mailto:${esc(d.email)}" style="color:#0e7490;">${esc(d.email)}</a>`)}
    ${row("Telefon", `<a href="tel:${esc(d.phone)}" style="color:#0e7490;">${esc(d.phone)}</a>`)}
    ${d.message?.trim() ? row("Wiadomość", esc(d.message.trim()).replace(/\n/g, "<br>")) : ""}
  </table>
  <p style="margin-top:24px;color:#94a3b8;font-size:12px;text-align:center;">
    Wiadomość wysłana automatycznie z formularza na stronie sprzedażowej.
  </p>
</body></html>`;
}

// Publiczny: formularz kontaktowy ze strony sprzedażowej.
// Kolejność jest istotna — najpierw ZAPIS w bazie, potem próba wysyłki maila.
// Dzięki temu zgłoszenie nie przepada, gdy poczta nie jest skonfigurowana
// albo chwilowo nie odpowiada.
router.post("/landing/contact", publicFormLimiter, async (req, res): Promise<void> => {
  const { name, email, phone, message } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    res.status(400).json({ error: "Podaj imię, email i telefon." });
    return;
  }

  const lead = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    message: message?.trim() || null,
  };

  let saved;
  try {
    [saved] = await db.insert(landingLeadsTable).values(lead).returning();
  } catch (err) {
    req.log.error({ err }, "Nie udało się zapisać zapytania z formularza");
    res.status(500).json({ error: "Błąd serwera. Spróbuj ponownie lub napisz bezpośrednio na e-mail." });
    return;
  }

  const result = await sendMail({
    subject: `Nowe zapytanie od ${lead.name}`,
    html: buildHtml(lead),
    replyTo: lead.email,
  });

  await db
    .update(landingLeadsTable)
    .set({ emailSent: result.sent, emailError: result.error ?? null })
    .where(eq(landingLeadsTable.id, saved.id));

  if (result.sent) {
    req.log.info({ leadId: saved.id, to: getMailRecipient() }, "Zapytanie zapisane i wysłane e-mailem");
  } else if (!isMailConfigured()) {
    req.log.warn({ leadId: saved.id }, "Zapytanie zapisane w bazie — poczta nieskonfigurowana (SMTP_USER/SMTP_PASS)");
  } else {
    req.log.error({ leadId: saved.id, err: result.error }, "Zapytanie zapisane, ale e-mail się nie wysłał");
  }

  // Dla odwiedzającego zgłoszenie jest przyjęte, gdy trafiło do bazy —
  // odzyskanie kontaktu nie zależy od tego, czy poczta akurat działa.
  res.json({ ok: true });
});

export default router;
