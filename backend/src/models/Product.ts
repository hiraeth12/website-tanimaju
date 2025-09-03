import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    imageSrc: { type: String }, // path gambar
    description: { type: String, required: true },
    info: { type: String },
    whatsappNumber: { type: String },
  },
);

export default mongoose.model("Product", ProductSchema);
