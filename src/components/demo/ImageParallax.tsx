import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxImageSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Gambar kanan bergerak naik - efek parallax
  const y = useTransform(scrollYProgress, [0, 1], [0, 0]);


  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[70vh] flex overflow-hidden"
    >
      {/* Gambar Kiri */}
      <div className="w-1/2 flex items-center justify-center bg-[#2a4d3e]">
        <img
          src="../images/parallax-placeholder-1.jpg"
          alt="Left"
          className="h-[34vh] w-auto object-cover"
        />
      </div>

      {/* Gambar Kanan - Diperbesar untuk efek parallax */}
      <div className="w-1/2 h-full overflow-hidden relative">
        <motion.img
          style={{ y }}
          src="../images/parallax-placeholder-2.jpg"
          alt="Right"
          className="absolute top-0 left-0 w-full h-full object-cover scale "
        />
      </div>
    </section>
  );
}
