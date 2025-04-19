import BlogCard from "@/pages/blog/BlogCard";

interface BlogSectionProps {
  limit?: number;
}

export default function BlogSection({ limit }: BlogSectionProps) {
  const rawPosts = [
    {
      title: "Avocado Season is Here",
      image: "../images/blog-placeholder-1.jpg",
      date: "Nov 13, 2024",
    },
    {
      title: "Tips For Your Herb Garden",
      image: "../images/blog-placeholder-2.jpg",
      date: "Nov 13, 2024",
    },
    {
      title: "Creamy Pumpkin Soup",
      image: "../images/blog-placeholder-3.jpg",
      date: "Nov 13, 2024",
    },
    {
      title: "Creamy Pumpkin Soup",
      image: "../images/blog-placeholder-3.jpg",
      date: "Nov 13, 2024",
    },
    {
      title: "Creamy Pumpkin Soup",
      image: "../images/blog-placeholder-3.jpg",
      date: "Nov 13, 2024",
    },
    {
      title: "Creamy Pumpkin Soup",
      image: "../images/blog-placeholder-3.jpg",
      date: "Nov 13, 2024",
    },
  ];

  const posts = rawPosts.map((post) => ({
    ...post,
    slug: post.title.toLowerCase().replace(/\s+/g, "-"),
  }));

  const visiblePosts = limit ? posts.slice(0, limit) : posts;

  return (
    <section className="py-16 bg-[#e8e0d4]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visiblePosts.map((post, index) => (
            <BlogCard
              key={index}
              title={post.title}
              image={post.image}
              date={post.date}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
