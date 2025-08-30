import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// === Middleware ===
app.use(cors({
  origin: "http://localhost:5173", // izinkan frontend dev
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// === Routes ===
import bibitRoutes from "./routes/bibitRoutes";
import panenRoutes from "./routes/panenRoutes";
import petaniRoutes from "./routes/petaniRoutes";
import postRoutes from "./routes/postRoutes";
import productRoutes from "./routes/productRoutes";
import tanamanRoutes from "./routes/tanamanRoutes";

app.use("/api/bibits", bibitRoutes);
app.use("/api/panens", panenRoutes);
app.use("/api/petanis", petaniRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tanamans", tanamanRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/website_tanijuu";

// === MongoDB connect ===
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error(err));

// === Default route ===
app.get("/", (req, res) => {
  res.send("Backend API running 🚀");
});
