import { Router } from "express";
import { db, geneticCalculationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { optionalAuth, requireAuth, type AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

type Genotype = "AA" | "AS" | "SS" | "AC" | "SC" | "CC";

function getAlleles(genotype: Genotype): string[] {
  return [genotype[0], genotype[1]];
}

function calculateProbabilities(parent1: Genotype, parent2: Genotype): Record<string, number> {
  const a1 = getAlleles(parent1);
  const a2 = getAlleles(parent2);
  const combinations: Record<string, number> = {};

  for (const g1 of a1) {
    for (const g2 of a2) {
      const pair = [g1, g2].sort().join("") as string;
      // Normalize: AS = SA, etc.
      const normalized = pair === "SA" ? "AS" : pair === "CS" ? "SC" : pair === "CA" ? "AC" : pair;
      combinations[normalized] = (combinations[normalized] || 0) + 0.25;
    }
  }
  return combinations;
}

function getRiskLevel(probs: Record<string, number>): "LOW" | "MODERATE" | "HIGH" | "CRITICAL" {
  const ssRisk = (probs["SS"] || 0);
  const scRisk = (probs["SC"] || 0);
  const ccRisk = (probs["CC"] || 0);
  const totalRisk = ssRisk + scRisk + ccRisk;

  if (totalRisk === 0) return "LOW";
  if (totalRisk <= 0.25) return "MODERATE";
  if (totalRisk <= 0.5) return "HIGH";
  return "CRITICAL";
}

function getAdvice(riskLevel: string, probs: Record<string, number>): string {
  if (riskLevel === "LOW") return "Le risque génétique est faible. Vos enfants ne seront pas affectés par la drépanocytose, mais un conseil génétique reste recommandé avant tout mariage.";
  if (riskLevel === "MODERATE") return "Il existe un risque modéré. Nous vous recommandons fortement une consultation avec un généticien et un dépistage prénatal lors de toute grossesse.";
  if (riskLevel === "HIGH") return "Le risque génétique est élevé. Une consultation génétique approfondie est indispensable. Un suivi médical spécialisé sera nécessaire pour tout enfant atteint.";
  return "Le risque est critique — 50% ou plus de vos enfants pourraient être atteints de drépanocytose sévère. Une consultation génétique urgente est fortement recommandée avant toute décision de parentalité.";
}

router.post("/calculate", optionalAuth, async (req: AuthRequest, res) => {
  const { parent1Type, parent2Type } = req.body;
  if (!parent1Type || !parent2Type) return res.status(400).json({ error: "Both parent genotypes are required" });

  const probabilities = calculateProbabilities(parent1Type as Genotype, parent2Type as Genotype);
  const riskLevel = getRiskLevel(probabilities);
  const advice = getAdvice(riskLevel, probabilities);
  const details = Object.entries(probabilities)
    .map(([type, prob]) => `${type}: ${(prob * 100).toFixed(0)}%`)
    .join(", ");

  // Save if authenticated
  if (req.user) {
    await db.insert(geneticCalculationsTable).values({
      userId: req.user.id,
      parent1Type,
      parent2Type,
      riskLevel,
      probabilities: JSON.stringify(probabilities),
    });
  }

  return res.json({ probabilities, riskLevel, advice, details });
});

router.get("/history", requireAuth, async (req: AuthRequest, res) => {
  const history = await db.select().from(geneticCalculationsTable)
    .where(eq(geneticCalculationsTable.userId, req.user!.id))
    .orderBy(desc(geneticCalculationsTable.createdAt))
    .limit(20);

  return res.json(history.map(h => ({
    id: h.id,
    parent1Type: h.parent1Type,
    parent2Type: h.parent2Type,
    riskLevel: h.riskLevel,
    probabilities: h.probabilities,
    createdAt: h.createdAt.toISOString(),
  })));
});

export default router;
