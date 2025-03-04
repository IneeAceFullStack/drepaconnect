import { Router } from "express";
import { db, bloodRequestsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, optionalAuth, type AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

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

router.get("/", optionalAuth, async (req: AuthRequest, res) => {
  const { bloodType, urgent } = req.query as { bloodType?: string; urgent?: string };
  let requests = await db.select().from(bloodRequestsTable).orderBy(desc(bloodRequestsTable.createdAt));
  if (bloodType) requests = requests.filter(r => r.bloodType === bloodType);
  if (urgent !== undefined) requests = requests.filter(r => r.urgent === (urgent === "true"));
  return res.json(requests.map(formatRequest));
});

router.post("/", optionalAuth, async (req: AuthRequest, res) => {
  const { patientName, bloodType, city, hospital, urgent, message } = req.body;
  if (!patientName || !bloodType || !city) return res.status(400).json({ error: "Required fields missing" });

  const [request] = await db.insert(bloodRequestsTable).values({
    requestedBy: req.user?.id ?? null,
    patientName, bloodType, city, hospital,
    urgent: urgent ?? false, message,
  }).returning();

  return res.status(201).json(formatRequest(request));
});

router.post("/:id/respond", requireAuth, async (req: AuthRequest, res) => {
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
