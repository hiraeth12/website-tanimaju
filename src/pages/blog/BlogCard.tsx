import {  Forward } from "lucide-react";
import { Link } from "react-router-dom";
import { ShareDialog } from "./ShareDialog"; // Impor komponen baru

interface BlogCardProps {
  title: string;
  image: string;
  date: string;
  slug: string;
  author: string;
  authorImage?: string;
}

export default function BlogCard({
  title,
  image,
  date,
  slug,
  author,
  authorImage,
}: BlogCardProps) {

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm font-body transition-transform w-full max-w-[800px] flex flex-col">
      {/* Gambar */}
      <div className="aspect-[16/9] overflow-hidden items-center relative">
        <Link to={`/blog/${slug}`} className="block w-full h-full">
          <img
            src={`${import.meta.env.VITE_API_URL_IMAGE}${image}`}
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
                  src={`${import.meta.env.VITE_API_URL_IMAGE}${authorImage}`}
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-3" />
              )}
              <div>
                <p className="text-sm font-medium">{author}</p>
                <p className="text-xs text-gray-500">
                  {new Date(date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
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

              className="transition-all duration-300"
            >
              <span className="relative hover:bg-gradient-to-r from-cyan-500 to-emerald-600 hover:bg-clip-text hover:text-transparent text-base md:text-lg font-cascadia">
                {title}
              </span>
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
}
