import { StatCards } from "./StatCards";
import { ActivityGraph } from "./ActivityGraphs";
import { UsageRadar } from "./UsageRadar";
import { RecentTransactions } from "./RecentTransactions";

export const Grid = () => {
  return (
    <div className="space-y-6">
      {/* StatCards - responsive layout */}
      <StatCards />
      
      {/* Charts Row - responsive layout with equal heights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">        
        {/* ActivityGraph - takes 2/3 of the width */}
        <div className="lg:col-span-2">
          <ActivityGraph />
        </div>
        
        {/* UsageRadar - takes 1/3 of the width */}
        <div className="lg:col-span-1">
          <UsageRadar />
        </div>
      </div>
      
      {/* RecentTransactions - full width */}
      <RecentTransactions />
    </div>
  );
};