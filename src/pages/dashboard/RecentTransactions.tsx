// src/pages/dashboard/RecentTransactions.tsx

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, Download } from "lucide-react";
import * as XLSX from "xlsx";

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

export const RecentTransactions = () => {
  const [harvestData, setHarvestData] = useState<HarvestItem[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/panens`)
      .then((res) => res.json())
      .then((data) => setHarvestData(data))
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(harvestData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Panen");
    XLSX.writeFile(workbook, "data_panen.xlsx");
  };

  return (
    <div className="p-4 rounded border border-stone-300 bg-white">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Data Panen (Recent Transactions)</h3>
        <Button onClick={handleExport} className="gap-2 self-start sm:self-auto">
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
                  <TableHead key={header} className="text-gray-700 whitespace-nowrap">
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
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">{item.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.farmer}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.field}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.seedProvider}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.plant}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.fertilizer}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.amount}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.salesStatus}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.buyerName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
