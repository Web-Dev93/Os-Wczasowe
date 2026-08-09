import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

// Public: list published posts (newest first)
router.get("/posts", async (_req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.isPublished, true))
    .orderBy(postsTable.createdAt);
  res.json(posts.reverse());
});

// Admin: list all posts
router.get("/admin/posts", requireAdmin, async (_req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(postsTable)
    .orderBy(postsTable.createdAt);
  res.json(posts.reverse());
});

// Admin: create post
router.post("/admin/posts", requireAdmin, async (req, res): Promise<void> => {
  const { title, content, imageUrl, isPublished } = req.body as {
    title?: string; content?: string; imageUrl?: string; isPublished?: boolean;
  };
  if (!title?.trim()) { res.status(400).json({ error: "Tytuł jest wymagany" }); return; }
  const [post] = await db.insert(postsTable).values({
    title: title.trim(),
    content: content?.trim() || null,
    imageUrl: imageUrl?.trim() || null,
    isPublished: isPublished ?? true,
  }).returning();
  res.status(201).json(post);
});

// Admin: update post
router.put("/admin/posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { title, content, imageUrl, isPublished } = req.body as {
    title?: string; content?: string; imageUrl?: string; isPublished?: boolean;
  };
  if (!title?.trim()) { res.status(400).json({ error: "Tytuł jest wymagany" }); return; }
  const [post] = await db.update(postsTable).set({
    title: title.trim(),
    content: content?.trim() || null,
    imageUrl: imageUrl?.trim() || null,
    isPublished: isPublished ?? true,
  }).where(eq(postsTable.id, id)).returning();
  if (!post) { res.status(404).json({ error: "Wpis nie znaleziony" }); return; }
  res.json(post);
});

// Admin: delete post
router.delete("/admin/posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  await db.delete(postsTable).where(eq(postsTable.id, id));
  res.status(204).end();
});

export default router;
