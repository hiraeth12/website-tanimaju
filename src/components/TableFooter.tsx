// src/components/tables/TableFooter.tsx

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface TableFooterProps {
  total: number;        // total semua data
  filtered: number;     // data hasil filter
  perPage: number;      // jumlah per halaman (current)
  onPerPageChange: (value: number) => void;
}

export function TableFooter({
  total,
  filtered,
  perPage,
  onPerPageChange,
}: TableFooterProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <div>
        Menampilkan {filtered > 0 ? 1 : 0} sampai {filtered} dari {total} hasil
      </div>
      <div className="flex items-center space-x-2">
        <span>Per halaman</span>
        <Select
          value={String(perPage)}
          onValueChange={(val) => onPerPageChange(Number(val))}
        >
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
  );
}
