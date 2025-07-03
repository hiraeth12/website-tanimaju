import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type TanamanForm = {
  id: string;
  namaTanaman: string;
  pupuk: string;
};

export default function EditTanamanPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState<TanamanForm | null>(null);
  const pupukOptions = ["Urea", "ZA", "Kompos", "NPK", "Organik"];

  useEffect(() => {
    fetch("/data/tanaman.json")
      .then((res) => res.json())
      .then((data: Omit<TanamanForm, "id">[]) => {
        const withIds = data.map((item, index) => ({
          ...item,
          id: `tanaman-${index + 1}`,
        }));
        const found = withIds.find((tanaman) => tanaman.id === id);
        if (found) setFormData(found);
      })
      .catch((err) => console.error("Gagal memuat data tanaman:", err));
  }, [id]);

  const handleChange = (field: keyof TanamanForm, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  if (!formData) {
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-600">Memuat data tanaman...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="px-6 mt-2 mb-4 ml-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            to="/admin/tanaman"
            className="hover:underline hover:text-gray-800 transition"
          >
            Tanaman
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">Edit</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Tanaman</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {/* Input Nama Tanaman */}
            <div className="space-y-2">
              <Label htmlFor="namaTanaman">Nama Tanaman</Label>
              <Input
                id="namaTanaman"
                value={formData.namaTanaman}
                onChange={(e) => handleChange("namaTanaman", e.target.value)}
              />
            </div>

            {/* Select Pupuk */}
            <div className="space-y-2">
              <Label htmlFor="pupuk">Pupuk</Label>
              <Select
                value={formData.pupuk}
                onValueChange={(value) => handleChange("pupuk", value)}
              >
                <SelectTrigger className="w-full" id="pupuk">
                  <SelectValue placeholder="Pilih jenis pupuk" />
                </SelectTrigger>
                <SelectContent>
                  {pupukOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
            Update
          </Button>
          <Button variant="outline" className="px-6">
            Kembali
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
