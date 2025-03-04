import { pgTable, text, serial, timestamp, integer, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const sickleTypeEnum = pgEnum("sickle_type", ["SS", "AS", "SC", "AA", "AC", "CC"]);

export const patientsTable = pgTable("patients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  sickleType: sickleTypeEnum("sickle_type").notNull(),
  dateOfBirth: text("date_of_birth"),
  bloodType: text("blood_type"),
  weight: real("weight"),
  height: real("height"),
  allergies: text("allergies"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPatientSchema = createInsertSchema(patientsTable).omit({ id: true, createdAt: true });
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patientsTable.$inferSelect;
