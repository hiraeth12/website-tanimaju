// backend/src/routes/mysql/bibitRoutes.ts
import express from "express";
import mysqlPool from "../../config/mysql-database.js";

const router = express.Router();

// Get all bibit
router.get("/", async (req, res) => {
  try {
    const [rows] = await mysqlPool.execute("SELECT * FROM bibit ORDER BY id DESC");
    console.log("✅ MySQL Bibit found:", (rows as any[]).length, "items");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching bibit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get bibit by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await mysqlPool.execute("SELECT * FROM bibit WHERE id = ?", [id]);
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "Bibit not found" });
    }
    
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error("❌ Error fetching bibit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new bibit
router.post("/", async (req, res) => {
  try {
    const { tanaman, sumber, namaPenyedia, tanggalPemberian } = req.body;

    if (!tanaman || !tanggalPemberian) {
      return res.status(400).json({ error: "Tanaman dan tanggalPemberian wajib diisi" });
    }

    const [result] = await mysqlPool.execute(
      "INSERT INTO bibit (tanaman, sumber, namaPenyedia, tanggalPemberian) VALUES (?, ?, ?, ?)",
      [tanaman, sumber || null, namaPenyedia || null, tanggalPemberian]
    );

    const insertId = (result as any).insertId;
    res.status(201).json({ 
      message: "Bibit created successfully", 
      id: insertId 
    });
  } catch (error) {
    console.error("❌ Error creating bibit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update bibit
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { tanaman, sumber, namaPenyedia, tanggalPemberian } = req.body;

    const [result] = await mysqlPool.execute(
      "UPDATE bibit SET tanaman = ?, sumber = ?, namaPenyedia = ?, tanggalPemberian = ? WHERE id = ?",
      [tanaman, sumber || null, namaPenyedia || null, tanggalPemberian, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Bibit not found" });
    }

    res.json({ message: "Bibit updated successfully" });
  } catch (error) {
    console.error("❌ Error updating bibit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete bibit
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [result] = await mysqlPool.execute("DELETE FROM bibit WHERE id = ?", [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Bibit not found" });
    }

    res.json({ message: "Bibit deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting bibit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
