import { Command } from "cmdk";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "./Routeselect"; // pastikan path ini sesuai

export const CommandMenu = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  // Filtering and grouping
  const filteredRoutes = routes.filter((r) =>
    r.title.toLowerCase().includes(value.toLowerCase())
  );

  const groupedRoutes = filteredRoutes.reduce((acc: Record<string, typeof routes>, route) => {
    const group = route.group || "_ungrouped";
    if (!acc[group]) acc[group] = [];
    acc[group].push(route);
    return acc;
  }, {});

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 bg-stone-950/50 z-50"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl border border-stone-300 overflow-hidden w-full max-w-lg mx-auto mt-12 font-body"
      >
        <Command.Input
          value={value}
          onValueChange={setValue}
          placeholder="Go to page..."
          className="relative border-b border-stone-300 p-3 text-lg w-full placeholder:text-stone-400 focus:outline-none"
        />

        <Command.List className="p-3">
          <Command.Empty>
            No results found for{" "}
            <span className="text-violet-500">"{value}"</span>
          </Command.Empty>

          {Object.entries(groupedRoutes).map(([group, routes]) => (
            <Command.Group
              key={group}
              heading={group === "_ungrouped" ? "General" : group}
              className="text-sm text-stone-400 mb-3"
            >
              {routes.map((route) => (
                <Command.Item
                  key={route.title}
                  onSelect={() => {
                    if (route.to) {
                      setOpen(false);
                      if (route.to === "/") {
                        window.open("/", "_blank");
                      } else {
                        navigate(route.to);
                      }
                    }
                  }}
                  className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2"
                >
                  <route.icon className="w-4 h-4" />
                  {route.title}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </div>
    </Command.Dialog>
  );
};
