"use client";

import { useEffect, useState } from "react";

export default function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll);
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  return (
    // Hero Section
    <main>
      <div className="relative h-[70vh] w-full overflow-hidden">
        {/* Background layer - moves slower */}
        <div
          className="absolute inset-0 h-[135%] w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('images/about-placeholder-1.jpg')`,
            transform: `translateY(${scrollY * 0.2}px)`,
            top: "-10%",
          }}
        />

        {/* Overlay to darken the background */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content layer - fixed position relative to scroll */}
        <div className="relative flex h-full w-full flex-col items-center justify-center px-4 text-center">
          {/* <h1
          className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        >
          Discover Amazing Experiences
        </h1>
        <p
          className="mb-8 max-w-2xl text-lg text-white/90 sm:text-xl md:text-2xl"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        >
          Scroll down to explore our world of possibilities and find your next
          adventure
        </p> */}
          <div
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            style={{ transform: `translateY(${scrollY * -0.02}px)` }}
          ></div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </div>
      </div>
    </main>

    
  );
}
