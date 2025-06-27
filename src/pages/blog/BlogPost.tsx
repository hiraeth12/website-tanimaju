import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { slugify } from "@/utils/slugify";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BlogBreadcrumb from "@/pages/blog/BlogBreadcrumb";

// Definisikan tipe Post di sini agar konsisten
interface Post {
  title: string;
  image: string;
  date: string;
  category?: string;
  content?: string[];
  tags?: string[];
  authorImage?: string;
  slug?: string; // Tambahkan slug ke tipe data
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch data dari post.json dan cari artikel yang cocok
  useEffect(() => {
    setLoading(true);
    fetch("../src/data/post.json")
      .then((res) => res.json())
      .then((posts: Post[]) => {
        const foundPost = posts
          .map((p) => ({ ...p, slug: slugify(p.title) }))
          .find((p) => p.slug === slug);
        setPost(foundPost || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setLoading(false);
      });
  }, [slug]); // Jalankan ulang efek jika slug berubah

  // Tampilan saat Loading
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-[#F7F7F7] pt-24">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <p className="text-center text-slate-600">Loading article...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Tampilan jika artikel tidak ditemukan
  if (!post) {
    return (
      <>
        <Navbar />
        <div className="bg-[#F7F7F7] pt-24">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <p className="text-center text-slate-600">
              Artikel tidak ditemukan.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#F7F7F7] pt-10 md:pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <BlogBreadcrumb />
          <div className="flex flex-col md:flex-row gap-8">
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
                <p className="text-sm text-gray-600 font-body">{post.date}</p>
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
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPost;