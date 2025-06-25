import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/NavBar";
import ProductCard from "./ProductCard";
import Footer from "@/components/Footer";
import LoadMoreButton from "@/components/LoadButton";
import { products } from "./ProductData";

const PRODUCTS_PER_PAGE = 4;

const Order = () => {
  const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_PAGE);

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
        <main className="flex-grow">
          {/* Header (Tidak ada perubahan) */}
          <div className="bg-[#F6F4EB] text-slate-800 py-16 text-center font-title font-semibold min-h-[220px] flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 font-cascadia">Order Online</h1>
            <div className="w-12 h-0.5 bg-[#3a4a3c] mx-auto mt-5"></div>
            <p className="mt-3 font-body text-base max-w-xl mx-auto">
              Fresh Produce Delivered Weekly
            </p>
          </div>

          <div className="bg-[#F6F4EB] py-8 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] lg:grid-cols-4 gap-4 sm:gap-6">
                {products.slice(0, visibleProducts).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: (index % PRODUCTS_PER_PAGE) * 0.1,
                    }}
                    layout
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </div>
              {visibleProducts < products.length && (
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
