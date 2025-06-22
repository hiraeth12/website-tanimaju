import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DemoDialog } from "@/components/DemoDialog";
import { products } from "../order/ProductData";

export function CarouselDemo() {
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-10xl mx-auto">
      <Carousel className="w-full touch-pan-x">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="p-4">
                <DemoDialog
                  open={openDialogId === product.id}
                  onOpenChange={(open) =>
                    setOpenDialogId(open ? product.id : null)
                  }
                  title={product.title}
                  price={product.price}
                  sku={product.sku}
                  imageSrc={product.imageSrc}
                  description={product.description}
                />
                <Card
                  onClick={() => setOpenDialogId(product.id)}
                  className="overflow-hidden group relative cursor-pointer"
                >
                  <CardContent className="p-0 relative">
                    <img
                      src={product.imageSrc}
                      alt={product.title}
                      className="w-full h-full object-cover aspect-square transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-lg font-semibold font-body">
                        Quick View
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Panah hanya tampil di desktop */}
        <div className="hidden md:flex absolute inset-y-0 left-0 items-center">
          <CarouselPrevious />
        </div>
        <div className="hidden md:flex absolute inset-y-0 right-0 items-center animate-arrow-bounce">
          <CarouselNext />
        </div>
      </Carousel>

      {/* Reminder swipe di mobile */}
      <div className="md:hidden mt-3 text-center text-sm text-slate-800">
        <span className="inline-flex items-center gap-1 font-body">
          <span>Swipe untuk melihat produk lainnya</span>
          <span className="animate-bounce-right">→</span>
        </span>
      </div>
    </div>
  );
}
