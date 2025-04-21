import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LoadMoreButtonProps = {
  to?: string;
  onClick?: () => void;
};

export default function LoadMoreButton({ to, onClick }: LoadMoreButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (to) {
        navigate(to);
      } else if (onClick) {
        onClick();
      }
    }, 500);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "relative group overflow-hidden",
        "text-white font-medium py-2 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
        "min-w-[160px] h-12 border-none",
        "bg-gradient-to-r from-[#00A9FF] to-[#0066FF] hover:from-[#0095E0] hover:to-[#0052CC]"
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 font-body">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <MoreHorizontal className="w-5 h-5 transition-all duration-100 group-hover:animate-pulse" />
            <span className="transition-transform group-hover:translate-x-1">
              Load More
            </span>
          </>
        )}
      </span>
      <span className="absolute inset-0 w-full h-full bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      <span className="absolute inset-0 w-full h-full bg-black/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 delay-100" />
    </Button>
  );
}
