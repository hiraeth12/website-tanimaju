// src/pages/dashboard/item/ItemPage.tsx

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { SearchBar } from "@/components/SearchBarProps";
import { ActionButtons } from "@/components/ActionButton";
import ItemTable from "./itemTable";
import { TableFooter } from "@/components/TableFooter";

interface ProductItem {
  _id: string;
  title: string;
  price: number;
  imageSrc: string;
  description: string;
  info: string;
  whatsappNumber: string;
}

export default function ItemPage() {
  const [productData, setProductData] = useState<ProductItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchItemData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProductData(data);
    } catch (err) {
      console.error("Failed to load product data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemData();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(productData.map((item) => item._id));
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

  const filteredData = productData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Gagal menghapus produk");

      // update state agar langsung hilang dari tabel
      setProductData((prev) => prev.filter((item) => item._id !== id));
      alert("Produk berhasil dihapus!");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus produk");
    }
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Produk</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <ActionButtons
            onRefresh={fetchItemData}
            loading={loading}
            actions={[
              {
                label: "Tambah Produk",
                to: "/admin/item/create",
                className: "bg-green-600 hover:bg-green-700 text-white",
              },
            ]}
          />
        </div>

        <ItemTable
          productData={productData}
          filteredData={filteredData}
          selectedRows={selectedRows}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          formatRupiah={formatRupiah}
          onDelete={handleDelete} // 🔥 tambahan
        />

        <TableFooter
          total={productData.length}
          filtered={filteredData.length}
          perPage={perPage}
          onPerPageChange={setPerPage}
        />
      </div>
    </DashboardLayout>
  );
}
