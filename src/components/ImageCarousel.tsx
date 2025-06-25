import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface ImageCarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // auto ganti setiap 10 detik

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full max-w-4xl">
      {/* Logo in top left */}
      <div className="absolute -left-4 -top-4 z-10 h-32 w-32">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <circle cx="100" cy="100" r="99" stroke="#E9A77C" strokeWidth="2" />
          <circle cx="100" cy="40" r="10" fill="#E9A77C" />
          <path
            d="M100 40L160 100M100 40L40 100"
            stroke="#E9A77C"
            strokeWidth="2"
          />
          <path
            d="M40 100C40 100 60 130 100 130C140 130 160 100 160 100"
            stroke="#E9A77C"
            strokeWidth="2"
          />
          <path
            d="M70 80C70 80 80 100 100 100C120 100 130 80 130 80"
            stroke="#E9A77C"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M60 90C60 90 65 70 75 70C85 70 85 90 85 90"
            stroke="#E9A77C"
            strokeWidth="2"
          />
          <path
            d="M160 100C160 100 170 120 160 140"
            stroke="#E9A77C"
            strokeWidth="2"
          />
          <path
            d="M40 100C40 100 30 120 40 140"
            stroke="#E9A77C"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Main carousel container */}
      <div className="relative h-60 sm:h-80 md:h-[500px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-white">
        {/* Left Arrow */}
        <div className="absolute left-2 sm:left-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-white">
          <ChevronLeft
            onClick={goToPrevious}
            className="w-6 h-6 sm:w-9 sm:h-9 drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]"
          />
        </div>

        {/* Right Arrow */}
        <div className="absolute right-2 sm:right-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-white">
          <ChevronRight
            onClick={goToNext}
            className="w-6 h-6 sm:w-9 sm:h-9 drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]"
          />
        </div>

        {/* Image slider */}
        <div className="relative h-full w-full overflow-hidden">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 z-10 flex justify-center space-x-1 sm:space-x-2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full cursor-pointer transition-all duration-300 ${
              slideIndex === currentIndex
                ? "bg-white scale-75 opacity-100"
                : "bg-white/50 scale-50 opacity-70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
