// backend/src/routes/panenRoutes.ts
import express from "express";
import Panen from "../models/Panen.js";
import { createPanen } from "../controller/panenController.js";

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
router.post("/", async (req, res) => {
  try {
    console.log("🔄 Received POST data:", req.body);
    
    // Handle both frontend and API formats
    const {
      tanggalPanen, date,
      petani, farmer,
      lahan, field, 
      bibit, seedProvider,
      tanaman, plant,
      pupuk, fertilizer,
      jumlahHasilPanen, amount,
      statusPenjualan, salesStatus,
      namaPembeli, buyerName
    } = req.body;

    const panenData = {
      date: tanggalPanen || date || new Date(),
      farmer: petani || farmer || "",
      field: lahan || field || "Default Field",
      seedProvider: bibit || seedProvider || "Default Provider", 
      plant: tanaman || plant || "",
      fertilizer: pupuk || fertilizer || "Default Fertilizer",
      amount: jumlahHasilPanen || amount || 0,
      salesStatus: statusPenjualan || salesStatus || "Tersedia",
      buyerName: namaPembeli || buyerName || ""
    };

    console.log("💾 Saving panen data:", panenData);
    
    const panen = new Panen(panenData);
    const savedPanen = await panen.save();
    
    console.log("✅ Panen saved:", savedPanen);
    res.status(201).json({ message: "Panen created successfully", id: savedPanen._id });
  } catch (error: any) {
    console.error("❌ Error creating panen:", error);
    res.status(500).json({ 
      error: error.message,
      details: "Failed to create panen record"
    });
  }
});

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
