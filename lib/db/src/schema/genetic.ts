import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const geneticCalculationsTable = pgTable("genetic_calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  parent1Type: text("parent1_type").notNull(),
  parent2Type: text("parent2_type").notNull(),
  riskLevel: text("risk_level").notNull(),
  probabilities: text("probabilities"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGeneticCalculationSchema = createInsertSchema(geneticCalculationsTable).omit({ id: true, createdAt: true });
export type InsertGeneticCalculation = z.infer<typeof insertGeneticCalculationSchema>;
export type GeneticCalculation = typeof geneticCalculationsTable.$inferSelect;
