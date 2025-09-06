// src/pages/dashboard/tanaman/TanamanPage.tsx

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { SearchBar } from "@/components/SearchBarProps";
import { ActionButtons } from "@/components/ActionButton";
import { TanamanTable } from "./TanamanTable";
import { TableFooter } from "@/components/TableFooter";
import { Alert } from "@/components/Alert";
import { ConfirmAlert } from "@/components/ConfirmAlert";

interface TanamanItem {
  id: string;
  namaTanaman: string;
  pupuk: string;
}

export default function TanamanPage() {
  const [tanamanData, setTanamanData] = useState<TanamanItem[]>([]);
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
  const fetchTanamanData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tanaman`);
      const data = await res.json();
      setTanamanData(data);
    } catch (err) {
      console.error("Failed to load tanaman data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTanamanData();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(tanamanData.map((item) => item.id));
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

  const filteredData = tanamanData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = async (id: string) => {
    setConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;

    try {
      const res = await fetch(`${API_URL}/tanaman/${confirmId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus tanaman");

      setAlert({
        variant: "success",
        title: "Berhasil",
        message: "Data Tanaman berhasil dihapus!",
      });
      fetchTanamanData();
    } catch (err) {
      setAlert({
        variant: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menghapus data tanaman",
      });
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tanaman</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <ActionButtons
            onRefresh={fetchTanamanData}
            loading={loading}
            actions={[
              {
                label: "Tambah Tanaman",
                to: "/admin/tanaman/create",
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
            message="Yakin ingin menghapus data tanaman ini?"
            onConfirm={confirmDelete}
            onCancel={() => setConfirmId(null)}
          />
        )}

        <TanamanTable
          data={filteredData}
          selectedRows={selectedRows}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onDelete={handleDelete}
        />

        <TableFooter
          total={tanamanData.length}
          filtered={filteredData.length}
          perPage={perPage}
          onPerPageChange={setPerPage}
        />
      </div>
    </DashboardLayout>
  );
}
