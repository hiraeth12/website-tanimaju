// src/pages/dashboard/panen/CreatePanenPage.tsx

import type React from "react";
import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Link } from "react-router-dom";

// Definisikan tipe untuk form data agar lebih aman
type FormData = {
  petani: string;
  pupuk: string;
  tanaman: string;
  namaPenyediaBibit: string;
  lahan: string;
  jumlahHasilPanen: string;
  statusPenjualan: string;
  namaPembeli: string;
  deskripsi: string;
  foto: File | null;
};

export default function CreatePanenPage() {
  const [formData, setFormData] = useState<FormData>({
    petani: "",
    pupuk: "",
    tanaman: "",
    namaPenyediaBibit: "",
    lahan: "",
    jumlahHasilPanen: "",
    statusPenjualan: "",
    namaPembeli: "",
    deskripsi: "",
    foto: null,
  });

  // Satu fungsi untuk menangani semua perubahan input teks dan select
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, foto: file }));
  };

  const handleDragOver = (event: React.DragEvent) => event.preventDefault();

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) setFormData((prev) => ({ ...prev, foto: file }));
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="px-6 mt-2 mb-4 ml-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            to="/admin/panen"
            className="hover:underline hover:text-gray-800 transition"
          >
            Panen
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">Create</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Create Hasil Panen</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Petani */}
            <div className="space-y-2">
              <Label htmlFor="petani">
                Petani<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={formData.petani}
                  onValueChange={(value) => handleChange("petani", value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Pilih petani" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petani1">Petani 1</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tanaman */}
            <div className="space-y-2">
              <Label htmlFor="tanaman">
                Tanaman<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={formData.tanaman}
                  onValueChange={(value) => handleChange("tanaman", value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Pilih tanaman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padi">Padi</SelectItem>
                    <SelectItem value="jagung">Jagung</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Lahan */}
            <div className="space-y-2">
              <Label htmlFor="lahan">
                Lahan<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={formData.lahan}
                  onValueChange={(value) => handleChange("lahan", value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Pilih lahan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lahan1">Lahan 1</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Status penjualan */}
            <div className="space-y-2">
              <Label htmlFor="status">
                Status penjualan<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.statusPenjualan}
                onValueChange={(value) =>
                  handleChange("statusPenjualan", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terjual">Terjual</SelectItem>
                  <SelectItem value="belum-terjual">Belum Terjual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi}
                onChange={(e) => handleChange("deskripsi", e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pupuk */}
            <div className="space-y-2">
              <Label htmlFor="pupuk">
                Pupuk<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={formData.pupuk}
                  onValueChange={(value) => handleChange("pupuk", value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Pilih pupuk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urea">Urea</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Nama Penyedia Bibit */}
            <div className="space-y-2">
              <Label htmlFor="penyedia">
                Nama Penyedia Bibit<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={formData.namaPenyediaBibit}
                  onValueChange={(value) =>
                    handleChange("namaPenyediaBibit", value)
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Pilih penyedia bibit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="penyedia1">Penyedia 1</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Jumlah hasil panen */}
            <div className="space-y-2">
              <Label htmlFor="jumlah">
                Jumlah hasil panen (kg)<span className="text-red-500">*</span>
              </Label>
              <Input
                id="jumlah"
                type="number"
                value={formData.jumlahHasilPanen}
                onChange={(e) =>
                  handleChange("jumlahHasilPanen", e.target.value)
                }
              />
            </div>

            {/* Nama pembeli */}
            <div className="space-y-2">
              <Label htmlFor="pembeli">Nama pembeli</Label>
              <Input
                id="pembeli"
                type="text"
                value={formData.namaPembeli}
                onChange={(e) => handleChange("namaPembeli", e.target.value)}
              />
            </div>

            {/* Foto */}
            <div className="space-y-2">
              <Label htmlFor="foto">Foto</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="foto"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <label htmlFor="foto" className="cursor-pointer">
                  <div className="text-gray-500">
                    <p>
                      Drag & Drop atau{" "}
                      <span className="text-blue-600 font-semibold">
                        Browse
                      </span>
                    </p>
                  </div>
                </label>
                {formData.foto && (
                  <p className="mt-2 text-sm text-gray-600">
                    Terpilih: {formData.foto.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
