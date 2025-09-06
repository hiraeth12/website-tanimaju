import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InputField } from "@/components/InputField";
import ImageUpload from "@/components/ImageUpload";
import { FormActions } from "@/components/FormActions";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingScreen } from "@/components/LoadingSpinner";
import { useNotificationContext } from "@/context/NotificationContext";

type ProductForm = {
  _id: string;
  title: string;
  price: string;
  imageSrc: string | File | null;
  description: string;
  info: string;
  whatsappNumber: string;
};

export default function EditItemPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState<ProductForm | null>(null);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch produk");
        return res.json();
      })
      .then((data) => {
        setFormData({
          _id: data._id,
          title: data.title || "",
          price: data.price || "",
          imageSrc: data.imageSrc || null,
          description: data.description || "",
          info: data.info || "",
          whatsappNumber: data.whatsappNumber || "",
        });
      })
      .catch((err) => console.error("Gagal memuat produk:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    field: keyof ProductForm,
    value: string | File | null
  ) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // ✅ Submit update data
  const handleSubmit = async () => {
    if (!formData) return;
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("price", formData.price);
      form.append("description", formData.description);
      form.append("info", formData.info);
      form.append("whatsappNumber", formData.whatsappNumber);

      // hanya append file baru jika user upload
      if (formData.imageSrc instanceof File) {
        form.append("imageSrc", formData.imageSrc);
      }

      const res = await fetch(`${API}/products/${id}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) throw new Error("Gagal update produk");

      addNotification({
        variant: "success",
        title: "Berhasil!",
        message: "Produk berhasil diperbarui!",
        duration: 4000,
      });
      navigate("/admin/item");
    } catch (err) {
      console.error(err);
      addNotification({
        variant: "error",
        title: "Error!",
        message: "Terjadi kesalahan saat update produk",
        duration: 5000,
      });
    }
  };

  if (loading || !formData) {
    return (
      <DashboardLayout>
        <LoadingScreen />
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <Breadcrumb
        items={[{ label: "Item", to: "/admin/item" }, { label: "Edit" }]}
      />

      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Produk</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InputField
              id="title"
              label="Nama Produk"
              value={formData.title}
              onChange={(value) => handleChange("title", value)}
            />

            <InputField
              id="description"
              label="Deskripsi"
              value={formData.description}
              onChange={(value) => handleChange("description", value)}
            />

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

          <div className="space-y-6">
            <InputField
              id="price"
              label="Harga (Rp)"
              value={formData.price}
              onChange={(value) => handleChange("price", value)}
            />

            <InputField
              id="whatsappNumber"
              label="Nomor WhatsApp"
              value={formData.whatsappNumber}
              onChange={(value) => handleChange("whatsappNumber", value)}
            />

            <ImageUpload
              _id="imageSrc"
              label="Gambar Produk"
              value={formData.imageSrc}
              onChange={(file) => handleChange("imageSrc", file)}
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/item")}
          submitLabel="Simpan Perubahan"
          cancelLabel="Batal"
        />
      </div>
    </DashboardLayout>
  );
}
