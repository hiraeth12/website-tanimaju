import mongoose from "mongoose";

const TanamanSchema = new mongoose.Schema({
  namaTanaman: String,
  pupuk: String
});

export default mongoose.model("Tanaman", TanamanSchema);