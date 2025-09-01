// src/pages/dashboard/tanaman/TanamanPage.tsx

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { SearchBar } from "@/components/SearchBarProps";
import { ActionButtons } from "@/components/ActionButton";
import { TanamanTable } from "./TanamanTable";
import { TableFooter } from "@/components/TableFooter";

interface TanamanItem {
  _id: string;
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

  // Ambil data tanaman
  const fetchTanamanData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tanamans`);
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
      setSelectedRows(tanamanData.map((item) => item._id));
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
    if (!confirm("Yakin ingin menghapus tanaman ini?")) return;

    try {
      const res = await fetch(`${API_URL}/tanamans/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus tanaman");

      alert("Tanaman berhasil dihapus!");
      fetchTanamanData(); // refresh data
    } catch (err) {
      console.error("Error deleting tanaman:", err);
      alert("Terjadi kesalahan saat menghapus tanaman");
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
