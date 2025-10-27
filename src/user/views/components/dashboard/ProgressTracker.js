import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  
  export default function ProgressTracker({ data, legends, quizStats }) {
    // Fallback data if no data provided
    const chartData = data && data.length > 0 ? data : [
      { date: "09/20", correct: 0, wrong: 0, skipped: 0 },
      { date: "09/22", correct: 0, wrong: 0, skipped: 0 },
      { date: "09/24", correct: 0, wrong: 0, skipped: 0 },
      { date: "09/26", correct: 0, wrong: 0, skipped: 0 },
      { date: "09/28", correct: 0, wrong: 0, skipped: 0 },
    ];
  
    const legendsData = legends && legends.length > 0 ? legends : [
      { key: "correct", name: "Correct", color: "#10b981", value: 0 },
      { key: "wrong", name: "Wrong", color: "#ef4444", value: 0 },
      { key: "skipped", name: "Skipped", color: "#f59e0b", value: 0 },
    ];

    const quizStatsData = quizStats && quizStats.length > 0 ? quizStats : [
      { label: "Total Attempts", value: 0, color: "#a855f7" },
      { label: "Avg per Day", value: 0, color: "#ec4899" },
      { label: "This Month", value: 0, color: "#3b82f6" },
    ];
  
    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-2.5 shadow-lg">
            {payload.map((entry, idx) => (
              <div key={idx} className="text-xs font-medium" style={{ color: entry.color }}>
                {entry.name}: {entry.value}%
              </div>
            ))}
          </div>
        );
      }
      return null;
    };
  
    return (
      <div className="bg-gradient-to-br from-white via-green-50/20 to-emerald-50/10 rounded-xl p-3.5 shadow-md border border-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="p-1.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
            <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800 text-sm">Progress Tracker</h3>
        </div>
  
        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3">
          <div className="w-full h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 2, right: 8, left: -16, bottom: 2 }}>
                <defs>
                  {legendsData.map((legend, idx) => (
                    <linearGradient key={legend.key} id={`grad${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={legend.color} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={legend.color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
  
                <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="4 3" strokeOpacity={0.3} />
                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 10 }} interval={0} tickMargin={3} axisLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} width={20} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d1d5db', strokeDasharray: '4 4' }} />
  
                {legendsData.map((legend, idx) => (
                  <Area 
                    key={legend.key}
                    type="monotone" 
                    dataKey={legend.key} 
                    stroke={legend.color} 
                    strokeWidth={2} 
                    fill={`url(#grad${idx})`} 
                    isAnimationActive={false}
                    dot={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
  
          {/* legends and stats combined */}
          <div className="mt-2 space-y-1">
            {/* Answer breakdown */}
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {legendsData.map((l) => (
                <div key={l.key} className="flex items-center justify-between gap-1 px-1.5 py-1 rounded bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${l.color}15, ${l.color}08)` }}>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                    <span className="text-gray-700 font-medium text-[10px] truncate">{l.name}</span>
                  </div>
                  <div className="text-gray-600 font-semibold text-[9px] flex-shrink-0">{l.value}%</div>
                </div>
              ))}
            </div>

            {/* Quiz stats divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-1"></div>

            {/* Quiz attempts stats */}
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {quizStatsData.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between gap-1 px-1.5 py-1 rounded bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${stat.color}15, ${stat.color}08)` }}>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
                    <span className="text-gray-700 font-medium text-[10px] truncate">{stat.label}</span>
                  </div>
                  <div className="text-gray-600 font-semibold text-[9px] flex-shrink-0">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
