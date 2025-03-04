import { pgTable, text, serial, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const requestStatusEnum = pgEnum("request_status", ["OPEN", "FULFILLED", "CANCELLED"]);

export const bloodRequestsTable = pgTable("blood_requests", {
  id: serial("id").primaryKey(),
  requestedBy: integer("requested_by"),
  patientName: text("patient_name").notNull(),
  bloodType: text("blood_type").notNull(),
  city: text("city").notNull(),
  hospital: text("hospital"),
  urgent: boolean("urgent").notNull().default(false),
  status: requestStatusEnum("status").notNull().default("OPEN"),
  message: text("message"),
  respondedBy: integer("responded_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBloodRequestSchema = createInsertSchema(bloodRequestsTable).omit({ id: true, createdAt: true });
export type InsertBloodRequest = z.infer<typeof insertBloodRequestSchema>;
export type BloodRequest = typeof bloodRequestsTable.$inferSelect;
