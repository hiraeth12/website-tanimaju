import express from "express";
import Product from "../models/Product";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const data = await Product.find();
  res.json(data);
});

// POST new
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

export default router;
