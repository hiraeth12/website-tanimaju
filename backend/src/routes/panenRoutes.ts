import express from "express";
import Panen from "../models/Panen";
import { createPanen } from "../controller/panenController";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const data = await Panen.find();
  res.json(data);
});

// POST new
router.post("/", async (req, res) => {
  const panen = new Panen(req.body);
  await panen.save();
  res.status(201).json(panen);
});

router.post("/", createPanen);

export default router;
