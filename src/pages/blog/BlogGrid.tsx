import { useEffect, useState } from "react";
import { slugify } from "@/utils/slugify";
import BlogCard from "@/pages/blog/BlogCard";

interface Post {
  title: string;
  image: string;
  date: string;
  category?: string;
  content?: string[];
  tags?: string[];
  authorImage?: string;
  author: string;
  slug?: string;
}

interface BlogGridProps {
  limit?: number;
  category?: string;
  searchQuery?: string;
  isHome?: boolean;
}

export default function BlogGrid({
  limit,
  category = "All Posts",
  searchQuery = "",
  isHome = false,
}: BlogGridProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setIsLoaded(false);
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setPosts(data);
          setIsLoaded(true);
        }, 500);
      })
      .catch((error) => {
        console.error("Error fetching blog posts:", error);
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const postsWithSlug = posts.map((post) => ({
    ...post,
    slug: slugify(post.title),
  }));

  const filteredPosts = postsWithSlug
    .filter((post) => {
      const matchesCategory =
        category === "All Posts" || post.category === category;
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const limitedPosts =
    isHome && isMobile
      ? filteredPosts.slice(0, 1)
      : limit
      ? filteredPosts.slice(0, limit)
      : filteredPosts;

  const skeletonCount = isHome && isMobile ? 1 : limit || 3;

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 min-h-[300px]">
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {!isLoaded ? (
          Array.from({ length: skeletonCount }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-sm font-body w-full max-w-[800px] flex flex-col animate-pulse"
            >
              {/* Gambar */}
              <div className="aspect-[16/9] bg-gray-300" />

              {/* Konten */}
              <div className="p-6 space-y-4 flex flex-col flex-grow">
                {/* Penulis */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    <div className="space-y-1">
                      <div className="w-20 h-4 bg-gray-300 rounded" />
                      <div className="w-16 h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                </div>

                {/* Judul */}
                <div className="space-y-2">
                  <div className="w-3/4 h-5 bg-gray-300 rounded" />
                  <div className="w-2/5 h-4 bg-gray-200 rounded" />
                </div>

                {/* View */}
                <div className="mt-auto flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-300" />
                  <div className="w-12 h-4 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))
        ) : limitedPosts.length > 0 ? (
          limitedPosts.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              image={post.image}
              date={post.date}
              slug={post.slug as string}
              author={post.author}
              authorImage={post.authorImage}
            />
          ))
        ) : (
          <div className="text-center col-span-full py-16">
            <p className="text-slate-600">
              No articles found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
