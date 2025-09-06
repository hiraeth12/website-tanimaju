import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InputField } from "@/components/InputField";
import { SelectField } from "@/components/SelectField";
import { FormActions } from "@/components/FormActions";
import { LoadingScreen } from "@/components/LoadingSpinner";
import { useNotificationContext } from "@/context/NotificationContext";

type TanamanForm = {
  id: string;
  namaTanaman: string;
  pupuk: string;
};

export default function EditTanamanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();
  const [formData, setFormData] = useState<TanamanForm | null>(null);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/tanaman/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch tanaman");
        return res.json();
      })
      .then((data) => {
        setFormData({
          id: data.id,
          namaTanaman: data.namaTanaman,
          pupuk: data.pupuk,
        });
      })
      .catch((err) => console.error("Gagal memuat data tanaman:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: keyof TanamanForm, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async () => {
    if (!formData) return;
    try {
      const res = await fetch(`${API}/tanaman/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaTanaman: formData.namaTanaman,
          pupuk: formData.pupuk,
        }),
      });

      if (!res.ok) throw new Error("Gagal update tanaman");

      addNotification({
        variant: "success",
        title: "Berhasil!",
        message: "Data tanaman berhasil diperbarui!",
        duration: 4000,
      });
      navigate("/admin/tanaman");
    } catch (err) {
      console.error(err);
      addNotification({
        variant: "error",
        title: "Error!",
        message: "Terjadi kesalahan saat update tanaman",
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
        items={[{ label: "Tanaman", to: "/admin/tanaman" }, { label: "Edit" }]}
      />

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Tanaman</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {/* Input Nama Tanaman */}
            <InputField
              id="namaTanaman"
              label="Nama Tanaman"
              value={formData.namaTanaman}
              onChange={(value) => handleChange("namaTanaman", value)}
            />

            {/* Select Pupuk */}
            <SelectField
              id="pupuk"
              label="Pupuk"
              value={formData.pupuk}
              onChange={(value) => handleChange("pupuk", value)}
              options={[
                { value: "Urea", label: "Urea" },
                { value: "NPK", label: "NPK" },
                { value: "Kompos", label: "Kompos" },
                { value: "Organik Cair", label: "Organik Cair" },
              ]}
              placeholder="Pilih pupuk"
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/tanaman")}
          submitLabel="Simpan Perubahan"
          cancelLabel="Batal"
        />
      </div>
    </DashboardLayout>
  );
}
