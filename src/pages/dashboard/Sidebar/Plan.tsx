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
    <div className="pt-4 text-xs">
      <div className="flex items-center justify-between w-full gap-2">
        <div className="leading-tight flex-1 min-w-0">
          <p className="font-bold truncate">TaniMaju</p>
          <p className="text-stone-500 truncate">Log out</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-stone-200 rounded transition-colors flex-shrink-0"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-stone-600" />
        </button>
      </div>
    </div>
  );
};
