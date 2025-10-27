// src/components/dashboard/SubjectTracker.js
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function SubjectTracker({ data }) {
  // Fallback data if no data provided
  const items = data && data.length > 0 ? data : [
    { name: "No reviewers yet", value: 100, color: "#3B82F6" },
  ];

  const mainPct = items[0]?.value ?? 0;

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/20 to-cyan-50/10 rounded-xl p-3.5 shadow-md border border-white/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="p-1.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
          <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 text-sm">Subject Tracker</h3>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
        <div className="relative w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="value"
                nameKey="name"
                innerRadius="55%"
                outerRadius="88%"
                paddingAngle={items.length > 1 ? 2.5 : 0}
                startAngle={90}
                endAngle={450}
              >
                {items.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center border border-white/60 shadow-sm">
              <div className="text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{mainPct}%</div>
              <div className="text-[10px] text-gray-500 font-medium mt-0.5">Coverage</div>
            </div>
          </div>
        </div>

        <div className="mt-3 w-full grid grid-cols-1 gap-1.5 text-xs">
          {items.slice(0, 6).map((d) => (
            <div key={d.name} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-gradient-to-r transition-all hover:shadow-sm" style={{ backgroundImage: `linear-gradient(to right, ${d.color}15, ${d.color}08)` }}>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ background: d.color }} />
                <span className="text-gray-700 font-medium text-[11px] truncate">{d.name}</span>
              </div>
              <div className="text-gray-600 font-bold text-[10px] flex-shrink-0 ml-2">{d.value}%</div>
            </div>
          ))}
          {items.length > 6 && (
            <div className="text-center text-[10px] text-gray-500 mt-1">
              +{items.length - 6} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

