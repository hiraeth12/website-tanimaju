import { Eye } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  {
    feature: "Tracking",
    mobile: 15,
    desktop: 110,
    max: 150,
  },
  {
    feature: "Builder",
    mobile: 130,
    desktop: 90,
    max: 150,
  },
  {
    feature: "Schedule",
    mobile: 86,
    desktop: 130,
    max: 150,
  },
  {
    feature: "AI Train",
    mobile: 125,
    desktop: 40,
    max: 150,
  },
  {
    feature: "Interval",
    mobile: 148,
    desktop: 90,
    max: 150,
  },
];

export const UsageRadar = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded border border-stone-300 bg-white h-80">
      <div className="p-4 flex-shrink-0">
        <h3 className="flex items-center gap-1.5 font-medium">
          <Eye className="w-4 h-4" /> Usage
        </h3>
      </div>

      <div className="flex-1 px-4 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis className="text-xs font-bold" dataKey="feature" />
            <PolarRadiusAxis angle={30} domain={[0, 150]} />
            <Radar
              name="Mobile"
              dataKey="mobile"
              stroke="#18181b"
              fill="#18181b"
              fillOpacity={0.2}
            />
            <Radar
              name="Desktop"
              dataKey="desktop"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.2}
            />
            <Tooltip
              wrapperClassName="text-sm rounded"
              labelClassName="text-xs text-stone-500"
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};