import { Request, Response } from "express";
import Panen from "../models/Panen";

export const createPanen = async (req: Request, res: Response) => {
  try {
    const panen = new Panen(req.body);
    await panen.save();
    res.status(201).json(panen);
  } catch (error) {
    console.error("Error creating Panen:", error);
    res.status(500).json({ message: "Gagal membuat data panen" });
  }
};
