import { pgTable, text, serial, boolean, date, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const diario = pgTable("diario", {
  id: serial("id").primaryKey(),
  materia: text("materia").notNull(),
  data: date("data").notNull(), // ISO date string YYYY-MM-DD
  tipo: text("tipo").notNull(), // 'Compito' | 'Verifica' | 'Evento'
  descrizione: text("descrizione").notNull(),
  completato: boolean("completato").default(false).notNull(),
  studiato: boolean("studiato").default(false).notNull(),
});

export const voti = pgTable("voti", {
  id: serial("id").primaryKey(),
  materia: text("materia").notNull(),
  voto: numeric("voto", { precision: 4, scale: 2 }).notNull(),
});

export const insertDiarioSchema = createInsertSchema(diario).omit({ id: true });
export const insertVotoSchema = createInsertSchema(voti).omit({ id: true });

export type InsertDiario = z.infer<typeof insertDiarioSchema>;
export type Diario = typeof diario.$inferSelect;
export type InsertVoto = z.infer<typeof insertVotoSchema>;
export type Voto = typeof voti.$inferSelect;
