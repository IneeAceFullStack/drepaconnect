import { Router } from "express";
import { db, medicationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

function formatMed(m: typeof medicationsTable.$inferSelect) {
  return {
    id: m.id,
    patientId: m.patientId,
    name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    times: m.times,
    startDate: m.startDate,
    endDate: m.endDate,
    active: m.active,
    lastTaken: m.lastTaken,
    notes: m.notes,
    createdAt: m.createdAt.toISOString(),
  };
}

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
  let meds = await db.select().from(medicationsTable).orderBy(desc(medicationsTable.createdAt));
  if (patientId) meds = meds.filter(m => m.patientId === patientId);
  return res.json(meds.map(formatMed));
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { patientId, name, dosage, frequency, times, startDate, endDate, notes } = req.body;
  if (!patientId || !name || !dosage || !frequency) return res.status(400).json({ error: "Required fields missing" });

  const [med] = await db.insert(medicationsTable).values({
    patientId, name, dosage, frequency, times, startDate, endDate, notes,
  }).returning();

  return res.status(201).json(formatMed(med));
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const { name, dosage, frequency, times, endDate, active, notes } = req.body;

  const updates: Partial<typeof medicationsTable.$inferInsert> = {};
  if (name !== undefined) updates.name = name;
  if (dosage !== undefined) updates.dosage = dosage;
  if (frequency !== undefined) updates.frequency = frequency;
  if (times !== undefined) updates.times = times;
  if (endDate !== undefined) updates.endDate = endDate;
  if (active !== undefined) updates.active = active;
  if (notes !== undefined) updates.notes = notes;

  const [updated] = await db.update(medicationsTable).set(updates).where(eq(medicationsTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Medication not found" });
  return res.json(formatMed(updated));
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  await db.delete(medicationsTable).where(eq(medicationsTable.id, id));
  return res.status(204).send();
});

router.post("/:id/take", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const [updated] = await db.update(medicationsTable)
    .set({ lastTaken: new Date().toISOString() })
    .where(eq(medicationsTable.id, id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Medication not found" });
  return res.json(formatMed(updated));
});

export default router;
