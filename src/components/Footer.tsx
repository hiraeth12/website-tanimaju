import { Github, Instagram, Linkedin, Mail, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-emerald-500 to-cyan-600 text-white py-12 relative overflow-hidden font-body">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Social media */}
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/sea.laboratory/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4 text-slate-900 group-hover:text-[#F6F4EB] transition-colors duration-300" />
            </a>

            <a
              href="https://github.com/sealabtelu"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4 text-slate-900 group-hover:text-[#F6F4EB] transition-colors duration-300" />
            </a>

            <a
              href="https://www.linkedin.com/company/sea-laboratory/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4 text-slate-900 group-hover:text-[#F6F4EB] transition-colors duration-300" />
            </a>

            <a
              href="mailto:sealaboratory@365.telkomuniversity.ac.id"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group"
              aria-label="Email"
            >
              <Mail className="h-4 w-4 text-slate-900 group-hover:text-[#F6F4EB] transition-colors duration-300" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCIxFBfOtf-EZA_9A9Xb4EpQ"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group"
              aria-label="LinkedIn"
            >
              <Youtube className="h-4 w-4 text-slate-900 group-hover:text-[#F6F4EB] transition-colors duration-300" />
            </a>
          </div>

          {/* Garis aksen pemisah */}
          <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50"></div>

          {/* Credit */}
          <p className="text-slate-900 text-xs text-center">
            © {new Date().getFullYear()} SEA Laboratory. All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-cyan-500/5 to-purple-500/5 blur-3xl -z-10"></div>
    </footer>
  );
}
