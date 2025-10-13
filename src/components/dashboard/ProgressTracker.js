// src/components/dashboard/ProgressTracker.js
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ProgressTracker({ data, legends }) {
  // Fallback data if no data provided
  const chartData = data && data.length > 0 ? data : [
    { date: "09/20", reviewer0: 0, reviewer1: 0, reviewer2: 0, reviewer3: 0 },
    { date: "09/22", reviewer0: 0, reviewer1: 0, reviewer2: 0, reviewer3: 0 },
    { date: "09/24", reviewer0: 0, reviewer1: 0, reviewer2: 0, reviewer3: 0 },
    { date: "09/26", reviewer0: 0, reviewer1: 0, reviewer2: 0, reviewer3: 0 },
    { date: "09/28", reviewer0: 0, reviewer1: 0, reviewer2: 0, reviewer3: 0 },
  ];

  const legendsData = legends && legends.length > 0 ? legends : [
    { key: "reviewer0", name: "No reviewers yet", color: "#3B82F6", value: 0 },
  ];

  return (
    <div className="bg-white/50 rounded-2xl p-4 shadow-sm border border-[#eef3fb]">
      <h3 className="font-bold text-gray-700 mb-3 text-sm">Progress Tracker</h3>

      <div className="bg-[#fbfdff] rounded-xl p-4">
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 6, left: -12, bottom: 6 }}>
              <defs>
                {legendsData.map((legend, idx) => (
                  <linearGradient key={legend.key} id={`grad${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={legend.color} stopOpacity={0.16} />
                    <stop offset="100%" stopColor={legend.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid vertical={false} stroke="#eef3fb" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} interval={0} tickMargin={6} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} width={28} />
              <Tooltip wrapperStyle={{ borderRadius: 8 }} />

              {legendsData.map((legend, idx) => (
                <Area 
                  key={legend.key}
                  type="monotone" 
                  dataKey={legend.key} 
                  stroke={legend.color} 
                  strokeWidth={2} 
                  fill={`url(#grad${idx})`} 
                  isAnimationActive={false} 
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* legends bottom */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
          {legendsData.map((l) => (
            <div key={l.key} className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                <span className="text-gray-600 text-[13px] truncate">{l.name}</span>
              </div>
              <div className="text-xs text-gray-400">{l.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
