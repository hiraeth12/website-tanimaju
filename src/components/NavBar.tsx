import { NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const linkStyle = "text-[#2A4D3E] hover:text-[#FF4500] transition-colors";
  const activeStyle = "text-[#FF4500] font-semibold";

  return (
      <header className="bg-[#FF8C42] flex justify-between items-center px-6 py-4 md:px-12">
        {/* Logo dan Judul */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
          {/* <h1 className="text-[#2A4D3E] text-2xl md:text-3xl font-bold">
          TaniMaju
        </h1> */}
        </div>

        {/* Navigasi */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${activeStyle}` : linkStyle
            }
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
