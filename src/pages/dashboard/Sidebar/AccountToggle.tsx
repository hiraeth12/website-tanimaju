// File: src/components/AccountToggle.tsx
import { ChevronDown, ChevronUp } from "lucide-react";

export const AccountToggle = () => {
  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <button className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
        <img
          src="https://api.dicebear.com/9.x/notionists/svg"
          alt="avatar"
          className="size-8 rounded shrink-0 bg-violet-500 shadow"
        />
        <div className="text-start">
          <span className="text-sm font-bold block">Tom Is Loading</span>
          <span className="text-xs block text-stone-500">tom@hover.dev</span>
        </div>

        {/* Ikon Lucide React */}
        <ChevronDown className="absolute right-2 top-1/2 translate-y-[calc(-50%+4px)] w-4 h-4 text-stone-500" />
        <ChevronUp className="absolute right-2 top-1/2 translate-y-[calc(-50%-4px)] w-4 h-4 text-stone-500" />
      </button>
    </div>
  );
};
