import { useState } from "react";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  title: string;
  image: string;
  date: string;
  slug: string;
}

export default function BlogCard({ title, image, date, slug }: BlogCardProps) {
  const [views, setViews] = useState(0);

  const handleTitleClick = () => {
    setViews((prev) => prev + 1);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm font-body transition-transform">
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 mr-3" />
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>
        <h3 className="text-xl font-medium text-[#3a4a3c] mb-6 hover:underline hover:text-[#00A9FF] cursor-pointer">
          <Link to={`/blog/${slug}`} onClick={handleTitleClick}>
            {title}
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
