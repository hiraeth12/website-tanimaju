import { useState } from "react";
import { Eye, Forward } from "lucide-react";
import { Link } from "react-router-dom";
import { ShareDialog } from "./ShareDialog"; // Impor komponen baru

interface BlogCardProps {
  title: string;
  image: string;
  date: string;
  slug: string;
  authorImage?: string;
}

export default function BlogCard({
  title,
  image,
  date,
  slug,
  authorImage,
}: BlogCardProps) {
  const [views, setViews] = useState(0);

  const handleTitleClick = () => {
    setViews((prev) => prev + 1);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm font-body transition-transform w-full max-w-[800px] flex flex-col">
      {/* Gambar */}
      <div className="aspect-[16/9] overflow-hidden items-center relative">
        <Link to={`/blog/${slug}`} className="block w-full h-full">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>

      {/* Konten */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-4">
            {/* Info Penulis */}
            <div className="flex items-center">
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

            <ShareDialog slug={slug}>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors -mr-2"
                aria-label="Share Options"
              >
                <Forward className="w-4 h-4 text-gray-500" />
              </button>
            </ShareDialog>
          </div>

          {/* Judul */}
          <h3 className="text-xl font-medium text-slate-800 mb-6 cursor-pointer">
            <Link
              to={`/blog/${slug}`}
              onClick={handleTitleClick}
              className="transition-all duration-300"
            >
              <span className="relative hover:bg-gradient-to-r from-cyan-500 to-emerald-600 hover:bg-clip-text hover:text-transparent text-base md:text-lg font-cascadia">
                {title}
              </span>
            </Link>
          </h3>
        </div>

        {/* View Count */}
        <div className="mt-auto flex items-center space-x-1">
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{views}</span>
        </div>
      </div>
    </div>
  );
}