import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InputField } from "@/components/InputField";
import ImageUpload from "@/components/ImageUpload";
import { FormActions } from "@/components/FormActions";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "@/context/NotificationContext";

type PetaniForm = {
  nama: string;
  alamat: string;
  nomorKontak: string;
  foto: File | null;
};

export default function CreatePetaniPage() {
  const [formData, setFormData] = useState<PetaniForm>({
    nama: "",
    alamat: "",
    nomorKontak: "",
    foto: null,
  });

  const handleChange = (field: keyof PetaniForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();

   const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("nama", formData.nama);
      form.append("alamat", formData.alamat);
      form.append("nomorKontak", formData.nomorKontak);
      if (formData.foto) {
        form.append("foto", formData.foto);
      }

      const response = await fetch(`${API}/petani`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) throw new Error("Gagal membuat data petani");
      await response.json();
      
      addNotification({
        variant: "success",
        title: "Berhasil!",
        message: "Data petani berhasil disimpan!",
        duration: 4000,
      });
      navigate("/admin/petani");
    } catch (error) {
      console.error(error);
      addNotification({
        variant: "error",
        title: "Error!",
        message: "Terjadi kesalahan saat menyimpan data petani",
        duration: 5000,
      });
    }
  };


  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Petani", to: "/admin/petani" }, { label: "Create" }]}
      />

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Tambahkan Petani</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            {/* Nama Petani */}
            <InputField
              id="nama"
              label="Nama Petani"
              type="text"
              value={formData.nama}
              onChange={(val) => handleChange("nama", val)}
              required
            />

            {/* Alamat */}
            <InputField
              id="alamat"
              label="Alamat"
              type="text"
              value={formData.alamat}
              onChange={(val) => handleChange("alamat", val)}
              required
            />
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            {/* WhatsApp */}
            <InputField
              id="nomorKontak"
              label="Nomor Kontak"
              type="text"
              value={formData.nomorKontak}
              onChange={(val) => handleChange("nomorKontak", val)}
              required
            />

            {/* Foto Petani */}
            <ImageUpload
              _id="foto"
              label="Foto Petani"
              value={formData.foto}
              onChange={(file) => setFormData({ ...formData, foto: file })}
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/petani")}
        />
      </div>
    </DashboardLayout>
  );
}
