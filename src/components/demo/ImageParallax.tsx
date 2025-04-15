import { useRef } from "react";
import ImageCarousel from "@/components/ImageCarousel";

export default function ParallaxImageSection() {
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
      className="relative w-full h-[70vh] flex overflow-hidden"
    >
      {/* Gambar Kiri */}
      <div className="w-1/2 flex items-center justify-center bg-[#2a4d3e]">
        <img
          src="/images/parallax-placeholder-1.jpg"
          alt="Left"
          className="h-[34vh] w-auto object-cover"
        />
      </div>

      {/* Carousel di Kanan */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <ImageCarousel images={images} />
      </div>
    </section>
  );
}
