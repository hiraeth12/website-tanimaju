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
    <div className="flex gap-2">
      {/* Tombol Refresh */}
      <Button variant="outline" onClick={onRefresh} disabled={loading}>
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Memuat..." : "Muat Ulang"}
      </Button>

      {/* Tombol Tambahan */}
      {actions?.map((action) => (
        <Link key={action.to} to={action.to}>
          <Button variant={action.variant ?? "default"} className={action.className}>
            {action.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
