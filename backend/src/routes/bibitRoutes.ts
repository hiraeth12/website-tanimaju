import express from "express";
import {
  getAllBibits,
  createBibit,
  getBibitById,
  updateBibit,
  deleteBibit,
} from "../controller/bibitController.js";

const router = express.Router();

router.get("/", getAllBibits);
router.post("/", createBibit);
router.get("/:id", getBibitById);
router.put("/:id", updateBibit);
router.delete("/:id", deleteBibit);

export default router;
