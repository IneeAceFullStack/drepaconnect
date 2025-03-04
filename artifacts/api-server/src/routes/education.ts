import { Router } from "express";
import { db, educationModulesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { optionalAuth, type AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

function formatModule(m: typeof educationModulesTable.$inferSelect) {
  return {
    id: m.id,
    title: m.title,
    category: m.category,
    targetAudience: m.targetAudience,
    summary: m.summary,
    content: m.content,
    videoUrl: m.videoUrl,
    imageUrl: m.imageUrl,
    readTime: m.readTime,
    createdAt: m.createdAt.toISOString(),
  };
}

router.get("/", optionalAuth, async (req: AuthRequest, res) => {
  const { category, targetAudience } = req.query as { category?: string; targetAudience?: string };
  let modules = await db.select().from(educationModulesTable);
  if (category) modules = modules.filter(m => m.category === category);
  if (targetAudience) modules = modules.filter(m => m.targetAudience === targetAudience || m.targetAudience === "ALL");
  return res.json(modules.map(formatModule));
});

router.get("/:id", optionalAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const [module] = await db.select().from(educationModulesTable).where(eq(educationModulesTable.id, id)).limit(1);
  if (!module) return res.status(404).json({ error: "Module not found" });
  return res.json(formatModule(module));
});

export default router;
