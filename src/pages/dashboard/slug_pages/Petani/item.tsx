import { useEffect, useState } from "react";
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
import { Search, ChevronDown , ChevronRight} from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";

interface HarvestItem {
  id: number;
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

export default function ItemPage() {
  const [harvestData, setHarvestData] = useState<HarvestItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/data/panen.json")
      .then((res) => res.json())
      .then((data) => setHarvestData(data))
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(harvestData.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
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
          <span>Item</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">List</span>
        </div>
      </div>
      <div className="px-6 py-4">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Item</h1>
          <Link to="/admin/panen/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Tambah Item
            </Button>
          </Link>
        </div>

        {/* Search */}
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
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/panen/${item.id}`}
                      className="text-blue-600 hover:underline"
                    >
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
                </TableRow>
              ))}
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
