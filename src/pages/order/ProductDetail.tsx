// File: src/pages/order/ProductDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProductInfo from "@/pages/order/ProductInfo";
import ReturnPolicy from "@/pages/order/ReturnPolicy";
import ShippingInfo from "@/pages/order/ShippingInfo";
import { generateSlug, formatPrice } from "@/lib/utils";

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
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
                src={product.imageSrc?.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${product.imageSrc}` : product.imageSrc}
                alt={product.title}
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.currentTarget.src = '/images/product-placeholder-5.jpg';
                }}
              />
              <div className="mt-6 text-black">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Kolom kanan: Detail produk */}
            <div>
              <h1 className="text-3xl font-medium text-black mb-1 font-cascadia">
                {product.title}
              </h1>
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
