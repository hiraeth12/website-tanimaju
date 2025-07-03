// File: src/pages/dashboard/slug_pages/Bibit/CreateBibitPage.tsx

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Link } from "react-router-dom";

type BibitForm = {
  tanaman: string;
  sumber: string;
  namaPenyedia: string;
  tanggalPemberian: string;
};

export default function CreateBibitPage() {
  const [formData, setFormData] = useState<BibitForm>({
    tanaman: "",
    sumber: "",
    namaPenyedia: "",
    tanggalPemberian: "",
  });

  const handleChange = (field: keyof BibitForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="px-6 mt-2 mb-4 ml-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            to="/admin/bibit"
            className="hover:underline hover:text-gray-800 transition"
          >
            Bibit
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">Create</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Tambahkan Bibit</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tanaman">Tanaman</Label>
              <Input
                id="tanaman"
                value={formData.tanaman}
                onChange={(e) => handleChange("tanaman", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sumber">Sumber</Label>
              <Input
                id="sumber"
                value={formData.sumber}
                onChange={(e) => handleChange("sumber", e.target.value)}
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="namaPenyedia">Nama Penyedia</Label>
              <Input
                id="namaPenyedia"
                value={formData.namaPenyedia}
                onChange={(e) => handleChange("namaPenyedia", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggalPemberian">Tanggal Pemberian</Label>
              <Input
                id="tanggalPemberian"
                type="date"
                value={formData.tanggalPemberian}
                onChange={(e) =>
                  handleChange("tanggalPemberian", e.target.value)
                }
              />
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
