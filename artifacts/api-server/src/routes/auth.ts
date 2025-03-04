import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword, signToken } from "../lib/auth.js";
import { RegisterBody, LoginBody } from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation error", details: parsed.error });

  const { name, email, password, role, phone } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) return res.status(400).json({ error: "Email already registered" });

  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(usersTable).values({
    name, email, passwordHash, role: role as "PATIENT" | "DOCTOR" | "DONOR" | "HELPER" | "ADMIN", phone
  }).returning();

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, createdAt: user.createdAt.toISOString() }
  });
});

router.post("/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation error" });

  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, createdAt: user.createdAt.toISOString() }
  });
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, createdAt: user.createdAt.toISOString() });
});

export default router;
