import mongoose from "mongoose";

const PetaniSchema = new mongoose.Schema({
  nama: String,
  alamat: String,
  nomorKontak: String,
  foto: String,
});
export default mongoose.model("Petani", PetaniSchema);
