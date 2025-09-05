import express from "express";
import mysql from "mysql2/promise";
import mysqlPool from "../../config/mysql-database.js";
import { adaptMongoToMySQL } from "../../utils/dataAdapter.js";
import { adaptTanamanMySQLToMongo, adaptTanamanMongoToMySQL } from "../../utils/fieldAdapters.js";

const router = express.Router();

// Get all tanaman
router.get("/", async (req, res) => {
  try {
    const [rows] = await mysqlPool.execute("SELECT * FROM tanaman ORDER BY id DESC");
    console.log("✅ MySQL Tanaman found:", (rows as any[]).length, "items");
    const adaptedData = adaptTanamanMySQLToMongo(rows);
    res.json(adaptedData);
  } catch (error) {
    console.error("Error fetching tanaman:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get tanaman by ID
router.get("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);
    const [rows] = await mysqlPool.execute("SELECT * FROM tanaman WHERE id = ?", [id]);
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "Tanaman not found" });
    }
    
    const adaptedData = adaptTanamanMySQLToMongo((rows as any[])[0]);
    res.json(adaptedData);
  } catch (error) {
    console.error("Error fetching tanaman:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new tanaman
router.post("/", async (req, res) => {
  try {
    // Convert frontend fields to MySQL fields
    const mysqlData = adaptTanamanMongoToMySQL(req.body);
    const { nama, jenis, deskripsi, perawatan } = mysqlData;
    
    // Provide default values for undefined fields
    const defaultDeskripsi = deskripsi || `Tanaman ${nama || 'Unknown'}`;
    const defaultPerawatan = perawatan || `Menggunakan pupuk ${jenis || 'Default'}`;
    
    const [result] = await mysqlPool.execute(
      "INSERT INTO tanaman (nama, jenis, deskripsi, perawatan) VALUES (?, ?, ?, ?)",
      [nama, jenis, defaultDeskripsi, defaultPerawatan]
    );
    
    const insertId = (result as any).insertId;
    
    // Return created tanaman with frontend structure
    const [rows] = await mysqlPool.execute("SELECT * FROM tanaman WHERE id = ?", [insertId]);
    const adaptedData = adaptTanamanMySQLToMongo((rows as any[])[0]);
    
    res.status(201).json(adaptedData);
  } catch (error) {
    console.error("Error creating tanaman:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update tanaman
router.put("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);
    
    // Convert frontend fields to MySQL fields
    const mysqlData = adaptTanamanMongoToMySQL(req.body);
    const { nama, jenis, deskripsi, perawatan } = mysqlData;
    
    // Provide default values for undefined fields
    const defaultDeskripsi = deskripsi || `Tanaman ${nama || 'Unknown'}`;
    const defaultPerawatan = perawatan || `Menggunakan pupuk ${jenis || 'Default'}`;
    
    const [result] = await mysqlPool.execute(
      "UPDATE tanaman SET nama = ?, jenis = ?, deskripsi = ?, perawatan = ? WHERE id = ?",
      [nama, jenis, defaultDeskripsi, defaultPerawatan, id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Tanaman not found" });
    }
    
    // Return updated tanaman with frontend structure
    const [rows] = await mysqlPool.execute("SELECT * FROM tanaman WHERE id = ?", [id]);
    const adaptedData = adaptTanamanMySQLToMongo((rows as any[])[0]);
    
    res.json(adaptedData);
  } catch (error) {
    console.error("Error updating tanaman:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete tanaman
router.delete("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);
    
    const [result] = await mysqlPool.execute("DELETE FROM tanaman WHERE id = ?", [id]);
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Tanaman not found" });
    }
    
    res.json({ message: "Tanaman deleted successfully" });
  } catch (error) {
    console.error("Error deleting tanaman:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
