// src/pages/dashboard/petani/PetaniPage.tsx

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
import { Search, ChevronDown, ChevronRight, Copy } from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";

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
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/petani`)
      .then((res) => res.json())
      .then((data) => {
        setPetaniData(data);
      })
      .catch((err) => console.error("Failed to load petani data:", err));
  }, [API_URL]);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus petani ini?")) {
      try {
        const response = await fetch(`${API_URL}/petani/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPetaniData(prev => prev.filter(item => item._id !== id));
          alert("Petani berhasil dihapus!");
        } else {
          alert("Gagal menghapus petani!");
        }
      } catch (error) {
        console.error("Error deleting petani:", error);
        alert("Terjadi kesalahan saat menghapus petani!");
      }
    }
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(petaniData.map((item) => item._id));
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

  const filteredData = petaniData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <DashboardLayout>
      <div className="px-6 mt-2 ml-[2px]">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Petani</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">List</span>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Petani</h1>
          <Link to="/admin/petani/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Tambah Petani
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari Nama..."
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
                      selectedRows.length === petaniData.length &&
                      petaniData.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {["Nama", "Alamat", "Nomor Kontak", "Foto", "Aksi"].map(
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

                  <TableCell className="font-medium text-gray-800">
                    {item.nama}
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">
                    {item.alamat || "-"}
                  </TableCell>

                  <TableCell className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-mono">{item.nomorKontak}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigator.clipboard.writeText(item.nomorKontak)
                      }
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </Button>
                  </TableCell>

                  <TableCell>
                    <img
                      src={item.foto?.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${item.foto}` : item.foto}
                      alt={item.nama}
                      className="w-12 h-12 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = '/images/petani/petani-placeholder.jpg';
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/admin/petani/edit/${item._id}`}>
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
            {filteredData.length} dari {petaniData.length} hasil
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
