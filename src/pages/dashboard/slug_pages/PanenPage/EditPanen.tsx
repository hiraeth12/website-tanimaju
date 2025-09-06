import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InputField } from "@/components/InputField";
import { SelectField } from "@/components/SelectField";
import { FormActions } from "@/components/FormActions";
import { LoadingScreen } from "@/components/LoadingSpinner";

interface HarvestItem {
  _id: string;
  date: string;
  farmer: string;
  field: string;
  seedProvider: string;
  plant: string;
  fertilizer: string;
  amount: number;
  salesStatus: string;
  buyerName: string;
}

export default function EditPanenPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<HarvestItem | null>(null);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const [petaniList, setPetaniList] = useState<any[]>([]);
  const [bibitList, setBibitList] = useState<any[]>([]);
  const [tanamanList, setTanamanList] = useState<any[]>([]);
  const mapApiData = (item: any): HarvestItem => ({
    _id: item.id.toString(),
    date: item.tanggalPanen,
    farmer: item.petani_nama || "",
    field: item.lahan,
    seedProvider: item.bibit_nama_penyedia || "",
    plant: item.tanaman_nama || "",
    fertilizer: item.pupuk,
    amount: item.jumlahHasilPanen ?? 0,
    salesStatus: item.statusPenjualan,
    buyerName: item.namaPembeli ?? "",
  });

  // fetch data panen by id
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/panen/${id}`)
      .then((res) => res.json())
      .then((json) => setData(mapApiData(json)))
      .catch((err) => console.error("Failed to fetch panen data:", err))
      .finally(() => setLoading(false));
  }, [id, API]);

  // fetch list petani, bibit, tanaman
  useEffect(() => {
    fetch(`${API}/petani`)
      .then((res) => res.json())
      .then(setPetaniList);
    fetch(`${API}/bibit`)
      .then((res) => res.json())
      .then(setBibitList);
    fetch(`${API}/tanaman`)
      .then((res) => res.json())
      .then(setTanamanList);
  }, [API]);

  const handleChange = (field: keyof HarvestItem, value: string | number) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleSubmit = async () => {
    if (!data) return;
    try {
      // Format tanggal ke YYYY-MM-DD
      const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : '';
      
      const payload = {
        tanggalPanen: formattedDate,
        petani: data.farmer,
        lahan: data.field,
        bibit: data.seedProvider,
        tanaman: data.plant,
        pupuk: data.fertilizer,
        jumlahHasilPanen: Number(data.amount),
        statusPenjualan: data.salesStatus,
        namaPembeli: data.buyerName,
      };

      console.log("Updating panen with payload:", payload);

      const res = await fetch(`${API}/panen/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal update panen");

      alert("Data panen berhasil diperbarui!");
      navigate("/admin/panen");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update panen");
    }
  };

  if (loading || !data) {
    return (
      <DashboardLayout>
        <LoadingScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Breadcrumb
        items={[{ label: "Panen", to: "/admin/panen" }, { label: "Edit" }]}
      />

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Hasil Panen</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <InputField
              id="date"
              label="Tanggal Panen"
              type="date"
              value={new Date(data.date).toISOString().split("T")[0]}
              onChange={(v) => handleChange("date", v)}
            />

            <SelectField
              id="farmer"
              label="Petani"
              value={data.farmer}
              onChange={(v) => handleChange("farmer", v)}
              options={petaniList.map((p) => ({ label: p.nama, value: p.nama }))}
              placeholder="Pilih petani"
            />

            <SelectField
              id="field"
              label="Lahan"
              value={data.field}
              onChange={(v) => handleChange("field", v)}
              options={[
                { label: "Sukabirus", value: "Sukabirus" },
                { label: "Sukapura", value: "Sukapura" },
                { label: "Cikoneng", value: "Cikoneng" },
                { label: "Cibiru", value: "Cibiru" },
              ]}
              placeholder="Pilih lahan"
            />

            <SelectField
              id="seedProvider"
              label="Penyedia Bibit"
              value={data.seedProvider}
              onChange={(v) => handleChange("seedProvider", v)}
              options={bibitList.map((b) => ({
                value: b.namaPenyedia,
                label: b.namaPenyedia,
              }))}
              placeholder="Pilih bibit"
            />
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <SelectField
              id="plant"
              label="Tanaman"
              value={data.plant}
              onChange={(v) => handleChange("plant", v)}
              options={tanamanList.map((t) => ({
                value: t.namaTanaman,
                label: t.namaTanaman,
              }))}
              placeholder="Pilih tanaman"
            />

            <SelectField
              id="fertilizer"
              label="Pupuk"
              value={data.fertilizer}
              onChange={(v) => handleChange("fertilizer", v)}
              options={[
                { value: "Urea", label: "Urea" },
                { value: "NPK", label: "NPK" },
                { value: "Kompos", label: "Kompos" },
                { value: "Organik Cair", label: "Organik Cair" },
              ]}
              placeholder="Pilih pupuk"
            />

            <InputField
              id="amount"
              label="Jumlah Hasil Panen"
              type="number"
              value={data.amount}
              onChange={(v) => handleChange("amount", v)}
            />

            <SelectField
              id="salesStatus"
              label="Status Penjualan"
              value={data.salesStatus}
              onChange={(v) => handleChange("salesStatus", v)}
              options={[
                { label: "Terjual", value: "Terjual" },
                { label: "Belum Terjual", value: "Belum Terjual" },
              ]}
              placeholder="Pilih status"
            />

            <InputField
              id="buyerName"
              label="Nama Pembeli"
              value={data.buyerName}
              onChange={(v) => handleChange("buyerName", v)}
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/panen")}
          submitLabel="Simpan Perubahan"
          cancelLabel="Batal"
        />
      </div>
    </DashboardLayout>
  );
}
