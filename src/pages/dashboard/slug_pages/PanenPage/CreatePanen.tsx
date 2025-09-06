import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InputField } from "@/components/InputField";
import { SelectField } from "@/components/SelectField";
import { FormActions } from "@/components/FormActions";
import { StatusSelectField } from "./StatusSelectField";
import { useNotificationContext } from "@/context/NotificationContext";

type FormData = {
  tanggalPanen: string;
  petani: string;
  lahan: string;
  bibit: string;
  tanaman: string;
  pupuk: string;
  jumlahHasilPanen: string;
  statusPenjualan: string;
  namaPembeli: string;
};

export default function CreatePanenPage() {
  const [formData, setFormData] = useState<FormData>({
    tanggalPanen: "",
    petani: "",
    lahan: "",
    bibit: "",
    tanaman: "",
    pupuk: "",
    jumlahHasilPanen: "",
    statusPenjualan: "",
    namaPembeli: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [petanis, setPetanis] = useState<any[]>([]);
  const [penyediaBibit, setPenyediaBibit] = useState<any[]>([]);
  const [tanamans, setTanamans] = useState<any[]>([]);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();

  const handleSubmit = async () => {
    try {
      const payload = {
        petani: formData.petani, // pakai nama / string
        tanaman: formData.tanaman, // pakai namaTanaman (varchar)
        bibit: formData.bibit, // pakai namaPenyedia (varchar)
        lahan: formData.lahan,
        pupuk: formData.pupuk,
        jumlahHasilPanen: Number(formData.jumlahHasilPanen),
        tanggalPanen: formData.tanggalPanen,
        statusPenjualan:
          formData.statusPenjualan === "Terjual" ? "Terjual" : "Belum Terjual",
        namaPembeli: formData.namaPembeli || null,
      };

      const response = await fetch(`${API}/panen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal membuat panen");

      const data = await response.json();
      console.log("Berhasil buat panen:", data);
      
      addNotification({
        variant: "success",
        title: "Berhasil!",
        message: "Data panen berhasil disimpan!",
        duration: 4000,
      });

      // reset form
      setFormData({
        tanggalPanen: "",
        petani: "",
        lahan: "",
        bibit: "",
        tanaman: "",
        pupuk: "",
        jumlahHasilPanen: "",
        statusPenjualan: "",
        namaPembeli: "",
      });

      navigate("/admin/panen");
    } catch (error) {
      console.error(error);
      addNotification({
        variant: "error",
        title: "Error!",
        message: "Terjadi kesalahan saat menyimpan panen",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [petaniRes, bibitRes, tanamanRes] = await Promise.all([
          fetch(`${API}/petani`).then((r) => r.json()),
          fetch(`${API}/bibit`).then((r) => r.json()),
          fetch(`${API}/tanaman`).then((r) => r.json()),
        ]);

        console.log("Petani data:", petaniRes);
        console.log("Bibit data:", bibitRes);
        console.log("Tanaman data:", tanamanRes);

        setPetanis(Array.isArray(petaniRes) ? petaniRes : petaniRes.data || []);
        setPenyediaBibit(
          Array.isArray(bibitRes) ? bibitRes : bibitRes.data || []
        );
        setTanamans(
          Array.isArray(tanamanRes) ? tanamanRes : tanamanRes.data || []
        );
      } catch (err) {
        console.error("Gagal fetch data dropdown", err);
      }
    };

    fetchOptions();
  }, [API]);

  return (
    <DashboardLayout>
      <Breadcrumb
        items={[{ label: "Panen", to: "/admin/panen" }, { label: "Create" }]}
      />

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Create Hasil Panen</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <InputField
              id="tanggalPanen"
              label="Tanggal Panen"
              type="date"
              required
              value={formData.tanggalPanen || ""}
              onChange={(val) => handleChange("tanggalPanen", val)}
            />

            <SelectField
              id="petani"
              label="Petani"
              required
              value={formData.petani}
              placeholder="Pilih petani"
              options={petanis.map((p) => ({
                value: p.nama, // ⚡ ambil nama langsung
                label: p.nama,
              }))}
              onChange={(val) => handleChange("petani", val)}
            />

            <SelectField
              id="lahan"
              label="Lahan"
              required
              value={formData.lahan || ""}
              placeholder="Pilih lahan"
              options={[
                { value: "Sukabirus", label: "Sukabirus" },
                { value: "Sukapura", label: "Sukapura" },
                { value: "Cikoneng", label: "Cikoneng" },
                { value: "Cibiru", label: "Cibiru" },
              ]}
              onChange={(val) => handleChange("lahan", val)}
            />

            <SelectField
              id="bibit"
              label="Nama Penyedia Bibit"
              required
              value={formData.bibit}
              placeholder="Pilih penyedia bibit"
              options={penyediaBibit.map((pb) => ({
                value: pb.namaPenyedia, // ⚡ ambil nama langsung
                label: pb.namaPenyedia,
              }))}
              onChange={(val) => handleChange("bibit", val)}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SelectField
              id="tanaman"
              label="Tanaman"
              required
              value={formData.tanaman}
              placeholder="Pilih tanaman"
              options={tanamans.map((t) => ({
                value: t.namaTanaman, // ⚡ ambil nama langsung
                label: t.namaTanaman,
              }))}
              onChange={(val) => handleChange("tanaman", val)}
            />

            <SelectField
              id="pupuk"
              label="Pupuk"
              required
              value={formData.pupuk || ""}
              placeholder="Pilih pupuk"
              options={[
                { value: "Urea", label: "Urea" },
                { value: "NPK", label: "NPK" },
                { value: "Kompos", label: "Kompos" },
                { value: "Organik Cair", label: "Organik Cair" },
              ]}
              onChange={(val) => handleChange("pupuk", val)}
            />

            <InputField
              id="jumlahHasilPanen"
              label="Jumlah hasil panen (kg)"
              type="number"
              required
              value={formData.jumlahHasilPanen || ""}
              onChange={(val) => handleChange("jumlahHasilPanen", val)}
            />

            <StatusSelectField
              value={formData.statusPenjualan || ""}
              onChange={(val) => handleChange("statusPenjualan", val)}
            />

            <InputField
              id="namaPembeli"
              label="Nama Pembeli"
              type="text"
              value={formData.namaPembeli || ""}
              onChange={(val) => handleChange("namaPembeli", val)}
            />
          </div>
        </div>

        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/panen")}
        />
      </div>
    </DashboardLayout>
  );
}
