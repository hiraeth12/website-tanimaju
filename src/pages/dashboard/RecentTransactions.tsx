import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Download } from "lucide-react";
import * as XLSX from "xlsx";

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

export const RecentTransactions = () => {
  const [harvestData, setHarvestData] = useState<HarvestItem[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const mapApiData = (item: any): HarvestItem => ({
    _id: item._id,
    date: item.tanggalPanen,
    farmer: item.petani?.nama ?? "-",
    field: item.lahan,
    seedProvider: item.bibit?.namaPenyedia ?? "-",
    plant: item.tanaman?.namaTanaman ?? "-",
    fertilizer: item.pupuk ?? "-",
    amount: item.jumlahHasilPanen ?? "0",
    salesStatus: item.statusPenjualan ?? "-",
    buyerName: item.namaPembeli ?? "-",
  });

  useEffect(() => {
    fetch(`${API_URL}/panens`)
      .then((res) => res.json())
      .then((data) => setHarvestData(data.map(mapApiData))) // <-- pakai mapper
      .catch((err) => console.error("Failed to load data:", err));
  }, [API_URL]);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(harvestData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Panen");
    XLSX.writeFile(workbook, "data_panen.xlsx");
  };

  return (
    <div className="p-4 rounded border border-stone-300 bg-white">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">
          Data Panen (Recent Transactions)
        </h3>
        <Button
          onClick={handleExport}
          className="gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Excel</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Tanggal Panen",
                  "Petani",
                  "Lahan",
                  "Penyedia Bibit",
                  "Tanaman",
                  "Pupuk",
                  "Jumlah",
                  "Status",
                  "Pembeli",
                ].map((header) => (
                  <TableHead
                    key={header}
                    className="text-gray-700 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>{header}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {harvestData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{item.farmer}</TableCell>
                  <TableCell>{item.field}</TableCell>
                  <TableCell>{item.seedProvider}</TableCell>
                  <TableCell>{item.plant}</TableCell>
                  <TableCell>{item.fertilizer}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.salesStatus}</TableCell>
                  <TableCell>{item.buyerName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
