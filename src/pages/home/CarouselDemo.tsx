import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DemoDialog } from "@/components/DemoDialog"; // pastikan nama import sama
// Jangan lupa DemoDialog menerima prop `description`

const products = [
  {
    id: 1,
    name: "Padi",
    price: 6500,
    sku: "0001",
    image: "/images/shop-placeholder-1.jpg",
    description: "Padi berkualitas untuk hasil panen terbaik.",
  },
  {
    id: 2,
    name: "Bawang Merah",
    price: 60000,
    sku: "0002",
    image: "/images/shop-placeholder-2.jpg",
    description: "Bawang merah segar dari petani lokal.",
  },
  {
    id: 3,
    name: "Jagung Manis",
    price: 17000,
    sku: "0003",
    image: "/images/shop-placeholder-3.jpg",
    description: "Jagung manis siap konsumsi dengan rasa alami.",
  },
  {
    id: 4,
    name: "Sawi",
    price: 10000,
    sku: "0004",
    image: "/images/shop-placeholder-4.jpg",
    description: "Sayur sawi segar cocok untuk berbagai masakan.",
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
              <DemoDialog
                open={openDialogId === product.id}
                onOpenChange={(open) =>
                  setOpenDialogId(open ? product.id : null)
                }
                title={product.name}
                price={product.price}
                sku={product.sku}
                imageSrc={product.image}
                description={product.description} // <-- ini penting
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
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
