//src/pages/dashboard/sidebar/Sidebar.tsx

import { AccountToggle } from "./AccountToggle";
import { Search } from "./search";
import { RouteSelect } from "./Routeselect";
import { Plan } from "./Plan";

export const Sidebar = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header section with consistent padding */}
      <div className="px-4 pt-4">
        <AccountToggle />
        <Search />
      </div>
      
      {/* Scrollable menu section */}
      <div className="flex-1 overflow-y-auto px-4">
        <RouteSelect />
      </div>
      
      {/* Footer section */}
      <div className="px-4 pb-4">
        <Plan />
      </div>
    </div>
  );
};
