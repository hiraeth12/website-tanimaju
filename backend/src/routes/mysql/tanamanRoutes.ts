import express from "express";
import mysqlPool from "../../config/mysql-database.js";

const router = express.Router();

// ✅ Get all tanaman
router.get("/", async (req, res) => {
  try {
    const [rows] = await mysqlPool.execute(
      "SELECT * FROM tanaman ORDER BY id DESC"
    );
    console.log("✅ MySQL Tanaman found:", (rows as any[]).length, "items");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching tanaman:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get tanaman by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await mysqlPool.execute(
      "SELECT * FROM tanaman WHERE id = ?",
      [id]
    );

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "Tanaman not found" });
    }

    res.json((rows as any[])[0]);
  } catch (error) {
    console.error("❌ Error fetching tanaman by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Create new tanaman
router.post("/", async (req, res) => {
  try {
    const { namaTanaman, pupuk } = req.body;

    const [result] = await mysqlPool.execute(
      "INSERT INTO tanaman (namaTanaman, pupuk) VALUES (?, ?)",
      [namaTanaman, pupuk]
    );

    const insertId = (result as any).insertId;

    const [rows] = await mysqlPool.execute(
      "SELECT * FROM tanaman WHERE id = ?",
      [insertId]
    );

    res.status(201).json((rows as any[])[0]);
  } catch (error) {
    console.error("❌ Error creating tanaman:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Update tanaman
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { namaTanaman, pupuk } = req.body;

    const [result] = await mysqlPool.execute(
      "UPDATE tanaman SET namaTanaman = ?, pupuk = ? WHERE id = ?",
      [namaTanaman, pupuk, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Tanaman not found" });
    }

    const [rows] = await mysqlPool.execute(
      "SELECT * FROM tanaman WHERE id = ?",
      [id]
    );

    res.json((rows as any[])[0]);
  } catch (error) {
    console.error("❌ Error updating tanaman:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Delete tanaman
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [result] = await mysqlPool.execute(
      "DELETE FROM tanaman WHERE id = ?",
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Tanaman not found" });
    }

    res.json({ message: "Tanaman deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting tanaman:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
