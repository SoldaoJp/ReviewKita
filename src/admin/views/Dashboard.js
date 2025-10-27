import AdminLayout from './Layout';
import { useState, useEffect } from 'react';
import { getUserActivityAnalytics } from '../services/adminService';
import httpService from '../../user/services/httpService';
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
  const [aggLoading, setAggLoading] = useState(true);
  const [aggData, setAggData] = useState(null);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        setActivityLoading(true);
        const response = await getUserActivityAnalytics(30);
        if (response.success && response.data) {
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
    const fetchAggregate = async () => {
      try {
        setAggLoading(true);
        const resp = await httpService.get('/admin/analytics/aggregate');
        if (resp && resp.data) {
          setAggData(resp.data);
        }
      } catch (e) {
        console.error('Error fetching aggregated analytics:', e);
      } finally {
        setAggLoading(false);
      }
    };

    fetchUserActivity();
    fetchAggregate();
  }, []);

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

  const masteryData = (aggData?.subjectAnalysis?.perSubjectAccuracy || [])
    .slice(0, 5)
    .map(s => ({ topic: s.subject || 'General', mastery: s.accuracy }));

  const featureData = aggData?.masteryDistribution
    ? [
        { name: 'Beginner', value: aggData.masteryDistribution.beginner || 0 },
        { name: 'Intermediate', value: aggData.masteryDistribution.intermediate || 0 },
        { name: 'Advanced', value: aggData.masteryDistribution.advanced || 0 },
        { name: 'Expert', value: aggData.masteryDistribution.expert || 0 },
      ]
    : [];
  const COLORS = ["#3B82F6", "#22C55E", "#FACC15", "#F97316"];

  const uploadData = (aggData?.difficultyAnalysis || []).map(d => {
    const total = d.totalQuestions || 0;
    const success = Math.round((d.accuracy / 100) * total);
    const fail = Math.max(0, total - success);
    return { type: d.difficulty, success, fail };
  });

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
                    ðŸ“Š <span className="font-medium">Total Reviewers Reviewed:</span> {activitySummary.totalReviewersReviewed}
                  </p>
                  <p>
                    ðŸ“… <span className="font-medium">Active Days:</span> {activitySummary.totalActiveDays} days
                  </p>
                  <p>
                    ðŸ“ˆ <span className="font-medium">Avg Reviewers/Day:</span> {activitySummary.overallAvgReviewersPerDay.toFixed(1)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Subject Mastery by Topic
            </h2>
            <p className="text-gray-500 mb-4">
              Identify strengths and weaknesses across subjects.
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
            {aggLoading ? (
              <p className="text-sm text-gray-500 mt-3">Loading subject mastery€¦</p>
            ) : (
              <p className="text-sm text-gray-600 mt-3">
                ï¿½ Showing top {masteryData.length} subjects by accuracy
              </p>
            )}
          </div>
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Mastery Distribution
            </h2>
            <p className="text-gray-500 mb-4">
              Distribution of users across mastery levels.
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={featureData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {featureData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">ðŸ§© {aggData?.masteryDistribution?.totalMasteryRecords || 0} mastery records analyzed</p>
          </div>
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Difficulty Breakdown</h2>
            <p className="text-gray-500 mb-4">Questions by difficulty with estimated correct vs incorrect.</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={uploadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="success" fill="#22C55E" radius={[6, 6, 0, 0]} name="Estimated Correct" />
                <Bar dataKey="fail" fill="#EF4444" radius={[6, 6, 0, 0]} name="Estimated Incorrect" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">œ… Built from {aggData?.performanceMetrics?.accuracyRate ?? 0}% overall accuracy</p>
          </div>
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Answer Distribution</h2>
            <p className="text-gray-500 mb-4">Counts of correct vs wrong vs skipped across the system.</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Correct', value: aggData?.performanceMetrics?.correctAnswers || 0 },
                    { name: 'Wrong', value: aggData?.performanceMetrics?.wrongAnswers || 0 },
                    { name: 'Skipped', value: aggData?.performanceMetrics?.skippedAnswers || 0 },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {['#22C55E', '#EF4444', '#FACC15'].map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">ðŸ“¦ Total questions: {aggData?.systemOverview?.totalQuestions || 0}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


