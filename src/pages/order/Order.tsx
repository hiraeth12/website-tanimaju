import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/NavBar";
import { ProductCard } from "@/pages/order/ProductCard";
import Footer from "@/components/Footer";

const Order = () => {
  const [showMore, setShowMore] = useState(false);

  const handleLoadMore = () => {
    setShowMore(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      {/* ✅ Fade in wrapper */}
      <motion.div
        className="flex flex-col min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} // optional, for exit transition
        transition={{ duration: 0.3 }}
      >
        <main className="flex-grow">
          {/* Header */}
          <div className="bg-[#2d4134] text-white py-16 text-center">
            <h1 className="text-3xl font-bold">Order Online</h1>
            <div className="w-12 h-0.5 bg-[#3a4a3c] mx-auto mt-5"></div>
            <p className="mt-3">Fresh Produce Delivered Weekly</p>
          </div>

          {/* Content */}
          <div className="bg-[#e8e0d3] py-8 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              {/* Top row - Baskets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <ProductCard
                    title="Classic Basket"
                    price={15.0}
                    imageSrc="/images/product-placeholder-1.jpg"
                    ViewProduct={true}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <ProductCard
                    title="Mixed Basket"
                    price={25.0}
                    imageSrc="/images/product-placeholder-2.jpg"
                    ViewProduct={true}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <ProductCard
                    title="Wholesome Family Basket"
                    price={45.0}
                    imageSrc="/images/product-placeholder-3.jpg"
                    ViewProduct={true}
                  />
                </motion.div>
              </div>

              {/* Bottom row - Individual products */}
              <AnimatePresence>
                {showMore && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <ProductCard
                      title="I'm a product"
                      price={2.0}
                      imageSrc="/images/product-placeholder-4.jpg"
                      ViewProduct={true}
                    />
                    <ProductCard
                      title="I'm a product"
                      price={2.0}
                      imageSrc="/images/product-placeholder-5.jpg"
                      ViewProduct={true}
                    />
                    <ProductCard
                      title="I'm a product"
                      price={2.0}
                      imageSrc="/images/product-placeholder-6.jpg"
                      ViewProduct={true}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Load More Button */}
              {!showMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-3 border border-[#2d4134] text-[#2d4134] hover:bg-[#2d4134] hover:text-white transition-colors rounded"
                  >
                    Load More
                  </button>
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
