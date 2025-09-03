import express from "express";
import Petani from "../models/Petani.js";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/petani"); // 🔥 ganti jadi folder petani
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

// GET all
router.get("/", async (req, res) => {
  const data = await Petani.find();
  res.json(data);
});

// POST new
router.post("/", upload.single("foto"), async (req, res) => {
  try {
    const { nama, alamat, nomorKontak } = req.body;

    const petani = new Petani({
      nama,
      alamat,
      nomorKontak,
      foto: req.file
        ? `${req.protocol}://${req.get("host")}/uploads/petani/${req.file.filename}`
        : null,
    });

    await petani.save();
    res.status(201).json(petani);
  } catch (error) {
    console.error("Error membuat data petani:", error);
    res.status(500).json({ message: "Gagal membuat data petani" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const petani = await Petani.findById(id);

    if (!petani) {
      return res.status(404).json({ message: "Data Petani tidak ditemukan" });
    }

    res.json(petani);
  } catch (error) {
    console.error("Error fetching petani:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

router.put("/:id", upload.single("foto"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, alamat, nomorKontak } = req.body;

    const updateData: any = {
      nama,
      alamat,
      nomorKontak,
    };

    if (req.file) {
      updateData.foto = `${req.protocol}://${req.get("host")}/uploads/petani/${req.file.filename}`;
    }

    const updatedPetani = await Petani.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedPetani) {
      return res.status(404).json({ message: "Data Petani tidak ditemukan" });
    }

    res.json(updatedPetani);
  } catch (error) {
    console.error("Error updating petani:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Petani.findByIdAndDelete(id); // 🔥 pakai Petani

    if (!deleted) {
      return res.status(404).json({ message: "Data Petani tidak ditemukan" });
    }

    res.json({ message: "Data Petani berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting petani:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});


export default router;
