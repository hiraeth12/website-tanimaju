import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const linkStyle =
    "font-semibold text-slate-700 hover:text-[#89CFF3] transition-colors";
  const activeStyle = "text-[#A0E9FF] font-semibold";

  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        onClick={() => setIsOpen(false)}
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        onClick={() => setIsOpen(false)}
      >
        About
      </NavLink>
      <NavLink
        to="/order"
        className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        onClick={() => setIsOpen(false)}
      >
        Order Online
      </NavLink>
      <NavLink
        to="/blog"
        className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        onClick={() => setIsOpen(false)}
      >
        Blog
      </NavLink>
    </>
  );

  return (
    <header className="bg-[#0096E0] relative flex items-center justify-between px-6 py-4 md:px-12 h-20">
      <div className="flex items-center space-x-3 h-full overflow-hidden">
        <div className="h-14 w-12">
          <img src={logo} alt="Logo" className="h-full w-full object-contain" />
        </div>
      </div>

      <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2 font-body">
        {navLinks}
      </nav>

      {/* Hamburger / X button with transition */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-white focus:outline-none relative w-8 h-8"
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

      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#0096E0] flex flex-col items-center space-y-4 py-4 z-50 font-body">
          {navLinks}
        </div>
      )}
    </header>
  );
};

export default Navbar;
