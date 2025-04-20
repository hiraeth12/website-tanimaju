import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

export default function CoolButton() {
  return (
    <div className="flex items-center justify-center p-8 font-body">
      <Link to="/order">
        <Button
          className={cn(
            "relative group overflow-hidden bg-gradient-to-r from-sky-500 to-purple-600 hover:from-purple-600 hover:to-sky-500 transition-all duration-300 text-white font-medium py-2 px-6 rounded-full shadow-lg hover:shadow-xl",
            "flex items-center gap-2",
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span className="transition-transform group-hover:translate-x-1">View Product</span>
          </span>
          <span className="absolute inset-0 w-full h-full bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Button>
      </Link>
    </div>
  )
}
