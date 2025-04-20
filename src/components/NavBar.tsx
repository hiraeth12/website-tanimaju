import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const linkStyle = "font-semibold text-slate-700 hover:text-[#89CFF3] transition-colors";
  const activeStyle = "text-[#A0E9FF] font-semibold";

  return (
    <header className="bg-[#00A9FF] relative flex items-center justify-between px-6 py-4 md:px-12 h-20">
      {/* Logo */}
      <div className="flex items-center space-x-3 h-full overflow-hidden">
        <div className="h-14 w-12">
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
    </header>
  );
};

export default Navbar;
