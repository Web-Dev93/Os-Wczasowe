import { Router, type IRouter } from "express";
import { ReplitConnectors } from "@replit/connectors-sdk";

const router: IRouter = Router();

function buildEmail(to: string, subject: string, htmlBody: string): string {
  // RFC 2822 format, UTF-8 encoded subject
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const lines = [
    `To: ${to}`,
    `From: ${to}`,
    `Subject: ${encodedSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    htmlBody,
  ];
  return lines.join("\r\n");
}

// Public: contact form from landing page → sends Gmail notification
router.post("/landing/contact", async (req, res): Promise<void> => {
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

  try {
    const connectors = new ReplitConnectors();

    // Get owner's Gmail address
    const profileRes = await connectors.proxy("google-mail", "/gmail/v1/users/me/profile", {
      method: "GET",
    });
    if (!profileRes.ok) {
      throw new Error(`Gmail profile error: ${profileRes.status}`);
    }
    const profile = (await profileRes.json()) as { emailAddress: string };
    const ownerEmail = profile.emailAddress;

    const htmlBody = `
<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#222;">
  <div style="background:linear-gradient(135deg,#0e7490,#0369a1);border-radius:12px;padding:24px 28px;margin-bottom:24px;">
    <h1 style="color:#fff;margin:0;font-size:22px;">🌊 Nowe zapytanie ze strony sprzedażowej</h1>
    <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Ktoś jest zainteresowany zakupem strony dla ośrodka.</p>
  </div>

  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    <tr style="background:#f8fafc;">
      <td style="padding:12px 16px;font-weight:600;color:#475569;width:140px;border-bottom:1px solid #e2e8f0;">Imię i nazwisko</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">${name}</td>
    </tr>
    <tr>
      <td style="padding:12px 16px;font-weight:600;color:#475569;border-bottom:1px solid #e2e8f0;">Email</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;"><a href="mailto:${email}" style="color:#0e7490;text-decoration:none;">${email}</a></td>
    </tr>
    <tr style="background:#f8fafc;">
      <td style="padding:12px 16px;font-weight:600;color:#475569;border-bottom:1px solid #e2e8f0;">Telefon</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;"><a href="tel:${phone}" style="color:#0e7490;text-decoration:none;">${phone}</a></td>
    </tr>
    ${
      message?.trim()
        ? `<tr>
      <td style="padding:12px 16px;font-weight:600;color:#475569;border-bottom:1px solid #e2e8f0;">Wiadomość</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">${message.trim().replace(/\n/g, "<br>")}</td>
    </tr>`
        : ""
    }
  </table>

  <div style="margin-top:24px;padding:16px;background:#ecfdf5;border-left:4px solid #10b981;border-radius:4px;">
    <p style="margin:0;font-size:13px;color:#065f46;">
      💡 Oddzwoń jak najszybciej — zainteresowanie jest świeże!
    </p>
  </div>

  <p style="margin-top:28px;color:#94a3b8;font-size:12px;text-align:center;">
    Wiadomość wysłana automatycznie ze strony sprzedażowej.
  </p>
</body></html>`;

    const raw = buildEmail(ownerEmail, `Nowe zapytanie od ${name}`, htmlBody);
    const rawBase64 = Buffer.from(raw).toString("base64url");

    const sendRes = await connectors.proxy(
      "google-mail",
      "/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        body: JSON.stringify({ raw: rawBase64 }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!sendRes.ok) {
      const errBody = await sendRes.json().catch(() => ({}));
      console.error("Gmail send error", sendRes.status, errBody);
      res.status(500).json({ error: "Nie udało się wysłać wiadomości. Spróbuj telefonicznie." });
      return;
    }

    console.log(`[landing-contact] Email sent to ${ownerEmail} from ${name} (${email})`);
    res.json({ ok: true });
  } catch (err) {
    console.error("[landing-contact] Error:", err);
    res.status(500).json({ error: "Błąd serwera. Spróbuj ponownie." });
  }
});

export default router;
