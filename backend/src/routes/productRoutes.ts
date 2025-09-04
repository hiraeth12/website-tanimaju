import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const router = express.Router();

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
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

// GET all products
router.get("/", async (req, res) => {
  try {
    const data = await Product.find();
    console.log(`✅ Products found: ${data.length} items`);
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("✅ Product found:", product.title);
    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST new product
router.post("/", upload.single('imageSrc'), async (req, res) => {
  try {
    const productData = {
      title: req.body.title,
      price: Number(req.body.price),
      imageSrc: req.file ? `/uploads/products/${req.file.filename}` : '',
      description: req.body.description,
      info: req.body.info,
      whatsappNumber: req.body.whatsappNumber
    };
    
    const product = new Product(productData);
    await product.save();
    console.log("✅ Product created:", product.title);
    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT update product
router.put("/:id", upload.single('imageSrc'), async (req, res) => {
  try {
    console.log("🔄 Updating product:", req.params.id);
    console.log("📝 Request body:", req.body);
    console.log("📁 Uploaded file:", req.file);

    const updateData = { ...req.body };

    // If a new image was uploaded, update the imageSrc field
    if (req.file) {
      updateData.imageSrc = `/uploads/products/${req.file.filename}`;
      console.log("📸 New image uploaded:", updateData.imageSrc);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    console.log("✅ Product updated:", product.title);
    res.json(product);
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("✅ Product deleted:", product.title);
    res.json({ message: "Product deleted successfully", product });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
