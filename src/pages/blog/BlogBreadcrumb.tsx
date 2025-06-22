import { Link, useParams } from "react-router-dom";

const BlogBreadcrumb = () => {
  const { slug } = useParams<{ slug: string }>();
  const formattedTitle = slug ? slug.replace(/-/g, " ") : "Loading...";

  return (
    <div className="flex justify-between items-center mt-10 mb-6 text-slate-700 font-semibold font-body">
      <div>
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/blog" className="hover:underline">
          Blog
        </Link>{" "}
        / <span className="capitalize">{formattedTitle}</span>
      </div>
    </div>
  );
};

export default BlogBreadcrumb;
