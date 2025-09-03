import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const router = express.Router();

// === Setup multer ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products"); // folder untuk simpan gambar
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

// === Routes ===

// GET all
router.get("/", async (req, res) => {
  const data = await Product.find();
  res.json(data);
});

// POST new dengan upload gambar
router.post("/", upload.single("imageSrc"), async (req, res) => {
  try {
    const { title, price, description, info, whatsappNumber } = req.body;

    const product = new Product({
      title,
      price,
      imageSrc: req.file
        ? `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`
        : null,
      description,
      info,
      whatsappNumber,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Gagal membuat produk" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

router.put("/:id", upload.single("imageSrc"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, description, info, whatsappNumber } = req.body;

    const updateData: any = {
      title,
      price,
      description,
      info,
      whatsappNumber,
    };

    if (req.file) {
      updateData.imageSrc = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// DELETE produk
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
