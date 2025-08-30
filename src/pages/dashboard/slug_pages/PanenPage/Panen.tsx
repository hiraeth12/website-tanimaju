import { useEffect, useState, useCallback } from "react"; // 1. Tambahkan useCallback
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronDown, ChevronRight, RefreshCw } from "lucide-react"; // 2. Tambahkan ikon RefreshCw
import { DashboardLayout } from "@/components/Layout/DashboardLayout";

interface HarvestItem {
  _id: string;
  date: string;
  farmer: string;
  field: string;
  seedProvider: string;
  plant: string;
  fertilizer: string;
  amount: string;
  salesStatus: string;
  buyerName: string;
}

export default function PanenPage() {
  const [harvestData, setHarvestData] = useState<HarvestItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading indicator
  const API_URL = import.meta.env.VITE_API_URL;

  // Fungsi untuk memetakan data yang tidak konsisten ke format yang benar
  const mapApiDataToHarvestItem = (item: any): HarvestItem => {
    // Cek apakah ini format data yang baru (dengan field 'tanggalPanen')
    if (item.tanggalPanen) {
      return {
        _id: item._id,
        date: item.tanggalPanen,
        farmer: item.petani,
        field: item.lahan,
        seedProvider: item.namaPenyediaBibit,
        plant: item.tanaman,
        fertilizer: item.pupuk,
        amount: String(item.jumlahHasilPanen),
        salesStatus: item.statusPenjualan,
        buyerName: item.namaPembeli,
      };
    }
    return item;
  };

  const fetchHarvestData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/panens`);
      const rawData = await response.json();
      const cleanedData = rawData.map(mapApiDataToHarvestItem);

      setHarvestData(cleanedData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 4. Panggil fungsi fetch saat komponen pertama kali dimuat
  useEffect(() => {
    fetchHarvestData();
  }, [fetchHarvestData]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(harvestData.map((item) => item._id));
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

  const filteredData = harvestData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <DashboardLayout>
      <div className="px-6 mt-2 ml-[2px]">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Panen</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">List</span>
        </div>
      </div>
      <div className="px-6 py-4">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Panen</h1>
          <Link to="/admin/panen/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              New hasil panen
            </Button>
          </Link>
        </div>

        {/* Search & Actions */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* 5. Tambahkan tombol Refresh di sini */}
            <Button
              variant="outline"
              onClick={fetchHarvestData}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Memuat..." : "Muat Ulang"}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedRows.length === harvestData.length &&
                      harvestData.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {[
                  "Tanggal Panen",
                  "Petani",
                  "Lahan",
                  "Nama Penyedia Bibit",
                  "Tanaman",
                  "Pupuk",
                  "Jumlah hasil panen",
                  "Status penjualan",
                  "Nama pembeli",
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
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
                      {new Date(item.date).toLocaleDateString("id-ID")}
                    </TableCell>

                    <TableCell>
                      <Link to="#" className="text-blue-600 hover:underline">
                        {item.farmer}
                      </Link>
                    </TableCell>
                    <TableCell>{item.field}</TableCell>
                    <TableCell>{item.seedProvider}</TableCell>
                    <TableCell>{item.plant}</TableCell>
                    <TableCell>{item.fertilizer}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.salesStatus === "Terjual"
                            ? "border-green-600 text-green-600"
                            : "border-gray-400 text-gray-600"
                        }
                      >
                        {item.salesStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.buyerName}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/admin/panen/edit/${item._id}`}>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Menampilkan {filteredData.length > 0 ? 1 : 0} sampai{" "}
            {filteredData.length} dari {harvestData.length} hasil
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
