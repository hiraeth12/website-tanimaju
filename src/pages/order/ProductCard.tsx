import { Link } from "react-router-dom";
import { generateSlug, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  title: string;
  price: number;
  imageSrc?: string;
  description: string;
}

export default function ProductCard({
  title,
  price,
  imageSrc,
  description,
}: ProductCardProps) {
  const slug = generateSlug(title);

  return (
    <Link to={`/order/${slug}`} className="group block">
      <div className="relative rounded-lg overflow-hidden bg-white transition-all duration-300 hover:shadow-xl h-[320px] sm:h-[360px] flex flex-col aspect-auto">
        {/* Gambar Produk */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50 rounded-t-lg">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-300/50 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gray-300/80"></div>
              </div>
            </div>
          )}
        </div>

        {/* Detail Produk */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg text-gray-800 tracking-tight leading-snug mb-1 font-cascadia">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 font-body overflow-hidden line-clamp-2 h-[2.5rem]">
            {description}
          </p>
          <p className="font-body text-lg font-bold text-slate-800 mt-auto pt-2">
            {formatPrice(price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
