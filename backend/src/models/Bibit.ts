import mongoose from "mongoose";

const BibitSchema = new mongoose.Schema({
  tanaman: String,
  sumber: String,
  namaPenyedia: String,
  tanggalPemberian: Date,
});

export default mongoose.model("Bibit", BibitSchema);
