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
  content?: string;  // Changed from string[] to string
  tags?: string[];
  author: string;
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
    fetch(`${import.meta.env.VITE_API_URL}/posts`)
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
                        src={post.image?.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${post.image}` : post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/blog/blog-placeholder-1.jpg';
                        }}
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
                        {post.author}
                      </h3>
                      <p className="text-sm text-gray-600 font-body">
                        {post.date}
                      </p>
                    </div>

                    <div className="space-y-3 text-gray-700 mb-8 font-body text-sm sm:text-base text-justify">
                      {post.content ? (
                        // Split content by double line breaks for paragraphs, or treat as single paragraph
                        post.content.includes('\n\n') 
                          ? post.content.split('\n\n').map((para, idx) => (
                              <p key={idx}>{para.trim()}</p>
                            ))
                          : <p>{post.content}</p>
                      ) : (
                        <p>No content available.</p>
                      )}
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

              {!isLoaded && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="animate-pulse space-y-6"
                >
                  {/* Gambar Skeleton */}
                  <div className="w-full aspect-video bg-gray-300 rounded-lg" />

                  {/* Judul Skeleton */}
                  <div className="h-8 bg-gray-300 rounded w-2/3" />

                  {/* Kategori Skeleton */}
                  <div className="h-6 bg-gray-300 rounded w-1/4" />

                  {/* Admin dan tanggal */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/5" />
                    <div className="h-4 bg-gray-200 rounded w-1/6" />
                  </div>

                  {/* Konten skeleton */}
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>

                  {/* Tags Skeleton */}
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-300 rounded-full" />
                    <div className="h-6 w-20 bg-gray-300 rounded-full" />
                    <div className="h-6 w-12 bg-gray-300 rounded-full" />
                  </div>
                </motion.div>
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
