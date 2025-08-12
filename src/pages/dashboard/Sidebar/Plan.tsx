import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export const Plan: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: hapus data auth jika ada
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/"); // redirect ke halaman utama
  };

  return (
    <div className="border-t border-stone-300 pt-4 text-xs">
      <div className="flex items-center justify-between w-full">
        <div className="leading-tight">
          <p className="font-bold">TaniMaju</p>
          <p className="text-stone-500">Log out</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-stone-200 rounded transition-colors"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5 text-stone-600" />
        </button>
      </div>
    </div>
  );
};
