import { slugify } from "@/utils/slugify";
import BlogCard from "@/pages/blog/BlogCard";
import { blogPosts } from "./post";
import { useEffect, useState } from "react";

interface BlogSectionProps {
  limit?: number;
  category?: string;
  searchQuery?: string;
  isHome?: boolean; // ✅
}

export default function BlogSection({
  limit,
  category = "All Posts",
  searchQuery = "",
  isHome = false, // ✅ default false
}: BlogSectionProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const postsWithSlug = blogPosts.map((post) => ({
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

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {limitedPosts.map((post) => (
          <BlogCard
            key={post.slug}
            title={post.title}
            image={post.image}
            date={post.date}
            slug={post.slug}
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
