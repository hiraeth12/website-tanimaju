import { X, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CoolButton from "./ShopButton";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  price: number;
  sku: string;
  imageSrc: string;
  description: string;
}

export function DemoDialog({
  open,
  onOpenChange,
  title,
  price,
  // sku,
  imageSrc,
  description,
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-3xl border-none rounded-xl shadow-lg font-body">
        <div className="grid grid-cols-1 md:grid-cols-2 relative">
          {/* Tombol Kembali untuk Mobile */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute z-10 left-4 top-4 bg-white rounded-full h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors md:hidden shadow-md"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
            <span className="sr-only">Back</span>
          </button>

          {/* Gambar Produk */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Detail Produk */}
          <div className="p-6 md:p-8 flex flex-col relative">
            {/* Tombol Tutup untuk Desktop */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 transition-colors hidden md:block"
              aria-label="Close"
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </button>

            <div className="space-y-6 flex-1">
              <div>
                <DialogTitle asChild>
                  <h2 className="text-2xl font-medium tracking-tight">
                    {title}
                  </h2>
                </DialogTitle>
                <p className="text-2xl font-semibold mt-1">Rp. {price}</p>
                {/* <p className="text-sm text-gray-500 mt-1">SKU: {sku}</p> */}
                <DialogDescription asChild>
                  <p className="text-sm text-gray-700 mt-4">{description}</p>
                </DialogDescription>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <CoolButton />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}