import { Link } from "react-router-dom";
import { CarouselDemo } from "./demo/CarouselDemo";

export default function ProductShowcase() {
  return (
    <section className="py-12 px-4 bg-[#e8e0d4]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[#2A4D3E] text-3xl md:text-4xl font-bold text-center mb-4">
          Shop Season&apos;s Produce
        </h2>
        <div className="flex justify-center mb-10">
          <div className="w-12 h-0.5 bg-[#2A4D3E]"></div>
        </div>
        <div className="flex items-center justify-center">
          <CarouselDemo />
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <Link
          to="/order"
          className="bg-[#FF8C42] hover:bg-[#FF7A2E] text-white px-8 py-3 text-center transition-colors rounded-md"
        >
          Order Online
        </Link>
      </div>
    </section>
  );
}
