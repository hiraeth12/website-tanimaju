// backend/src/models/Petani.ts

import mongoose from "mongoose";

const PetaniSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  alamat: { type: String, required: true },
  nomorKontak: { type: String },
  foto: { type: String },
});
export default mongoose.model("Petani", PetaniSchema);
