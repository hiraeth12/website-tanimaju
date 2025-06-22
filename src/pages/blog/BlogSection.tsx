import { slugify } from "@/utils/slugify";
import BlogCard from "@/pages/blog/BlogCard";
import { blogPosts } from "./post";

interface BlogSectionProps {
  limit?: number;
  category?: string;
  searchQuery?: string;
}

export default function BlogSection({
  limit,
  category = "All Posts",
  searchQuery = "",
}: BlogSectionProps) {
  const postsWithSlug = blogPosts.map(post => ({
    ...post,
    slug: slugify(post.title),
  }));

  const filteredPosts = postsWithSlug.filter(post => {
    const matchesCategory = category === "All Posts" || post.category === category;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visiblePosts = limit ? filteredPosts.slice(0, limit) : filteredPosts;

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {visiblePosts.map(post => (
          <BlogCard
            key={post.slug}
            title={post.title}
            image={post.image}
            date={post.date}
            slug={post.slug}
          />
        ))}
        {visiblePosts.length === 0 && (
          <div className="text-center col-span-3 py-16">
            <p className="text-slate-600">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
