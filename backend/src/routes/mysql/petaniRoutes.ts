// backend/src/routes/mysql/petaniRoutes.ts
import express from "express";
import multer from "multer";
import path from "path";
import { PetaniRepository } from "../../repositories/PetaniRepository.js";
import { adaptMySQLToMongo, adaptMongoToMySQL } from "../../utils/dataAdapter.js";
import { getCurrentDateGMT7, formatTimestampGMT7 } from "../../utils/timezone.js";

const router = express.Router();

// Konfigurasi multer untuk upload file dengan timezone GMT+7
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/petani/');
  },
  filename: (req, file, cb) => {
    // Use GMT+7 timestamp for filename
    const now = new Date();
    const gmt7Time = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const timestamp = gmt7Time.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const uniqueSuffix = Math.round(Math.random() * 1E9);
    cb(null, 'petani-' + timestamp + '-' + uniqueSuffix + path.extname(file.originalname));
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
    const petani = await PetaniRepository.findAll();
    console.log(`✅ MySQL Petani found: ${petani.length} items`);
    const adaptedData = adaptMySQLToMongo(petani);
    res.json(adaptedData);
  } catch (error) {
    console.error("❌ Error fetching petani:", error);
    res.status(500).json({ error: "Failed to fetch petani" });
  }
});

// GET single petani by ID
router.get("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);
    const petani = await PetaniRepository.findById(id);
    if (!petani) {
      return res.status(404).json({ error: "Petani not found" });
    }
    
    console.log(`✅ MySQL Petani found: ${petani.nama}`);
    const adaptedPetani = adaptMySQLToMongo(petani);
    res.json(adaptedPetani);
  } catch (error) {
    console.error("❌ Error fetching petani:", error);
    res.status(500).json({ error: "Failed to fetch petani" });
  }
});

// POST create new petani
router.post("/", upload.single('foto'), async (req, res) => {
  try {
    const { nama, alamat, nomorKontak } = req.body;
    
    // Validate required fields
    if (!nama) {
      return res.status(400).json({ error: "Nama is required" });
    }

    const petaniData = {
      nama,
      alamat: alamat || undefined,
      nomorKontak: nomorKontak || undefined,
      foto: req.file ? `/uploads/petani/${req.file.filename}` : undefined
    };

    const petaniId = await PetaniRepository.create(petaniData);
    
    console.log(`✅ MySQL Petani created with ID: ${petaniId}`);
    
    // Return created petani with adapted structure
    const createdPetani = await PetaniRepository.findById(petaniId);
    const adaptedData = adaptMySQLToMongo(createdPetani);
    res.status(201).json(adaptedData);
  } catch (error) {
    console.error("❌ Error creating petani:", error);
    res.status(500).json({ error: "Failed to create petani" });
  }
});

// PUT update petani
router.put("/:id", upload.single('foto'), async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);

    // Check if petani exists
    const existingPetani = await PetaniRepository.findById(id);
    if (!existingPetani) {
      return res.status(404).json({ error: "Petani not found" });
    }

    const { nama, alamat, nomorKontak } = req.body;
    
    const updateData: any = {};
    
    if (nama !== undefined) updateData.nama = nama;
    if (alamat !== undefined) updateData.alamat = alamat;
    if (nomorKontak !== undefined) updateData.nomorKontak = nomorKontak;
    if (req.file) updateData.foto = `/uploads/petani/${req.file.filename}`;

    const updated = await PetaniRepository.update(id, updateData);
    if (!updated) {
      return res.status(400).json({ error: "No changes made" });
    }
    
    // Return updated petani with adapted structure
    const updatedPetani = await PetaniRepository.findById(id);
    const adaptedUpdatedPetani = adaptMySQLToMongo(updatedPetani);
    
    console.log(`✅ MySQL Petani updated: ${id}`);
    res.json(adaptedUpdatedPetani);
  } catch (error) {
    console.error("❌ Error updating petani:", error);
    res.status(500).json({ error: "Failed to update petani" });
  }
});

// DELETE petani
router.delete("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);

    const deleted = await PetaniRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Petani not found" });
    }
    
    console.log(`✅ MySQL Petani deleted: ${id}`);
    res.json({ message: "Petani deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting petani:", error);
    res.status(500).json({ error: "Failed to delete petani" });
  }
});

export default router;
