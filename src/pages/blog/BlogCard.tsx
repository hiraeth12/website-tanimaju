import { useState } from "react";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  title: string;
  image: string;
  date: string;
  slug: string;
  authorImage?: string; // Optional prop for author's image
}

export default function BlogCard({ title, image, date, slug,authorImage }: BlogCardProps) {
  const [views, setViews] = useState(0);

  const handleTitleClick = () => {
    setViews((prev) => prev + 1);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm font-body transition-transform w-full max-w-[800px]">
      <div className="aspect-square md:h-[230px] md:w-[340px] h-[230px] w-[400px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4">
          {authorImage ? (
            <img
              src={authorImage}
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 mr-3" />
          )}
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>

        <h3 className="text-xl font-medium text-slate-800 mb-6 cursor-pointer">
          <Link
            to={`/blog/${slug}`}
            onClick={handleTitleClick}
            className="transition-all duration-300"
          >
            <span className="relative">
              <span className="hover:bg-gradient-to-r from-cyan-500 to-emerald-600 hover:bg-clip-text hover:text-transparent text-md md:text-md">
                {title}
              </span>
            </span>
          </Link>
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
