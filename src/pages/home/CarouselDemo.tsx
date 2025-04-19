import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  return (
    <Carousel className="w-full max-w-10xl">
      <CarouselContent>
        {products.map((product, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="overflow-hidden group relative cursor-pointer">
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
                </DialogTrigger>

                <DialogContent className="max-w-4xl p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full md:w-1/2 h-auto object-cover"
                    />
                    <div className="flex flex-col gap-4 w-full md:w-1/2">
                      <h3 className="text-2xl font-semibold">{product.name}</h3>
                      <p className="text-xl font-medium text-gray-700">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        SKU: {product.sku}
                      </p>

                      <div>
                        <label
                          htmlFor="quantity"
                          className="text-sm font-medium"
                        >
                          Quantity
                        </label>
                        <Input
                          id="quantity"
                          type="number"
                          defaultValue={1}
                          className="w-24 mt-1"
                        />
                      </div>

                      <Button className="bg-[#FF8C42] hover:bg-[#FF7A2E] text-white mt-2 w-full">
                        Add to Cart
                      </Button>

                      <a
                        href="#"
                        className="text-sm text-[#FF8C42] underline mt-2"
                      >
                        View More Details
                      </a>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
