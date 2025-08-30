// src/pages/dashboard/item/ItemPage.tsx

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
} from "@/components/ui/select"
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

interface ProductItem {
  id: string;
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
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProductData(data))
      .catch((err) => console.error("Failed to load product data:", err));
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

  return (
    <DashboardLayout>
      <div className="px-6 mt-2 ml-[2px]">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Produk</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">List</span>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Produk</h1>
          <Link to="/admin/item/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Tambah produk
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search produk..."
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
                      selectedRows.length === productData.length &&
                      productData.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {[
                  "Gambar",
                  "Nama Produk",
                  "Harga",
                  "Deskripsi",
                  "WhatsApp",
                  "Aksi",
                ].map((header) => (
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
                  <TableCell>
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    {item.title}
                  </TableCell>
                  <TableCell>{formatRupiah(item.price)}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-gray-600">
                    {item.description}
                  </TableCell>
                  <TableCell className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-mono">{item.whatsappNumber}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(item.whatsappNumber);
                        // Ganti Toast dengan alert
                      }}
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </Button>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/admin/item/edit/${item.id}`}>
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
                {filteredData.length} dari {productData.length} hasil
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