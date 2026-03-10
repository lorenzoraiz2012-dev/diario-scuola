import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Diario endpoints
  app.get(api.diario.list.path, async (req, res) => {
    const items = await storage.getDiarioItems();
    res.json(items);
  });

  app.post(api.diario.create.path, async (req, res) => {
    try {
      const input = api.diario.create.input.parse(req.body);
      const item = await storage.createDiarioItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.diario.update.path, async (req, res) => {
    try {
      const input = api.diario.update.input.parse(req.body);
      const item = await storage.updateDiarioItem(Number(req.params.id), input);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.diario.delete.path, async (req, res) => {
    await storage.deleteDiarioItem(Number(req.params.id));
    res.status(204).send();
  });

  // Voti endpoints
  app.get(api.voti.list.path, async (req, res) => {
    const items = await storage.getVoti();
    res.json(items);
  });

  app.post(api.voti.create.path, async (req, res) => {
    try {
      const input = api.voti.create.input.parse(req.body);
      const item = await storage.createVoto(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.voti.delete.path, async (req, res) => {
    await storage.deleteVoto(Number(req.params.id));
    res.status(204).send();
  });

  return httpServer;
}
