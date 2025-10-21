// Image Preloader Utility
// This utility preloads images and caches them for improved performance

class ImagePreloader {
  private cache: Map<string, HTMLImageElement> = new Map();
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();

  /**
   * Preload a single image
   */
  preloadImage(src: string): Promise<HTMLImageElement> {
    // Return cached image if available
    if (this.cache.has(src)) {
      return Promise.resolve(this.cache.get(src)!);
    }

    // Return existing loading promise if image is currently being loaded
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    // Create new loading promise
    const loadingPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        this.loadingPromises.delete(src);
        resolve(img);
      };

      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });

    this.loadingPromises.set(src, loadingPromise);
    return loadingPromise;
  }

  /**
   * Preload multiple images
   */
  preloadImages(sources: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(sources.map((src) => this.preloadImage(src)));
  }

  /**
   * Check if an image is cached
   */
  isCached(src: string): boolean {
    return this.cache.has(src);
  }

  /**
   * Get cached image
   */
  getCachedImage(src: string): HTMLImageElement | undefined {
    return this.cache.get(src);
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

// Create a singleton instance
export const imagePreloader = new ImagePreloader();

// Export hook for React components
export const useImagePreloader = () => {
  return imagePreloader;
};
