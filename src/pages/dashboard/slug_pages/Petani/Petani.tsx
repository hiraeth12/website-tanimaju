// src/pages/dashboard/item/ItemPage.tsx

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { SearchBar } from "@/components/SearchBarProps";
import { ActionButtons } from "@/components/ActionButton";
import PetaniTable from "./PetaniTable";
import { TableFooter } from "@/components/TableFooter";

interface PetaniItem {
  _id: string;
  nama: string;
  nomorKontak: string;
  foto: string;
  alamat?: string;
}

export default function PetaniPage() {
  const [petaniData, setPetaniData] = useState<PetaniItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPetaniData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/petanis`);
      const data = await res.json();
      setPetaniData(data);
    } catch (err) {
      console.error("Failed to load petani data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetaniData();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(petaniData.map((item) => item._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (_id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, _id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== _id));
    }
  };

  const filteredData = petaniData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/petanis/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Gagal menghapus data Petani !");

      setPetaniData((prev) => prev.filter((item) => item._id !== id));
      alert("Data Petani berhasil dihapus!");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus data Petani");
    }
  };

  return (
    <DashboardLayout>
      <div className="px-6 mt-2 ml-[2px]"></div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Petani</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <ActionButtons
            onRefresh={fetchPetaniData}
            loading={loading}
            actions={[
              {
                label: "Tambah Petani",
                to: "/admin/petani/create",
                className: "bg-green-600 hover:bg-green-700 text-white",
              },
            ]}
          />
        </div>

        <PetaniTable
          petaniData={petaniData}
          filteredData={filteredData}
          selectedRows={selectedRows}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          onDelete={handleDelete}
        />

        <TableFooter
          total={petaniData.length}
          filtered={filteredData.length}
          perPage={perPage}
          onPerPageChange={setPerPage}
        />
      </div>
    </DashboardLayout>
  );
}
