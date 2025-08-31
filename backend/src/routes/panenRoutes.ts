// backend/src/routes/panenRoutes.ts
import express from "express";
import Panen from "../models/Panen";
import { createPanen } from "../controller/panenController";

const router = express.Router();

// GET all dengan populate
router.get("/", async (req, res) => {
  try {
    const data = await Panen.find()
      .populate("petani", "nama") 
      .populate("bibit", "namaPenyedia")
      .populate("tanaman", "namaTanaman");

    res.json(data);
  } catch (error: any) {
    console.error("Error get panen:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET by ID
router.get("/:id", async (req, res) => {
  try {
    const panen = await Panen.findById(req.params.id)
      .populate("petani", "nama")
      .populate("bibit", "namaPenyedia")
      .populate("tanaman", "namaTanaman");

    if (!panen) {
      return res.status(404).json({ message: "Data panen tidak ditemukan" });
    }

    res.json(panen);
  } catch (error: any) {
    console.error("Error get panen by id:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST new
router.post("/", createPanen);

// ✅ PUT update by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Panen.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("petani", "nama")
      .populate("bibit", "namaPenyedia")
      .populate("tanaman", "namaTanaman");

    if (!updated) {
      return res.status(404).json({ message: "Data panen tidak ditemukan" });
    }

    res.json(updated);
  } catch (error: any) {
    console.error("Error update panen:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Panen.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Panen berhasil dihapus" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
