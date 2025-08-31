import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "./Breadcrumb";
import { SelectField } from "./SelectField";
import { InputField } from "./InputField";
import { FormActions } from "./FormActions";
import { StatusSelectField } from "./StatusSelectField";

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
  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        jumlahHasilPanen: Number(formData.jumlahHasilPanen),
        tanggalPanen: new Date(formData.tanggalPanen),
        statusPenjualan:
          formData.statusPenjualan === "terjual" ? "Terjual" : "Belum Terjual",
      };

      const response = await fetch(`${API}/panens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal membuat panen");

      const data = await response.json();
      console.log("Berhasil buat panen:", data);
      alert("Data panen berhasil disimpan!");

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
      alert("Terjadi kesalahan saat menyimpan panen");
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [petaniRes, bibitRes, tanamanRes] = await Promise.all([
          fetch(`${API}/petanis`).then((r) => r.json()),
          fetch(`${API}/bibits`).then((r) => r.json()),
          fetch(`${API}/tanamans`).then((r) => r.json()),
        ]);

        setPetanis(petaniRes);
        setPenyediaBibit(bibitRes);
        setTanamans(tanamanRes);
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
            {/* Tanggal Panen */}
            <InputField
              id="tanggalPanen"
              label="Tanggal Panen"
              type="date"
              required
              value={formData.tanggalPanen}
              onChange={(val) => handleChange("tanggalPanen", val)}
            />

            {/* Petani */}
            <SelectField
              id="petani"
              label="Petani"
              required
              value={formData.petani}
              placeholder="Pilih petani"
              options={petanis.map((p) => ({ value: p._id, label: p.nama }))}
              onChange={(val) => handleChange("petani", val)}
              withAddButton
            />

            {/* Lahan */}
            <SelectField
              id="lahan"
              label="Lahan"
              required
              value={formData.lahan}
              placeholder="Pilih lahan"
              options={[
                { value: "Sukabirus", label: "Sukabirus" },
                { value: "Sukapura", label: "Sukapura" },
                { value: "Cikoneng", label: "Cikoneng" },
                { value: "Cibiru", label: "Cibiru" },
              ]}
              onChange={(val) => handleChange("lahan", val)}
              withAddButton
            />

            {/* Nama Penyedia Bibit */}
            <SelectField
              id="bibit"
              label="Nama Penyedia Bibit"
              required
              value={formData.bibit}
              placeholder="Pilih penyedia bibit"
              options={penyediaBibit.map((pb) => ({
                value: pb._id,
                label: pb.namaPenyedia,
              }))}
              onChange={(val) => handleChange("bibit", val)}
              withAddButton
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Tanaman */}
            <SelectField
              id="tanaman"
              label="Tanaman"
              required
              value={formData.tanaman}
              placeholder="Pilih tanaman"
              options={tanamans.map((t) => ({
                value: t._id,
                label: t.namaTanaman,
              }))}
              onChange={(val) => handleChange("tanaman", val)}
              withAddButton
            />

            {/* Pupuk */}
            <SelectField
              id="pupuk"
              label="Pupuk"
              required
              value={formData.pupuk}
              placeholder="Pilih pupuk"
              options={[
                { value: "Urea", label: "Urea" },
                { value: "NPK", label: "NPK" },
                { value: "Kompos", label: "Kompos" },
                { value: "Organik Cair", label: "Organik Cair" },
              ]}
              onChange={(val) => handleChange("pupuk", val)}
              withAddButton
            />

            {/* Jumlah hasil panen */}
            <InputField
              id="jumlahHasilPanen"
              label="Jumlah hasil panen (kg)"
              type="number"
              required
              value={formData.jumlahHasilPanen}
              onChange={(val) => handleChange("jumlahHasilPanen", val)}
            />

            {/* Status penjualan */}
            <StatusSelectField
              value={formData.statusPenjualan}
              onChange={(val) => handleChange("statusPenjualan", val)}
            />

            <InputField
              id="namaPembeli"
              label="Nama Pembeli"
              type="text"
              value={formData.namaPembeli}
              onChange={(val) => handleChange("namaPembeli", val)}
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/panen")}
        />
      </div>
    </DashboardLayout>
  );
}
