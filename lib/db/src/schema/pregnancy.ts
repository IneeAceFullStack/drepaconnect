import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { patientsTable } from "./patients";

export const pregnanciesTable = pgTable("pregnancies", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patientsTable.id, { onDelete: "cascade" }),
  startDate: text("start_date").notNull(),
  expectedDate: text("expected_date"),
  currentWeek: integer("current_week"),
  partnerSickleType: text("partner_sickle_type"),
  riskLevel: text("risk_level"),
  doctorName: text("doctor_name"),
  notes: text("notes"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPregnancySchema = createInsertSchema(pregnanciesTable).omit({ id: true, createdAt: true });
export type InsertPregnancy = z.infer<typeof insertPregnancySchema>;
export type Pregnancy = typeof pregnanciesTable.$inferSelect;
