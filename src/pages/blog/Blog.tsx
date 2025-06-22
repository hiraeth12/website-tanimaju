import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "../../components/NavBar";
import Footer from "@/components/Footer";
import BlogSection from "@/pages/blog/BlogSection";
import { useLocation } from "react-router-dom";

const Blog = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlCategory = params.get("category");
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F5ECE0]">
        <section className=" text-slate-600 px-4">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-[#F5ECE0] text-slate-800 py-8 text-center font-title font-semibold min-h-[220px] flex flex-col justify-center">
              <h1 className="text-3xl font-bold">Artikel</h1>
              <div className="w-12 h-0.5 bg-[#3a4a3c] mx-auto mt-5"></div>
              <p className="mt-3 font-body text-base max-w-xl mx-auto">
                Artikel yang bisa anda baca
              </p>
            </div>

            <div className="flex justify-between items-center relative font-body font-semibold">
              <nav className="flex space-x-8">
                {["All Posts", "News", "Recipes"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`pb-2 transition-all duration-300 ${
                      selectedCategory === cat
                        ? "border-b-2 border-orange-400 text-slate-800 font-bold"
                        : "border-b-2 border-transparent text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>

              <div className="relative">
                {!showSearch ? (
                  <button
                    aria-label="Search"
                    className="text-slate-600"
                    onClick={() => setShowSearch(true)}
                  >
                    <Search size={20} />
                  </button>
                ) : (
                  <div
                    className={`
              flex items-center border-b border-slate-700 px-2 py-1 w-64
              transition-all duration-300 ease-in-out
              animate-fade-in
            `}
                  >
                    <Search className="text-slate-700 w-4 h-4 mr-2" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-transparent text-slate-700 placeholder-slate-700 focus:outline-none w-full"
                      autoFocus
                    />
                    <button
                      className="text-slate-700 ml-2"
                      onClick={() => {
                        setShowSearch(false);
                        setQuery("");
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section with fade transition */}
        <div className="max-w-6xl mx-auto px-4 fade">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + query} // trigger re-animation when these change
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BlogSection category={selectedCategory} searchQuery={query} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
