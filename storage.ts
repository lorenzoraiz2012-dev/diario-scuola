import { db } from "./db";
import { diario, type Diario, type InsertDiario, voti, type Voto, type InsertVoto } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Diario
  getDiarioItems(): Promise<Diario[]>;
  createDiarioItem(item: InsertDiario): Promise<Diario>;
  updateDiarioItem(id: number, updates: Partial<InsertDiario>): Promise<Diario | undefined>;
  deleteDiarioItem(id: number): Promise<void>;
  
  // Voti
  getVoti(): Promise<Voto[]>;
  createVoto(item: InsertVoto): Promise<Voto>;
  deleteVoto(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getDiarioItems(): Promise<Diario[]> {
    return await db.select().from(diario);
  }

  async createDiarioItem(item: InsertDiario): Promise<Diario> {
    const [created] = await db.insert(diario).values(item).returning();
    return created;
  }

  async updateDiarioItem(id: number, updates: Partial<InsertDiario>): Promise<Diario | undefined> {
    const [updated] = await db.update(diario).set(updates).where(eq(diario.id, id)).returning();
    return updated;
  }

  async deleteDiarioItem(id: number): Promise<void> {
    await db.delete(diario).where(eq(diario.id, id));
  }

  async getVoti(): Promise<Voto[]> {
    return await db.select().from(voti);
  }

  async createVoto(item: InsertVoto): Promise<Voto> {
    const [created] = await db.insert(voti).values(item).returning();
    return created;
  }

  async deleteVoto(id: number): Promise<void> {
    await db.delete(voti).where(eq(voti.id, id));
  }
}

export const storage = new DatabaseStorage();
