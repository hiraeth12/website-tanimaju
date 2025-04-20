import { CarouselDemo } from "./CarouselDemo";
import CoolButton from "@/components/ShopButton";

export default function ProductShowcase() {
  return (
    <section className="py-12 px-4 bg-[#F2EFE7] font-title">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-slate-800 text-3xl md:text-4xl font-bold text-center mb-4">
          Produk Pertanian Kami
        </h2>
        <div className="flex justify-center mb-10">
          <div className="w-12 h-0.5 bg-[#2a2b4d]"></div>
        </div>
        <div className="flex items-center justify-center">
          <CarouselDemo />
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <CoolButton />
      </div>
    </section>
  );
}
