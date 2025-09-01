// File: backend/src/controller/panenController.ts
import { Request, Response } from "express";
import Panen from "../models/Panen.js";

export const createPanen = async (req: Request, res: Response) => {
  try {
    console.log("Data diterima:", req.body); // debug
    const panen = new Panen(req.body);
    await panen.save();
    res.status(201).json(panen);
  } catch (error: any) {
    console.error("Error createPanen:", error.message);
    res.status(500).json({ error: error.message });
  }
};
