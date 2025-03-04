import { Router } from "express";
import { db, centersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, optionalAuth, type AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

function formatCenter(c: typeof centersTable.$inferSelect) {
  return {
    id: c.id,
    name: c.name,
    city: c.city,
    province: c.province,
    address: c.address,
    phone: c.phone,
    email: c.email,
    latitude: c.latitude,
    longitude: c.longitude,
    services: c.services,
    openingHours: c.openingHours,
    active: c.active,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/", optionalAuth, async (req: AuthRequest, res) => {
  const { city, province } = req.query as { city?: string; province?: string };
  let centers = await db.select().from(centersTable).where(eq(centersTable.active, true));
  if (city) centers = centers.filter(c => c.city.toLowerCase().includes(city.toLowerCase()));
  if (province) centers = centers.filter(c => c.province.toLowerCase().includes(province.toLowerCase()));
  return res.json(centers.map(formatCenter));
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { name, city, province, address, phone, email, latitude, longitude, services, openingHours } = req.body;
  if (!name || !city || !province) return res.status(400).json({ error: "Required fields missing" });

  const [center] = await db.insert(centersTable).values({
    name, city, province, address, phone, email, latitude, longitude, services, openingHours,
  }).returning();

  return res.status(201).json(formatCenter(center));
});

router.get("/:id", optionalAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const [center] = await db.select().from(centersTable).where(eq(centersTable.id, id)).limit(1);
  if (!center) return res.status(404).json({ error: "Center not found" });
  return res.json(formatCenter(center));
});

export default router;
