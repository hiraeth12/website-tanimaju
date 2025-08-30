import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Import model
import Bibit from "./models/Bibit";
import Panen from "./models/Panen";
import Petani from "./models/Petani";
import Post from "./models/Post";
import Product from "./models/Product";
import Tanaman from "./models/Tanaman";

const MONGO_URI = "mongodb://127.0.0.1:27017/website_tanijuu";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // --- Load JSON ---
    const bibits = JSON.parse(fs.readFileSync(path.join(__dirname, "data/bibit.json"), "utf-8"));
    const panens = JSON.parse(fs.readFileSync(path.join(__dirname, "data/panen.json"), "utf-8"));
    const petanis = JSON.parse(fs.readFileSync(path.join(__dirname, "data/petani.json"), "utf-8"));
    const posts = JSON.parse(fs.readFileSync(path.join(__dirname, "data/post.json"), "utf-8"));
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, "data/product.json"), "utf-8"));
    const tanamans = JSON.parse(fs.readFileSync(path.join(__dirname, "data/tanaman.json"), "utf-8"));

    // --- Insert to DB ---
    await Bibit.insertMany(bibits);
    await Panen.insertMany(panens);
    await Petani.insertMany(petanis);
    await Post.insertMany(posts);
    await Product.insertMany(products);
    await Tanaman.insertMany(tanamans);

    console.log("Data berhasil dimasukkan 🎉");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
