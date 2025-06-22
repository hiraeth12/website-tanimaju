import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ShippingInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-[#e0d9d0] py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-[#5d534a]"
      >
        <span className="font-medium">PETUNJUK PEMESANAN</span>
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
            <div className="mt-4 text-[#5d534a] text-sm space-y-2">
              <ol className="list-decimal list-inside">
                <li>Klik tombol WhatsApp di atas untuk menghubungi penjual.</li>
                <li>Sebutkan produk dan jumlah yang ingin dipesan.</li>
                <li>Tunggu konfirmasi harga dan ketersediaan dari penjual.</li>
                <li>Selesaikan pembayaran sesuai instruksi penjual.</li>
                <li>Produk dikirim sesuai kesepakatan.</li>
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
