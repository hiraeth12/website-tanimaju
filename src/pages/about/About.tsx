import Navbar from "../../components/NavBar";
import Footer from "@/components/Footer";
import AboutParallax from "@/pages/about/AboutParallax";
import { useInView } from "../../hooks/useInView";
import ImageCarousel from "@/components/ImageCarousel";
import { useEffect } from "react";
import MeetOurTeam from "./MeetOurTeam";

const About = () => {
  const textInView = useInView();
  const imageInView = useInView();

  const images = [
    { src: "../images/carousel-placeholder-1.jpg", alt: "Slide 1" },
    { src: "../images/carousel-placeholder-2.jpg", alt: "Slide 2" },
    { src: "../images/carousel-placeholder-3.jpg", alt: "Slide 3" },
    { src: "../images/carousel-placeholder-4.jpg", alt: "Slide 4" },
  ];

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
      <section className="relative py-20 px-4 md:px-24 overflow-hidden">
        {/* Background belah 2 */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 bg-[#F6F4EB]" />
          <div className="w-1/2 bg-gradient-to-l from-[#0096E0] to-[#F6F4EB]" />
        </div>

        {/* Konten utama */}
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between md:gap-32 gap-24">
          {/* Teks */}
          <div
            ref={textInView.ref}
            className={`md:w-1/2 text-left fade-in-left z-10 ${
              textInView.isVisible ? "fade-in-show" : ""
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 font-title">
              Tentang Kami
            </h2>
            <div className="w-14 h-0.5 bg-[#2A4D3E] mb-6" />
            <p className="text-slate-700 text-base md:text-lg mb-8 leading-relaxed text-justify font-body">
              <span className="font-bold text-black">TaniMaju</span> adalah
              sebuah aplikasi manajemen hasil panen yang dirancang untuk
              meningkatkan efisiensi dan produktivitas pertanian di Desa
              Sukamaju, Bandung, Jawa Barat. Nama{" "}
              <span className="font-bold text-black">TaniMaju</span> sendiri
              merupakan gabungan dari kata{" "}
              <span className="font-bold text-black">Tani</span> yang berarti
              pertanian dan <span className="font-bold text-black">Maju</span>{" "}
              yang mencerminkan kemajuan.{" "}
            </p>
            <p className="text-slate-700 text-base md:text-lg mb-8 leading-relaxed text-justify font-body">
              Nama ini mencerminkan visi utama aplikasi, yaitu memajukan sektor
              pertanian lokal melalui pemanfaatan teknologi. Dengan menghadirkan
              inovasi digital ke tengah-tengah kehidupan petani,{" "}
              <span className="font-bold text-black">TaniMaju</span> berkomitmen
              untuk memberdayakan komunitas tani di Desa Sukamaju agar lebih
              mandiri, modern, dan siap menghadapi tantangan pertanian di era
              digital.
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
              src="/images/about-placeholder-2.jpg"
              alt="Farm Illustration"
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      </section>
      {/* Carousel */}
      <section className="flex justify-center items-center min-h-screen bg-[#F2EFE7]">
        <ImageCarousel images={images} />
      </section>
      {/* Meet our Team */}
      <section
        className="bg-[#E6E1D2]
 py-16 px-4 w-full"
      >
        <div className="w-full max-w-7xl mx-auto">
          <MeetOurTeam />
        </div>
      </section>

      {/* Footer */}
      <Footer></Footer>
    </>
  );
};

export default About;
