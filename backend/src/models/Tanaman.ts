// src/models/Tanaman.ts
import mongoose from "mongoose";

const TanamanSchema = new mongoose.Schema(
  {
    namaTanaman: {
      type: String,
      required: true,
      trim: true,
    },
    pupuk: {
      type: String,
      required: true,
      trim: true,
    },
  }
);

export default mongoose.model("Tanaman", TanamanSchema);
