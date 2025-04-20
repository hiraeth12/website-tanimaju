import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProductDialogProps {
  title: string;
  price: number;
  imageSrc: string;
  children: React.ReactNode;
}

export default function ProductDialog({
  title,
  price,
  imageSrc,
  children,
}: ProductDialogProps) {
  const navigate = useNavigate(); // <-- di sini

  const handleViewProduct = () => {
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/order/${slug}`);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#2d4134] font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[#2d4134]">
            Quick overview of this product
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="w-full md:w-1/2 aspect-square rounded-md overflow-hidden">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-lg font-semibold text-[#2d4134] mb-2">
                ${price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Produk segar langsung dari petani lokal kami. Nikmati hasil
                panen terbaik untuk keluarga Anda!
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            className="w-full bg-[#2d4134] text-white hover:bg-[#1e3024]"
            onClick={handleViewProduct}
          >
            View Detailed Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
