import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function BlogSection() {
  const posts = [
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
  ];

  return (
    <section className="py-16 bg-[#e8e0d4]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-[#3a4a3c] text-center mb-4">
          From Our Articles
        </h2>
        <div className="w-12 h-0.5 bg-[#3a4a3c] mx-auto mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-sm overflow-hidden shadow-sm"
            >
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover "
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-300 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Admin</p>
                    <p className="text-xs text-gray-500">
                      {post.date} · 1 min read
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-medium text-[#3a4a3c] mb-6 hover:underline hover:text-[#f47a4d] cursor-pointer">
                  <Link to="/blog/avocado-season-is-here">{post.title}</Link>
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">0</span>
                    </div>
                    <div className="flex items-center space-x-1"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link to="/blog">
            <button className="bg-[#f47a4d] hover:bg-[#e06a40] text-white px-8 py-3 rounded-sm transition-colors">
              See More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
