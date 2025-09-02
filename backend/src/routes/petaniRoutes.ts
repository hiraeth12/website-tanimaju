import express from "express";
import Petani from "../models/Petani.js";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const data = await Petani.find();
  res.json(data);
});

// POST new
router.post("/", async (req, res) => {
  const petani = new Petani(req.body);
  await petani.save();
  res.status(201).json(petani);
});

export default router;
