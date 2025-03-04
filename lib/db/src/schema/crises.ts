import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { patientsTable } from "./patients";

export const crisesTable = pgTable("crises", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patientsTable.id, { onDelete: "cascade" }),
  intensity: integer("intensity").notNull(),
  location: text("location"),
  symptoms: text("symptoms"),
  triggers: text("triggers"),
  treatment: text("treatment"),
  hospitalVisit: boolean("hospital_visit").notNull().default(false),
  startedAt: text("started_at").notNull(),
  endedAt: text("ended_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCrisisSchema = createInsertSchema(crisesTable).omit({ id: true, createdAt: true });
export type InsertCrisis = z.infer<typeof insertCrisisSchema>;
export type Crisis = typeof crisesTable.$inferSelect;
