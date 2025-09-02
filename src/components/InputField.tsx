import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type InputFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  placeholder?: string;
  required?: boolean;
  onChange: (val: string) => void;
};

export function InputField({
  id,
  label,
  type = "text",
  value,
  placeholder,
  required,
  onChange,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
