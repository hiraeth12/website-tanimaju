import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { SearchBar } from "@/components/SearchBarProps";
import { ActionButtons } from "@/components/ActionButton";
import { TableFooter } from "@/components/TableFooter";
import BlogTable from "./PostTable";
import { Alert } from "@/components/Alert";
import { ConfirmAlert } from "@/components/ConfirmAlert";

interface BlogPost {
  id: string;
  title: string;
  image: string;
  date: string;
  category: string;
  author: string;
  tags: string[];
}

export default function PostsPage() {
  const [blogData, setBlogData] = useState<BlogPost[]>([]);
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

  const fetchBlogData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setBlogData(data);
    } catch (err) {
      console.error("Failed to load blog data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(blogData.map((item) => item.id));
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

  const filteredData = blogData.filter((item) =>
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
      const res = await fetch(`${API_URL}/posts/${confirmId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus post");

      setAlert({
        variant: "success",
        title: "Berhasil",
        message: "Data Posts berhasil dihapus!",
      });
      fetchBlogData();
    } catch (err) {
      setAlert({
        variant: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menghapus data Posts",
      });
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <ActionButtons
            onRefresh={fetchBlogData}
            loading={loading}
            actions={[
              {
                label: "Tambah Artikel",
                to: "/admin/posts/create",
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
            message="Yakin ingin menghapus blog ini?"
            onConfirm={confirmDelete}
            onCancel={() => setConfirmId(null)}
          />
        )}

        <BlogTable
          blogData={blogData}
          filteredData={filteredData}
          selectedRows={selectedRows}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          onDelete={handleDelete}
        />

        <TableFooter
          total={blogData.length}
          filtered={filteredData.length}
          perPage={perPage}
          onPerPageChange={setPerPage}
        />
      </div>
    </DashboardLayout>
  );
}
