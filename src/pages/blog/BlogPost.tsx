import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { slugify } from "@/utils/slugify";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BlogBreadcrumb from "@/pages/blog/BlogBreadcrumb";
import { AnimatePresence, motion } from "framer-motion";

interface Post {
  title: string;
  image: string;
  date: string;
  category?: string;
  content?: string[];
  tags?: string[];
  authorImage?: string;
  slug?: string;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsLoaded(false);
    fetch("/data/post.json")
      .then((res) => res.json())
      .then((posts: Post[]) => {
        const foundPost = posts
          .map((p) => ({ ...p, slug: slugify(p.title) }))
          .find((p) => p.slug === slug);
        setPost(foundPost ?? null);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setPost(null);
        setIsLoaded(true);
      });
  }, [slug]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-[#F7F7F7]">
        <div className="pt-10 md:pt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
            <BlogBreadcrumb />

            <AnimatePresence mode="wait">
              {isLoaded && post && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col md:flex-row gap-8"
                >
                  <div className="flex-1">
                    <div className="relative w-full mb-6 rounded-lg overflow-hidden aspect-video">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-cascadia">
                      {post.title}
                    </h1>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Link
                        to={`/blog?category=${encodeURIComponent(
                          post.category ?? ""
                        )}`}
                        className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white px-3 py-1 rounded-full text-sm transition font-body"
                      >
                        {post.category}
                      </Link>
                    </div>

                    <div className="mb-5">
                      <h3 className="font-semibold text-base sm:text-lg font-body">
                        Admin
                      </h3>
                      <p className="text-sm text-gray-600 font-body">
                        {post.date}
                      </p>
                    </div>

                    <div className="space-y-3 text-gray-700 mb-8 font-body text-sm sm:text-base text-justify">
                      {post.content?.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold mb-2 font-body">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {post.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="border border-slate-600 rounded-full px-3 py-1 text-sm transition-all duration-200 hover:border-slate-400 hover:bg-emerald-300 hover:text-slate-900 hover:font-semibold font-body"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {isLoaded && !post && (
                <motion.p
                  key="notfound"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-center text-slate-600 text-lg font-body py-16"
                >
                  Artikel tidak ditemukan.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
