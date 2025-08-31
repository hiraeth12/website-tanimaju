import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { SearchBar } from "./SearchPanen";
import { ActionButtons } from "./ActionButtonPanen";
import { PanenTableHeader } from "./PanenTableHeader";
import { PanenTableRow } from "./PanenTableRow";

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

export default function PanenPage() {
  const [harvestData, setHarvestData] = useState<HarvestItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const mapApiData = (item: any): HarvestItem => ({
    _id: item._id,
    date: item.tanggalPanen,
    farmer: item.petani?.nama ?? "-",
    field: item.lahan,
    seedProvider: item.bibit?.namaPenyedia ?? "-",
    plant: item.tanaman?.namaTanaman ?? "-",
    fertilizer: item.pupuk,
    amount: item.jumlahHasilPanen ?? 0,
    salesStatus: item.statusPenjualan,
    buyerName: item.namaPembeli ?? "-",
  });

  const fetchHarvestData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/panens`);
      const raw = await res.json();
      setHarvestData(raw.map(mapApiData));
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchHarvestData();
  }, [fetchHarvestData]);

  const toggleRow = (id: string, checked: boolean) =>
    setSelectedRows((prev) =>
      checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)
    );

  const toggleAll = (checked: boolean) =>
    setSelectedRows(checked ? harvestData.map((i) => i._id) : []);

  const filteredData = harvestData.filter((item) =>
    Object.values(item).some((v) =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(`${API_URL}/panens/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus data");

      setHarvestData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error delete:", err);
      alert("Gagal menghapus data");
    }
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Panen</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />

          <ActionButtons onRefresh={fetchHarvestData} loading={loading} />
        </div>

        {/* Table */}
        <div className="bg-white border rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <PanenTableHeader
                allSelected={selectedRows.length === harvestData.length}
                onToggleAll={toggleAll}
                totalRows={harvestData.length}
              />
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <PanenTableRow
                    key={item._id}
                    item={item}
                    isSelected={selectedRows.includes(item._id)}
                    onToggle={toggleRow}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
