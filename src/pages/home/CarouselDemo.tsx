import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DemoDialog } from "@/components/DemoDialog"; // named import sesuai definisi

const products = [
  {
    id: 1,
    name: "Classic Basket",
    price: 15.0,
    sku: "0001",
    image: "/images/shop-placeholder-1.jpg",
  },
  {
    id: 2,
    name: "Mixed Basket",
    price: 25.0,
    sku: "0002",
    image: "/images/shop-placeholder-2.jpg",
  },
  {
    id: 3,
    name: "Family Basket",
    price: 45.0,
    sku: "0003",
    image: "/images/shop-placeholder-1.jpg",
  },
];

export function CarouselDemo() {
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);

  return (
    <Carousel className="w-full max-w-10xl">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-4">
              {/* Pass data product ke DemoDialog */}
              <DemoDialog
                open={openDialogId === product.id}
                onOpenChange={(open) =>
                  setOpenDialogId(open ? product.id : null)
                }
                title={product.name}
                price={product.price}
                sku={product.sku}
                imageSrc={product.image}
              />

              <Card
                onClick={() => setOpenDialogId(product.id)}
                className="overflow-hidden group relative cursor-pointer"
              >
                <CardContent className="p-0 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover aspect-square transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-lg font-semibold">
                      Quick View
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
