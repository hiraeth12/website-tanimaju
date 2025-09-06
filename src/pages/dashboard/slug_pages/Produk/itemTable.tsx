// src/components/admin/ItemTable.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Copy } from "lucide-react";

type Item = {
  id: string;
  imageSrc: string;
  title: string;
  price: number;
  description: string;
  whatsappNumber: string;
};

type ItemTableProps = {
  productData: Item[];
  filteredData: Item[];
  selectedRows: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectRow: (id: string, checked: boolean) => void;
  formatRupiah: (value: number) => string;
  onDelete: (id: string) => void; // 🔥 tambahan
};


const ItemTable: React.FC<ItemTableProps> = ({
  productData,
  filteredData,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  formatRupiah,
  onDelete,
}) => {
  return (
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
                onCheckedChange={(checked) =>
                  handleSelectAll(checked as boolean)
                }
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
                  src={`${import.meta.env.VITE_API_URL_IMAGE}${item.imageSrc}`}
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
                    alert("Nomor WhatsApp disalin!");
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
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item.id)}
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
  );
};

export default ItemTable;
