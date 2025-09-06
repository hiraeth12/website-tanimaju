import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { SearchBar } from "@/components/SearchBarProps";
import { ActionButtons } from "@/components/ActionButton";
import { PanenTableHeader } from "./PanenTableHeader";
import { PanenTableRow } from "./PanenTableRow";
import { TableFooter } from "@/components/TableFooter";
import { Alert } from "@/components/Alert";
import { ConfirmAlert } from "@/components/ConfirmAlert";

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
  const [perPage, setPerPage] = useState(10);
  const API_URL = import.meta.env.VITE_API_URL;
  const [alert, setAlert] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const mapApiData = (item: any): HarvestItem => ({
    _id: item.id.toString(),
    date: item.tanggalPanen || "-",
    farmer: item.petani_nama || "-",
    field: item.lahan || "Default Field",
    seedProvider: item.bibit_nama_penyedia || "Default Provider",
    plant: item.tanaman_nama || "-",
    fertilizer: item.pupuk || "Default Fertilizer",
    amount: item.jumlahHasilPanen || 0,
    salesStatus: item.statusPenjualan || "-",
    buyerName: item.namaPembeli || "-",
  });

  const fetchHarvestData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/panen`);
      const raw = await res.json();
      const mapped = raw.map(mapApiData);
      console.log("🗂️ Mapped data:", mapped);

      setHarvestData(mapped);
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
    setConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;

    try {
      const res = await fetch(`${API_URL}/panen/${confirmId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus panen ");

      setAlert({
        variant: "success",
        title: "Berhasil",
        message: "Data Panen berhasil dihapus!",
      });
      fetchHarvestData();
    } catch (err) {
      setAlert({
        variant: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menghapus panen",
      });
    } finally {
      setConfirmId(null); // tutup modal
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

          <ActionButtons
            onRefresh={fetchHarvestData}
            loading={loading}
            actions={[
              {
                label: "Tambah Panen",
                to: "/admin/panen/create",
                className: "bg-green-600 hover:bg-green-700 text-white",
              },
            ]}
          />
        </div>

        {alert && (
          <div className="mb-4">
            <Alert
              variant={alert.variant}
              title={alert.title}
              duration={5000}
              onClose={() => setAlert(null)}
            >
              {alert.message}
            </Alert>
          </div>
        )}

        {confirmId && (
          <ConfirmAlert
            title="Konfirmasi Hapus"
            message="Yakin ingin menghapus data panen ini?"
            onConfirm={confirmDelete}
            onCancel={() => setConfirmId(null)}
          />
        )}

        {/* Table */}
        <div className="bg-white border rounded-lg shadow-sm mb-6">
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
        <TableFooter
          total={harvestData.length}
          filtered={filteredData.length}
          perPage={perPage}
          onPerPageChange={setPerPage}
        />
      </div>
    </DashboardLayout>
  );
}
