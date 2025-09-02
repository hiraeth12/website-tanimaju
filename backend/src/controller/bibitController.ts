import { Request, Response } from "express";
import Bibit from "../models/Bibit.js";

// 🔎 Helper validasi input
const validateBibitInput = (body: any) => {
  const errors: string[] = [];

  if (!body.tanaman || typeof body.tanaman !== "string" || body.tanaman.trim() === "") {
    errors.push("Nama tanaman tidak boleh kosong");
  }
  if (!body.sumber || typeof body.sumber !== "string" || body.sumber.trim() === "") {
    errors.push("Sumber tidak boleh kosong");
  }
  if (!body.namaPenyedia || typeof body.namaPenyedia !== "string" || body.namaPenyedia.trim() === "") {
    errors.push("Nama penyedia tidak boleh kosong");
  }
  if (!body.tanggalPemberian || String(body.tanggalPemberian).trim() === "") {
    errors.push("Tanggal pemberian tidak boleh kosong");
  }

  return errors;
};

// ✅ GET semua bibit
export const getAllBibits = async (req: Request, res: Response) => {
  try {
    const bibits = await Bibit.find();
    res.json(bibits);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data bibit", error });
  }
};

// ✅ POST buat bibit baru
export const createBibit = async (req: Request, res: Response) => {
  try {
    const errors = validateBibitInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validasi gagal", errors });
    }

    const bibit = new Bibit(req.body);
    await bibit.save();
    res.status(201).json(bibit);
  } catch (error) {
    res.status(400).json({ message: "Gagal membuat bibit", error });
  }
};

// ✅ GET detail bibit by ID
export const getBibitById = async (req: Request, res: Response) => {
  try {
    const bibit = await Bibit.findById(req.params.id);
    if (!bibit) return res.status(404).json({ message: "Bibit tidak ditemukan" });
    res.json(bibit);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil bibit", error });
  }
};

// ✅ PUT update bibit
export const updateBibit = async (req: Request, res: Response) => {
  try {
    const errors = validateBibitInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validasi gagal", errors });
    }

    const bibit = await Bibit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!bibit) return res.status(404).json({ message: "Bibit tidak ditemukan" });
    res.json(bibit);
  } catch (error) {
    res.status(400).json({ message: "Gagal update bibit", error });
  }
};

// ✅ DELETE bibit
export const deleteBibit = async (req: Request, res: Response) => {
  try {
    const bibit = await Bibit.findByIdAndDelete(req.params.id);
    if (!bibit) return res.status(404).json({ message: "Bibit tidak ditemukan" });
    res.json({ message: "Bibit berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus bibit", error });
  }
};
