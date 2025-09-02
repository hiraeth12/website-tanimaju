// src/components/tables/TanamanTable.tsx

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";

interface TanamanItem {
  _id: string;
  namaTanaman: string;
  pupuk: string;
}

interface TanamanTableProps {
  data: TanamanItem[];
  selectedRows: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onDelete: (id: string) => Promise<void>;
}

export function TanamanTable({
  data,
  selectedRows,
  onSelectAll,
  onSelectRow,
  onDelete,
}: TanamanTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.length === data.length && data.length > 0}
                onCheckedChange={onSelectAll}
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
          {data.map((item) => (
            <TableRow key={item._id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedRows.includes(item._id)}
                  onCheckedChange={(checked) =>
                    onSelectRow(item._id, checked as boolean)
                  }
                />
              </TableCell>

              <TableCell className="text-gray-800">
                {item.namaTanaman}
              </TableCell>
              <TableCell className="text-gray-700">{item.pupuk}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link to={`/admin/tanaman/edit/${item._id}`}>
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
}
