// src/routes/admin.ts
import { Router } from "express";
import { authMiddleware, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware, 
  requireAdmin,   
  (req, res) => {
    res.json({
      message: "Welcome to Admin Dashboard",
      user: (req as any).user, 
    });
  }
);

export default router;
