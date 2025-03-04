import { pgTable, text, serial, timestamp, integer, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { patientsTable } from "./patients";

export const recordTypeEnum = pgEnum("record_type", [
  "CONSULTATION", "LAB_RESULT", "TRANSFUSION", "VACCINATION", "HOSPITALIZATION", "OTHER"
]);

export const medicalRecordsTable = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patientsTable.id, { onDelete: "cascade" }),
  type: recordTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  doctorName: text("doctor_name"),
  facility: text("facility"),
  results: text("results"),
  hemoglobinLevel: real("hemoglobin_level"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecordsTable).omit({ id: true, createdAt: true });
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type MedicalRecord = typeof medicalRecordsTable.$inferSelect;
