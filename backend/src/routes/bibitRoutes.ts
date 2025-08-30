import express from "express";
import Bibit from "../models/Bibit";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const data = await Bibit.find();
  res.json(data);
});

// POST new
router.post("/", async (req, res) => {
  const bibit = new Bibit(req.body);
  await bibit.save();
  res.status(201).json(bibit);
});

export default router;
