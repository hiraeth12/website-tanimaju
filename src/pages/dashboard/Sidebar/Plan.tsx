import React from "react";

export const Plan: React.FC = () => {
  return (
    <div className="sticky top-[calc(100vh-48px-16px)] h-12 border-t border-stone-300 px-2 text-xs flex items-end">
      <div className="flex items-center justify-between w-full">
        <div className="leading-tight">
          <p className="font-bold">Enterprise</p>
          <p className="text-stone-500">Pay as you go</p>
        </div>
        <button className="px-2 py-1.5 font-medium bg-stone-200 hover:bg-stone-300 transition-colors rounded">
          Support
        </button>
      </div>
    </div>
  );
};
