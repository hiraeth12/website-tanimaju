// File: src/pages/dashboard/slug_pages/Petani/CreatePetani.tsx

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";

// Tipe untuk data form petani
type PetaniForm = {
  nama: string;
  alamat: string;
  nomorKontak: string;
  foto: string;
};

export default function CreatePetaniPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PetaniForm>({
    nama: "",
    alamat: "",
    nomorKontak: "",
    foto: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;

  // Fungsi generik untuk menangani perubahan pada input
  const handleChange = (field: keyof PetaniForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fungsi untuk submit form
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/petanis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Petani berhasil dibuat!');
        navigate('/admin/petani');
      } else {
        alert('Gagal membuat petani!');
      }
    } catch (error) {
      console.error('Error creating petani:', error);
      alert('Terjadi kesalahan saat membuat petani!');
    }
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="px-6 mt-2 mb-4 ml-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/admin/petani" className="hover:underline hover:text-gray-800 transition">
            Petani
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">Create</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Create Petani</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            {/* Nama Petani */}
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Petani</Label>
              <Input 
                id="nama" 
                value={formData.nama} 
                onChange={(e) => handleChange("nama", e.target.value)} 
                placeholder="Masukkan nama petani"
              />
            </div>

            {/* Nomor Kontak */}
            <div className="space-y-2">
              <Label htmlFor="nomorKontak">Nomor Kontak</Label>
              <Input 
                id="nomorKontak" 
                value={formData.nomorKontak} 
                onChange={(e) => handleChange("nomorKontak", e.target.value)} 
                placeholder="Masukkan nomor kontak"
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            {/* Alamat */}
            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Textarea
                id="alamat"
                value={formData.alamat}
                onChange={(e) => handleChange("alamat", e.target.value)}
                className="min-h-[120px] resize-none"
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            {/* URL Foto */}
            <div className="space-y-2">
              <Label htmlFor="foto">URL Foto</Label>
              <Input 
                id="foto" 
                value={formData.foto} 
                onChange={(e) => handleChange("foto", e.target.value)} 
                placeholder="Masukkan URL foto petani"
              />
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-6"
            onClick={handleSubmit}
          >
            Create
          </Button>
          <Button 
            variant="outline" 
            className="px-6"
            onClick={() => {
              handleSubmit();
              // Reset form untuk create another
              setFormData({
                nama: "",
                alamat: "",
                nomorKontak: "",
                foto: "",
              });
            }}
          >
            Create & create another
          </Button>
          <Link to="/admin/petani">
            <Button variant="outline" className="px-6">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
