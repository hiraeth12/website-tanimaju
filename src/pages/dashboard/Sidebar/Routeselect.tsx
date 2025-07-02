import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Sprout,
  Database,
  Tag,
  LucideIcon,
  Globe,
  UsersRound,
  Leaf,
  Bean,
  Flower2,
  Grid2x2Check,
  FileUp,
} from "lucide-react";

interface RouteItem {
  title: string;
  icon: LucideIcon;
  to?: string;
  group?: string;
}

const routes: RouteItem[] = [
  { title: "Dashboard", icon: Home, to: "/admin" },
  { title: "Halaman Utama", icon: Globe, to: "/" },
  { title: "Panen", icon: Sprout, to: "/admin/panen", group: "Pencatatan" },
  {
    title: "Item",
    icon: Database,
    to: "/admin/item",
    group: "Produk",
  },
  {
    title: "Petani",
    icon: UsersRound,
    to: "/admin/petani",
    group: "Data Umum",
  },
  { title: "Bibit", icon: Bean, to: "/admin/bibit", group: "Data Umum" },
  { title: "Tanaman", icon: Leaf, to: "/admin/tanaman", group: "Data Umum" },
  { title: "Pupuk", icon: Flower2, to: "/admin/pupuk", group: "Data Umum" },

  {
    title: "Kategori",
    icon: Grid2x2Check,
    to: "/admin/kategori",
    group: "Blog",
  },
  {
    title: "Tags",
    icon: Tag,
    to: "/admin/tags",
    group: "Blog",
  },
  {
    title: "Posts",
    icon: FileUp,
    to: "/admin/posts",
    group: "Blog",
  },
];

export const RouteSelect = () => {
  const location = useLocation();

  const mainRoutes = routes.filter((r) => !r.group);
  const groupedRoutes = routes
    .filter((r) => r.group)
    .reduce((acc: Record<string, RouteItem[]>, route) => {
      if (!acc[route.group!]) acc[route.group!] = [];
      acc[route.group!].push(route);
      return acc;
    }, {});

  const isRouteActive = (route: RouteItem) => {
    if (!route.to) return false;
    return (
      location.pathname === route.to ||
      location.pathname.startsWith(route.to + "/")
    );
  };

  return (
    <div className="space-y-3">
      {/* Non-grouped */}
      <div className="space-y-1">
        {mainRoutes.map((route, idx) => (
          <Route
            key={idx}
            title={route.title}
            Icon={route.icon}
            to={route.to}
            isActive={isRouteActive(route)}
          />
        ))}
      </div>

      {/* Grouped */}
      {Object.entries(groupedRoutes).map(([groupName, groupRoutes]) => (
        <div key={groupName} className="space-y-1">
          <div className="px-2 py-1 text-xs font-medium text-stone-500 uppercase">
            {groupName}
          </div>

          <div className="space-y-1">
            {groupRoutes.map((route, idx) => (
              <Route
                key={idx}
                title={route.title}
                Icon={route.icon}
                to={route.to}
                isActive={isRouteActive(route)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface RouteProps {
  Icon: LucideIcon;
  title: string;
  to?: string;
  isActive?: boolean;
}

const Route = ({ Icon, title, to, isActive = false }: RouteProps) => {
  const content = (
    <div
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition ${
        isActive
          ? "bg-white text-stone-950 shadow"
          : "hover:bg-stone-200 bg-transparent text-stone-500"
      }`}
    >
      <Icon
        className={`w-4 h-4 ${isActive ? "text-violet-500" : ""}`}
        strokeWidth={2}
      />
      <span>{title}</span>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};
