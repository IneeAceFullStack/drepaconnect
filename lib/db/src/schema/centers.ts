import { pgTable, text, serial, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const centersTable = pgTable("screening_centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  services: text("services"),
  openingHours: text("opening_hours"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCenterSchema = createInsertSchema(centersTable).omit({ id: true, createdAt: true });
export type InsertCenter = z.infer<typeof insertCenterSchema>;
export type Center = typeof centersTable.$inferSelect;
