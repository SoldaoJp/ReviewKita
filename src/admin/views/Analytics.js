import AdminLayout from './Layout';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
} from "recharts";

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data from backend
    const mockAnalyticsData = {
      overallAccuracy: 78.5,
      totalQuestionsTaken: 450,
      correctAnswers: 354,
      wrongAnswers: 78,
      skippedAnswers: 18,
      averageTimePerQuestion: 45.2, // seconds
      streakDays: 12,
      subjects: [
        { name: 'Science', accuracy: 82, totalItems: 120, correctItems: 98, timePerQuestion: 42, mastery: 85 },
        { name: 'Programming', accuracy: 75, totalItems: 95, correctItems: 71, timePerQuestion: 58, mastery: 78 },
        { name: 'English', accuracy: 81, totalItems: 85, correctItems: 69, timePerQuestion: 38, mastery: 80 },
        { name: 'Math', accuracy: 72, totalItems: 110, correctItems: 79, timePerQuestion: 52, mastery: 75 },
        { name: 'History', accuracy: 68, totalItems: 40, correctItems: 27, timePerQuestion: 35, mastery: 70 },
      ],
      previousOverallAccuracy: 72.1,
      improvementRate: 6.4,
      last7DaysParticipation: [
        { day: 'Mon', active: 1 },
        { day: 'Tue', active: 1 },
        { day: 'Wed', active: 1 },
        { day: 'Thu', active: 0 },
        { day: 'Fri', active: 1 },
        { day: 'Sat', active: 1 },
        { day: 'Sun', active: 1 },
      ],
    };

    // Simulate loading delay
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center h-screen">
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!analyticsData) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      </AdminLayout>
    );
  }

  const data = analyticsData;

  // Calculate weakest subject
  const weakestSubject = data.subjects.reduce((min, current) =>
    current.accuracy < min.accuracy ? current : min
  );

  // Correct vs Wrong vs Skipped data
  const correctWrongSkippedData = [
    { name: 'Correct', value: data.correctAnswers, percentage: ((data.correctAnswers / data.totalQuestionsTaken) * 100).toFixed(1) },
    { name: 'Wrong', value: data.wrongAnswers, percentage: ((data.wrongAnswers / data.totalQuestionsTaken) * 100).toFixed(1) },
    { name: 'Skipped', value: data.skippedAnswers, percentage: ((data.skippedAnswers / data.totalQuestionsTaken) * 100).toFixed(1) },
  ];

  // Subject coverage data
  const subjectCoverageData = data.subjects.map(subject => ({
    name: subject.name,
    coverage: ((subject.totalItems / data.totalQuestionsTaken) * 100).toFixed(1),
  }));

  const COLORS = ["#22C55E", "#EF4444", "#FACC15", "#3B82F6", "#8B5CF6"];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <button
            title="Export (not implemented)"
            onClick={(e) => { e.preventDefault(); }}
            aria-disabled="true"
            className="inline-flex items-center gap-2 bg-white/50 border border-[#eef3fb] text-sm text-gray-700 px-3 py-2 rounded-lg hover:bg-white/80 hover:text-gray-900 hover:shadow-sm transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4 4-4M4 20h16" />
            </svg>
            Export
          </button>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {/* Overall Accuracy */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Overall Accuracy</p>
            <p className="text-4xl font-bold text-[#2472B5] mb-2">{data.overallAccuracy}%</p>
            <p className="text-xs text-gray-500">
              {data.correctAnswers}/{data.totalQuestionsTaken} correct
            </p>
          </div>

          {/* Improvement Rate */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Improvement Rate</p>
            <p className={`text-4xl font-bold mb-2 ${data.improvementRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.improvementRate >= 0 ? '+' : ''}{data.improvementRate}%
            </p>
            <p className="text-xs text-gray-500">
              vs previous: {data.previousOverallAccuracy}%
            </p>
          </div>

          {/* Average Time per Question */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Avg Time/Question</p>
            <p className="text-4xl font-bold text-[#2472B5] mb-2">{data.averageTimePerQuestion}s</p>
            <p className="text-xs text-gray-500">Overall speed indicator</p>
          </div>

          {/* Current Streak */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Current Streak</p>
            <p className="text-4xl font-bold text-orange-500 mb-2">🔥 {data.streakDays}</p>
            <p className="text-xs text-gray-500">Consecutive active days</p>
          </div>

          {/* Weakest Subject */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Weakest Subject</p>
            <p className="text-lg font-bold text-red-600 mb-2">{weakestSubject.name}</p>
            <p className="text-xs text-gray-500">
              Accuracy: {weakestSubject.accuracy}% — Focus on this next
            </p>
          </div>
        </div>

        {/* Main Grid: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Correct vs Wrong vs Skipped */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Answer Distribution
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Counts and percentages of correct, wrong, and skipped answers
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={correctWrongSkippedData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  fill="#8884d8"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {correctWrongSkippedData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} items`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-green-700">✅ Correct: {data.correctAnswers} ({correctWrongSkippedData[0].percentage}%)</p>
              <p className="text-red-700">❌ Wrong: {data.wrongAnswers} ({correctWrongSkippedData[1].percentage}%)</p>
              <p className="text-yellow-700">⏭️ Skipped: {data.skippedAnswers} ({correctWrongSkippedData[2].percentage}%)</p>
            </div>
          </div>

          {/* Per-Subject Accuracy */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Per-Subject Accuracy
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Identify strengths and weaknesses across subjects
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.subjects}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="accuracy" name="Accuracy" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Per-Subject Coverage */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Per-Subject Coverage
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Percentage of total questions per subject (context for accuracy)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={subjectCoverageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="coverage" name="Coverage Percentage" fill="#10B981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Per-Subject Speed */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Per-Subject Speed
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Average seconds per question by subject
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="category"
                  dataKey="name"
                  name="Subject"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis type="number" dataKey="timePerQuestion" name="Seconds per Question" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  name="Average Time (seconds)"
                  data={data.subjects}
                  fill="#F59E0B"
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Mastery Score */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Subject Mastery Score
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Long-term progress weighted by item count
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.subjects}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="mastery"
                  name="Mastery Percentage"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 7-Day Participation Streak */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Streak & Consistency
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Last 7 days participation (engagement driver)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.last7DaysParticipation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 1]} />
                <Tooltip formatter={() => 'Active'} />
                <Bar
                  dataKey="active"
                  fill="#14B8A6"
                  radius={[8, 8, 0, 0]}
                  shape={<rect />}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-4 text-sm text-gray-600">
              🔥 {data.last7DaysParticipation.filter(d => d.active === 1).length} / 7 days active
            </p>
          </div>
        </div>

        {/* Subject Details Table */}
        <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Subject Performance Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Accuracy</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Items Answered</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Correct</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Avg Time/Q (sec)</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Mastery Score</th>
                </tr>
              </thead>
              <tbody>
                {data.subjects.map((subject, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-white/50 transition">
                    <td className="py-3 px-4 font-medium text-gray-800">{subject.name}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-semibold ${subject.accuracy >= 80 ? 'text-green-600' : subject.accuracy >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {subject.accuracy}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-600">{subject.totalItems}</td>
                    <td className="text-center py-3 px-4 text-gray-600">{subject.correctItems}</td>
                    <td className="text-center py-3 px-4 text-gray-600">{subject.timePerQuestion}s</td>
                    <td className="text-center py-3 px-4">
                      <span className="font-semibold text-[#2472B5]">{subject.mastery}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
