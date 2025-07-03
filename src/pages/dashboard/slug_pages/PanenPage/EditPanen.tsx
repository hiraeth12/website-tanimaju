import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PanenData {
  id: number;
  date: string;
  farmer: string;
  field: string;
  seedProvider: string;
  plant: string;
  fertilizer: string;
  amount: string;
  salesStatus: string;
  buyerName: string;
  description?: string;
  photo?: File | null;
}

export default function EditPanenPage() {
  const { id } = useParams();
  const [data, setData] = useState<PanenData | null>(null);

  useEffect(() => {
    fetch("/data/panen.json")
      .then((res) => res.json())
      .then((json) => {
        const selected = json.find((item: PanenData) => String(item.id) === id);
        setData({ ...selected, photo: null });
      })
      .catch((err) => console.error("Failed to fetch panen data:", err));
  }, [id]);

  const handleChange = (field: keyof PanenData, value: string) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  if (!data) return <div className="p-6">Loading...</div>;

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
          <span className="font-semibold text-gray-800">Edit</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Hasil Panen</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Tanggal Panen */}
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal Panen</Label>
              <Input
                id="date"
                type="date"
                value={new Date(data.date).toISOString().split("T")[0]}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>

            {/* Petani */}
            <div className="space-y-2">
              <Label htmlFor="farmer">Petani</Label>
              <Input
                id="farmer"
                value={data.farmer}
                onChange={(e) => handleChange("farmer", e.target.value)}
              />
            </div>

            {/* Lahan */}
            <div className="space-y-2">
              <Label htmlFor="field">Lahan</Label>
              <Input
                id="field"
                value={data.field}
                onChange={(e) => handleChange("field", e.target.value)}
              />
            </div>

            {/* Nama Penyedia Bibit */}
            <div className="space-y-2">
              <Label htmlFor="seedProvider">Nama Penyedia Bibit</Label>
              <Input
                id="seedProvider"
                value={data.seedProvider}
                onChange={(e) => handleChange("seedProvider", e.target.value)}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Tanaman */}
            <div className="space-y-2">
              <Label htmlFor="plant">Tanaman</Label>
              <Input
                id="plant"
                value={data.plant}
                onChange={(e) => handleChange("plant", e.target.value)}
              />
            </div>

            {/* Pupuk */}
            <div className="space-y-2">
              <Label htmlFor="fertilizer">Pupuk</Label>
              <Input
                id="fertilizer"
                value={data.fertilizer}
                onChange={(e) => handleChange("fertilizer", e.target.value)}
              />
            </div>

            {/* Jumlah Hasil Panen */}
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah Hasil Panen</Label>
              <Input
                id="amount"
                value={data.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
            </div>

            {/* Status Penjualan */}
            <div className="space-y-2">
              <Label htmlFor="salesStatus">Status Penjualan</Label>
              <Select
                value={data.salesStatus}
                onValueChange={(v) => handleChange("salesStatus", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Terjual">Terjual</SelectItem>
                  <SelectItem value="Belum Terjual">Belum Terjual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nama Pembeli */}
            <div className="space-y-2">
              <Label htmlFor="buyerName">Nama Pembeli</Label>
              <Input
                id="buyerName"
                value={data.buyerName}
                onChange={(e) => handleChange("buyerName", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
            Simpan Perubahan
          </Button>
          <Button variant="outline" className="px-6">
            Cancel
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
