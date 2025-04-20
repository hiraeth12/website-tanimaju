import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import BlogBreadcrumb from "@/pages/blog/BlogBreadcrumb";

const BlogPost: React.FC = () => {
  //const { slug } = useParams<{ slug: string }>();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Navigation */}
        <BlogBreadcrumb />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Article Content */}
          <div className="flex-1">
            {/* Hero Banner with 16:9 Ratio */}
            <div className="relative w-full mb-8 rounded-lg overflow-hidden bg-[#e6edc9] aspect-video">
              <img
                src="/images/placeholder-1.jpg"
                alt="Hero Image"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold mb-4">
              Aplikasi TaniMaju Dirilis
            </h1>

            {/* Categories */}
            <div className="flex gap-2 mb-6">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                Pertanian
              </span>
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                Teknologi & Inovasi
              </span>
            </div>

            {/* Author and Date */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg">Desa Sukamaju</h3>
              <p className="text-sm text-gray-600">16 Oct 2024</p>
            </div>

            {/* Article Content */}
            <div className="space-y-4 text-gray-700 mb-8">
              <p>
                Pada hari ini, Desa Sukamaju menyambut peluncuran aplikasi
                TaniMaju, sebuah inovasi digital yang diharapkan dapat
                merevolusi cara petani desa mencatat dan mengelola hasil panen
                mereka.
              </p>
              <p>
                Aplikasi ini dikembangkan oleh tim dari SEA Lab Universitas
                Telkom dan diharapkan bisa meningkatkan efisiensi dokumentasi
                pertanian dan membantu produktivitas.
              </p>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                <span className="border border-gray-300 rounded-full px-3 py-1 text-sm">
                  Pertanian
                </span>
                <span className="border border-gray-300 rounded-full px-3 py-1 text-sm">
                  Desa Sukamaju
                </span>
                <span className="border border-gray-300 rounded-full px-3 py-1 text-sm">
                  Website
                </span>
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
