import { useEffect, useState } from "react";
import { slugify } from "@/utils/slugify";
import BlogCard from "@/pages/blog/BlogCard";

// Definisikan tipe Post di sini agar komponen mandiri
interface Post {
  title: string;
  image: string;
  date: string;
  category?: string;
  authorImage?: string;
  slug?: string;
}

interface BlogSectionProps {
  limit?: number;
  category?: string;
  searchQuery?: string;
  isHome?: boolean;
}

export default function BlogSection({
  limit,
  category = "All Posts",
  searchQuery = "",
  isHome = false,
}: BlogSectionProps) {
  const [posts, setPosts] = useState<Post[]>([]); // State untuk data dari JSON
  const [loading, setLoading] = useState(true); // State untuk loading
  const [isMobile, setIsMobile] = useState(false);

  // Fetch data dari post.json
  useEffect(() => {
    fetch("../src/data/post.json")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog posts:", error);
        setLoading(false);
      });
  }, []);

  // Cek ukuran layar
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

  // Tampilan saat loading
  if (loading) {
    return (
      <section className="py-8 text-center">
        <p className="text-slate-600">Loading articles...</p>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {limitedPosts.map((post) => (
          <BlogCard
            key={post.slug}
            title={post.title}
            image={post.image}
            date={post.date}
            slug={post.slug ?? ""}
            authorImage={post.authorImage}
          />
        ))}
        {!loading && limitedPosts.length === 0 && (
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