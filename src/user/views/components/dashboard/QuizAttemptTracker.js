// src/components/dashboard/QuizAttemptTracker.js
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

export default function QuizAttemptTracker({ data }) {
  // Fallback data if no data provided
  const chartData = data && data.length > 0 ? data : [
    { name: "Mon", attempts: 0 },
    { name: "Tue", attempts: 0 },
    { name: "Wed", attempts: 0 },
    { name: "Thu", attempts: 0 },
    { name: "Fri", attempts: 0 },
  ];

  // Calculate total and average attempts
  const totalAttempts = chartData.reduce((sum, item) => sum + (item.attempts || 0), 0);
  const avgAttempts = chartData.length > 0 ? Math.round(totalAttempts / chartData.length) : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-2.5 shadow-lg">
          <div className="text-xs font-medium text-purple-600">
            {payload[0].payload.name}: {payload[0].value} attempts
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white via-purple-50/20 to-pink-50/10 rounded-xl p-3.5 shadow-md border border-white/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="p-1.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
          <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 text-sm">Quizzes Taken</h3>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3">
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="4 3" strokeOpacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} tickMargin={4} axisLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} width={24} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }} />
              <Bar dataKey="attempts" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.attempts > avgAttempts ? '#a855f7' : entry.attempts > 0 ? '#d8b4fe' : '#e9d5ff'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats bottom */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="px-2 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-purple-25">
            <div className="text-[10px] text-gray-600 font-medium">Total Attempts</div>
            <div className="text-base font-bold text-purple-600 mt-0.5">{totalAttempts}</div>
          </div>
          <div className="px-2 py-2 rounded-lg bg-gradient-to-r from-pink-50 to-pink-25">
            <div className="text-[10px] text-gray-600 font-medium">Avg per Day</div>
            <div className="text-base font-bold text-pink-600 mt-0.5">{avgAttempts}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
