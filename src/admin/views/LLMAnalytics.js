import React, { useState, useEffect } from "react";
import AdminLayout from "./Layout";
import { fetchLLMAnalytics } from "../services/llmAnalyticsService";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function LLMAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await fetchLLMAnalytics();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={loadAnalytics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) return null;

  const COLORS = ["#3B82F6", "#22C55E", "#FACC15", "#F97316", "#EC4899", "#8B5CF6", "#06B6D4"];

  // Prepare data for charts
  const modelRatingsData = Object.entries(analytics.models_rating || {}).map(([name, value]) => ({
    name,
    rating: value
  }));

  const modelReviewersData = Object.entries(analytics.models_total_reviewers || {}).map(([name, value]) => ({
    name,
    reviewers: value
  }));

  const modelReportsData = Object.entries(analytics.models_total_reports || {}).map(([name, value]) => ({
    name,
    reports: value
  }));

  const modelRecommendationsData = Object.entries(analytics.models_total_recommendations || {}).map(([name, value]) => ({
    name,
    recommendations: value
  }));

  // Prepare model comparison radar chart data
  const radarData = analytics.model_rankings?.map(model => ({
    model: model.model_name,
    rating: model.rating_percentage,
    recommendations: model.recommendations,
    uses: model.total_uses / 10, // Scale down for better visualization
    reviewers: model.total_reviewers,
    reports: model.total_reports * 10 // Scale up for better visualization
  })) || [];

  return (
    <AdminLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">LLM Analytics Dashboard</h1>
            <button 
              onClick={loadAnalytics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Refresh Data
            </button>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-600">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Total Models</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.summary?.total_models || 0}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Total Uses</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.summary?.total_uses || 0}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Total Reviewers</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.summary?.total_reviewers || 0}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-orange-500">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Total Reports</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.summary?.total_reports || 0}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Total Recommendations</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.summary?.total_recommendations || 0}</p>
            </div>
          </div>

          {/* Monthly Reviewers Trend */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Reviewers Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthly_chart_data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="reviewers"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  name="Reviewers"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Model Comparison Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Model Ratings */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Model Ratings</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelRatingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rating" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Model Total Reviewers */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Total Reviewers per Model</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelReviewersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reviewers" fill="#22C55E" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Model Total Reports */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Total Reports per Model</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelReportsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reports" fill="#F97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Model Total Recommendations */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Total Recommendations per Model</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelRecommendationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="recommendations" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Rankings Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Model Rankings</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Uses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendations</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.model_rankings?.map((model, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.model_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full ${
                          model.rating_percentage >= 80 ? 'bg-green-100 text-green-800' :
                          model.rating_percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {model.rating_percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.total_uses}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.total_reviewers}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.total_reports}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.recommendations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
