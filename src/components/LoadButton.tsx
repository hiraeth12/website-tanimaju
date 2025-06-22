import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LoadMoreButtonProps = {
  to?: string;
  onClick?: () => void;
};

export default function LoadMoreButton({ to, onClick }: LoadMoreButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "relative group overflow-hidden",
        "text-white font-medium py-2 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
        "min-w-[160px] h-12 border-none",
        "bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500"
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 font-body">
        <MoreHorizontal className="w-5 h-5 transition-all duration-100 group-hover:animate-pulse" />
        <span className="transition-transform group-hover:translate-x-1">
          Load More
        </span>
      </span>

      <span className="absolute inset-0 w-full h-full bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      <span className="absolute inset-0 w-full h-full bg-black/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 delay-100" />
    </Button>
  );
}