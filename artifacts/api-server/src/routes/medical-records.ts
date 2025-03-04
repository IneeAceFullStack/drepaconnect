import { Router } from "express";
import { db, medicalRecordsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

function formatRecord(r: typeof medicalRecordsTable.$inferSelect) {
  return {
    id: r.id,
    patientId: r.patientId,
    type: r.type,
    title: r.title,
    description: r.description,
    date: r.date,
    doctorName: r.doctorName,
    facility: r.facility,
    results: r.results,
    hemoglobinLevel: r.hemoglobinLevel,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
  let records = await db.select().from(medicalRecordsTable).orderBy(desc(medicalRecordsTable.date));
  if (patientId) records = records.filter(r => r.patientId === patientId);
  return res.json(records.map(formatRecord));
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { patientId, type, title, description, date, doctorName, facility, results, hemoglobinLevel } = req.body;
  if (!patientId || !type || !title || !date) return res.status(400).json({ error: "Required fields missing" });

  const [record] = await db.insert(medicalRecordsTable).values({
    patientId, type, title, description, date, doctorName, facility, results, hemoglobinLevel,
  }).returning();

  return res.status(201).json(formatRecord(record));
});

router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const [record] = await db.select().from(medicalRecordsTable).where(eq(medicalRecordsTable.id, id)).limit(1);
  if (!record) return res.status(404).json({ error: "Record not found" });
  return res.json(formatRecord(record));
});

export default router;
