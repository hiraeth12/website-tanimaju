//src/pages/dashboard/sidebar/Sidebar.tsx

import { AccountToggle } from "./AccountToggle";
import { Search } from "./search";
import { RouteSelect } from "./Routeselect";
import { Plan } from "./Plan";

export const Sidebar = () => {
  return (
    <div>
      <div className="overflow-y-scroll sticky top-4 h-[calc(100vh-32px-48px)]">
        <AccountToggle />
        <Search />
        <RouteSelect />
      </div>
      <Plan />
    </div>
  );
};
