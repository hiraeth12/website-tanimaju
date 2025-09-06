import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CoolButton from "../../components/ShopButton";
import { generateSlug } from "@/lib/utils";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  price: number;
  imageSrc: string;
  description: string;
}

export function ProductDialog({
  open,
  onOpenChange,
  title,
  price,
  imageSrc,
  description,

}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-4xl border-none rounded-xl shadow-lg font-body">
        <div className="grid grid-cols-1 md:grid-cols-2 relative">
          {/* Gambar Produk */}
          <div className="relative w-full h-full max-h-[400px] md:max-h-none overflow-hidden">
            <img
              src={`${import.meta.env.VITE_API_URL_IMAGE}${imageSrc}`}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Detail Produk */}
          <div className="p-6 md:p-8 flex flex-col">
            {/* Konten utama yang bisa di-scroll */}
            <div className="flex-grow overflow-y-auto pr-2">
              <DialogTitle asChild>
                <h2 className="text-[22px] tracking-tight font-cascadia">
                  {title}
                </h2>
              </DialogTitle>
              <p className="text-xl font-semibold mt-2">
                Rp {price.toLocaleString("id-ID")}
              </p>
              <DialogDescription asChild>
                <p className="text-md text-gray-700 mt-2">{description}</p>
              </DialogDescription>

              {/* Info Produk Langsung */}
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex-shrink-0">
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
