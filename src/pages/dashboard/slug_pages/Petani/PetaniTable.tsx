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

type Petani = {
  _id: string;
  nama: string;
  alamat?: string;
  nomorKontak: string;
  foto: string;
};

type PetaniTableProps = {
  petaniData: Petani[];
  filteredData: Petani[];
  selectedRows: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectRow: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void; // 🔥 biar tombol hapus bisa dipakai
};

const PetaniTable: React.FC<PetaniTableProps> = ({
  petaniData,
  filteredData,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
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
                  selectedRows.length === petaniData.length &&
                  petaniData.length > 0
                }
                onCheckedChange={(checked) =>
                  handleSelectAll(checked as boolean)
                }
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
                  src={item.foto}
                  alt={item.nama}
                  className="w-12 h-12 object-cover rounded-md"
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
                    onClick={() => onDelete(item._id)}
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

export default PetaniTable;
