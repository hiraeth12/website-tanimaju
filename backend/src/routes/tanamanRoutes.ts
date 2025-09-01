import express from "express";
import {
  getTanaman,
  createTanaman,
  deleteTanaman,
  getTanamanById,
  updateTanaman,
} from "../controller/tanamanController.js";

const router = express.Router();

router.get("/", getTanaman);
router.post("/", createTanaman);
router.get("/:id", getTanamanById);   // 🔥 GET detail tanaman
router.put("/:id", updateTanaman);    // 🔥 UPDATE tanaman
router.delete("/:id", deleteTanaman);

export default router;
