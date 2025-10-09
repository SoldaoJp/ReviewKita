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

export default function ProgressTracker({ series }) {
  // sample fallback data (replace with props or backend)
  const data = [
    { date: "09/20", ds: 20, qm: 10, adb: 5, nw: 0 },
    { date: "09/22", ds: 35, qm: 28, adb: 18, nw: 2 },
    { date: "09/24", ds: 55, qm: 45, adb: 35, nw: 8 },
    { date: "09/26", ds: 78, qm: 63, adb: 60, nw: 15 },
    { date: "09/28", ds: 100, qm: 80, adb: 100, nw: 28 },
  ];

  const legends = [
    { key: "ds", name: "Data Scalability", color: "#3B82F6", value: 100 },
    { key: "qm", name: "Quantitative Methods", color: "#EC4899", value: 80 },
    { key: "adb", name: "Advanced Database", color: "#7C3AED", value: 100 },
    { key: "nw", name: "Networking 2", color: "#10B981", value: 28 },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eef3fb]">
      <h3 className="font-semibold text-gray-700 mb-3 text-sm">Progress Tracker</h3>

      <div className="bg-[#fbfdff] rounded-xl p-4">
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 6, left: -12, bottom: 6 }}>
              <defs>
                <linearGradient id="gradDs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.16} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradQm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity={0.14} />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAdb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradNw" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.10} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#eef3fb" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} interval={0} tickMargin={6} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} width={28} />
              <Tooltip wrapperStyle={{ borderRadius: 8 }} />

              <Area type="monotone" dataKey="ds" stroke="#3B82F6" strokeWidth={2} fill="url(#gradDs)" isAnimationActive={false} />
              <Area type="monotone" dataKey="qm" stroke="#EC4899" strokeWidth={2} fill="url(#gradQm)" isAnimationActive={false} />
              <Area type="monotone" dataKey="adb" stroke="#7C3AED" strokeWidth={2} fill="url(#gradAdb)" isAnimationActive={false} />
              <Area type="monotone" dataKey="nw" stroke="#10B981" strokeWidth={2} fill="url(#gradNw)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* legends bottom */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
          {legends.map((l) => (
            <div key={l.key} className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                <span className="text-gray-600 text-[13px]">{l.name}</span>
              </div>
              <div className="text-xs text-gray-400">{l.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
