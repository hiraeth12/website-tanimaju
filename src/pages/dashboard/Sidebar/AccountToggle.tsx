// File: src/components/AccountToggle.tsx

export const AccountToggle = () => {
  return (
    <div className="border-b mb-4 pb-4 border-stone-300">
      <button className="flex p-2 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
        <img
          src="https://api.dicebear.com/9.x/notionists/svg"
          alt="avatar"
          className="size-8 rounded shrink-0 bg-violet-500 shadow"
        />
        <div className="text-start">
          <span className="text-sm font-bold block">Admin</span>
          <span className="text-xs block text-stone-500">admin@tanimaju.com</span>
        </div>

      </button>
    </div>
  );
};
