import { useEffect, useState } from "react";
import { slugify } from "@/utils/slugify";
import BlogCard from "@/pages/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton"; // ⬅️ Impor komponen Skeleton

// Definisikan tipe Post di sini atau impor dari file terpisah
interface Post {
  title: string;
  image: string;
  date: string;
  category?: string;
  content?: string[];
  tags?: string[];
  authorImage?: string;
  slug?: string; // Slug ditambahkan saat pemrosesan
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
  const [loading, setLoading] = useState(true);

  // Fetch data dari post.json
  useEffect(() => {
    setLoading(true);
    fetch("/data/post.json")
      .then((res) => res.json())
      .then((data) => {
        // Simulasi loading yang lebih lama untuk melihat skeleton
        setTimeout(() => {
          setPosts(data);
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.error("Error fetching blog posts:", error);
        setLoading(false);
      });
  }, []);

  // Cek ukuran layar untuk tampilan mobile di home
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Proses data setelah di-fetch
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

  // === TAMPILAN SKELETON SAAT LOADING ===
  if (loading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-full max-w-sm p-4 rounded-lg shadow bg-white"
            >
              <Skeleton className="w-full h-48 rounded-md mb-4" />
              <Skeleton className="w-3/4 h-4 mb-2" />
              <Skeleton className="w-1/2 h-4 mb-4" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-24 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {limitedPosts.map((post) => (
          <BlogCard
            key={post.slug}
            title={post.title}
            image={post.image}
            date={post.date}
            slug={post.slug}
            authorImage={post.authorImage}
          />
        ))}
        {limitedPosts.length === 0 && (
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
