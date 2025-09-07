import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "").split(",");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser()); 
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// serve file upload
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// === Routes MySQL ===
const startServer = async () => {
  try {
    const { testConnection } = await import("./config/mysql-database.js");
    const { default: productRoutesMysql } = await import(
      "./routes/mysql/productRoutes.js"
    );
    const { default: petaniRoutesMysql } = await import(
      "./routes/mysql/petaniRoutes.js"
    );
    const { default: postRoutesMysql } = await import(
      "./routes/mysql/postRoutes.js"
    );
    const { default: bibitRoutesMysql } = await import(
      "./routes/mysql/bibitRoutes.js"
    );
    const { default: tanamanRoutesMysql } = await import(
      "./routes/mysql/tanamanRoutes.js"
    );
    const { default: panenRoutesMysql } = await import(
      "./routes/mysql/panenRoutes.js"
    );
    const { default: authRoutesMysql } = await import(
      "./routes/mysql/authRoutes.js"
    );

    app.use("/api/products", productRoutesMysql);
    app.use("/api/petani", petaniRoutesMysql);
    app.use("/api/posts", postRoutesMysql);
    app.use("/api/bibit", bibitRoutesMysql);
    app.use("/api/tanaman", tanamanRoutesMysql);
    app.use("/api/panen", panenRoutesMysql);
    app.use("/api/auth", authRoutesMysql); // Add auth routes

    // tes koneksi MySQL
    const connected = await testConnection();
    if (connected) {
      console.log("MySQL connected ✅");
      app.listen(PORT, () =>
        console.log(`🚀 Server running on http://localhost:${PORT}`)
      );
    } else {
      console.error("❌ MySQL connection failed");
      process.exit(1);
    }
  } catch (err) {
    console.error("MySQL setup error ❌", err);
    process.exit(1);
  }
};

startServer();

app.get("/", (req, res) => {
  res.send("Backend API running 🚀");
});
