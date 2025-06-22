import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ReturnPolicyProps {
  whatsappNumber: string;
  productTitle: string;
}

export default function ReturnPolicy({
  whatsappNumber,
  productTitle,
}: ReturnPolicyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const waLink = `https://wa.me/${whatsappNumber}?text=Halo%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(
    productTitle
  )}%20anda.%20Bolehkah%20saya%20mendapatkan%20informasi%20lebih%20lanjut?`;

  return (
    <div className="border-t border-[#e0d9d0] py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-[#5d534a]"
      >
        <span className="font-medium">CONTACT SELLER</span>
        <Plus
          className={`h-4 w-4 transform transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 text-[#5d534a] text-sm">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
              >
                Hubungi via WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
