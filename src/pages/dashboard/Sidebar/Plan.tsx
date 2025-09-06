import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Plan: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // redirect ke halaman utama
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear local storage and redirect anyway
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      navigate("/");
    }
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
