import { Router } from "express";
import { db, patientsTable, usersTable } from "@workspace/db";
import { eq, ilike, or } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

function formatPatient(p: typeof patientsTable.$inferSelect & { name?: string | null }) {
  return {
    id: p.id,
    userId: p.userId,
    name: (p as any).name ?? null,
    sickleType: p.sickleType,
    dateOfBirth: p.dateOfBirth,
    bloodType: p.bloodType,
    weight: p.weight,
    height: p.height,
    allergies: p.allergies,
    notes: p.notes,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const { search, sickleType } = req.query as { search?: string; sickleType?: string };

  let patients = await db
    .select({
      id: patientsTable.id,
      userId: patientsTable.userId,
      sickleType: patientsTable.sickleType,
      dateOfBirth: patientsTable.dateOfBirth,
      bloodType: patientsTable.bloodType,
      weight: patientsTable.weight,
      height: patientsTable.height,
      allergies: patientsTable.allergies,
      notes: patientsTable.notes,
      createdAt: patientsTable.createdAt,
      name: usersTable.name,
    })
    .from(patientsTable)
    .leftJoin(usersTable, eq(patientsTable.userId, usersTable.id));

  if (sickleType) {
    patients = patients.filter(p => p.sickleType === sickleType);
  }
  if (search) {
    const q = search.toLowerCase();
    patients = patients.filter(p => p.name?.toLowerCase().includes(q));
  }

  return res.json(patients.map(formatPatient));
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { sickleType, dateOfBirth, bloodType, weight, height, allergies, notes } = req.body;
  if (!sickleType) return res.status(400).json({ error: "sickleType is required" });

  const [patient] = await db.insert(patientsTable).values({
    userId: req.user!.id,
    sickleType,
    dateOfBirth,
    bloodType,
    weight,
    height,
    allergies,
    notes,
  }).returning();

  const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
  return res.status(201).json(formatPatient({ ...patient, name: user?.name }));
});

router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const [result] = await db
    .select({
      id: patientsTable.id,
      userId: patientsTable.userId,
      sickleType: patientsTable.sickleType,
      dateOfBirth: patientsTable.dateOfBirth,
      bloodType: patientsTable.bloodType,
      weight: patientsTable.weight,
      height: patientsTable.height,
      allergies: patientsTable.allergies,
      notes: patientsTable.notes,
      createdAt: patientsTable.createdAt,
      name: usersTable.name,
    })
    .from(patientsTable)
    .leftJoin(usersTable, eq(patientsTable.userId, usersTable.id))
    .where(eq(patientsTable.id, id))
    .limit(1);

  if (!result) return res.status(404).json({ error: "Patient not found" });
  return res.json(formatPatient(result));
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const { sickleType, dateOfBirth, bloodType, weight, height, allergies, notes } = req.body;

  const updates: Partial<typeof patientsTable.$inferInsert> = {};
  if (sickleType !== undefined) updates.sickleType = sickleType;
  if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
  if (bloodType !== undefined) updates.bloodType = bloodType;
  if (weight !== undefined) updates.weight = weight;
  if (height !== undefined) updates.height = height;
  if (allergies !== undefined) updates.allergies = allergies;
  if (notes !== undefined) updates.notes = notes;

  const [updated] = await db.update(patientsTable).set(updates).where(eq(patientsTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Patient not found" });

  const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, updated.userId)).limit(1);
  return res.json(formatPatient({ ...updated, name: user?.name }));
});

export default router;
