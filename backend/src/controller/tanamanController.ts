import { Request, Response } from "express";
import Tanaman from "../models/Tanaman.js";

// GET all tanaman
export const getTanaman = async (req: Request, res: Response) => {
  try {
    const data = await Tanaman.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error });
  }
};

// CREATE tanaman baru
export const createTanaman = async (req: Request, res: Response) => {
  try {
    const { namaTanaman, pupuk } = req.body;

    if (!namaTanaman || !pupuk) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const tanaman = new Tanaman({ namaTanaman, pupuk });
    await tanaman.save();

    res.status(201).json(tanaman);
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat data", error });
  }
};

// GET detail tanaman by ID
export const getTanamanById = async (req: Request, res: Response) => {
  try {
    const tanaman = await Tanaman.findById(req.params.id);
    if (!tanaman) {
      return res.status(404).json({ message: "Tanaman tidak ditemukan" });
    }
    res.json(tanaman);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail tanaman", error });
  }
};

// UPDATE tanaman
export const updateTanaman = async (req: Request, res: Response) => {
  try {
    const { namaTanaman, pupuk } = req.body;
    const tanaman = await Tanaman.findByIdAndUpdate(
      req.params.id,
      { namaTanaman, pupuk },
      { new: true, runValidators: true }
    );
    if (!tanaman) {
      return res.status(404).json({ message: "Tanaman tidak ditemukan" });
    }
    res.json(tanaman);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui tanaman", error });
  }
};

// DELETE tanaman
export const deleteTanaman = async (req: Request, res: Response) => {
  try {
    const tanaman = await Tanaman.findByIdAndDelete(req.params.id);
    if (!tanaman) {
      return res.status(404).json({ message: "Tanaman tidak ditemukan" });
    }
    res.json({ message: "Tanaman berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus data", err });
  }
};
