import { ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import CoolButton from "./ShopButton";
import { generateSlug } from "@/lib/utils";

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
  imageSrc,
  description,
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 overflow-hidden max-w-3xl border-none rounded-xl shadow-lg font-body"
      >
        {/* Hapus tombol close default */}
        <DialogClose className="hidden" />

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
            <div className="space-y-6 flex-1">
              <div>
                <DialogTitle asChild>
                  <h2 className="text-xl tracking-tight font-cascadia">
                    {title}
                  </h2>
                </DialogTitle>
                <DialogDescription asChild>
                  <p className="text-md text-gray-700 mt-2">{description}</p>
                </DialogDescription>
                <p className="text-xl font-semibold mt-2">Rp. {price}</p>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <CoolButton
                to={`/order/${generateSlug(title)}`}
                label="View Product"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
