import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableRow } from "@/components/ui/table";

interface PanenTableHeaderProps {
  allSelected: boolean;
  onToggleAll: (checked: boolean) => void;
  totalRows: number;
}

export function PanenTableHeader({
  allSelected,
  onToggleAll,
  totalRows,
}: PanenTableHeaderProps) {
  return (
    <TableRow>
      <TableHead className="w-12">
        <Checkbox
          checked={allSelected && totalRows > 0}
          onCheckedChange={onToggleAll}
        />
      </TableHead>
      <TableHead>Tanggal Panen</TableHead>
      <TableHead>Petani</TableHead>
      <TableHead>Lahan</TableHead>
      <TableHead>Nama Penyedia Bibit</TableHead>
      <TableHead>Tanaman</TableHead>
      <TableHead>Pupuk</TableHead>
      <TableHead>Jumlah hasil panen</TableHead>
      <TableHead>Status penjualan</TableHead>
      <TableHead>Nama pembeli</TableHead>
      <TableHead>Aksi</TableHead>
    </TableRow>
  );
}
