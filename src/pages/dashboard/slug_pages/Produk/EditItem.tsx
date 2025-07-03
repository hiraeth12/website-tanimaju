import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";

// Tipe untuk data form produk
type ProductForm = {
  title: string;
  price: string;
  imageSrc: string | File | null;
  description: string;
  info: string;
  whatsappNumber: string;
};

export default function EditItemPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState<ProductForm>({
    title: "",
    price: "",
    imageSrc: null,
    description: "",
    info: "",
    whatsappNumber: "",
  });

  useEffect(() => {
    fetch("/data/product.json")
      .then((res) => res.json())
      .then((data) => {
        const item = data.find((p: any) => p.id === id);
        if (item) {
          setFormData({
            ...item,
            price: String(item.price),
            imageSrc: item.imageSrc, // keep URL for preview
          });
        }
      })
      .catch((err) => console.error("Failed to fetch product:", err));
  }, [id]);

  const handleChange = (field: keyof ProductForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, imageSrc: file }));
  };

  const handleDragOver = (event: React.DragEvent) => event.preventDefault();

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
          <Link to="/admin/item" className="hover:underline hover:text-gray-800 transition">
            Produk
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">Edit</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Produk</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Nama Produk</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Singkat</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="info">Informasi Lengkap</Label>
              <Textarea
                id="info"
                value={formData.info}
                onChange={(e) => handleChange("info", e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>

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
              <Label htmlFor="imageSrc">Gambar Produk</Label>
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
                      Drag & Drop atau {" "}
                      <span className="text-blue-600 font-semibold">Browse</span>
                    </p>
                  </div>
                </label>
                {typeof formData.imageSrc === "string" && (
                  <p className="mt-2 text-sm text-gray-600">
                    <img
                      src={formData.imageSrc}
                      alt="preview"
                      className="w-32 h-32 object-cover mx-auto mt-2 rounded"
                    />
                  </p>
                )}
                {formData.imageSrc instanceof File && (
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
