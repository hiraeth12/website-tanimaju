import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmAlertProps {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function Konfirmasi({
  title = "Konfirmasi",
  message = "Apakah Anda yakin ingin melanjutkan?",
  onConfirm,
  onCancel,
}: ConfirmAlertProps) {
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm font-cascadia"
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className={cn(
          "relative flex flex-col gap-3 p-6 rounded-xl shadow-xl w-full max-w-sm",
          "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white"
        )}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <h4 className="font-medium text-sm">{title}</h4>
        </div>

        {/* Message */}
        <p className="text-sm text-white/90">{message}</p>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            className="px-4 py-2 text-sm rounded-md bg-white/20 hover:bg-white/30 transition cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            Tolak
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            className="px-4 py-2 text-sm rounded-md bg-white hover:bg-white/90 text-slate-600 font-medium transition cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            Setuju
          </button>
        </div>

        {/* Close (optional) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }}
          className="absolute top-3 right-3 p-1 rounded-md hover:bg-white/10 transition cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
