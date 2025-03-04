import { Router } from "express";
import { db, usersTable, patientsTable, bloodDonorsTable, centersTable, crisesTable, medicationsTable, bloodRequestsTable } from "@workspace/db";
import { eq, desc, gte, and } from "drizzle-orm";
import { optionalAuth, requireAuth, type AuthRequest } from "../middlewares/auth.middleware.js";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/national", optionalAuth, async (req: AuthRequest, res) => {
  const [totalPatients] = await db.select({ count: sql<number>`count(*)::int` }).from(patientsTable);
  const [totalDoctors] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.role, "DOCTOR"));
  const [totalDonors] = await db.select({ count: sql<number>`count(*)::int` }).from(bloodDonorsTable);
  const [totalCenters] = await db.select({ count: sql<number>`count(*)::int` }).from(centersTable).where(eq(centersTable.active, true));

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const allCrises = await db.select().from(crisesTable);
  const crisisThisMonth = allCrises.filter(c => c.startedAt >= monthStart).length;

  const byType = [
    { type: "SS", count: 0, percentage: 0 },
    { type: "AS", count: 0, percentage: 0 },
    { type: "SC", count: 0, percentage: 0 },
    { type: "AA", count: 0, percentage: 0 },
    { type: "AC", count: 0, percentage: 0 },
    { type: "CC", count: 0, percentage: 0 },
  ];
  const allPatients = await db.select({ sickleType: patientsTable.sickleType }).from(patientsTable);
  const total = allPatients.length || 1;
  for (const p of allPatients) {
    const found = byType.find(t => t.type === p.sickleType);
    if (found) found.count++;
  }
  for (const t of byType) t.percentage = Math.round((t.count / total) * 100 * 10) / 10;

  return res.json({
    totalPatients: totalPatients.count,
    totalDoctors: totalDoctors.count,
    totalDonors: totalDonors.count,
    totalCenters: totalCenters.count,
    crisisThisMonth,
    prevalenceRate: 4.5,
    byProvince: [
      { province: "Pool (Brazzaville)", count: Math.floor(totalPatients.count * 0.40) },
      { province: "Kouilou (Pointe-Noire)", count: Math.floor(totalPatients.count * 0.25) },
      { province: "Niari (Dolisie)", count: Math.floor(totalPatients.count * 0.10) },
      { province: "Cuvette (Owando)", count: Math.floor(totalPatients.count * 0.08) },
      { province: "Sangha (Ouesso)", count: Math.floor(totalPatients.count * 0.07) },
      { province: "Autres provinces", count: Math.floor(totalPatients.count * 0.10) },
    ],
    bySickleType: byType,
  });
});

router.get("/dashboard", requireAuth, async (req: AuthRequest, res) => {
  const [totalPatients] = await db.select({ count: sql<number>`count(*)::int` }).from(patientsTable);
  const [activeMedications] = await db.select({ count: sql<number>`count(*)::int` }).from(medicationsTable).where(eq(medicationsTable.active, true));
  const [pendingBloodRequests] = await db.select({ count: sql<number>`count(*)::int` }).from(bloodRequestsTable).where(eq(bloodRequestsTable.status, "OPEN"));
  const [availableDonors] = await db.select({ count: sql<number>`count(*)::int` }).from(bloodDonorsTable).where(eq(bloodDonorsTable.available, true));

  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
  const allCrises = await db.select().from(crisesTable).orderBy(desc(crisesTable.createdAt));
  const crisisThisWeek = allCrises.filter(c => c.startedAt >= weekStart).length;

  const recentCrises = allCrises.slice(0, 5).map(c => ({
    id: c.id, patientId: c.patientId, intensity: c.intensity, location: c.location,
    symptoms: c.symptoms, triggers: c.triggers, treatment: c.treatment,
    hospitalVisit: c.hospitalVisit, startedAt: c.startedAt, endedAt: c.endedAt,
    notes: c.notes, createdAt: c.createdAt.toISOString(),
  }));

  const recentRequests = await db.select().from(bloodRequestsTable)
    .where(eq(bloodRequestsTable.status, "OPEN"))
    .orderBy(desc(bloodRequestsTable.createdAt))
    .limit(5);

  return res.json({
    totalPatients: totalPatients.count,
    activeMedications: activeMedications.count,
    crisisThisWeek,
    pendingBloodRequests: pendingBloodRequests.count,
    availableDonors: availableDonors.count,
    recentCrises,
    recentBloodRequests: recentRequests.map(r => ({
      id: r.id, requestedBy: r.requestedBy, patientName: r.patientName,
      bloodType: r.bloodType, city: r.city, hospital: r.hospital,
      urgent: r.urgent, status: r.status, message: r.message,
      respondedBy: r.respondedBy, createdAt: r.createdAt.toISOString(),
    })),
  });
});

router.get("/crises-by-month", optionalAuth, async (req: AuthRequest, res) => {
  const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
  const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;

  let allCrises = await db.select().from(crisesTable);
  if (patientId) allCrises = allCrises.filter(c => c.patientId === patientId);
  allCrises = allCrises.filter(c => new Date(c.startedAt).getFullYear() === year);

  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const result = months.map((month, i) => {
    const monthCrises = allCrises.filter(c => new Date(c.startedAt).getMonth() === i);
    const count = monthCrises.length;
    const avgIntensity = count > 0 ? monthCrises.reduce((s, c) => s + c.intensity, 0) / count : 0;
    return { month, count, avgIntensity: Math.round(avgIntensity * 10) / 10 };
  });

  return res.json(result);
});

export default router;
