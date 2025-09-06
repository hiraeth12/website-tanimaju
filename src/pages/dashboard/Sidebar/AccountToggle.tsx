// File: src/components/AccountToggle.tsx

import { useAuth } from "@/context/AuthContext";

export const AccountToggle = () => {
  const { user } = useAuth();

  return (
    <div className="border-b mb-4 pb-4 border-stone-300">
      <button className="flex p-2 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
        <img
          src="/images/seachan.png"
          alt="avatar"
          className="size-8 rounded shrink-0 bg-transparent shadow"
        />
        <div className="text-start">
          <span className="text-sm font-bold block">
            {user?.username ? `${user.username} (${user.role})` : "Loading..."}
          </span>
          <span className="text-xs block text-stone-500">
            {user?.email || "Loading..."}
          </span>
        </div>

      </button>
    </div>
  );
};
