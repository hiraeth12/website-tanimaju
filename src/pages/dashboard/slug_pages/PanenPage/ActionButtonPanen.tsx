import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ActionButtonsProps {
  onRefresh: () => void;
  loading: boolean;
}

export function ActionButtons({ onRefresh, loading }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onRefresh} disabled={loading}>
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Memuat..." : "Muat Ulang"}
      </Button>

      <Link to="/admin/panen/create">
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          New hasil panen
        </Button>
      </Link>
    </div>
  );
}
