import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InputField } from "@/components/InputField";
import { SelectField } from "@/components/SelectField";
import { FormActions } from "@/components/FormActions";

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
  const mapApiData = (item: any): HarvestItem => {
    // Helper function to safely format date
    const formatDate = (dateValue: any): string => {
      if (!dateValue) return "";
      
      // Handle different date formats
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        // If direct conversion fails, try parsing MySQL datetime format
        if (typeof dateValue === 'string' && dateValue.includes('T')) {
          const parsedDate = new Date(dateValue.split('T')[0]);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate.toISOString().split('T')[0];
          }
        }
        return "";
      }
      
      return date.toISOString().split('T')[0];
    };

    return {
      _id: item._id || item.id,
      date: formatDate(item.date || item.tanggalPanen || item.tanggal_panen),
      farmer: item.farmer || item.petani?._id || item.petani_id?.toString() || "",
      field: item.field || item.lahan || "",
      seedProvider: item.seedProvider || item.bibit?._id || item.bibit_id?.toString() || "",
      plant: item.plant || item.tanaman?._id || item.tanaman_id?.toString() || "",
      fertilizer: item.fertilizer || item.pupuk || "",
      amount: item.amount || item.jumlahHasilPanen || item.jumlah || 0,
      salesStatus: item.salesStatus || item.statusPenjualan || item.status_penjualan || "",
      buyerName: item.buyerName || item.namaPembeli || item.nama_pembeli || "",
    };
  };

  // fetch data panen by id (hanya setelah reference data dimuat)
  useEffect(() => {
    if (!id || petaniList.length === 0 || tanamanList.length === 0 || bibitList.length === 0) return;
    
    setLoading(true);
    fetch(`${API}/panen/${id}`)
      .then((res) => res.json())
      .then((json) => {
        const mappedData = mapApiData(json);
        setData(mappedData);
      })
      .catch((err) => console.error("Failed to fetch panen data:", err))
      .finally(() => setLoading(false));
  }, [id, petaniList, tanamanList, bibitList]);

  // fetch list petani, bibit, tanaman
  useEffect(() => {
    Promise.all([
      fetch(`${API}/petani`).then((res) => res.json()),
      fetch(`${API}/bibit`).then((res) => res.json()),
      fetch(`${API}/tanaman`).then((res) => res.json()),
    ])
      .then(([petani, bibit, tanaman]) => {
        setPetaniList(petani);
        setBibitList(bibit);
        setTanamanList(tanaman);
      })
      .catch((err) => console.error("Failed to fetch reference data:", err));
  }, []);

  const handleChange = (field: keyof HarvestItem, value: string | number) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleSubmit = async () => {
    if (!data) return;
    try {
      const payload = {
        tanggalPanen: data.date,
        petani: data.farmer,
        lahan: data.field,
        bibit: data.seedProvider,
        tanaman: data.plant,
        pupuk: data.fertilizer,
        jumlahHasilPanen: Number(data.amount),
        statusPenjualan: data.salesStatus,
        namaPembeli: data.buyerName,
      };

      const res = await fetch(`${API}/panen/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Gagal update panen");
      }

      alert("Data panen berhasil diperbarui!");
      navigate("/admin/panen");
    } catch (err) {
      alert("Terjadi kesalahan saat update panen");
    }
  };

  if (loading || !data) return <div className="p-6">Loading...</div>;

  return (
    <DashboardLayout>
      <Breadcrumb
        items={[{ label: "Panen", to: "/admin/panen" }, { label: "Edit" }]}
      />

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Hasil Panen</h1>
        {data && (
          <div className="text-sm text-gray-600 mt-2">
            Data terakhir diperbarui: {new Date(data.date || '').toLocaleDateString('id-ID')}
          </div>
        )}
      </div>

      {/* Loading State */}
      {(loading || petaniList.length === 0 || tanamanList.length === 0 || bibitList.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p>Memuat data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && !data && petaniList.length > 0 && tanamanList.length > 0 && bibitList.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-red-600">Gagal memuat data panen</p>
        </div>
      )}

      {/* Form */}
      {!loading && data && petaniList.length > 0 && tanamanList.length > 0 && bibitList.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kolom Kiri */}
            <div className="space-y-6">
            <InputField
              id="date"
              label="Tanggal Panen"
              type="date"
              value={(() => {
                if (!data.date || data.date === "") {
                  return "";
                }
                const date = new Date(data.date);
                if (isNaN(date.getTime())) {
                  return "";
                }
                const gmt7Date = new Date(date.getTime() + (7 * 60 * 60 * 1000));
                return gmt7Date.toISOString().split("T")[0];
              })()}
              onChange={(v) => handleChange("date", v)}
            />

            <SelectField
              id="farmer"
              label="Petani"
              value={data.farmer}
              onChange={(v) => handleChange("farmer", v)}
              options={petaniList.map((p) => ({ label: p.nama, value: p._id.toString() }))}
              placeholder="Pilih petani"
            />
            {data.farmer && (
              <div className="text-sm text-gray-600 mt-1">
                Petani terpilih: {petaniList.find(p => p._id.toString() === data.farmer)?.nama || 'Data tidak ditemukan'}
              </div>
            )}

            <SelectField
              id="field"
              label="Lahan"
              value={data.field}
              onChange={(v) => handleChange("field", v)}
              options={[
                { label: "Sukabirus", value: "Sukabirus" },
                { label: "Sukapura", value: "Sukapura" },
                { label: "Cikoneng", value: "Cikoneng" },
              ]}
              placeholder="Pilih lahan"
            />

            <SelectField
              id="seedProvider"
              label="Penyedia Bibit"
              value={data.seedProvider}
              onChange={(v) => handleChange("seedProvider", v)}
              options={bibitList.map((b) => ({
                value: b._id.toString(),
                label: b.namaPenyedia,
              }))}
              placeholder="Pilih bibit"
            />
            {data.seedProvider && (
              <div className="text-sm text-gray-600 mt-1">
                Bibit terpilih: {bibitList.find(b => b._id.toString() === data.seedProvider)?.namaPenyedia || 'Data tidak ditemukan'}
              </div>
            )}
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <SelectField
              id="plant"
              label="Tanaman"
              value={data.plant}
              onChange={(v) => handleChange("plant", v)}
              options={tanamanList.map((t) => ({
                value: t._id.toString(),
                label: t.namaTanaman,
              }))}
              placeholder="Pilih tanaman"
            />
            {data.plant && (
              <div className="text-sm text-gray-600 mt-1">
                Tanaman terpilih: {tanamanList.find(t => t._id.toString() === data.plant)?.namaTanaman || 'Data tidak ditemukan'}
              </div>
            )}

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
      )}
    </DashboardLayout>
  );
}
