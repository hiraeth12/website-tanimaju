import { slugify } from "@/utils/slugify";
import { blogPosts } from "@/pages/blog/post";
import { useParams } from "react-router-dom";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BlogBreadcrumb from "@/pages/blog/BlogBreadcrumb";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const post = blogPosts
    .map((p) => ({ ...p, slug: slugify(p.title) }))
    .find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="text-center text-slate-600">Artikel tidak ditemukan.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <BlogBreadcrumb />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="relative w-full mb-8 rounded-lg overflow-hidden bg-[#e6edc9] aspect-video">
              <img
                src={post.image}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4 font-cascadia">
              {post.title}
            </h1>
            <div className="flex gap-2 mb-6">
              <Link
                to={`/blog?category=${encodeURIComponent(post.category ?? "")}`}
                className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm hover:bg-amber-200 transition font-body"
              >
                {post.category}
              </Link>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg font-body">Admin</h3>
              <p className="text-sm text-gray-600 font-body">{post.date}</p>
            </div>
            <div className="space-y-4 text-gray-700 mb-8 font-body">
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
                    className="border border-gray-300 rounded-full px-3 py-1 text-sm 
                 transition-all duration-200
                 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPost;
