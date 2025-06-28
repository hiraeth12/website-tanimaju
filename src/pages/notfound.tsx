// File: src/pages/NotFound.tsx

import { Link } from "react-router-dom"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0891b2] to-[#059669] px-4 relative">
      <div className="text-center space-y-8 max-w-md mx-auto z-10">
        {/* Large 404 Text */}
        <div className="space-y-4">
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-white/90 leading-none tracking-tight">
            404
          </h1>
          <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            Page Not Found
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Return Home Button */}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-white/90 font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
