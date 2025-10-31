import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CoolButton from "../../components/ShopButton";
import { generateSlug } from "@/lib/utils";
import { Star } from "lucide-react";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  price: number;
  imageSrc: string;
  description: string;
  averageRating?: number;
  totalRatings?: number;
}

export function ProductDialog({
  open,
  onOpenChange,
  title,
  price,
  imageSrc,
  description,
  averageRating = 0,
  totalRatings = 0,
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

              {/* Average Rating Display */}
              <div className="mt-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => {
                      const rating = averageRating || 0;
                      const fullStars = Math.floor(rating);
                      const hasHalfStar = rating % 1 >= 0.5;
                      
                      if (index < fullStars) {
                        return <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
                      } else if (index === fullStars && hasHalfStar) {
                        return (
                          <div key={index} className="relative w-4 h-4">
                            <Star className="w-4 h-4 text-gray-300 absolute" />
                            <div className="overflow-hidden absolute w-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                          </div>
                        );
                      } else {
                        return <Star key={index} className="w-4 h-4 text-gray-300" />;
                      }
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-gray-800">
                      {(averageRating || 0).toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">/ 5.0</span>
                  </div>
                  {totalRatings > 0 && (
                    <span className="text-xs text-gray-500">
                      ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>

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
