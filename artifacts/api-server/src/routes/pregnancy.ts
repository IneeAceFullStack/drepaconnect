import { Router } from "express";
import { db, pregnanciesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

function formatPregnancy(p: typeof pregnanciesTable.$inferSelect) {
  return {
    id: p.id,
    patientId: p.patientId,
    startDate: p.startDate,
    expectedDate: p.expectedDate,
    currentWeek: p.currentWeek,
    partnerSickleType: p.partnerSickleType,
    riskLevel: p.riskLevel,
    doctorName: p.doctorName,
    notes: p.notes,
    active: p.active,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
  let pregnancies = await db.select().from(pregnanciesTable).orderBy(desc(pregnanciesTable.createdAt));
  if (patientId) pregnancies = pregnancies.filter(p => p.patientId === patientId);
  return res.json(pregnancies.map(formatPregnancy));
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { patientId, startDate, expectedDate, partnerSickleType, doctorName, notes } = req.body;
  if (!patientId || !startDate) return res.status(400).json({ error: "Required fields missing" });

  // Calculate risk based on partner genotype
  let riskLevel = "LOW";
  if (partnerSickleType === "SS") riskLevel = "CRITICAL";
  else if (partnerSickleType === "AS" || partnerSickleType === "SC") riskLevel = "HIGH";
  else if (partnerSickleType === "AC") riskLevel = "MODERATE";

  const [pregnancy] = await db.insert(pregnanciesTable).values({
    patientId, startDate, expectedDate, partnerSickleType, riskLevel, doctorName, notes,
  }).returning();

  return res.status(201).json(formatPregnancy(pregnancy));
});

router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const [pregnancy] = await db.select().from(pregnanciesTable).where(eq(pregnanciesTable.id, id)).limit(1);
  if (!pregnancy) return res.status(404).json({ error: "Pregnancy not found" });
  return res.json(formatPregnancy(pregnancy));
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const { expectedDate, currentWeek, partnerSickleType, riskLevel, doctorName, notes, active } = req.body;

  const updates: Partial<typeof pregnanciesTable.$inferInsert> = {};
  if (expectedDate !== undefined) updates.expectedDate = expectedDate;
  if (currentWeek !== undefined) updates.currentWeek = currentWeek;
  if (partnerSickleType !== undefined) updates.partnerSickleType = partnerSickleType;
  if (riskLevel !== undefined) updates.riskLevel = riskLevel;
  if (doctorName !== undefined) updates.doctorName = doctorName;
  if (notes !== undefined) updates.notes = notes;
  if (active !== undefined) updates.active = active;

  const [updated] = await db.update(pregnanciesTable).set(updates).where(eq(pregnanciesTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Pregnancy not found" });
  return res.json(formatPregnancy(updated));
});

export default router;
