// File: src/pages/dashboard/slug_pages/Produk/CreateItem.tsx

import type React from "react";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Link } from "react-router-dom";

// Tipe untuk data form produk
type ProductForm = {
  title: string;
  price: string;
  imageSrc: File | null;
  description: string;
  info: string;
  whatsappNumber: string;
};

export default function CreatePetaniPage() {
  const [formData, setFormData] = useState<ProductForm>({
    title: "",
    price: "",
    imageSrc: null,
    description: "",
    info: "",
    whatsappNumber: "",
  });

  // Fungsi generik untuk menangani perubahan pada input teks dan textarea
  const handleChange = (field: keyof ProductForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fungsi untuk menangani unggahan file melalui dialog "Browse"
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, imageSrc: file }));
  };

  // Fungsi untuk menangani event drag over
  const handleDragOver = (event: React.DragEvent) => event.preventDefault();

  // Fungsi untuk menangani event drop file
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) setFormData((prev) => ({ ...prev, imageSrc: file }));
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="px-6 mt-2 mb-4 ml-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            to="/admin/petani"
            className="hover:underline hover:text-gray-800 transition"
          >
            Petani
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">Create</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Tambahkan Petani</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            {/* Nama Produk */}
            <div className="space-y-2">
              <Label htmlFor="title">Nama Petani</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <Label htmlFor="title">Alamat Petani</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">


            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              />
            </div>

            {/* Gambar Produk */}
            <div className="space-y-2">
              <Label htmlFor="imageSrc">Gambar Petani</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="imageSrc"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <label htmlFor="imageSrc" className="cursor-pointer">
                  <div className="text-gray-500">
                    <p>
                      Drag & Drop atau{" "}
                      <span className="text-blue-600 font-semibold">
                        Browse
                      </span>
                    </p>
                  </div>
                </label>
                {formData.imageSrc && (
                  <p className="mt-2 text-sm text-gray-600">
                    Terpilih: {formData.imageSrc.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
            Create
          </Button>
          <Button variant="outline" className="px-6">
            Create & create another
          </Button>
          <Button variant="outline" className="px-6">
            Cancel
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
