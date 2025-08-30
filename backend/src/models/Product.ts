import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  id: String,
  title: String,
  price: Number,
  imageSrc: String,
  description: String,
  info: String,
  whatsappNumber: String
});
export default mongoose.model("Product", ProductSchema);