import { NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const linkStyle = "text-[#2A4D3E] hover:text-[#FF4500] transition-colors";
  const activeStyle = "text-[#FF4500] font-semibold";

  return (
    <header className="bg-[#D0D7B5] relative flex items-center justify-between px-6 py-4 md:px-12 h-20">
      {/* Logo */}
      <div className="flex items-center space-x-3 h-full overflow-hidden">
        <div className="h-20 w-20">
          <img src={logo} alt="Logo" className="h-full w-full object-contain" />
        </div>
      </div>

      {/* Navigasi di Tengah */}
      <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        >
          About
        </NavLink>
        <NavLink
          to="/order"
          className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        >
          Order Online
        </NavLink>
        <NavLink
          to="/blog"
          className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        >
          Blog
        </NavLink>
      </nav>

      {/* Cart Icon */}
      <div className="flex items-center space-x-4">
        <NavLink
          to="/cart"
          className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        >
          <ShoppingCart className="h-5 w-5 mr-1" />
        </NavLink>
      </div>
    </header>
  );
};

export default Navbar;
