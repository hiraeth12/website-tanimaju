// backend/src/routes/mysql/productRoutes.ts
import express from "express";
import multer from "multer";
import path from "path";
import { ProductRepository } from "../../repositories/ProductRepository.js";
import { adaptMySQLToMongo, adaptMongoToMySQL } from "../../utils/dataAdapter.js";
import { getCurrentDateGMT7, formatTimestampGMT7 } from "../../utils/timezone.js";

const router = express.Router();

// Konfigurasi multer untuk upload file dengan timezone GMT+7
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    // Use GMT+7 timestamp for filename
    const now = new Date();
    const gmt7Time = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const timestamp = gmt7Time.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const uniqueSuffix = Math.round(Math.random() * 1E9);
    cb(null, 'product-' + timestamp + '-' + uniqueSuffix + path.extname(file.originalname));
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
    const products = await ProductRepository.findAll();
    console.log(`✅ MySQL Products found: ${products.length} items`);
    const adaptedData = adaptMySQLToMongo(products);
    res.json(adaptedData);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);

    const product = await ProductRepository.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    console.log(`✅ MySQL Product found: ${product.title}`);
    const adaptedData = adaptMySQLToMongo(product);
    res.json(adaptedData);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST create new product
router.post("/", upload.single('imageSrc'), async (req, res) => {
  try {
    const { title, price, description, info, whatsappNumber } = req.body;
    
    // Validate required fields
    if (!title || !price) {
      return res.status(400).json({ error: "Title and price are required" });
    }

    const productData = {
      title,
      price: parseFloat(price),
      imageSrc: req.file ? `/uploads/products/${req.file.filename}` : undefined,
      description: description || undefined,
      info: info || undefined,
      whatsappNumber: whatsappNumber || undefined
    };

    const productId = await ProductRepository.create(productData);
    
    console.log(`✅ MySQL Product created with ID: ${productId}`);
    res.status(201).json({ 
      id: productId, 
      message: "Product created successfully",
      ...productData
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT update product
router.put("/:id", upload.single('imageSrc'), async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);

    // Check if product exists
    const existingProduct = await ProductRepository.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { title, price, description, info, whatsappNumber } = req.body;
    
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (description !== undefined) updateData.description = description;
    if (info !== undefined) updateData.info = info;
    if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber;
    if (req.file) updateData.imageSrc = `/uploads/products/${req.file.filename}`;

    const updated = await ProductRepository.update(id, updateData);
    if (!updated) {
      return res.status(400).json({ error: "No changes made" });
    }
    
    console.log(`✅ MySQL Product updated: ${id}`);
    res.json({ 
      message: "Product updated successfully",
      id,
      ...updateData
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);

    const deleted = await ProductRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    console.log(`✅ MySQL Product deleted: ${id}`);
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
    
    console.log(`✅ MySQL Search results: ${products.length} products found for "${term}"`);
    const adaptedData = adaptMySQLToMongo(products);
    res.json(adaptedData);
  } catch (error) {
    console.error("❌ Error searching products:", error);
    res.status(500).json({ error: "Failed to search products" });
  }
});

export default router;
