import mongoose from "mongoose";

const PanenSchema = new mongoose.Schema({
  tanggalPanen: { type: Date, required: true },
  petani: { type: mongoose.Schema.Types.ObjectId, ref: "Petani" },
  lahan: { type: String },
  bibit: { type: mongoose.Schema.Types.ObjectId, ref: "Bibit" },
  tanaman: { type: mongoose.Schema.Types.ObjectId, ref: "Tanaman" },
  pupuk: { type: String },
  jumlahHasilPanen: { type: Number },
  statusPenjualan: { type: String, enum: ["Terjual", "Belum Terjual"], default: "Belum Terjual" },
  namaPembeli: { type: String }
});

export default mongoose.model("Panen", PanenSchema);
