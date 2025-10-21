import { useEffect } from "react";
import { imagePreloader } from "@/utils/imagePreloader";

/**
 * Hook to preload critical app images on startup
 * This improves initial page load performance by caching images
 */
export const useAppPreload = () => {
  useEffect(() => {
    // List of critical images to preload on app startup
    const criticalImages = [
      // Home page images
      "/images/home/placeholder-1.jpg",
      "/images/home/placeholder-2.jpg",
      "/images/home/placeholder-3.jpg",
      "/images/home/placeholder-4.jpg",
      "/images/home/placeholder-hero.png",
      
      // About page images
      "/images/about/about-placeholder-2.png",
      
      // Logo and common assets
      "/shit-logo.png",
      "/vite.svg",
    ];

    // Preload images in the background
    imagePreloader
      .preloadImages(criticalImages)
      .then(() => {
        console.log("App images preloaded successfully");
      })
      .catch((error) => {
        console.error("Error preloading app images:", error);
      });
  }, []);
};
