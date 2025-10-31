import { Link } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0891b2] to-[#059669] px-4 relative">
      <div className="text-center space-y-8 max-w-md mx-auto z-10">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-white/10 p-8 backdrop-blur-sm">
            <ShieldAlert className="w-20 h-20 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-white font-cascadia leading-tight">
              Access Denied
            </h1>
            <div className="w-20 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg text-white/90 font-body">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <p className="text-sm text-white/70 font-body">
              Halaman ini hanya dapat diakses oleh Administrator.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Link
            to="/admin"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-white/90 font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            Kembali ke Dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-medium px-8 py-3 rounded-full transition-all duration-200 w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Additional Info */}
        <div className="pt-4">
          <p className="text-xs text-white/60 font-body">
            Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator.
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
