import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BlogBreadcrumb = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const formattedTitle = slug ? slug.replace(/-/g, " ") : "Loading...";

  return (
    <div className="flex justify-between items-center mt-10 mb-6 text-slate-700 font-body">
      {/* Breadcrumb Full (visible on sm and up) */}
      <div className="hidden sm:block">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/blog" className="hover:underline">
          Blog
        </Link>{" "}
        / <span className="capitalize">{formattedTitle}</span>
      </div>

      {/* Chevron Back (only visible on mobile) */}
      <button
        onClick={() => navigate(-1)}
        className="sm:hidden flex items-center text-sm text-[#5d534a] hover:text-[#3d3a35]"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        <span>Kembali</span>
      </button>
    </div>
  );
};

export default BlogBreadcrumb;
