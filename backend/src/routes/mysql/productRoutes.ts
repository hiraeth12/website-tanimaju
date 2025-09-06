// backend/src/routes/mysql/productRoutes.ts
import express from "express";
import multer from "multer";
import path from "path";
import { ProductRepository } from "../../repositories/ProductRepository.js";
import type { Product } from "../../models/mysql/interfaces.js";




const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/");
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const gmt7Time = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const timestamp = gmt7Time
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\..+/, "");
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    cb(
      null,
      "product-" +
        timestamp +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await ProductRepository.findAll();
    console.log(`✅ MySQL Products found: ${products.length} items`);
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // ✅ ubah ke number

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await ProductRepository.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST create new product
router.post("/", upload.single("imageSrc"), async (req, res) => {
  try {
    const { title, price, description, info, whatsappNumber } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: "Title and price are required" });
    }

    const productData = {
      title,
      price: parseFloat(price),
      imageSrc: req.file ? `/uploads/products/${req.file.filename}` : null,
      description: description || null,
      info: info || null,
      whatsappNumber: whatsappNumber || null,
    };

    const productId = await ProductRepository.create(productData);
    console.log(`✅ MySQL Product created with ID: ${productId}`);
    res.status(201).json({
      id: productId,
      message: "Product created successfully",
      ...productData,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT update product
router.put("/:id", upload.single("imageSrc"), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const existingProduct = await ProductRepository.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { title, price, description, info, whatsappNumber } = req.body;

    const updateData: Partial<Product> = {};
    if (title !== undefined) updateData.title = title;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (description !== undefined) updateData.description = description;
    if (info !== undefined) updateData.info = info;
    if (whatsappNumber !== undefined)
      updateData.whatsappNumber = whatsappNumber;
    if (req.file)
      updateData.imageSrc = `/uploads/products/${req.file.filename}`;

    const updated = await ProductRepository.update(id, updateData);
    if (!updated) {
      return res.status(400).json({ error: "No changes made" });
    }

    res.json({ message: "Product updated successfully", id, ...updateData });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const deleted = await ProductRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// GET search products
router.get("/search/:term", async (req, res) => {
  try {
    const { term } = req.params;
    const products = await ProductRepository.search(term);
    console.log(
      `✅ MySQL Search results: ${products.length} products found for "${term}"`
    );
    res.json(products);
  } catch (error) {
    console.error("❌ Error searching products:", error);
    res.status(500).json({ error: "Failed to search products" });
  }
});

export default router;
