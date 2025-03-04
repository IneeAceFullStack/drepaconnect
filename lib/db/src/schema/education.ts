import { pgTable, text, serial, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const educationCategoryEnum = pgEnum("education_category", [
  "BASICS", "GENETICS", "SYMPTOMS", "TREATMENT", "NUTRITION", "PREVENTION", "SCHOOL", "FAMILY"
]);

export const educationAudienceEnum = pgEnum("education_audience", [
  "ALL", "CHILDREN", "ADULTS", "STUDENTS", "TEACHERS", "PARENTS", "DOCTORS"
]);

export const educationModulesTable = pgTable("education_modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: educationCategoryEnum("category").notNull(),
  targetAudience: educationAudienceEnum("target_audience").notNull().default("ALL"),
  summary: text("summary"),
  content: text("content"),
  videoUrl: text("video_url"),
  imageUrl: text("image_url"),
  readTime: integer("read_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEducationModuleSchema = createInsertSchema(educationModulesTable).omit({ id: true, createdAt: true });
export type InsertEducationModule = z.infer<typeof insertEducationModuleSchema>;
export type EducationModule = typeof educationModulesTable.$inferSelect;
