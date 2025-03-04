import { Router } from "express";
import { db, crisesTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

function formatCrisis(c: typeof crisesTable.$inferSelect) {
  return {
    id: c.id,
    patientId: c.patientId,
    intensity: c.intensity,
    location: c.location,
    symptoms: c.symptoms,
    triggers: c.triggers,
    treatment: c.treatment,
    hospitalVisit: c.hospitalVisit,
    startedAt: c.startedAt,
    endedAt: c.endedAt,
    notes: c.notes,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/stats/summary", requireAuth, async (req: AuthRequest, res) => {
  const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;

  let crises = await db.select().from(crisesTable).orderBy(desc(crisesTable.createdAt));
  if (patientId) crises = crises.filter(c => c.patientId === patientId);

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisYearStart = new Date(now.getFullYear(), 0, 1);

  const total = crises.length;
  const hospitalVisits = crises.filter(c => c.hospitalVisit).length;
  const avgIntensity = total > 0 ? crises.reduce((s, c) => s + c.intensity, 0) / total : 0;
  const lastCrisis = crises[0];
  const thisMonth = crises.filter(c => new Date(c.startedAt) >= thisMonthStart).length;
  const thisYear = crises.filter(c => new Date(c.startedAt) >= thisYearStart).length;

  return res.json({
    total,
    avgIntensity: Math.round(avgIntensity * 10) / 10,
    hospitalVisits,
    lastCrisisDate: lastCrisis?.startedAt ?? null,
    thisMonth,
    thisYear,
  });
});

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

  let crises = await db.select().from(crisesTable).orderBy(desc(crisesTable.createdAt)).limit(limit);
  if (patientId) crises = crises.filter(c => c.patientId === patientId);

  return res.json(crises.map(formatCrisis));
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { patientId, intensity, location, symptoms, triggers, treatment, hospitalVisit, startedAt, endedAt, notes } = req.body;
  if (!patientId || !intensity || !startedAt) return res.status(400).json({ error: "Required fields missing" });

  const [crisis] = await db.insert(crisesTable).values({
    patientId, intensity, location, symptoms, triggers, treatment,
    hospitalVisit: hospitalVisit ?? false, startedAt, endedAt, notes,
  }).returning();

  return res.status(201).json(formatCrisis(crisis));
});

router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const [crisis] = await db.select().from(crisesTable).where(eq(crisesTable.id, id)).limit(1);
  if (!crisis) return res.status(404).json({ error: "Crisis not found" });
  return res.json(formatCrisis(crisis));
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const { intensity, location, symptoms, triggers, treatment, hospitalVisit, endedAt, notes } = req.body;

  const updates: Partial<typeof crisesTable.$inferInsert> = {};
  if (intensity !== undefined) updates.intensity = intensity;
  if (location !== undefined) updates.location = location;
  if (symptoms !== undefined) updates.symptoms = symptoms;
  if (triggers !== undefined) updates.triggers = triggers;
  if (treatment !== undefined) updates.treatment = treatment;
  if (hospitalVisit !== undefined) updates.hospitalVisit = hospitalVisit;
  if (endedAt !== undefined) updates.endedAt = endedAt;
  if (notes !== undefined) updates.notes = notes;

  const [updated] = await db.update(crisesTable).set(updates).where(eq(crisesTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Crisis not found" });
  return res.json(formatCrisis(updated));
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  await db.delete(crisesTable).where(eq(crisesTable.id, id));
  return res.status(204).send();
});

export default router;
