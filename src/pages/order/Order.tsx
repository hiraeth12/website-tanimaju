import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/NavBar";
import ProductCard from "./ProductCard";
import Footer from "@/components/Footer";
import LoadMoreButton from "@/components/LoadButton";

const Order = () => {
  const [showMore, setShowMore] = useState(false);

  const handleLoadMore = () => {
    setShowMore(true);
  };

  const products = [
    {
      title: "Padi",
      price: 6500,
      imageSrc: "/images/shop-placeholder-1.jpg",
      sku: "0001",
      description: "Padi berkualitas untuk hasil panen terbaik.",
    },
    {
      title: "Bawang Merah",
      price: 60000,
      imageSrc: "/images/shop-placeholder-2.jpg",
      sku: "0002",
      description: "A selection of seasonal fruits and vegetables.",
    },
    {
      title: "Jagung Manis",
      price: 17000,
      imageSrc: "/images/shop-placeholder-3.jpg",
      sku: "0003",
      description: "A selection of seasonal fruits and vegetables.",
    },
  ];

  const moreProducts = [
    {
      title: "Sawi",
      price: 7000,
      imageSrc: "/images/shop-placeholder-4.jpg",
      sku: "001",
      description: "A selection of seasonal fruits and vegetables.",
    },
    {
      title: "Kentang",
      price: 7000,
      imageSrc: "/images/shop-placeholder-5.jpg",
      sku: "001",
      description: "A selection of seasonal fruits and vegetables.",
    },
    {
      title: "Umbi Ungu",
      price: 7000,
      imageSrc: "/images/shop-placeholder-6.jpg",
      sku: "001",
      description: "A selection of seasonal fruits and vegetables.",
    },
  ];

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
          <div className="bg-gradient-to-b from-[#F6F4EB] to-[#e8e0d3] text-slate-800 py-16 text-center font-title font-semibold">
            <h1 className="text-3xl font-bold">Order Online</h1>
            <div className="w-12 h-0.5 bg-[#3a4a3c] mx-auto mt-5"></div>
            <p className="mt-3 font-body">Fresh Produce Delivered Weekly</p>
          </div>

          {/* Content */}
          <div className="bg-[#e8e0d3] py-8 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              {/* Top row - Baskets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <ProductCard {...product} ViewProduct={true} />
                  </motion.div>
                ))}
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
                    {moreProducts.map((product, index) => (
                      <ProductCard
                        key={index}
                        {...product}
                        ViewProduct={true}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Load More Button */}
              {!showMore && (
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
