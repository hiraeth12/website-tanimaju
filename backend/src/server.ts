import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Middleware ===
app.use(cors({
  origin: "http://localhost:5173", // izinkan frontend dev
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// === Routes ===
import bibitRoutes from "./routes/bibitRoutes.js";
import panenRoutes from "./routes/panenRoutes.js";
import petaniRoutes from "./routes/petaniRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import tanamanRoutes from "./routes/tanamanRoutes.js";

app.use("/api/bibits", bibitRoutes);
app.use("/api/panens", panenRoutes);
app.use("/api/petanis", petaniRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tanamans", tanamanRoutes);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI belum di-set di .env");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error ❌", err));


// === Default route ===
app.get("/", (req, res) => {
  res.send("Backend API running 🚀");
});

