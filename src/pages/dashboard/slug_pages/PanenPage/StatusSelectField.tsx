import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type StatusSelectFieldProps = {
  value: string;
  onChange: (val: string) => void;
};

export function StatusSelectField({ value, onChange }: StatusSelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">
        Status Penjualan<span className="text-red-500">*</span>
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="terjual">Terjual</SelectItem>
          <SelectItem value="belum-terjual">Belum Terjual</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
