// src/pages/dashboard/tanaman/TanamanPage.tsx

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

interface TanamanItem {
  id: string;
  namaTanaman: string;
  pupuk: string;
}

export default function TanamanPage() {
  const [tanamanData, setTanamanData] = useState<TanamanItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/data/tanaman.json")
      .then((res) => res.json())
      .then((data) => {
        const withId = data.map(
          (item: Omit<TanamanItem, "id">, index: number) => ({
            ...item,
            id: `tanaman-${index + 1}`,
          })
        );
        setTanamanData(withId);
      })
      .catch((err) => console.error("Failed to load tanaman data:", err));
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

  return (
    <DashboardLayout>
      <div className="px-6 mt-2 ml-[2px]">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Tanaman</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">List</span>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tanaman</h1>
          <Link to="/admin/tanaman/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Tambah Tanaman
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari Tanaman/Pupuk..."
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
                      selectedRows.length === tanamanData.length &&
                      tanamanData.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {["Nama Tanaman", "Pupuk", "Aksi"].map((header) => (
                  <TableHead key={header} className="text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>{header}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(item.id)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(item.id, checked as boolean)
                      }
                    />
                  </TableCell>

                  <TableCell className="text-gray-800">
                    {item.namaTanaman}
                  </TableCell>
                  <TableCell className="text-gray-700">{item.pupuk}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/admin/tanaman/edit/${item.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm">
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
            {filteredData.length} dari {tanamanData.length} hasil
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
