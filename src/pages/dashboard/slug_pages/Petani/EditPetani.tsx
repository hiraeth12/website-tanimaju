// File: src/pages/dashboard/slug_pages/Produk/EditPetaniPage.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Link } from "react-router-dom";

type ProductForm = {
  id: string;
  title: string;
  address: string;
  whatsappNumber: string;
  imageSrc: File | null;
};

export default function EditPetaniPage() {
  const { id } = useParams(); // misal id: petani-1
  const [formData, setFormData] = useState<ProductForm | null>(null);

  useEffect(() => {
    fetch("/data/petani.json")
      .then((res) => res.json())
      .then((data: any[]) => {
        const withIds = data.map((item, index) => ({
          id: `petani-${index + 1}`,
          title: item.nama,
          address: item.alamat,
          whatsappNumber: item.nomorKontak,
          imageSrc: null, // Untuk upload baru (jika diperlukan)
        }));

        const found = withIds.find((item) => item.id === id);
        if (found) {
          setFormData(found);
        } else {
          console.warn("Petani tidak ditemukan");
        }
      })
      .catch((err) => console.error("Gagal memuat data petani:", err));
  }, [id]);

  const handleChange = (field: keyof ProductForm, value: string | File | null) => {
    if (!formData) return;
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleChange("imageSrc", file);
  };

  const handleDragOver = (event: React.DragEvent) => event.preventDefault();

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleChange("imageSrc", file);
  };

  if (!formData) {
    return (
      <DashboardLayout>
        <div className="p-6">Memuat data petani...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-6 mt-2 mb-4 ml-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/admin/petani" className="hover:underline hover:text-gray-800 transition">
            Petani
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">Edit</span>
        </div>
      </div>

      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Petani</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Nama Petani</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Petani</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              />
            </div>

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
                <label htmlFor="imageSrc" className="cursor-pointer text-gray-600">
                  Drag & Drop atau{" "}
                  <span className="text-blue-600 font-semibold">Browse</span>
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

        <div className="flex gap-4 mt-8 pt-6 border-t">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
            Simpan
          </Button>
          <Button variant="outline" className="px-6">
            Batal
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
