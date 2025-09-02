import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InputField } from "@/components/InputField";
import { FormActions } from "@/components/FormActions";

type BibitForm = {
  _id: string;
  tanaman: string;
  sumber: string;
  namaPenyedia: string;
  tanggalPemberian: string;
};

export default function EditBibitPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState<BibitForm | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/bibits/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch bibit");
        return res.json();
      })
      .then((data) => {
        setFormData({
          _id: data._id,
          tanaman: data.tanaman || "",
          sumber: data.sumber || "",
          namaPenyedia: data.namaPenyedia || "",
          tanggalPemberian: data.tanggalPemberian
            ? new Date(data.tanggalPemberian).toISOString().split("T")[0]
            : "",
        });
      })
      .catch((err) => console.error("Gagal memuat data bibit:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: keyof BibitForm, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async () => {
    if (!formData) return;
    try {
      const res = await fetch(`${API}/bibits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tanaman: formData.tanaman,
          sumber: formData.sumber,
          namaPenyedia: formData.namaPenyedia,
          tanggalPemberian: formData.tanggalPemberian,
        }),
      });

      if (!res.ok) throw new Error("Gagal update bibit");

      alert("Data bibit berhasil diperbarui!");
      navigate("/admin/bibit");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update bibit");
    }
  };

  if (loading || !formData) {
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-600">Memuat data tanaman...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Breadcrumb
        items={[{ label: "Bibit", to: "/admin/bibit" }, { label: "Edit" }]}
      />

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Bibit</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <InputField
              id="tanaman"
              label="Nama Tanaman"
              value={formData.tanaman}
              onChange={(value) => handleChange("tanaman", value)}
            />

            <InputField
              id="sumber"
              label="Sumber"
              value={formData.sumber}
              onChange={(value) => handleChange("sumber", value)}
            />
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <InputField
              id="namaPenyedia"
              label="Penyedia"
              value={formData.namaPenyedia}
              onChange={(value) => handleChange("namaPenyedia", value)}
            />

            <InputField
              id="tanggalPemberian"
              label="Tanggal Pemberian"
              type="date"
              required
              value={formData.tanggalPemberian}
              onChange={(val) => handleChange("tanggalPemberian", val)}
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
