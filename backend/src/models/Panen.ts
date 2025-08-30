import mongoose from "mongoose";

const PanenSchema = new mongoose.Schema(
  {
    tanggalPanen: { type: Date, required: true },
    petani: { type: String, required: true },
    lahan: { type: String, required: true },
    namaPenyediaBibit: { type: String, required: true },
    tanaman: { type: String, required: true },
    pupuk: { type: String, required: true },
    jumlahHasilPanen: { type: Number, required: true },
    statusPenjualan: { 
      type: String, 
      enum: ["terjual", "belum-terjual"], 
      required: true 
    },
    namaPembeli: { type: String },
    foto: { type: String }, // nanti bisa simpan URL path file
  },
  { timestamps: true }
);

export default mongoose.model("Panen", PanenSchema);
