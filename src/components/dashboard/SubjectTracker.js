// src/components/dashboard/SubjectTracker.js
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function SubjectTracker({ data }) {
  // Fallback data if no data provided
  const items = data && data.length > 0 ? data : [
    { name: "No reviewers yet", value: 100, color: "#3B82F6" },
  ];

  const mainPct = items[0]?.value ?? 0;

  return (
    <div className="bg-white/50 rounded-2xl p-4 shadow-sm border border-[#eef3fb]">
      <h3 className="font-bold text-gray-700 mb-3 text-sm">Subject Tracker</h3>

      <div className="bg-[#fbfdff] rounded-xl p-4 flex flex-col items-center">
        <div className="relative w-44 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="value"
                nameKey="name"
                innerRadius="58%"
                outerRadius="90%"
                paddingAngle={items.length > 1 ? 3 : 0}
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
            <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center">
              <div className="text-sm font-semibold text-gray-800">{mainPct}%</div>
              <div className="text-[11px] text-gray-400">top subject</div>
            </div>
          </div>
        </div>

        <div className="mt-4 w-full grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
          {items.map((d) => (
            <div key={d.name} className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                <span className="text-gray-600 text-[13px] truncate">{d.name}</span>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0 ml-2">{d.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
