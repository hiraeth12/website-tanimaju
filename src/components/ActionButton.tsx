import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ExtraAction {
  label: string;
  to: string;
  variant?: "default" | "outline" | "destructive";
  className?: string; // supaya bisa kasih tailwind bebas
}

interface ActionButtonsProps {
  onRefresh: () => void;
  loading: boolean;
  actions?: ExtraAction[]; // optional
}

export function ActionButtons({ onRefresh, loading, actions }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      {/* Tombol Refresh */}
      <Button 
        variant="outline" 
        onClick={onRefresh} 
        disabled={loading}
        className="w-full sm:w-auto order-2 sm:order-1"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
        <span className="hidden sm:inline">{loading ? "Memuat..." : "Muat Ulang"}</span>
        <span className="sm:hidden">{loading ? "Loading..." : "Refresh"}</span>
      </Button>

      {/* Tombol Tambahan */}
      {actions?.map((action) => (
        <Link key={action.to} to={action.to} className="w-full sm:w-auto order-1 sm:order-2">
          <Button 
            variant={action.variant ?? "default"} 
            className={`w-full sm:w-auto ${action.className || ""}`}
          >
            <span className="text-sm sm:text-base">{action.label}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
}
