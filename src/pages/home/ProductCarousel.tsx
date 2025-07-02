import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DemoDialog } from "@/pages/home/ProductDialog";

interface Product {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  sku: string;
  description: string;
  info: string;
}

export function ProductCarousel() {
  const [products, setProducts] = useState<Product[]>([]); // State untuk data produk\
  const [loading, setLoading] = useState(true); // State untuk loading
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/product.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

   if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="bg-gray-200 aspect-square rounded-lg animate-pulse"></div>
              <div className="mt-2 h-5 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
              <div className="mt-1 h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto">
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
                  info={product.info}
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
                <div className="mt-2 text-center">
                  <h3 className="text-md font-cascadia text-slate-800 font-semibold">
                    {product.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 font-body">
                    Rp {product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Panah hanya tampil di desktop */}
        <div className="hidden md:flex absolute inset-y-0 left-0 items-center">
          <CarouselPrevious />
        </div>
        <div className="hidden md:flex absolute inset-y-0 right-0 items-center sm:animate-arrow-bounce">
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
