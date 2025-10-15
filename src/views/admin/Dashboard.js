import AdminLayout from '../../components/admin/Layout';
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
  // Chart data from AdminAnalytics.js
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
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Class Mastery */}
          <div className="bg-white rounded-xl shadow p-6">
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
          {/* Engagement Trends */}
          <div className="bg-white rounded-xl shadow p-6">
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
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">
              🔹 Engagement increased by 40% since Week 1.
            </p>
          </div>
          {/* Feature Usage */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Feature Usage Distribution
            </h2>
            <p className="text-gray-500 mb-4">
              Shows which features drive most of the learning time.
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={featureData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {featureData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">
              🧠 AI Summaries are the most used feature (40%).
            </p>
          </div>
          {/* Upload Success */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Upload Success by File Type
            </h2>
            <p className="text-gray-500 mb-4">
              Measures upload reliability and parsing success rates.
            </p>
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
            <p className="text-sm text-gray-600 mt-3">
              ✅ 97% average upload success rate across all file types.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
