import { useRef } from "react";
import ImageCarousel from "@/components/ImageCarousel";

export default function Section3() {
  const sectionRef = useRef(null);

  const images = [
    { src: "/images/carousel-placeholder-1.jpg", alt: "Slide 1" },
    { src: "/images/carousel-placeholder-2.jpg", alt: "Slide 2" },
    { src: "/images/carousel-placeholder-3.jpg", alt: "Slide 3" },
    { src: "/images/carousel-placeholder-4.jpg", alt: "Slide 4" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[70vh] flex overflow-hidden bg-gradient-to-r from-[#00A9FF] via-[#65CFFF] to-[#F5EEDC]"
    >
      {/* Gambar Kiri */}
      <div className="w-1/2 flex items-center justify-center bg-transparent">
        <img
          src="/images/parallax-placeholder-1.jpg"
          alt="Left"
          className="h-[34vh] w-auto object-cover"
        />
      </div>

      {/* Carousel Kanan */}
      <div className="w-1/2 flex items-center justify-center bg-transparent">
        <ImageCarousel images={images} />
      </div>
    </section>
  );
}
