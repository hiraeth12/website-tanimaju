// File: src/pages/dashboard/slug_pages/Produk/EditPetaniPage.tsx

import { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InputField } from "@/components/InputField";
import ImageUpload from "@/components/ImageUpload";
import { FormActions } from "@/components/FormActions";

type PetaniForm = {
  _id: string;
  nama: string;
  alamat: string;
  nomorKontak: string;
  foto: File | null;
};

export default function EditPetaniPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState<PetaniForm | null>(null);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/petani/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch petani");
        return res.json();
      })
      .then((data) => {
        setFormData({
          _id: data._id,
          nama: data.nama || "",
          alamat: data.alamat || "",
          nomorKontak: data.nomorKontak || "",
          foto: data.foto || null, 
        });
      })
      .catch((err) => console.error("Gagal memuat produk:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!formData) return;
    try {
      const form = new FormData();
      form.append("nama", formData.nama);
      form.append("alamat", formData.alamat);
      form.append("nomorKontak", formData.nomorKontak);

      
      if (formData.foto instanceof File) {
        form.append("foto", formData.foto);
      }

      const res = await fetch(`${API}/petani/${id}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) throw new Error("Gagal update petani");

      alert("Petani berhasil diperbarui!");
      navigate("/admin/petani");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update petani");
    }
  };

  if (loading || !formData) {
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-600">Memuat data produk...</div>
      </DashboardLayout>
    );
  }

  const handleChange = (
    field: keyof PetaniForm,
    value: string | File | null
  ) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
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
      <Breadcrumb
        items={[{ label: "Petani", to: "/admin/petani" }, { label: "Edit" }]}
      />

      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Petani</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InputField
              id="nama"
              label="Nama Petani"
              value={formData.nama}
              onChange={(value) => handleChange("nama", value)}
            />

            <InputField
              id="alamat"
              label="Alamat Petani"
              value={formData.alamat}
              onChange={(value) => handleChange("alamat", value)}
            />
          </div>

          <div className="space-y-6">
            <InputField
              id="nomorKontak"
              label="Nomor Kontak"
              value={formData.nomorKontak}
              onChange={(value) => handleChange("nomorKontak", value)}
            />

            <ImageUpload
              _id="foto"
              label="Foto Petani"
              value={formData.foto} 
              onChange={(file) => handleChange("foto", file)}
            />
          </div>
        </div>

        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/petani")}
          submitLabel="Simpan Perubahan"
          cancelLabel="Batal"
        />
      </div>
    </DashboardLayout>
  );
}
