import { Card } from "@/components/ui/card"; // Sesuaikan path
import ProductDialog from "@/components/ProductDialog"; // Sesuaikan path
import { useNavigate } from "react-router-dom"; // Import useNavigate dari react-router-dom

interface ProductCardProps {
  title: string;
  price: number;
  imageSrc: string;
  ViewProduct?: boolean;
}

export function ProductCard({
  title,
  price,
  imageSrc,
  ViewProduct = false,
}: ProductCardProps) {
  const navigate = useNavigate(); // <-- di sini

  const handleViewProduct = () => {
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/order/${slug}`);
  };

  return (
    <Card className="overflow-hidden relative cursor-pointer">
      {/* Gambar + Dialog */}
      <ProductDialog title={title} price={price} imageSrc={imageSrc}>
        <div className="relative overflow-hidden group w-full aspect-square max-h-[400px]">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-lg font-semibold">Quick View</span>
          </div>
        </div>
      </ProductDialog>

      {/* Info + button */}
      <div className="p-4 bg-white">
        <h3 className="text-[#2d4134] font-medium">{title}</h3>
        <p className="text-[#2d4134] mb-2">${price.toFixed(2)}</p>
        {ViewProduct && (
          <button
            onClick={handleViewProduct}
            className="w-full py-2 border border-[#2d4134] text-[#2d4134] hover:bg-[#2d4134] hover:text-white transition-colors"
          >
            View Product
          </button>
        )}
      </div>
    </Card>
  );
}
