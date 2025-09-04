import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";

interface BlogPost {
  _id: string;
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

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setBlogData(data);
      })
      .catch((err) => console.error("Failed to load posts data:", err));
  }, [API_URL]);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus post ini?")) {
      try {
        const response = await fetch(`${API_URL}/posts/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setBlogData(prev => prev.filter(item => item._id !== id));
          alert("Post berhasil dihapus!");
        } else {
          alert("Gagal menghapus post!");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Terjadi kesalahan saat menghapus post!");
      }
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(blogData.map((item) => item._id));
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

  return (
    <DashboardLayout>
      <div className="px-6 mt-2 ml-[2px]">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Posts</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">List</span>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Posts</h1>
          <Link to="/admin/posts/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Tambah Post
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari judul post..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedRows.length === blogData.length &&
                      blogData.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {["Gambar", "Judul", "Kategori", "Author", "Tanggal", "Tags", "Aksi"].map(
                  (header) => (
                    <TableHead key={header} className="text-gray-700">
                      <div className="flex items-center space-x-1">
                        <span>{header}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item._id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(item._id)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(item._id, checked as boolean)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-12 object-cover rounded-md"
                    />
                  </TableCell>

                  <TableCell className="font-medium text-gray-800 max-w-xs">
                    <div className="truncate">{item.title}</div>
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {item.category}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">
                    {item.author}
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString('id-ID')}
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">
                    <div className="flex flex-wrap gap-1 max-w-32">
                      {item.tags?.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {item.tags?.length > 2 && (
                        <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/admin/posts/edit/${item._id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Menampilkan {filteredData.length > 0 ? 1 : 0} sampai{" "}
            {filteredData.length} dari {blogData.length} hasil
          </div>
          <div className="flex items-center space-x-2">
            <span>Per halaman</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
