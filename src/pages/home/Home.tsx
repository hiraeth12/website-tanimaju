import { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";
import ProductShowcase from "./ProductShowcase";
import BlogSection from "@/pages/blog/BlogSection";
import Footer from "@/components/Footer";
import CoolButton from "@/components/ShopButton";
import LoadMoreButton from "@/components/LoadButton";

const images = [
  "/images/home/placeholder-1.jpg",
  "/images/home/placeholder-2.jpg",
  "/images/home/placeholder-3.jpg",
  "/images/home/placeholder-4.jpg",
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const textInView = useInView();
  const imageInView = useInView();

  return (
    <>
      <Navbar />

      <section className="relative w-full h-[calc(100vh-80px)] overflow-hidden opacity-95">
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        {/* Image Wrapper */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={images[currentIndex]}
              src={images[currentIndex]}
              alt="Hero Background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover absolute inset-0"
            />
          </AnimatePresence>
        </div>

        {/* Overlay Konten */}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4 z-10 font-title">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white text-5xl md:text-7xl font-bold mb-4"
          >
            Fresh Produce
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white text-3xl md:text-7xl font-bold mb-8"
          >
            Delivery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white text-xl md:text-2xl mb-8"
          >
            From Our Farm to Your Doorstep
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex justify-center items-center space-x-4">
              <CoolButton to="/order" />
            </div>
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full bg-white transition-all duration-300 cursor-pointer ${
                currentIndex === index ? "opacity-100 scale-110" : "opacity-50"
              } hover:scale-125 transition-transform`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </section>

      {/* Konten Lain */}
      <section className="bg-[#F6F4EB] py-20 px-4 md:px-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 opacity-30">
          <svg
            width="400"
            height="400"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#E8E0D3"
              d="M49.5,-55.8C62.8,-42.6,71.4,-21.3,74.5,1.7C77.6,24.7,75.2,49.3,61.2,63.9C47.2,78.5,21.6,83.1,-4.2,85.2C-30,87.2,-60,86.7,-71,72.4C-81.9,58.1,-73.8,29.1,-67.2,7.7C-60.7,-13.7,-55.7,-27.4,-46.2,-41.4C-36.7,-55.4,-22.7,-69.8,-5.5,-73.1C11.8,-76.4,23.5,-69,49.5,-55.8Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between md:gap-32 gap-24">
          <div
            ref={textInView.ref}
            className={`md:w-1/2 text-left fade-in-left z-10 ${
              textInView.isVisible ? "fade-in-show" : ""
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 font-title">
              <span className="text-cyan-600">Tentang</span> Kami
            </h2>
            <div className="w-14 h-0.5 bg-[#2A4D3E] mb-6" />
            <p className="text-slate-700 text-base md:text-lg mb-8 leading-relaxed text-justify font-body">
              Website manajemen hasil panen yang dirancang untuk mendukung para
              petani di Desa Sukamaju, Bandung, Jawa Barat sebagai solusi
              lengkap dalam mengelola data pertanian dengan lebih efisien dan
              akurat.
            </p>
            <LoadMoreButton to="/about" />
          </div>

          {/* Gambar */}
          <div
            ref={imageInView.ref}
            className={`md:w-1/2 fade-in-right z-10 ${
              imageInView.isVisible ? "fade-in-show" : ""
            }`}
          >
            <img
              src="../images/home/placeholder-hero.png"
              alt="Farm Illustration"
              className="w-full h-auto object-contain rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>
      {/* Another Section */}
      <ProductShowcase />
      {/* Carousel Section */}
      {/* Blog Section */}
      <section className="py-16 bg-[#F5ECE0]">
        <h2 className="text-3xl font-semibold text-slate-800 text-center mb-4 font-title">
          Artikel
        </h2>
        <div className="w-12 h-0.5 bg-[#3a4a3c] mx-auto mb-4"></div>
        <BlogSection isHome limit={3} />
        <div className="flex justify-center">
          <LoadMoreButton to="/blog" />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;
