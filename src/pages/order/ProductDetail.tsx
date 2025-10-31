// File: src/pages/order/ProductDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Forward, Star } from "lucide-react";

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProductInfo from "@/pages/order/ProductInfo";
import ReturnPolicy from "@/pages/order/ReturnPolicy";
import ShippingInfo from "@/pages/order/ShippingInfo";
import { ShareDialog } from "@/pages/order/ShareDialog";
import { generateSlug, formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// Definisikan tipe Product di sini
interface Product {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  sku: string;
  description: string;
  info: string;
  whatsappNumber: string;
  average_rating?: number;
  total_ratings?: number;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingMessage, setRatingMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch data dari product.json
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        const foundProduct = data.find((p) => generateSlug(p.title) === slug);
        setProduct(foundProduct || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  }, [slug]);

  // Set judul halaman
  useEffect(() => {
    if (product) {
      document.title = `${product.title} - TaniMaju`;
    } else if (!loading) {
      document.title = "Produk Tidak Ditemukan - TaniMaju";
    }
  }, [product, loading]);

  // Fetch user's existing rating for this product
  useEffect(() => {
    if (product && isAuthenticated && user) {
      fetch(`${API_URL}/products/${product.id}/rating/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.hasRated) {
            setUserRating(data.rating);
          }
        })
        .catch((error) => {
          console.error("Error fetching user rating:", error);
        });
    } else if (!isAuthenticated) {
      setUserRating(0);
    }
  }, [product, API_URL, isAuthenticated, user]);

  // Handle rating submission
  const handleRatingClick = async (rating: number) => {
    if (!product || isSubmittingRating) return;

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      setRatingMessage({
        type: "error",
        text: "Anda harus login terlebih dahulu untuk memberikan rating.",
      });
      setTimeout(() => setRatingMessage(null), 5000);
      return;
    }

    setIsSubmittingRating(true);
    setRatingMessage(null);

    try {
      const res = await fetch(`${API_URL}/products/${product.id}/rating`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          rating,
          userIdentifier: user.id.toString()
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal memberikan rating");
      }

      const data = await res.json();

      // Update local product state with new average
      setProduct({ 
        ...product, 
        average_rating: data.averageRating,
        total_ratings: data.totalRatings
      });

      // Update user's rating
      setUserRating(rating);

      // Show success message
      setRatingMessage({
        type: "success",
        text: `Terima kasih! Rating Anda: ${rating} ⭐ | Rata-rata: ${data.averageRating.toFixed(1)} (${data.totalRatings} rating)`,
      });

      // Hide message after 5 seconds
      setTimeout(() => setRatingMessage(null), 5000);
    } catch (error: any) {
      setRatingMessage({
        type: "error",
        text: error.message || "Gagal memberikan rating. Silakan coba lagi.",
      });

      // Hide error message after 5 seconds
      setTimeout(() => setRatingMessage(null), 5000);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const currentIndex = product
    ? products.findIndex((p) => p.id === product.id)
    : -1;
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct =
    currentIndex !== -1 && currentIndex < products.length - 1
      ? products[currentIndex + 1]
      : null;

  // Tampilan Skeleton saat loading
  if (loading) {
    return (
      <div className="bg-[#f5efe7]">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="mt-6 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle jika produk tidak ditemukan
  if (!product) {
    return (
      <div className="bg-[#f5efe7] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#5d534a]">404</h1>
          <p className="text-xl text-[#8b7e6d]">Produk tidak ditemukan.</p>
          <Link
            to="/order"
            className="text-cyan-600 hover:underline mt-4 inline-block"
          >
            Kembali ke Halaman Order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5efe7]">
      <Navbar />
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8 max-w-6xl font-body">
          {/* Navigasi Responsif */}
          {/* Navigasi Responsif */}
          <div className="mb-6 text-sm flex justify-between items-center text-slate-700">
            {/* Breadcrumb tampil di md+ */}{" "}
            <div className="hidden md:block">
              {" "}
              <Link to="/" className="hover:underline">
                Home
              </Link>{" "}
              /{" "}
              <Link to="/order" className="hover:underline">
                {" "}
                All Products
              </Link>{" "}
              / <span> {product.title}</span>{" "}
            </div>
            {/* Tombol kembali di sm (mobile only) */}{" "}
            <div className="md:hidden">
              {" "}
              <Link
                to="/order"
                className="flex items-center text-[#8b7e6d] hover:text-[#6d6358]"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> <span>Kembali</span>{" "}
              </Link>{" "}
            </div>
            {/* Prev / Next tetap tampil di semua layar */}{" "}
            <div className="flex items-center gap-2 text-[#8b7e6d]">
              {" "}
              {prevProduct ? (
                <Link
                  to={`/order/${generateSlug(prevProduct.title)}`}
                  className="flex items-center hover:text-[#6d6358]"
                >
                  <ChevronLeft className="h-4 w-4" /> <span>Prev</span>{" "}
                </Link>
              ) : (
                <span className="text-gray-400/50 cursor-not-allowed flex items-center">
                  <ChevronLeft className="h-4 w-4" /> Prev{" "}
                </span>
              )}
              {" | "}{" "}
              {nextProduct ? (
                <Link
                  to={`/order/${generateSlug(nextProduct.title)}`}
                  className="flex items-center hover:text-[#6d6358]"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />{" "}
                </Link>
              ) : (
                <span className="text-gray-400/50 cursor-not-allowed flex items-center">
                  Next <ChevronRight className="h-4 w-4" />{" "}
                </span>
              )}{" "}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Kolom kiri: Gambar + Deskripsi */}
            <div>
              <img
                src={`${import.meta.env.VITE_API_URL_IMAGE}${product.imageSrc}`}
                alt={product.title}
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.currentTarget.src = "/images/product-placeholder-5.jpg";
                }}
              />
              <div className="mt-6 text-black">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Kolom kanan: Detail produk */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-1">
                <h1 className="text-3xl font-medium text-black font-cascadia flex-1">
                  {product.title}
                </h1>
                <ShareDialog slug={slug || ""} productTitle={product.title}>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                    aria-label="Share Product"
                  >
                    <Forward className="w-5 h-5 text-gray-500" />
                  </button>
                </ShareDialog>
              </div>
              
              {/* Interactive Rating Section */}
              <div className="mb-6">
                <div className="flex flex-col gap-3">
                  {/* Average Rating Display */}
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600 font-medium">Rating Produk:</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => {
                          const rating = product.average_rating || 0;
                          const fullStars = Math.floor(rating);
                          const hasHalfStar = rating % 1 >= 0.5;
                          
                          if (index < fullStars) {
                            return <Star key={index} className="w-5 h-5 fill-yellow-400 text-yellow-400" />;
                          } else if (index === fullStars && hasHalfStar) {
                            return (
                              <div key={index} className="relative w-5 h-5">
                                <Star className="w-5 h-5 text-gray-300 absolute" />
                                <div className="overflow-hidden absolute w-2.5">
                                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                </div>
                              </div>
                            );
                          } else {
                            return <Star key={index} className="w-5 h-5 text-gray-300" />;
                          }
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-gray-800">
                          {(product.average_rating || 0).toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">/ 5.0</span>
                      </div>
                      {product.total_ratings !== undefined && product.total_ratings > 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.total_ratings} rating{product.total_ratings !== 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Interactive Rating Stars */}
                  <div className="flex flex-col gap-1 pt-2 border-t border-gray-200">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            {userRating > 0 ? `Rating Anda: ${userRating} ⭐ (Klik untuk mengubah)` : 'Berikan rating Anda:'}
                          </span>
                          {userRating > 0 && (
                            <span className="text-xs text-green-600 font-medium">✓ Sudah dinilai</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRatingClick(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              disabled={isSubmittingRating}
                              className="transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 rounded"
                              aria-label={`Rate ${star} stars`}
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  star <= (hoveredRating || userRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : star <= userRating
                                    ? "fill-yellow-300 text-yellow-300"
                                    : "text-gray-300 hover:text-yellow-200"
                                }`}
                              />
                            </button>
                          ))}
                          {isSubmittingRating && (
                            <span className="ml-2 text-xs text-gray-500 animate-pulse">Menyimpan...</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                        <p className="text-sm text-amber-800">
                          <Link to="/login" className="font-medium underline hover:text-amber-900">
                            Login
                          </Link>
                          {" "}untuk memberikan rating produk ini
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Rating Message */}
                  {ratingMessage && (
                    <div
                      className={`text-xs p-2 rounded-md ${
                        ratingMessage.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {ratingMessage.text}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-2xl text-black font-bold mb-6">
                {formatPrice(product.price)}
              </p>

              <ProductInfo info={product.info} />
              <ReturnPolicy
                whatsappNumber={product.whatsappNumber}
                productTitle={product.title}
              />
              <ShippingInfo />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
