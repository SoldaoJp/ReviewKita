import AdminLayout from './Layout';
import { useState, useEffect } from 'react';
import { getUserActivityAnalytics } from '../services/adminService';
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
} from "recharts";

export default function AdminDashboard() {
  const [userActivityData, setUserActivityData] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activitySummary, setActivitySummary] = useState(null);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        setActivityLoading(true);
        const response = await getUserActivityAnalytics(30);
        if (response.success && response.data) {
          // Format data for the chart
          const formattedData = response.data.dailyStats.map(stat => ({
            date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: stat.date,
            totalReviewers: stat.totalReviewers,
            activeUsers: stat.activeUsers,
            avgReviewersPerUser: stat.avgReviewersPerUser
          }));
          setUserActivityData(formattedData);
          setActivitySummary(response.data.summary);
        }
      } catch (error) {
        console.error('Error fetching user activity analytics:', error);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  // Custom tooltip for user activity chart
  const CustomActivityTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{data.fullDate}</p>
          <p className="text-sm text-blue-600">
            <span className="font-medium">Total Reviewers:</span> {data.totalReviewers}
          </p>
          <p className="text-sm text-green-600">
            <span className="font-medium">Active Users:</span> {data.activeUsers}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Avg per User:</span> {data.avgReviewersPerUser.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const masteryData = [
    { topic: "Data Scalability", mastery: 82 },
    { topic: "Quantitative Method", mastery: 68 },
    { topic: "Advanced Database", mastery: 74 },
    { topic: "IAS", mastery: 60 },
    { topic: "Advanced Programming", mastery: 88 },
  ];
  const engagementData = [
    { week: "Week 1", active: 320 },
    { week: "Week 2", active: 410 },
    { week: "Week 3", active: 385 },
    { week: "Week 4", active: 450 },
  ];
  const featureData = [
    { name: "AI Summaries", value: 40 },
    { name: "Flashcards", value: 25 },
    { name: "Quizzes", value: 30 },
    { name: "Achievements", value: 5 },
  ];
  const COLORS = ["#3B82F6", "#22C55E", "#FACC15", "#F97316"];
  const uploadData = [
    { type: "PDF", success: 920, fail: 30 },
    { type: "DOCX", success: 740, fail: 50 },
    { type: "TXT", success: 530, fail: 20 },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        {/* User Activity Analytics - 30 Days */}
        <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            User Activity Overview (Last 30 Days)
          </h2>
          <p className="text-gray-500 mb-4">
            Track daily reviewer engagement and active user participation.
          </p>
          {activityLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading activity data...</p>
            </div>
          ) : userActivityData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No activity data available</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    interval="preserveStartEnd"
                  />
                  <YAxis />
                  <Tooltip content={<CustomActivityTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="totalReviewers" 
                    stroke="#3B82F6" 
                    strokeWidth={3} 
                    dot={{ r: 4 }} 
                    name="Total Reviewers"
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke="#22C55E" 
                    strokeWidth={3} 
                    dot={{ r: 4 }} 
                    name="Active Users"
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              {activitySummary && (
                <div className="mt-4 flex gap-6 text-sm text-gray-600">
                  <p>
                    📊 <span className="font-medium">Total Reviewers Reviewed:</span> {activitySummary.totalReviewersReviewed}
                  </p>
                  <p>
                    📅 <span className="font-medium">Active Days:</span> {activitySummary.totalActiveDays} days
                  </p>
                  <p>
                    📈 <span className="font-medium">Avg Reviewers/Day:</span> {activitySummary.overallAvgReviewersPerDay.toFixed(1)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Class Mastery by Topic
            </h2>
            <p className="text-gray-500 mb-4">
              Identify strengths and weaknesses across learning topics.
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={masteryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mastery" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">
              🟩 Highest mastery: Programming (88%) | 🔴 Lowest: History (60%)
            </p>
          </div>
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Student Engagement Trends
            </h2>
            <p className="text-gray-500 mb-4">
              Weekly active students – measures participation and learning streaks.
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#22C55E" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">🔹 Engagement increased by 40% since Week 1.</p>
          </div>
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Feature Usage Distribution</h2>
            <p className="text-gray-500 mb-4">Shows which features drive most of the learning time.</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={featureData} dataKey="value" nameKey="name" outerRadius={90} fill="#8884d8" label>
                  {featureData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">🧠 AI Summaries are the most used feature (40%).</p>
          </div>
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Upload Success by File Type</h2>
            <p className="text-gray-500 mb-4">Measures upload reliability and parsing success rates.</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={uploadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="success" fill="#22C55E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="fail" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">✅ 97% average upload success rate across all file types.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


