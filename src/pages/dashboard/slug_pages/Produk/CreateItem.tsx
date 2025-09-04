// File: src/pages/dashboard/slug_pages/Produk/CreateItem.tsx

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InputField } from "@/components/InputField";
import ImageUpload from "@/components/ImageUpload";
import { FormActions } from "@/components/FormActions";
import { useNavigate } from "react-router-dom";

// Tipe untuk data form produk
type ProductForm = {
  title: string;
  price: string;
  imageSrc: File | null;
  description: string;
  info: string;
  whatsappNumber: string;
};

export default function CreateItemPage() {
  const [formData, setFormData] = useState<ProductForm>({
    title: "",
    price: "",
    imageSrc: null,
    description: "",
    info: "",
    whatsappNumber: "",
  });

  const handleChange = (field: keyof ProductForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("price", formData.price);
      form.append("description", formData.description);
      form.append("info", formData.info);
      form.append("whatsappNumber", formData.whatsappNumber);
      if (formData.imageSrc) {
        form.append("imageSrc", formData.imageSrc);
      }

      const response = await fetch(`${API}/products`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) throw new Error("Gagal membuat produk");
      await response.json();
      alert("Data produk berhasil disimpan!");
      navigate("/admin/item");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan produk");
    }
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Item", to: "/admin/item" }, { label: "Create" }]}
      />

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Create Produk</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            {/* Nama Produk */}
            <InputField
              id="title"
              label="Nama Produk"
              type="text"
              value={formData.title}
              onChange={(val) => handleChange("title", val)}
              required
            />

            {/* Deskripsi */}
            <InputField
              id="description"
              label="Deskripsi"
              type="text"
              value={formData.description}
              onChange={(val) => handleChange("description", val)}
              required
            />

            {/* Info */}
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
            {/* Harga */}
            <InputField
              id="price"
              label="Harga (Rp)"
              type="number"
              value={formData.price}
              onChange={(val) => handleChange("price", val)}
              required
            />

            {/* WhatsApp */}
            <InputField
              id="whatsappnumber"
              label="Nomor WhatsApp"
              type="text"
              value={formData.whatsappNumber}
              onChange={(val) => handleChange("whatsappNumber", val)}
              required
            />

            {/* Gambar Produk */}
            <ImageUpload
              _id="imageSrc"
              label="Gambar Produk"
              value={formData.imageSrc}
              onChange={(file) => setFormData({ ...formData, imageSrc: file })}
            />
          </div>
        </div>
        {/* Tombol Aksi */}
        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/item")}
        />
      </div>
    </DashboardLayout>
  );
}
