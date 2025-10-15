import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function LLMAnalytics() {
  // Mock Data
  const queryData = [
    { name: "Mon", volume: 20000 },
    { name: "Tue", volume: 40000 },
    { name: "Wed", volume: 60000 },
    { name: "Thu", volume: 70000 },
    { name: "Fri", volume: 80000 },
    { name: "Sat", volume: 95000 },
    { name: "Sun", volume: 100000 },
  ];

  const latencyData = [
    { name: "<50ms", percent: 10 },
    { name: "50-100ms", percent: 25 },
    { name: "100-200ms", percent: 30 },
    { name: "200-300ms", percent: 20 },
    { name: ">300ms", percent: 15 },
  ];

  const promptData = [
    { name: "Code Generation", value: 40 },
    { name: "Creative Writing", value: 15 },
    { name: "Data Summarization", value: 25 },
    { name: "Translation", value: 10 },
    { name: "Research", value: 10 },
  ];

  const COLORS = ["#3B82F6", "#22C55E", "#FACC15", "#F97316", "#EC4899"];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Large Language Model Analytics
      </h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-8">
        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg shadow">
          <h2 className="text-gray-700 font-semibold">Total Queries</h2>
          <p className="text-2xl font-bold text-gray-900">1,800,500</p>
          <p className="text-green-600 text-sm">↑ 12% this week</p>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg shadow">
          <h2 className="text-gray-700 font-semibold">Average Latency (ms)</h2>
          <p className="text-2xl font-bold text-gray-900">750ms</p>
          <p className="text-gray-600 text-sm">—</p>
        </div>

        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow">
          <h2 className="text-gray-700 font-semibold">Error Rate</h2>
          <p className="text-2xl font-bold text-gray-900">1.2%</p>
          <p className="text-green-600 text-sm">↓ 5% this week</p>
        </div>

        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg shadow">
          <h2 className="text-gray-700 font-semibold">Cost (USD)</h2>
          <p className="text-2xl font-bold text-gray-900">$1,500</p>
          <p className="text-red-600 text-sm">↑ 8% this week</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Daily Query Volume */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-800 font-semibold mb-4">Daily Query Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={queryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Query Latency Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-800 font-semibold mb-4">Query Latency Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percent" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="bg-white mt-8 p-6 rounded-lg shadow w-full max-w-6xl">
        <h3 className="text-gray-800 font-semibold mb-4">Top 5 Prompt Categories</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={promptData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {promptData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
