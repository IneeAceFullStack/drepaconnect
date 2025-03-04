import { Router } from "express";
import { db, bloodDonorsTable, bloodRequestsTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, optionalAuth, type AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

function formatDonor(d: typeof bloodDonorsTable.$inferSelect & { name?: string | null }) {
  return {
    id: d.id,
    userId: d.userId,
    name: (d as any).name ?? null,
    bloodType: d.bloodType,
    city: d.city,
    province: d.province,
    phone: d.phone,
    available: d.available,
    lastDonation: d.lastDonation,
    donationCount: d.donationCount,
    createdAt: d.createdAt.toISOString(),
  };
}

function formatRequest(r: typeof bloodRequestsTable.$inferSelect) {
  return {
    id: r.id,
    requestedBy: r.requestedBy,
    patientName: r.patientName,
    bloodType: r.bloodType,
    city: r.city,
    hospital: r.hospital,
    urgent: r.urgent,
    status: r.status,
    message: r.message,
    respondedBy: r.respondedBy,
    createdAt: r.createdAt.toISOString(),
  };
}

// DONORS
router.get("/", optionalAuth, async (req: AuthRequest, res) => {
  const { bloodType, city, available } = req.query as { bloodType?: string; city?: string; available?: string };

  const rows = await db
    .select({
      id: bloodDonorsTable.id,
      userId: bloodDonorsTable.userId,
      bloodType: bloodDonorsTable.bloodType,
      city: bloodDonorsTable.city,
      province: bloodDonorsTable.province,
      phone: bloodDonorsTable.phone,
      available: bloodDonorsTable.available,
      lastDonation: bloodDonorsTable.lastDonation,
      donationCount: bloodDonorsTable.donationCount,
      createdAt: bloodDonorsTable.createdAt,
      name: usersTable.name,
    })
    .from(bloodDonorsTable)
    .leftJoin(usersTable, eq(bloodDonorsTable.userId, usersTable.id))
    .orderBy(desc(bloodDonorsTable.createdAt));

  let donors = rows;
  if (bloodType) donors = donors.filter(d => d.bloodType === bloodType);
  if (city) donors = donors.filter(d => d.city.toLowerCase().includes(city.toLowerCase()));
  if (available !== undefined) donors = donors.filter(d => d.available === (available === "true"));

  return res.json(donors.map(formatDonor));
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { bloodType, city, province, phone } = req.body;
  if (!bloodType || !city) return res.status(400).json({ error: "Required fields missing" });

  const [donor] = await db.insert(bloodDonorsTable).values({
    userId: req.user!.id,
    bloodType,
    city,
    province,
    phone,
  }).returning();

  const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
  return res.status(201).json(formatDonor({ ...donor, name: user?.name }));
});

router.patch("/:id/availability", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const { available } = req.body;

  const [updated] = await db.update(bloodDonorsTable)
    .set({ available })
    .where(eq(bloodDonorsTable.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Donor not found" });
  const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, updated.userId)).limit(1);
  return res.json(formatDonor({ ...updated, name: user?.name }));
});

// BLOOD REQUESTS
router.get("/requests", optionalAuth, async (req: AuthRequest, res) => {
  const { bloodType, urgent } = req.query as { bloodType?: string; urgent?: string };
  let requests = await db.select().from(bloodRequestsTable).orderBy(desc(bloodRequestsTable.createdAt));
  if (bloodType) requests = requests.filter(r => r.bloodType === bloodType);
  if (urgent !== undefined) requests = requests.filter(r => r.urgent === (urgent === "true"));
  return res.json(requests.map(formatRequest));
});

router.post("/requests", optionalAuth, async (req: AuthRequest, res) => {
  const { patientName, bloodType, city, hospital, urgent, message } = req.body;
  if (!patientName || !bloodType || !city) return res.status(400).json({ error: "Required fields missing" });

  const [request] = await db.insert(bloodRequestsTable).values({
    requestedBy: req.user?.id ?? null,
    patientName,
    bloodType,
    city,
    hospital,
    urgent: urgent ?? false,
    message,
  }).returning();

  return res.status(201).json(formatRequest(request));
});

router.post("/requests/:id/respond", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const { donorId } = req.body;

  const [updated] = await db.update(bloodRequestsTable)
    .set({ respondedBy: donorId, status: "FULFILLED" })
    .where(eq(bloodRequestsTable.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Request not found" });
  return res.json(formatRequest(updated));
});

export default router;
