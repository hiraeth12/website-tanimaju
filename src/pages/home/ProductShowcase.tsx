import { ProductCarousel } from "./ProductCarousel";
import CoolButton from "@/components/ShopButton";

export default function ProductShowcase() {
  return (
    <section className="relative overflow-hidden py-12 px-4 bg-[#F2EFE7] font-title">
      {/* === DEKORASI LATAR BELAKANG - KANAN BAWAH === */}
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 z-0 opacity-75">
        <svg
          width="500"
          height="500"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#E8E0D3"
            d="M42.9,-54.6C56.3,-46.8,68.4,-34.5,74,-19.6C79.6,-4.7,78.7,12.9,70.5,26.5C62.3,40.1,46.8,49.8,31.7,58.3C16.6,66.8,1.9,74.1,-12.9,72.4C-27.7,70.7,-42.6,60,-53.4,46.9C-64.2,33.7,-70.9,18.1,-71.9,-0.3C-72.9,-18.7,-68.2,-39.5,-55.8,-49.6C-43.4,-59.8,-23.3,-59.3,-5.7,-56.3C11.9,-53.2,29.4,-62.4,42.9,-54.6Z"
            transform="translate(100 100)"
          ></path>
        </svg>
      </div>

      {/* === KONTEN UTAMA === */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto text-left">
          <h2 className="text-slate-800 text-xl md:text-2xl font-bold mb-4 font-cascadia ml-4 md:ml-5">
            <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              Produk
            </span>{" "}
            Pertanian Kami
          </h2>
          <div className="w-12 h-0.5 bg-[#3a4a3c] mb-10 ml-4 md:ml-5"></div>
          <div className="flex items-center justify-center">
            <ProductCarousel />
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <CoolButton to="/order" />
        </div>
      </div>
    </section>
  );
}
