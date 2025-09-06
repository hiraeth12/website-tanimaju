import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  _id: string;
  label: string;
  value: string | File | null; // bisa URL lama atau File baru
  onChange: (file: File | null) => void;
}

export default function ImageUpload({
  _id,
  label,
  value,
  onChange,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ bikin preview setiap kali value berubah
  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === "string") {
      // tambahkan base URL dari backend
      const baseUrl = import.meta.env.VITE_API_URL_IMAGE || "";
      setPreview(`${baseUrl}${value}`);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file ?? null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    onChange(file ?? null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={_id}>{label}</Label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={_id}
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />
        <label htmlFor={_id} className="cursor-pointer">
          <p className="text-gray-500">
            Drag & Drop atau{" "}
            <span className="text-blue-600 font-semibold">Browse</span>
          </p>
        </label>

        {/* Nama file (hanya kalau File) */}
        {value instanceof File && (
          <p className="mt-2 text-sm text-gray-600">Terpilih: {value.name}</p>
        )}

        {/* Preview Gambar */}
        {preview && (
          <div className="mt-4 flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-lg shadow-md object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
