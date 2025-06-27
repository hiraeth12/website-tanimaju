import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/NavBar";
import Footer from "@/components/Footer";
import BlogSection from "@/pages/blog/BlogGrid";
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
      <div className="min-h-screen bg-[#F6F4EB]">
        <section className="text-slate-600 px-4">
          <div className="max-w-[54rem] lg:max-w-[68rem] w-full mx-auto px-4">
            <div className="bg-transparent text-slate-800 py-8 text-center font-title font-semibold min-h-[180px] flex flex-col justify-center">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 font-cascadia mt-7">
                <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  Artikel
                </span>{" "}
                
              </h2>
              <div className="w-12 h-0.5 bg-[#3a4a3c] mx-auto mt-3"></div>
              <p className="mt-3 font-body text-md max-w-xl mx-auto">
                Lorem ipsum dolor sit amet.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 font-body font-semibold mt-3">
              <nav className="flex flex-wrap justify-center sm:justify-start gap-4">
                {["All Posts", "News", "Recipes"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`pb-1 sm:pb-2 transition-all duration-300 ${
                      selectedCategory === cat
                        ? "border-b-2 border-emerald-600 text-slate-800 font-bold"
                        : "border-b-2 border-transparent text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>

              <div className="flex justify-center sm:justify-end">
                <AnimatePresence mode="wait">
                  {!showSearch ? (
                    <motion.button
                      aria-label="Search"
                      className="text-slate-600"
                      onClick={() => setShowSearch(true)}
                      key="icon"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Search size={20} />
                    </motion.button>
                  ) : (
                    <motion.div
                      key="input"
                      className="flex items-center border-b border-slate-700 px-2 py-1 w-full sm:w-64"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 fade">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + query}
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
