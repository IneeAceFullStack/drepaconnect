import { pgTable, text, serial, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const bloodTypeEnum = pgEnum("blood_type", [
  "A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"
]);

export const bloodDonorsTable = pgTable("blood_donors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  bloodType: bloodTypeEnum("blood_type").notNull(),
  city: text("city").notNull(),
  province: text("province"),
  phone: text("phone"),
  available: boolean("available").notNull().default(true),
  lastDonation: text("last_donation"),
  donationCount: integer("donation_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBloodDonorSchema = createInsertSchema(bloodDonorsTable).omit({ id: true, createdAt: true });
export type InsertBloodDonor = z.infer<typeof insertBloodDonorSchema>;
export type BloodDonor = typeof bloodDonorsTable.$inferSelect;
