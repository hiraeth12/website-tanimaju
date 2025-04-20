import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CoolButton from "./ShopButton";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  price: number;
  sku: string;
  imageSrc: string;
}

export function DemoDialog({
  open,
  onOpenChange,
  title,
  price,
  sku,
  imageSrc,
}: ProductDialogProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-3xl border-none rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

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
                <p className="text-2xl font-bold mt-1">${price.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">SKU: {sku}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity
                </label>
                <div className="flex items-center w-24">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-r-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number.parseInt(e.target.value) || 1)
                    }
                    className="h-9 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-l-none"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
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
