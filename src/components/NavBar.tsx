// File: src/components/NavBar.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/(1)logo.png";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // === GAYA DIPISAHKAN UNTUK KEMUDAHAN PENGELOLAAN ===

  // 1. Gaya dasar untuk semua link
  const baseLinkStyle =
    "relative font-semibold text-slate-800 transition-colors pb-1";

  // 2. Gaya untuk garis bawah (disembunyikan secara default)
  const underlineStyle =
    "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-center after:transition-transform after:duration-300 after:scale-x-0";

  // 3. Gaya untuk link yang aktif (garis emerald selalu terlihat)
  const activeLinkStyle = "after:bg-emerald-600 after:scale-x-100";

  // 4. Gaya untuk hover di link yang tidak aktif (garis slate muncul saat hover)
  const hoverLinkStyle = "hover:after:scale-x-100 after:bg-slate-400";

  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn(
            baseLinkStyle,
            underlineStyle,
            isActive ? activeLinkStyle : hoverLinkStyle
          )
        }
        onClick={() => setIsOpen(false)}
      >
        Home
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          cn(
            baseLinkStyle,
            underlineStyle,
            isActive ? activeLinkStyle : hoverLinkStyle
          )
        }
        onClick={() => setIsOpen(false)}
      >
        About
      </NavLink>

      <NavLink
        to="/order"
        className={({ isActive }) =>
          cn(
            baseLinkStyle,
            underlineStyle,
            isActive ? activeLinkStyle : hoverLinkStyle
          )
        }
        onClick={() => setIsOpen(false)}
      >
        Order Online
      </NavLink>

      <NavLink
        to="/blog"
        className={({ isActive }) =>
          cn(
            baseLinkStyle,
            underlineStyle,
            isActive ? activeLinkStyle : hoverLinkStyle
          )
        }
        onClick={() => setIsOpen(false)}
      >
        Blog
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#fefaf3]/80 backdrop-blur-md flex items-center justify-between px-6 py-4 md:px-12 h-20 shadow-sm">
      <div className="flex items-center space-x-3 h-full overflow-hidden">
        <div className="h-14 w-12">
          <img src={logo} alt="Logo" className="h-full w-full object-contain" />
        </div>
      </div>

      <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2 font-body text-black">
        {navLinks}
      </nav>

      {/* Area kanan: User icon + hamburger */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin"
          className="text-slate-900 hover:text-emerald-600 transition-colors"
        >
          <User className="w-6 h-6" />
        </Link>

        {/* Hamburger / X button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-900 focus:outline-none relative w-8 h-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Menu size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-20 left-0 w-full bg-[#fefaf3]/95 backdrop-blur-md flex flex-col items-center space-y-4 py-6 z-40 shadow-md font-body"
        >
          {navLinks}
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
