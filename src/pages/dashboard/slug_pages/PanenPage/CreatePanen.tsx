// src/pages/dashboard/slug_pages/PanenPage/CreatePanen.tsx

import { useState, useEffect } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Link } from "react-router-dom";

type FormData = {
  petani: string;
  pupuk: string;
  tanaman: string;
  namaPenyediaBibit: string;
  lahan: string;
  jumlahHasilPanen: string;
  tanggalPanen: string;
  statusPenjualan: string;
  namaPembeli: string;
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
    tanggalPanen: "",
    statusPenjualan: "",
    namaPembeli: "",
    foto: null,
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API}/api/panens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat panen");
      }

      const data = await response.json();
      console.log("Berhasil buat panen:", data);
      alert("Data panen berhasil disimpan!");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan panen");
    }
  };

  const [petanis, setPetanis] = useState<any[]>([]);
  const [penyediaBibit, setPenyediaBibit] = useState<any[]>([]);
  const [tanamans, setTanamans] = useState<any[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [petaniRes, bibitRes, tanamanRes] = await Promise.all([
          fetch(`${API}/petanis`).then((r) => r.json()),
          fetch(`${API}/bibits`).then((r) => r.json()),
          fetch(`${API}/tanamans`).then((r) => r.json()),
        ]);

        setPetanis(petaniRes);
        setPenyediaBibit(bibitRes);
        setTanamans(tanamanRes);
      } catch (err) {
        console.error("Gagal fetch data dropdown", err);
      }
    };

    fetchOptions();
  }, [API]);

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
            {/* Tanggal Panen */}
            <div className="space-y-2">
              <Label htmlFor="tanggalPanen">
                Tanggal Panen<span className="text-red-500">*</span>
              </Label>
              <Input
                id="tanggalPanen"
                type="date"
                value={formData.tanggalPanen}
                onChange={(e) => handleChange("tanggalPanen", e.target.value)}
              />
            </div>

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
                    {petanis.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.nama}
                      </SelectItem>
                    ))}
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
                    {penyediaBibit.map((pb) => (
                      <SelectItem key={pb._id} value={pb._id}>
                        {pb.namaPenyedia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
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
                    {tanamans.map((t) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.namaTanaman}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

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
