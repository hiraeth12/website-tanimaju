import express from "express";
import mysql from "mysql2/promise";
import mysqlPool from "../../config/mysql-database.js";
import { adaptMongoToMySQL } from "../../utils/dataAdapter.js";
import { adaptPanenMySQLToMongo } from "../../utils/fieldAdapters.js";
import { getCurrentDateGMT7 } from "../../utils/timezone.js";

const router = express.Router();

// Get all panen
router.get("/", async (req, res) => {
  try {
    const [rows] = await mysqlPool.execute(`
      SELECT p.*, 
             pt.nama as petani_nama, 
             t.nama as tanaman_nama,
             b.nama_penyedia as bibit_nama_penyedia
      FROM panen p
      LEFT JOIN petani pt ON p.petani_id = pt.id
      LEFT JOIN tanaman t ON p.tanaman_id = t.id
      LEFT JOIN bibit b ON p.bibit_id = b.id
      ORDER BY p.id DESC
    `);
    console.log("✅ MySQL Panen found:", (rows as any[]).length, "items");
    const adaptedData = adaptPanenMySQLToMongo(rows);
    res.json(adaptedData);
  } catch (error) {
    console.error("Error fetching panen:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get panen by ID
router.get("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);
    const [rows] = await mysqlPool.execute(`
      SELECT p.*, 
             pt.nama as petani_nama, 
             t.nama as tanaman_nama,
             b.nama_penyedia as bibit_nama_penyedia
      FROM panen p
      LEFT JOIN petani pt ON p.petani_id = pt.id
      LEFT JOIN tanaman t ON p.tanaman_id = t.id
      LEFT JOIN bibit b ON p.bibit_id = b.id
      WHERE p.id = ?
    `, [id]);
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "Panen not found" });
    }
    
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error("Error fetching panen:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new panen
router.post("/", async (req, res) => {
  try {
    console.log("📝 Creating panen with data:", req.body);
    
    // Support both frontend format and API format
    const { 
      // Frontend format
      tanggalPanen, 
      petani, 
      lahan,
      bibit,
      tanaman, 
      pupuk,
      jumlahHasilPanen, 
      statusPenjualan, 
      namaPembeli,
      // API format (fallback)
      date, 
      farmer, 
      field,
      seedProvider,
      plant, 
      fertilizer,
      amount, 
      salesStatus, 
      buyerName
    } = req.body;

    // Convert to MySQL format with fallbacks and GMT+7 timezone
    const tanggal_panen = tanggalPanen || date || getCurrentDateGMT7();
    const petani_id = petani || farmer || null; // Frontend sends ID as string
    const lahan_value = lahan || field || null;
    const bibit_id = bibit || seedProvider || null; // Frontend sends ID as string
    const tanaman_id = tanaman || plant || null; // Frontend sends ID as string
    const pupuk_value = pupuk || fertilizer || null;
    const jumlah = jumlahHasilPanen || amount || 0;
    const status_penjualan = statusPenjualan || salesStatus || 'Tersedia';
    const nama_pembeli = namaPembeli || buyerName || '';
    
    // Insert with all the available columns including the newly added ones
    const query = `
      INSERT INTO panen (
        petani_id,
        tanaman_id,
        lahan,
        bibit_id,
        pupuk,
        jumlah, 
        tanggal_panen, 
        status_penjualan, 
        nama_pembeli,
        created_at, 
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const values = [
      petani_id,
      tanaman_id, 
      lahan_value,
      bibit_id,
      pupuk_value,
      jumlah, 
      tanggal_panen, 
      status_penjualan, 
      nama_pembeli
    ];
    
    console.log("🔍 SQL Query:", query);
    console.log("🔍 Values:", values);
    
    const [result] = await mysqlPool.execute(query, values);
    
    const insertId = (result as any).insertId;
    console.log("✅ Panen created with ID:", insertId);
    
    res.status(201).json({ 
      message: "Panen created successfully", 
      id: insertId 
    });
  } catch (error) {
    console.error("❌ Error creating panen:", error);
    res.status(500).json({ error: "Internal server error", details: (error as Error).message });
  }
});

// Update panen
router.put("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);
    console.log("📝 Updating panen ID:", id, "with data:", req.body);
    
    // Support both frontend format and API format
    const { 
      // Frontend format
      tanggalPanen, 
      petani, 
      tanaman, 
      jumlahHasilPanen, 
      statusPenjualan, 
      namaPembeli,
      // API format (fallback)
      date, 
      farmer, 
      plant, 
      amount, 
      salesStatus, 
      buyerName
    } = req.body;

    // Convert to MySQL format with fallbacks
    const tanggal_panen = tanggalPanen || date;
    const jumlah = jumlahHasilPanen || amount;
    const status_penjualan = statusPenjualan || salesStatus;
    const nama_pembeli = namaPembeli || buyerName;
    
    const [result] = await mysqlPool.execute(`
      UPDATE panen SET 
        jumlah = ?, 
        tanggal_panen = ?, 
        status_penjualan = ?, 
        nama_pembeli = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [jumlah, tanggal_panen, status_penjualan, nama_pembeli, id]);
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Panen not found" });
    }
    
    console.log("✅ Panen updated successfully");
    res.json({ message: "Panen updated successfully" });
  } catch (error) {
    console.error("❌ Error updating panen:", error);
    res.status(500).json({ error: "Internal server error", details: (error as Error).message });
  }
});

// Delete panen
router.delete("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);
    console.log("🗑️ Deleting panen ID:", id);
    
    const [result] = await mysqlPool.execute("DELETE FROM panen WHERE id = ?", [id]);
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Panen not found" });
    }
    
    console.log("✅ Panen deleted successfully");
    res.json({ message: "Panen deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting panen:", error);
    res.status(500).json({ error: "Internal server error", details: (error as Error).message });
  }
});

export default router;
