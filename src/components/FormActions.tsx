import { Button } from "@/components/ui/button";

type FormActionsProps = {
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
};

export function FormActions({
  onSubmit,
  onCancel,
  submitLabel = "Buat",
  cancelLabel = "Batal",
}: FormActionsProps) {
  return (
    <div className="flex gap-4 mt-8 pt-6 border-t">
      <Button
        className="bg-green-600 hover:bg-green-700 text-white px-6"
        onClick={onSubmit}
      >
        {submitLabel}
      </Button>
      <Button variant="outline" className="px-6" onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>
  );
}
