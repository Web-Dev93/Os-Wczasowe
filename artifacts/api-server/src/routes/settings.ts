import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";
import {
  GetSettingsResponse,
  AdminGetSettingsResponse,
  AdminUpdateSettingsBody,
  AdminUpdateSettingsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

// Ensure default settings row exists
async function getOrCreateSettings() {
  const rows = await db.select().from(settingsTable).limit(1);
  if (rows.length > 0) return rows[0];
  const [created] = await db.insert(settingsTable).values({}).returning();
  return created;
}

// Public
router.get("/settings", async (req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(GetSettingsResponse.parse(settings));
});

// Admin
router.get("/admin/settings", requireAdmin, async (req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(AdminGetSettingsResponse.parse(settings));
});

router.put("/admin/settings", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminUpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const settings = await getOrCreateSettings();
  const [updated] = await db
    .update(settingsTable)
    .set(parsed.data)
    .where(eq(settingsTable.id, settings.id))
    .returning();
  res.json(AdminUpdateSettingsResponse.parse(updated));
});

export default router;
