import { Command } from "cmdk";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Plus,
  Eye,
  Link as LinkIcon,
  Phone,
  LogOut,
} from "lucide-react";

export const CommandMenu = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 bg-stone-950/50"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl border-stone-300 border overflow-hidden w-full max-w-lg mx-auto mt-12 font-body"
      >
        <Command.Input
          value={value}
          onValueChange={setValue}
          placeholder="What do you need?"
          className="relative border-b border-stone-300 p-3 text-lg w-full placeholder:text-stone-400 focus:outline-none"
        />

        <Command.List className="p-3">
          <Command.Empty>
            No results found for{" "}
            <span className="text-violet-500">"{value}"</span>
          </Command.Empty>

          <Command.Group heading="Team" className="text-sm mb-3 text-stone-400">
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <Plus className="w-4 h-4" />
              Invite Member
            </Command.Item>
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <Eye className="w-4 h-4" />
              See Org Chart
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Integrations" className="text-sm text-stone-400 mb-3">
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Link Services
            </Command.Item>
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Support
            </Command.Item>
          </Command.Group>

          <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-50 hover:bg-stone-700 bg-stone-950 rounded items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Command.Item>
        </Command.List>
      </div>
    </Command.Dialog>
  );
};
