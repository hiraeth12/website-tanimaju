import express from "express";
import mysqlPool from "../../config/mysql-database.js";
import { getCurrentDateGMT7 } from "../../utils/timezone.js";

const router = express.Router();

// Get all panen
router.get("/", async (req, res) => {
  try {
    const [rows] = await mysqlPool.execute(`
      SELECT p.*, 
             pt.nama AS petani_nama, 
             t.namaTanaman AS tanaman_nama,
             b.namaPenyedia AS bibit_nama_penyedia
      FROM panen p
      LEFT JOIN petani pt ON p.petani_id = pt.id
      LEFT JOIN tanaman t ON p.tanaman_id = t.id
      LEFT JOIN bibit b ON p.bibit_id = b.id
      ORDER BY p.id DESC
    `);
    console.log("✅ MySQL Panen found:", (rows as any[]).length, "items");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching panen:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get panen by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await mysqlPool.execute(`
      SELECT p.*, 
             pt.nama AS petani_nama, 
             t.namaTanaman AS tanaman_nama,
             b.namaPenyedia AS bibit_nama_penyedia
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
    console.error("❌ Error fetching panen:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new panen
router.post("/", async (req, res) => {
  try {
    console.log("📝 Creating panen with data:", req.body);

    const { 
      tanggalPanen, 
      petani, 
      tanaman,
      lahan,
      bibit,
      pupuk,
      jumlahHasilPanen, 
      statusPenjualan, 
      namaPembeli
    } = req.body;

    // First, get the IDs from names
    let petani_id = null;
    let tanaman_id = null;
    let bibit_id = null;

    // Get petani ID by name
    if (petani) {
      const [petaniRows] = await mysqlPool.execute("SELECT id FROM petani WHERE nama = ?", [petani]);
      if ((petaniRows as any[]).length > 0) {
        petani_id = (petaniRows as any[])[0].id;
      }
    }

    // Get tanaman ID by name
    if (tanaman) {
      const [tanamanRows] = await mysqlPool.execute("SELECT id FROM tanaman WHERE namaTanaman = ?", [tanaman]);
      if ((tanamanRows as any[]).length > 0) {
        tanaman_id = (tanamanRows as any[])[0].id;
      }
    }

    // Get bibit ID by namaPenyedia
    if (bibit) {
      const [bibitRows] = await mysqlPool.execute("SELECT id FROM bibit WHERE namaPenyedia = ?", [bibit]);
      if ((bibitRows as any[]).length > 0) {
        bibit_id = (bibitRows as any[])[0].id;
      }
    }

    const query = `
      INSERT INTO panen (
        petani_id,
        tanaman_id,
        lahan,
        bibit_id,
        pupuk,
        jumlahHasilPanen, 
        tanggalPanen, 
        statusPenjualan, 
        namaPembeli,
        created_at, 
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const values = [
      petani_id,
      tanaman_id, 
      lahan,
      bibit_id,
      pupuk,
      jumlahHasilPanen, 
      tanggalPanen || getCurrentDateGMT7(), 
      statusPenjualan || 'Belum Terjual', 
      namaPembeli || null
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
    const id = req.params.id;
    console.log("📝 Updating panen ID:", id, "with data:", req.body);

    const { 
      tanggalPanen, 
      petani, 
      tanaman,
      lahan,
      bibit,
      pupuk,
      jumlahHasilPanen, 
      statusPenjualan, 
      namaPembeli
    } = req.body;

    // Get IDs from names
    let petani_id = null;
    let tanaman_id = null;
    let bibit_id = null;

    // Get petani ID by name
    if (petani) {
      const [petaniRows] = await mysqlPool.execute("SELECT id FROM petani WHERE nama = ?", [petani]);
      if ((petaniRows as any[]).length > 0) {
        petani_id = (petaniRows as any[])[0].id;
      }
    }

    // Get tanaman ID by name
    if (tanaman) {
      const [tanamanRows] = await mysqlPool.execute("SELECT id FROM tanaman WHERE namaTanaman = ?", [tanaman]);
      if ((tanamanRows as any[]).length > 0) {
        tanaman_id = (tanamanRows as any[])[0].id;
      }
    }

    // Get bibit ID by namaPenyedia
    if (bibit) {
      const [bibitRows] = await mysqlPool.execute("SELECT id FROM bibit WHERE namaPenyedia = ?", [bibit]);
      if ((bibitRows as any[]).length > 0) {
        bibit_id = (bibitRows as any[])[0].id;
      }
    }

    const [result] = await mysqlPool.execute(`
      UPDATE panen SET 
        petani_id = ?, 
        tanaman_id = ?, 
        lahan = ?, 
        bibit_id = ?, 
        pupuk = ?, 
        jumlahHasilPanen = ?, 
        tanggalPanen = ?, 
        statusPenjualan = ?, 
        namaPembeli = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [
      petani_id, 
      tanaman_id, 
      lahan, 
      bibit_id, 
      pupuk, 
      jumlahHasilPanen, 
      tanggalPanen, 
      statusPenjualan, 
      namaPembeli, 
      id
    ]);
    
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
    const id = req.params.id;
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
