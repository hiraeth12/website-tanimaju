import Navbar from "../../components/NavBar";
import Footer from "@/components/Footer";
import AboutParallax from "@/pages/about/AboutParallax";
import { useInView } from "../../hooks/useInView";
import { useEffect } from "react";
import MeetOurTeam from "./MeetOurTeam";
import MapSection from "./MapSection"; // Pastikan path ini benar

const About = () => {
  const textInView = useInView();
  const imageInView = useInView();
  const mapTextInView = useInView(); // Gunakan ref terpisah untuk teks di sebelah peta

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="fade">
        {/* Hero Section */}
        <AboutParallax />
      </div>
      {/* Section 1 */}
      <section className="relative py-20 px-4 md:px-24 overflow-hidden bg-[#F6F4EB]">
        {/* Konten utama */}
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between md:gap-32 gap-24">
          {/* Teks */}
          <div
            ref={textInView.ref}
            className={`md:w-1/2 text-left fade-in-left z-10 ${
              textInView.isVisible ? "fade-in-show" : ""
            }`}
          >
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 font-cascadia">
              <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Tentang
              </span>{" "}
              Kami
            </h2>
            <div className="w-14 h-0.5 bg-[#2A4D3E] mb-6" />
            <p className="text-slate-700 text-sm md:text-md mb-8 leading-relaxed text-justify font-body">
              <span className="font-bold text-black">TaniMaju</span>  adalah aplikasi pertanian yang dirancang untuk membantu petani dan masyarakat dalam mengelola hasil tani 
              secara efisien dan terarah. Melalui aplikasi ini, pengguna dapat dengan mudah melakukan jual beli hasil pertanian, memperoleh informasi mengenai kebutuhan tani seperti pupuk, bibit, dan perlengkapan, 
              serta mengakses blog berbagi informasi yang berisi pengetahuan, pengalaman, dan tips seputar pertanian.
            </p>
            <p className="text-slate-700 text-sm md:text-md mb-8 leading-relaxed text-justify font-body">
               Nama <span className="font-bold text-black">TaniMaju</span> berasal dari kombinasi kata <span className="font-bold text-black">“Tani”</span> yang berarti pertanian dan <span className="font-bold text-black">“Maju”</span> yang berarti kemajuan, mencerminkan visi untuk mendorong kemajuan sektor pertanian di Desa Sukamaju, Bandung, Jawa Barat, melalui pemanfaatan teknologi. Dengan hadirnya TaniMaju,
               pertanian desa diharapkan dapat berkembang menjadi lebih modern, mandiri, berdaya saing, dan berkelanjutan, sehingga mampu meningkatkan kesejahteraan bersama.
            </p>
          </div>
          {/* Gambar */}
          <div
            ref={imageInView.ref}
            className={`md:w-1/2 flex items-center fade-in-right z-10 ${
              imageInView.isVisible ? "fade-in-show" : ""
            }`}
          >
            <img
              src="/images/about/about-placeholder-2.png"
              alt="Farm Illustration"
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Lokasi Map Section */}
      <section className="relative py-16 px-4 md:px-24 overflow-hidden bg-[#F2EFE7]">
        {/* Konten utama dengan layout responsif */}
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between md:gap-32 gap-12">
          {/* Teks (akan muncul di bawah peta pada mobile) */}
          <div
            ref={mapTextInView.ref} // Asumsi Anda punya ref ini
            className={`md:w-1/2 text-left fade-in-left z-10 ${
              mapTextInView.isVisible ? "fade-in-show" : ""
            }`}
          >
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 font-cascadia">
              <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Lokasi
              </span>{" "}
              Kami
            </h2>
            <div className="w-14 h-0.5 bg-[#2A4D3E] mb-6" />
            <p className="text-slate-700 text-sm md:text-md mb-4 leading-relaxed text-justify font-body">
              Kami berlokasi di{" "}
              <span className="font-bold text-black">
                Desa Sukamaju, Bandung
              </span>
              , sebuah kawasan pertanian yang subur dan kaya akan potensi lokal.
              Di sinilah berbagai produk pertanian berkualitas tinggi
              dikembangkan dengan metode alami dan berkelanjutan.
            </p>
            <p className="text-slate-700 text-sm md:text-md mb-8 leading-relaxed text-justify font-body">
              Kunjungi desa kami dan saksikan langsung proses budidaya yang
              dilakukan oleh para petani lokal dengan penuh dedikasi. Temukan
              sendiri keunikan dan kualitas hasil bumi dari Sukamaju.
            </p>
          </div>

          {/* Peta (akan muncul di atas teks pada mobile) */}
          <div className="md:w-1/2 z-10 w-full h-[350px] md:h-[500px] mb-8">
            <MapSection />
          </div>
        </div>
      </section>

      {/* Meet our Team */}
      <section className="bg-[#F5ECE0] py-16 px-4 w-full">
        <div className="w-full max-w-7xl mx-auto">
          <MeetOurTeam />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
