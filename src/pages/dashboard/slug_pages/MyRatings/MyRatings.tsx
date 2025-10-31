// src/pages/dashboard/slug_pages/MyRatings/MyRatings.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, ExternalLink, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { generateSlug, formatPrice } from "@/lib/utils";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { ActionButtons } from "@/components/ActionButton";

interface UserRating {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string;
  productPrice: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function MyRatings() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) {
      fetchUserRatings();
    }
  }, [user]);

  const fetchUserRatings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/user-ratings/${user?.id}`);
      const data = await response.json();

      if (data.success) {
        setRatings(data.ratings);
      } else {
        setError("Gagal memuat data rating");
      }
    } catch (err) {
      console.error("Error fetching user ratings:", err);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Rating Saya</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mb-6">
        <ActionButtons
          onRefresh={fetchUserRatings}
          loading={loading}
          actions={[
            {
              label: "Lihat Produk",
              to: "/order",
              className: "bg-emerald-600 hover:bg-emerald-700 text-white",
            },
          ]}
        />
      </div>

      {/* Statistics Cards */}
      {ratings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Rating</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">
                  {ratings.length}
                </p>
              </div>
              <div className="bg-blue-200 p-3 rounded-full">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">
                  Rata-rata Rating
                </p>
                <p className="text-3xl font-bold text-yellow-900 mt-1">
                  {calculateAverageRating()}
                </p>
              </div>
              <div className="bg-yellow-200 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Rating Terakhir
                </p>
                <p className="text-sm font-medium text-green-900 mt-1">
                  {formatDate(ratings[0].updatedAt)}
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ratings Grid */}
      {ratings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Belum Ada Rating
          </h3>
          <p className="text-gray-500 mb-6">
            Anda belum memberikan rating untuk produk apapun
          </p>
          <Link
            to="/order"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Lihat Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ratings.map((rating) => (
            <div
              key={rating.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={`${import.meta.env.VITE_API_URL_IMAGE}${rating.productImage}`}
                  alt={rating.productTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/product-placeholder-5.jpg";
                  }}
                />
                <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full shadow-md">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-900">
                      {rating.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                  {rating.productTitle}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-emerald-600">
                    {formatPrice(rating.productPrice)}
                  </span>
                  {renderStars(rating.rating)}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar className="w-3 h-3" />
                  <span>Dinilai: {formatDate(rating.updatedAt)}</span>
                </div>

                {/* Action Button */}
                <Link
                  to={`/order/${generateSlug(rating.productTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Lihat Produk
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
