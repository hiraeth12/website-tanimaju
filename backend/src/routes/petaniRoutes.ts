import express from "express";
import multer from "multer";
import path from "path";
import Petani from "../models/Petani.js";

const router = express.Router();

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/petani/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'petani-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET all petani
router.get("/", async (req, res) => {
  try {
    const data = await Petani.find();
    console.log(`✅ Petani found: ${data.length} items`);
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching petani:", error);
    res.status(500).json({ error: "Failed to fetch petani" });
  }
});

// GET single petani by ID
router.get("/:id", async (req, res) => {
  try {
    const petani = await Petani.findById(req.params.id);
    if (!petani) {
      return res.status(404).json({ error: "Petani not found" });
    }
    console.log("✅ Petani found:", petani.nama);
    res.json(petani);
  } catch (error) {
    console.error("❌ Error fetching petani:", error);
    res.status(500).json({ error: "Failed to fetch petani" });
  }
});

// POST new petani
router.post("/", upload.single('foto'), async (req, res) => {
  try {
    const petaniData = {
      nama: req.body.nama,
      alamat: req.body.alamat,
      nomorKontak: req.body.nomorKontak,
      foto: req.file ? `/uploads/petani/${req.file.filename}` : ''
    };
    
    const petani = new Petani(petaniData);
    await petani.save();
    console.log("✅ Petani created:", petani.nama);
    res.status(201).json(petani);
  } catch (error) {
    console.error("❌ Error creating petani:", error);
    res.status(500).json({ error: "Failed to create petani" });
  }
});

// PUT update petani
router.put("/:id", upload.single('foto'), async (req, res) => {
  try {
    console.log("🔄 Updating petani:", req.params.id);
    console.log("📝 Request body:", req.body);
    console.log("📁 Uploaded file:", req.file);

    const updateData = { ...req.body };

    // If a new image was uploaded, update the foto field
    if (req.file) {
      updateData.foto = `/uploads/petani/${req.file.filename}`;
      console.log("📸 New image uploaded:", updateData.foto);
    }

    const petani = await Petani.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!petani) {
      return res.status(404).json({ error: "Petani not found" });
    }
    
    console.log("✅ Petani updated:", petani.nama);
    res.json(petani);
  } catch (error) {
    console.error("❌ Error updating petani:", error);
    res.status(500).json({ error: "Failed to update petani" });
  }
});

// DELETE petani
router.delete("/:id", async (req, res) => {
  try {
    const petani = await Petani.findByIdAndDelete(req.params.id);
    if (!petani) {
      return res.status(404).json({ error: "Petani not found" });
    }
    console.log("✅ Petani deleted:", petani.nama);
    res.json({ message: "Petani deleted successfully", petani });
  } catch (error) {
    console.error("❌ Error deleting petani:", error);
    res.status(500).json({ error: "Failed to delete petani" });
  }
});

export default router;
