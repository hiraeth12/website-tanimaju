import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  placeholder?: string;
  options: Option[];
  onChange: (val: string) => void;
  withAddButton?: boolean;
};

export function SelectField({
  id,
  label,
  required,
  value,
  placeholder,
  options,
  onChange,
  withAddButton,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={placeholder || `Pilih ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {withAddButton && (
          <Button variant="outline" size="icon" className="shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
