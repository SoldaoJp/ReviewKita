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
      <div className="bg-gradient-to-br from-white via-green-50/20 to-emerald-50/10 rounded-xl p-3.5 shadow-md border border-white/60 backdrop-blur-sm h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="p-1.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
            <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800 text-sm">Progress Tracker</h3>
        </div>
  
        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 flex-1 flex flex-col">
          <div className="w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  {legendsData.map((legend, idx) => (
                    <linearGradient key={legend.key} id={`grad${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={legend.color} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={legend.color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
  
                <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="4 3" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "#9ca3af", fontSize: 11 }} 
                  interval={0} 
                  tickMargin={6} 
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis 
                  tick={{ fill: "#9ca3af", fontSize: 11 }} 
                  width={35} 
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d1d5db', strokeDasharray: '4 4' }} />
  
                {legendsData.map((legend, idx) => (
                  <Area 
                    key={legend.key}
                    type="monotone" 
                    dataKey={legend.key} 
                    stroke={legend.color} 
                    strokeWidth={2.5} 
                    fill={`url(#grad${idx})`} 
                    isAnimationActive={false}
                    dot={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
  
          {/* legends and stats combined */}
          <div className="mt-3 space-y-1 flex-shrink-0">
            {/* Answer breakdown */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {legendsData.map((l) => (
                <div key={l.key} className="flex flex-col gap-1 px-2 py-2 rounded-lg bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${l.color}15, ${l.color}08)` }}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                    <span className="text-gray-700 font-medium text-[11px]">{l.name}</span>
                  </div>
                  <div className="text-gray-800 font-bold text-base ml-4">{l.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
