import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Facebook, Twitter } from "lucide-react";

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProductInfo from "@/pages/order/ProductInfo";
import ReturnPolicy from "@/pages/order/ReturnPolicy";
import ShippingInfo from "@/pages/order/ShippingInfo";
import { products } from "./ProductData";
import { generateSlug, formatPrice } from "@/lib/utils";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => generateSlug(p.title) === slug);
  const currentIndex = product ? products.indexOf(product) : -1;
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct =
    currentIndex < products.length - 1 ? products[currentIndex + 1] : null;

  useEffect(() => {
    // Scroll ke atas saat komponen dimuat
    window.scrollTo(0, 0);
    // Set judul halaman
    if (product) {
      document.title = `${product.title} - TaniMaju`;
    }
  }, [product]);

  // 4. Handle jika produk tidak ditemukan
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
          {/* Breadcrumb Dinamis */}
          <div className="flex justify-between items-center mb-6 text-sm">
            <div className="text-[#8b7e6d]">
              <Link to="/" className="hover:underline">
                Home
              </Link>{" "}
              /
              <Link to="/order" className="hover:underline">
                All Products
              </Link>{" "}
              /<span> {product.title}</span>
            </div>
            {/* Navigasi Prev/Next Dinamis */}
            <div className="flex items-center gap-2 text-[#8b7e6d]">
              {prevProduct ? (
                <Link
                  to={`/order/${generateSlug(prevProduct.title)}`}
                  className="flex items-center hover:text-[#6d6358]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev</span>
                </Link>
              ) : (
                <span className="text-gray-400/50 cursor-not-allowed flex items-center">
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </span>
              )}
              {" | "}
              {nextProduct ? (
                <Link
                  to={`/order/${generateSlug(nextProduct.title)}`}
                  className="flex items-center hover:text-[#6d6358]"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="text-gray-400/50 cursor-not-allowed flex items-center">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Kolom kiri: Gambar + Deskripsi */}
            <div>
              <img
                src={product.imageSrc}
                alt={product.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
              <div className="mt-6 text-[#5d534a]">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Kolom kanan: Detail produk */}
            <div>
              <h1 className="text-3xl font-medium text-[#5d534a] mb-1 font-cascadia">
                {product.title}
              </h1>
              <p className="text-sm text-[#8b7e6d] mb-4">SKU: {product.sku}</p>
              <p className="text-2xl text-[#5d534a] font-bold mb-6">
                {formatPrice(product.price)}
              </p>

              <ProductInfo info={product.info} />
              <ReturnPolicy
                whatsappNumber={product.whatsappNumber}
                productTitle={product.title}
              />
              <ShippingInfo />

              <div className="flex gap-4 mt-8">
                <Facebook className="h-5 w-5 text-[#8b7e6d] hover:text-[#5d534a] cursor-pointer" />
                <Twitter className="h-5 w-5 text-[#8b7e6d] hover:text-[#5d534a] cursor-pointer" />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
