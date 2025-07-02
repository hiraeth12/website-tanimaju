import { useState } from "react";
import { Search as SearchIcon, Command } from "lucide-react";
import { CommandMenu } from "./CommandMenu";

export const Search = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-stone-200 mb-4 relative rounded flex items-center px-2 py-1.5 text-sm">
        <SearchIcon className="mr-2 w-4 h-4 text-stone-600" />
        <input
          onFocus={(e) => {
            e.target.blur();
            setOpen(true);
          }}
          type="text"
          placeholder="Search"
          className="w-full bg-transparent placeholder:text-stone-400 focus:outline-none"
        />

        <span className="p-1 text-xs flex gap-0.5 items-center shadow bg-stone-50 rounded absolute right-1.5 top-1/2 -translate-y-1/2">
          <Command className="w-3.5 h-3.5" />K
        </span>
      </div>

      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
};
