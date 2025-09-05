import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

// === Middleware ===
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// === Database Configuration ===
const DATABASE_TYPE = process.env.DATABASE_TYPE || "mongodb";
const PORT = process.env.PORT || 5001;

console.log(`🔄 Using ${DATABASE_TYPE.toUpperCase()} database...`);

// === Routes ===
if (DATABASE_TYPE === "mysql") {
  // Dynamic import for MySQL
  const startMySQLServer = async () => {
    try {
      const { testConnection } = await import("./config/mysql-database.js");
      const { default: productRoutesMysql } = await import("./routes/mysql/productRoutes.js");
      const { default: petaniRoutesMysql } = await import("./routes/mysql/petaniRoutes.js");
      const { default: postRoutesMysql } = await import("./routes/mysql/postRoutes.js");
      const { default: bibitRoutesMysql } = await import("./routes/mysql/bibitRoutes.js");
      const { default: tanamanRoutesMysql } = await import("./routes/mysql/tanamanRoutes.js");
      const { default: panenRoutesMysql } = await import("./routes/mysql/panenRoutes.js");
      
      // Use MySQL routes
      app.use("/api/products", productRoutesMysql);
      app.use("/api/petani", petaniRoutesMysql);
      app.use("/api/posts", postRoutesMysql);
      app.use("/api/bibit", bibitRoutesMysql);
      app.use("/api/tanaman", tanamanRoutesMysql);
      app.use("/api/panen", panenRoutesMysql);
      
      // Test MySQL connection and start server
      const connected = await testConnection();
      if (connected) {
        console.log("MySQL connected ✅");
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (MySQL mode)`));
      } else {
        console.error("❌ MySQL connection failed");
        process.exit(1);
      }
    } catch (err) {
      console.error("MySQL setup error ❌", err);
      process.exit(1);
    }
  };
  
  startMySQLServer();
    
} else {
  // Dynamic import for MongoDB
  const startMongoServer = async () => {
    try {
      const { default: bibitRoutes } = await import("./routes/bibitRoutes.js");
      const { default: panenRoutes } = await import("./routes/panenRoutes.js");
      const { default: petaniRoutes } = await import("./routes/petaniRoutes.js");
      const { default: postRoutes } = await import("./routes/postRoutes.js");
      const { default: productRoutes } = await import("./routes/productRoutes.js");
      const { default: tanamanRoutes } = await import("./routes/tanamanRoutes.js");

      app.use("/api/bibits", bibitRoutes);
      app.use("/api/panens", panenRoutes);
      app.use("/api/petanis", petaniRoutes);
      app.use("/api/posts", postRoutes);
      app.use("/api/products", productRoutes);
      app.use("/api/tanamans", tanamanRoutes);

      const MONGO_URI = process.env.MONGO_URI as string;

      if (!MONGO_URI) {
        console.error("❌ MONGO_URI belum di-set di .env");
        process.exit(1);
      }

      await mongoose.connect(MONGO_URI);
      console.log("MongoDB connected ✅");
      app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (MongoDB mode)`));
    } catch (err) {
      console.error("MongoDB setup error ❌", err);
      process.exit(1);
    }
  };
  
  startMongoServer();
}


// === Default route ===
app.get("/", (req, res) => {
  res.send("Backend API running 🚀");
});
