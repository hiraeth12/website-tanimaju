import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DemoDialog } from "@/components/DemoDialog"; // pastikan path-nya benar

interface ProductCardProps {
  title: string;
  price: number;
  imageSrc?: string;
  ViewProduct?: boolean;
  sku: string;
  description: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export default function ProductCard({
  title,
  price,
  imageSrc,
  ViewProduct = false,
  sku,
  description,
}: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [eyeOpen, setEyeOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // ✅ Tambah state
  const slug = generateSlug(title);

  return (
    <>
      <div
        className="group relative rounded-lg overflow-hidden bg-white transition-all duration-300 hover:shadow-md font-body"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Product Image with Quick View Overlay */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
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

          <div
            className={`absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-300 ${
              isHovering ? "opacity-100" : ""
            }`}
          >
            <button
              className="px-5 py-2.5 bg-white/90 rounded-full flex items-center gap-2 text-sm font-medium text-gray-800 transform translate-y-2 transition-all duration-300 group-hover:translate-y-0 hover:bg-white hover:shadow-sm active:scale-95"
              onClick={(e) => {
                e.preventDefault();
                setEyeOpen(true); // 👉 aktifkan Eye
                setIsDialogOpen(true); // 👉 buka dialog
              }}
            >
              <div className="relative w-4 h-4">
                <EyeOff
                  className={`w-4 h-4 absolute transition-all duration-300 ${
                    eyeOpen ? "opacity-0 scale-75" : "opacity-100 scale-100"
                  }`}
                />
                <Eye
                  className={`w-4 h-4 absolute transition-all duration-300 ${
                    eyeOpen ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}
                />
              </div>
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-1 tracking-tight">
            {title}
          </h3>
          <p className="text-gray-600 mb-4">Rp.{price}</p>

          {ViewProduct && (
            <Link to={`/order/${slug}`}>
              <button className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-[#00A9FF] to-[#0066FF] hover:from-[#0095E0] hover:to-[#0052CC] hover:text-slate-800 group/button flex items-center justify-center">
                <span>View Product</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/button:translate-x-1" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* ✅ Pop-up Dialog */}
      <DemoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={title}
        price={price}
        sku={sku}
        imageSrc={imageSrc || ""}
        description={description}
      />
    </>
  );
}
