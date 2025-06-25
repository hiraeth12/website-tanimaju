import { Link } from "react-router-dom";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-white py-12 relative overflow-hidden font-body">
      {/* Accent line di atas footer */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Social media */}
          <div className="flex space-x-4">
            {[Instagram, Github, Linkedin, Mail].map((Icon, idx) => (
              <Link
                key={idx}
                to="#"
                className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors duration-300 group"
                aria-label="social-link"
              >
                <Icon className="h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
              </Link>
            ))}
          </div>

          {/* Garis aksen pemisah */}
          <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50"></div>

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
