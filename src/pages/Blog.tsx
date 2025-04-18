import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";

import Navbar from "../components/NavBar";
import Footer from "@/components/demo/Footer";
import BlogSection from "@/components/demo/BlogSection";

const Blog = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#e8e0d4]">
        <section className="bg-[#1e3329] text-white py-8 px-4">
          <div className="container mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-2">Our Blog</h1>
              <div className="w-12 h-0.5 bg-[#3a4a3c]"></div>
            </div>

            <div className="flex justify-between items-center relative">
              <nav className="flex space-x-8">
                <Link to="#" className="text-orange-400 hover:text-orange-300">
                  All Posts
                </Link>
                <Link to="#" className="text-white hover:text-gray-300">
                  News
                </Link>
                <Link to="#" className="text-white hover:text-gray-300">
                  Recipes
                </Link>
                <Link to="#" className="text-white hover:text-gray-300">
                  Events
                </Link>
              </nav>

              <div className="relative">
                {!showSearch ? (
                  <button
                    aria-label="Search"
                    className="text-white"
                    onClick={() => setShowSearch(true)}
                  >
                    <Search size={20} />
                  </button>
                ) : (
                  <div
                    className={`
              flex items-center border-b border-white px-2 py-1 w-64
              transition-all duration-300 ease-in-out
              animate-fade-in
            `}
                  >
                    <Search className="text-white w-4 h-4 mr-2" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-transparent text-white placeholder-white focus:outline-none w-full"
                      autoFocus
                    />
                    <button
                      className="text-white ml-2"
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

        {/* Blog Section */}
        <div className="fade">
          <BlogSection />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
