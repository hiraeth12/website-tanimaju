//import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Facebook, Twitter } from "lucide-react";
import ProductInfo from "@/components/ProductInfo";
import ReturnPolicy from "@/components/ReturnPolicy";
import ShippingInfo from "@/components/ShippingInfo";
import Navbar from "@/components/NavBar";
import Footer from "@/components/demo/Footer";
import { useEffect } from "react";

export default function BlogPost() {
  //const { productSlug } = useParams();

  useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

  // Contoh mapping slug ke detail (nanti bisa diambil dari API / state global)
  const productData = {
    title: "Classic Basket",
    price: 15.0,
    image: "/images/detailed-placeholder-1.jpg",
    sku: "0001",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  };

  return (
    <div className="bg-[#f5efe7]">
      <Navbar /> {/* Navbar component */}
      <div className="min-h-screen bg-[#f5efe7]">
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <div className="text-[#8b7e6d]">
              <a href="/" className="hover:underline">
                Home
              </a>{" "}
              /
              <a href="/order" className="hover:underline">
                {" "}
                All Products{" "}
              </a>{" "}
              /<span> {productData.title}</span>
            </div>
            <div className="flex items-center gap-2 text-[#8b7e6d]">
              <a href="#" className="flex items-center hover:text-[#6d6358]">
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </a>
              {" | "}
              <a href="#" className="flex items-center hover:text-[#6d6358]">
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Kolom kiri: Gambar + Deskripsi */}
            <div>
              <img
                src={productData.image}
                alt={productData.title}
                className="w-full h-auto rounded-sm"
              />
              {/* Deskripsi di bawah gambar */}
              <div className="mt-6 text-[#5d534a]">
                <p>{productData.description}</p>
              </div>
            </div>

            {/* Kolom kanan: Detail produk */}
            <div>
              <h1 className="text-3xl font-medium text-[#5d534a] mb-1">
                {productData.title}
              </h1>
              <p className="text-sm text-[#8b7e6d] mb-4">
                SKU: {productData.sku}
              </p>
              <p className="text-xl text-[#5d534a] mb-6">
                ${productData.price.toFixed(2)}
              </p>

              <button className="w-full bg-[#f58a4b] hover:bg-[#e67c3e] text-white py-3 px-4 mb-8 transition-colors">
                Add to Cart
              </button>

              <ProductInfo />
              <ReturnPolicy />
              <ShippingInfo />

              <div className="flex gap-4 mt-8">
                <Facebook className="h-5 w-5 text-[#8b7e6d] hover:text-[#5d534a]" />
                <Twitter className="h-5 w-5 text-[#8b7e6d] hover:text-[#5d534a]" />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
