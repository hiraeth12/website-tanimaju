import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface PanenTableRowProps {
  item: {
    _id: string;
    date: string;
    farmer: string;
    field: string;
    seedProvider: string;
    plant: string;
    fertilizer: string;
    amount: number;
    salesStatus: string;
    buyerName: string;
  };
  isSelected: boolean;
  onToggle: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
}

export function PanenTableRow({
  item,
  isSelected,
  onToggle,
  onDelete,
}: PanenTableRowProps) {
  return (
    <TableRow key={item._id} className="hover:bg-gray-50">
      {/* Checkbox */}
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(c) => onToggle(item._id, c as boolean)}
        />
      </TableCell>

      {/* Data Cells */}
      <TableCell>
        {new Date(item.date).toLocaleDateString("id-ID")}
      </TableCell>
      <TableCell className="text-blue-600 hover:underline">
        {item.farmer}
      </TableCell>
      <TableCell>{item.field}</TableCell>
      <TableCell>{item.seedProvider}</TableCell>
      <TableCell>{item.plant}</TableCell>
      <TableCell>{item.fertilizer}</TableCell>
      <TableCell>{item.amount}</TableCell>

      {/* Badge untuk status */}
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

      {/* Aksi */}
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/admin/panen/edit/${item._id}`}>
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
  );
}
