import { Router, type IRouter } from "express";
import { db, settingsTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  AdminGetMeResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const rows = await db.select().from(settingsTable).limit(1);
  const settings = rows[0];
  const correctPassword = settings?.adminPassword ?? "admin123";

  if (parsed.data.password !== correctPassword) {
    res.status(401).json({ error: "Nieprawidłowe hasło" });
    return;
  }

  const sess = req.session as { isAdmin?: boolean };
  sess.isAdmin = true;

  res.json(AdminLoginResponse.parse({ isAdmin: true }));
});

/** Demo-login — bez hasła, tylko dla wersji demonstracyjnej (disabled in production) */
router.post("/admin/demo-login", async (req, res): Promise<void> => {
  if (process.env.NODE_ENV === "production") {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const sess = req.session as { isAdmin?: boolean };
  sess.isAdmin = true;
  res.json({ isAdmin: true });
});

router.post("/admin/logout", (req, res): void => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/admin/me", (req, res): void => {
  const sess = req.session as { isAdmin?: boolean };
  if (!sess.isAdmin) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(AdminGetMeResponse.parse({ isAdmin: true }));
});

export default router;
