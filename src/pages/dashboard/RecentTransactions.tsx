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

  useEffect(() => {
    fetch("/data/panen.json")
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
    <div className="col-span-12 p-4 rounded border border-stone-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Data Panen (Recent Transactions)</h3>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export Excel
        </Button>
      </div>

      <div className="overflow-auto">
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
                <TableHead key={header} className="text-gray-700">
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
                <TableCell>{item.date}</TableCell>
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
  );
};
