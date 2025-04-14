import { Mail, Phone, MapPin } from "lucide-react";
import sea from "../../assets/sealogo.png";
import sukamaju from "../../assets/sukamajulogo.png";

export default function Footer() {
  return (
    <footer className="bg-[#a4b07c] text-white py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Address */}
          <div className="bg-[#bdc69a] rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Address</h3>
            <div className="flex items-start gap-2 mb-4">
              <MapPin className="w-5 h-5 mt-1" />
              <p>Desa Sukamaju, Jawa Barat, Indonesia</p>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex gap-4 mt-4">
                <img
                  src={sea}
                  alt="SEA Laboratory Logo"
                  className="h-12 object-contain"
                />
                <img
                  src={sukamaju}
                  alt="Sukamaju Logo"
                  className="h-12 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-white">
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-5 h-5" />
              <span>+6285176860621</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>sealaboratory@365.telkomuniversity.ac.id</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-sm border-t border-[#bdc69a] pt-4">
          © SEA LABORATORY 2025
        </div>
      </div>
    </footer>
  );
}
