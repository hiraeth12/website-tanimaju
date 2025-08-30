import express from "express";
import Tanaman from "../models/Tanaman";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const data = await Tanaman.find();
  res.json(data);
});

// POST new
router.post("/", async (req, res) => {
  const tanaman = new Tanaman(req.body);
  await tanaman.save();
  res.status(201).json(tanaman);
});

export default router;
