import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CoolButton from "./ShopButton";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  price: number;
  sku: string;
  imageSrc: string;
  description: string; // deskripsi singkat produk
}

export function DemoDialog({
  open,
  onOpenChange,
  title,
  price,
  sku,
  imageSrc,
  description,
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-3xl border-none rounded-xl shadow-lg font-body">
        <div className="grid grid-cols-1 md:grid-cols-2">
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
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </button>

            <div className="space-y-6 flex-1">
              <div>
                <h2 className="text-2xl font-medium tracking-tight">{title}</h2>
                <p className="text-2xl font-semibold mt-1">Rp. {price}</p>
                <p className="text-sm text-gray-500 mt-1">SKU: {sku}</p>
                <p className="text-sm text-gray-700 mt-4">{description}</p>
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
