// src/pages/dashboard/item/ItemPage.tsx

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { SearchBar } from "@/components/SearchBarProps";
import { ActionButtons } from "@/components/ActionButton";
import { TableFooter } from "@/components/TableFooter";
import { Alert } from "@/components/Alert";
import { ConfirmAlert } from "@/components/ConfirmAlert";
import ItemTable from "./itemTable";

interface ProductItem {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  description: string;
  info: string;
  whatsappNumber: string;
  average_rating?: number;
  total_ratings?: number;
}

export default function ItemPage() {
  const [productData, setProductData] = useState<ProductItem[]>([]);
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

  const fetchItemData = async () => {
    try {
      setLoading(true);
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
      setSelectedRows(productData.map((item) => item.id));
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
    setConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;

    try {
      const res = await fetch(`${API_URL}/products/${confirmId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus produk");

      setAlert({
        variant: "success",
        title: "Berhasil",
        message: "Data Produk berhasil dihapus!",
      });
      fetchItemData();
    } catch (err) {
      setAlert({
        variant: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menghapus data produk",
      });
    } finally {
      setConfirmId(null);
    }
  };

  const handleRatingUpdate = async (id: string, rating: number) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}/rating`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal mengupdate rating");
      }

      setAlert({
        variant: "success",
        title: "Berhasil",
        message: "Rating produk berhasil diperbarui!",
      });
      fetchItemData();
    } catch (err: any) {
      setAlert({
        variant: "error",
        title: "Gagal",
        message: err.message || "Terjadi kesalahan saat mengupdate rating",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Produk</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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
            message="Yakin ingin menghapus produk ini?"
            onConfirm={confirmDelete}
            onCancel={() => setConfirmId(null)}
          />
        )}

        <ItemTable
          productData={productData}
          filteredData={filteredData}
          selectedRows={selectedRows}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          formatRupiah={formatRupiah}
          onDelete={handleDelete}
          onRatingUpdate={handleRatingUpdate}
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
