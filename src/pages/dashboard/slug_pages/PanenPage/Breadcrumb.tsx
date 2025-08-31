import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  to?: string; // kalau ada → link, kalau tidak → text biasa
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="px-6 mt-2 mb-4 ml-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.to ? (
              <Link
                to={item.to}
                className="hover:underline hover:text-gray-800 transition"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-gray-800">{item.label}</span>
            )}

            {index < items.length - 1 && (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
