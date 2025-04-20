import { Link } from "react-router-dom";
import {
  Github,
  Instagram,
  Linkedin,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";
import sea from "../assets/sealogo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-12 relative overflow-hidden">
      {/* Accent line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src={sea}
                alt="sealogo"
                className="w-20 h-20 object-contain"
              />
              <h3 className="text-xl font-light tracking-wider">Sea</h3>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Creating the future through minimalist design and cutting-edge
              technology.
            </p>
          </div>
          
          {/* Pages (centered) */}
          <div className="space-y-4 text-center mx-auto">
            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-400">
              Pages
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Order", path: "/order" },
                { name: "Blog", path: "/blog" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center justify-center group text-sm"
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="h-3 w-0 group-hover:w-3 overflow-hidden transition-all duration-300 ml-1 text-cyan-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4 md:col-start-3 md:items-end text-right">
            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-400">
              Contact
            </h4>
            <div className="space-y-2 text-gray-300 text-sm">
              <div className="flex justify-end items-center space-x-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>+62 851-7686-0621</span>
              </div>
              <div className="flex justify-end items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>sealaboratory@365.telkomuniversity.ac.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col items-center space-y-6">
          {/* Social icons */}
          <div className="flex space-x-4">
            {[Instagram, Github, Linkedin].map((Icon, idx) => (
              <Link
                key={idx}
                to="#"
                className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors duration-300 group"
                aria-label="social-link"
              >
                <Icon className="h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
              </Link>
            ))}
          </div>

          {/* Credit */}
          <p className="text-gray-500 text-xs text-center">
            © {new Date().getFullYear()} SEA Laboratory. All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-cyan-500/5 to-purple-500/5 blur-3xl -z-10"></div>
    </footer>
  );
}
