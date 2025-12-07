import { type Translation, type InsertTranslation, translations } from "@shared/schema";
import { db } from "../db";
import { desc } from "drizzle-orm";

export interface IStorage {
  saveTranslation(translation: InsertTranslation): Promise<Translation>;
  getRecentTranslations(limit?: number): Promise<Translation[]>;
}

export class DatabaseStorage implements IStorage {
  async saveTranslation(translation: InsertTranslation): Promise<Translation> {
    const [result] = await db.insert(translations).values(translation).returning();
    return result;
  }

  async getRecentTranslations(limit: number = 20): Promise<Translation[]> {
    return db.select().from(translations).orderBy(desc(translations.createdAt)).limit(limit);
  }
}

export const storage = new DatabaseStorage();
