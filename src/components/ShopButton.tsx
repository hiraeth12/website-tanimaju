import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CoolButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  to: string;
  label?: string; // default "View Product"
}

const CoolButton = React.forwardRef<HTMLDivElement, CoolButtonProps>(
  ({ className, to, label = "View Product", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center p-8 font-body", className)}
        {...props}
      >
        <Link to={to}>
          <Button
            className={cn(
              "relative group overflow-hidden",
              "text-white font-medium py-2 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
              "min-w-[160px] h-12 border-none",
              "bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500",
              "flex items-center justify-center gap-2"
            )}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5 transition-transform duration-100 group-hover:rotate-12" />
              <span className="transition-transform group-hover:translate-x-1">
                {label}
              </span>
            </span>

            <span className="absolute inset-0 w-full h-full bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <span className="absolute inset-0 w-full h-full bg-black/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 delay-100" />
          </Button>
        </Link>
      </div>
    );
  }
);

CoolButton.displayName = "CoolButton";

export default CoolButton;
