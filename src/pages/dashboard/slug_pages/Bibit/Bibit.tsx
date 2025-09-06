import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { SearchBar } from "@/components/SearchBarProps";
import { ActionButtons } from "@/components/ActionButton";
import { TableFooter } from "@/components/TableFooter";
import { BibitTable } from "./BibitTable";
import { Alert } from "@/components/Alert";
import { ConfirmAlert } from "@/components/ConfirmAlert";

interface BibitItem {
  id: string;
  tanaman: string;
  sumber: string;
  namaPenyedia: string;
  tanggalPemberian: string;
}

export default function BibitPage() {
  const [bibitData, setBibitData] = useState<BibitItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [alert, setAlert] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchBibitData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/bibit`);
      const data = await res.json();
      setBibitData(data);
    } catch (err) {
      console.error("Failed to load bibit Data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBibitData();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(bibitData.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmId(id); 
  };

  const confirmDelete = async () => {
    if (!confirmId) return;

    try {
      const res = await fetch(`${API_URL}/bibit/${confirmId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus bibit");

      setAlert({
        variant: "success",
        title: "Berhasil",
        message: "Bibit berhasil dihapus!",
      });
      fetchBibitData();
    } catch (err) {
      setAlert({
        variant: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menghapus bibit",
      });
    } finally {
      setConfirmId(null); // tutup modal
    }
  };

  const filteredData = bibitData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <DashboardLayout>
      <div className="px-6 py-4 font-cascadia">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Bibit</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <ActionButtons
            onRefresh={fetchBibitData}
            loading={loading}
            actions={[
              {
                label: "Tambah Bibit",
                to: "/admin/bibit/create",
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
            message="Yakin ingin menghapus bibit ini?"
            onConfirm={confirmDelete}
            onCancel={() => setConfirmId(null)}
          />
        )}

        <BibitTable
          data={filteredData}
          selectedRows={selectedRows}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onDelete={handleDelete}
        />
        <TableFooter
          total={bibitData.length}
          filtered={filteredData.length}
          perPage={perPage}
          onPerPageChange={setPerPage}
        />
      </div>
    </DashboardLayout>
  );
}
