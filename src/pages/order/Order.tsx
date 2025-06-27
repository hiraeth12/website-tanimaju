import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/NavBar";
import ProductCard from "./ProductCard";
import Footer from "@/components/Footer";
import LoadMoreButton from "@/components/LoadButton";

// Definisikan tipe Product di sini atau impor dari file shared
interface Product {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  sku: string;
  description: string;
  info: string;
  whatsappNumber: string;
}

const PRODUCTS_PER_PAGE = 8; // Menampilkan 8 produk per halaman

const Order = () => {
  const [products, setProducts] = useState<Product[]>([]); // State untuk data dari JSON
  const [loading, setLoading] = useState(true); // State untuk loading
  const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_PAGE);

  // Fetch data dari product.json
  useEffect(() => {
    fetch("../src/data/product.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + PRODUCTS_PER_PAGE);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <motion.div
        className="flex flex-col min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <main className="flex-grow bg-[#F6F4EB]">
          {/* Header */}
          <div className="bg-[#F6F4EB] text-slate-800 py-16 text-center font-title font-semibold min-h-[220px] flex flex-col justify-center mb-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 font-cascadia">
              <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Order
              </span>{" "}
              Online !
            </h2>
            <div className="w-12 h-0.5 bg-[#3a4a3c] mx-auto mt-3"></div>
            <p className="mt-3 font-body text-md max-w-xl mx-auto">
              Fresh Produce Delivered Weekly
            </p>
          </div>

          <div className="bg-[#F6F4EB] py-8 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              {/* === Tampilan saat Loading atau Menampilkan Produk === */}
              {loading ? (
                // Skeleton Loader
                <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] lg:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="bg-gray-200 aspect-[4/5] rounded-lg animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                // Grid Produk
                <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] lg:grid-cols-4 gap-4 sm:gap-6">
                  {products.slice(0, visibleProducts).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: (index % PRODUCTS_PER_PAGE) * 0.05,
                      }}
                      layout
                    >
                      <ProductCard {...product} />
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Tombol Load More */}
              {!loading && visibleProducts < products.length && (
                <div className="text-center mt-8">
                  <LoadMoreButton onClick={handleLoadMore} />
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </motion.div>
    </>
  );
};

export default Order;