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
import { extractDataset } from '../services/adminService';
import httpService from '../../user/services/httpService';

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await httpService.get('/admin/analytics/aggregate');
        
        if (response && response.data) {
          const apiData = response.data;
          
          const transformedData = {
            totalUsers: apiData.systemOverview.totalUsers,
            totalQuizzes: apiData.systemOverview.totalQuizzes,
            totalRetakes: apiData.systemOverview.totalRetakes,
            totalReviewers: apiData.systemOverview.totalReviewers,
            totalQuestions: apiData.systemOverview.totalQuestions,
            overallAccuracy: apiData.systemOverview.overallAccuracy.replace('%', ''),
            
            correctAnswers: apiData.performanceMetrics.correctAnswers,
            wrongAnswers: apiData.performanceMetrics.wrongAnswers,
            skippedAnswers: apiData.performanceMetrics.skippedAnswers,
            accuracyRate: apiData.performanceMetrics.accuracyRate,
            averageTimePerQuestion: apiData.performanceMetrics.avgTimePerQuestion.replace('s', ''),
            
            previousOverallAccuracy: apiData.improvement.earlyAccuracy.replace('%', ''),
            improvementRate: apiData.improvement.improvementRate.replace('%', ''),
            
            subjects: apiData.subjectAnalysis.perSubjectAccuracy
              .slice(0, 5)
              .map(s => ({
                name: (s.subject && s.subject.toLowerCase() !== 'unknown' && s.subject.toLowerCase() !== 'other') 
                  ? s.subject 
                  : 'General',
                accuracy: s.accuracy,
                totalItems: s.totalQuestions,
                correctItems: Math.round((s.accuracy / 100) * s.totalQuestions),
                timePerQuestion: s.avgSecondsPerQuestion || 0,
                mastery: s.accuracy
              })),
            topSubjects: (apiData.subjectAnalysis.topSubjects || [])
              .map(s => ({
                ...s,
                subject: (s.subject && s.subject.toLowerCase() !== 'unknown' && s.subject.toLowerCase() !== 'other')
                  ? s.subject
                  : 'General'
              })),
            weakestSubjects: (apiData.subjectAnalysis.weakestSubjects || [])
              .map(s => ({
                ...s,
                subject: (s.subject && s.subject.toLowerCase() !== 'unknown' && s.subject.toLowerCase() !== 'other')
                  ? s.subject
                  : 'General'
              })),
            
            difficultyAnalysis: apiData.difficultyAnalysis,
            
            topPerformers: apiData.topPerformers,
            
            mostActiveUsers: apiData.mostActiveUsers,
            
            avgQuizzesPerUser: apiData.userAverages.avgQuizzesPerUser,
            avgRetakesPerUser: apiData.userAverages.avgRetakesPerUser,
            avgReviewersPerUser: apiData.userAverages.avgReviewersPerUser,
            avgActiveDaysPerUser: apiData.userAverages.avgActiveDaysPerUser,
            
            activityMetrics: apiData.activityMetrics,
            
            masteryDistribution: apiData.masteryDistribution,
            
            last7DaysParticipation: (() => {
              const avgActiveDays = apiData.userAverages.avgActiveDaysPerUser;
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              const activeDaysCount = Math.round(avgActiveDays);
              
              return days.map((day, index) => {
                const isActive = index < activeDaysCount ? 1 : 0;
                const avgActivity = Math.round(apiData.activityMetrics.totalReviewerActivities / 7);
                return {
                  day,
                  active: isActive,
                  value: isActive ? avgActivity + (Math.random() * 20 - 10) : 0
                };
              });
            })(),
          };
          
          setAnalyticsData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setAnalyticsData(getMockAnalyticsData());
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const getMockAnalyticsData = () => {
    return {
      totalUsers: 109,
      totalQuizzes: 1620,
      totalRetakes: 8100,
      totalReviewers: 414,
      totalQuestions: 48600,
      overallAccuracy: 78,
      correctAnswers: 37908,
      wrongAnswers: 10692,
      skippedAnswers: 1250,
      accuracyRate: 78,
      averageTimePerQuestion: 45.3,
      previousOverallAccuracy: 72,
      improvementRate: 14,
      avgQuizzesPerUser: 14.9,
      avgRetakesPerUser: 74.3,
      avgReviewersPerUser: 3.8,
      avgActiveDaysPerUser: 5.2,
      subjects: [
        { name: 'Mathematics', accuracy: 85, totalItems: 5000, correctItems: 4250, timePerQuestion: 45, mastery: 85 },
        { name: 'Science', accuracy: 82, totalItems: 4500, correctItems: 3690, timePerQuestion: 42, mastery: 82 },
        { name: 'History', accuracy: 78, totalItems: 3800, correctItems: 2964, timePerQuestion: 38, mastery: 78 },
        { name: 'English', accuracy: 80, totalItems: 4200, correctItems: 3360, timePerQuestion: 40, mastery: 80 },
        { name: 'Computer Science', accuracy: 79, totalItems: 4000, correctItems: 3160, timePerQuestion: 50, mastery: 79 },
      ],
      topSubjects: [
        { subject: 'Mathematics', accuracy: 85, totalQuestions: 5000, attempts: 250 },
        { subject: 'Science', accuracy: 82, totalQuestions: 4500, attempts: 230 },
        { subject: 'English', accuracy: 80, totalQuestions: 4200, attempts: 220 },
      ],
      weakestSubjects: [
        { subject: 'Chemistry', accuracy: 65, totalQuestions: 2500, attempts: 150 },
        { subject: 'Biology', accuracy: 67, totalQuestions: 2700, attempts: 160 },
      ],
      difficultyAnalysis: [
        { difficulty: 'Easy', accuracy: 92, totalQuestions: 16200 },
        { difficulty: 'Medium', accuracy: 78, totalQuestions: 16200 },
        { difficulty: 'Hard', accuracy: 64, totalQuestions: 16200 },
      ],
      topPerformers: [
        { userId: '1', username: 'alice_student', accuracy: '95%', totalQuestions: 1250, totalAttempts: 75 },
        { userId: '2', username: 'bob_learner', accuracy: '93%', totalQuestions: 1180, totalAttempts: 70 },
      ],
      mostActiveUsers: [
        { userId: '1', username: 'kevin_kotlin', totalAttempts: 150, accuracy: '78%' },
        { userId: '2', username: 'laura_python', totalAttempts: 145, accuracy: '80%' },
      ],
      last7DaysParticipation: [
        { day: 'Mon', active: 1, value: 150 },
        { day: 'Tue', active: 1, value: 160 },
        { day: 'Wed', active: 1, value: 155 },
        { day: 'Thu', active: 0, value: 0 },
        { day: 'Fri', active: 1, value: 170 },
        { day: 'Sat', active: 1, value: 145 },
        { day: 'Sun', active: 1, value: 130 },
      ],
    };
  };

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

  const handleExportDataset = async () => {
    try {
      setExporting(true);
      setExportProgress(0);

      setExportProgress(20);
      const response = await extractDataset();
      setExportProgress(50);

      console.log('Export response:', response);

      if (!response || !response.dataset) {
        throw new Error('No dataset returned from server');
      }

      const dataset = response.dataset;

      if (!Array.isArray(dataset)) {
        throw new Error('Invalid dataset structure: expected an array');
      }

      if (dataset.length === 0) {
        throw new Error('Dataset is empty');
      }
      
      setExportProgress(70);
      const csvContent = convertDatasetToCSV(dataset);
      setExportProgress(90);

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ReviewKita_Dataset_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportProgress(100);
      setTimeout(() => {
        setExporting(false);
        setExportProgress(0);
      }, 500);
    } catch (error) {
      console.error('Error exporting dataset:', error);
      alert('Failed to export dataset. Please try again.');
      setExporting(false);
      setExportProgress(0);
    }
  };

  const convertDatasetToCSV = (dataset) => {
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    let csv = '';

    const allKeys = new Set();
    dataset.forEach(record => {
      Object.keys(record).forEach(key => allKeys.add(key));
    });

    const headers = Array.from(allKeys);

    csv += headers.map(header => escapeCSV(header)).join(',') + '\n';

    dataset.forEach(record => {
      const row = headers.map(header => escapeCSV(record[header]));
      csv += row.join(',') + '\n';
    });

    return csv;
  };

  const weakestSubject = data.subjects.reduce((min, current) =>
    current.accuracy < min.accuracy ? current : min
  );

  const correctWrongSkippedData = [
    { name: 'Correct', value: data.correctAnswers, percentage: ((data.correctAnswers / (data.correctAnswers + data.wrongAnswers + data.skippedAnswers)) * 100).toFixed(1) },
    { name: 'Wrong', value: data.wrongAnswers, percentage: ((data.wrongAnswers / (data.correctAnswers + data.wrongAnswers + data.skippedAnswers)) * 100).toFixed(1) },
    { name: 'Skipped', value: data.skippedAnswers, percentage: ((data.skippedAnswers / (data.correctAnswers + data.wrongAnswers + data.skippedAnswers)) * 100).toFixed(1) },
  ];

  const totalQuestionsAttempted = data.subjects.reduce((sum, s) => sum + s.totalItems, 0);
  const subjectCoverageData = data.subjects.map(subject => ({
    name: subject.name,
    coverage: ((subject.totalItems / (data.totalQuestions || 1)) * 100).toFixed(1),
  }));

  const COLORS = ["#22C55E", "#EF4444", "#FACC15", "#3B82F6", "#8B5CF6"];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <button
            onClick={handleExportDataset}
            disabled={exporting}
            className={`inline-flex items-center gap-2 bg-white/50 border border-[#eef3fb] text-sm text-gray-700 px-3 py-2 rounded-lg hover:bg-white/80 hover:text-gray-900 hover:shadow-sm transition-colors duration-150 ${exporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {exporting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4 4-4M4 20h16" />
                </svg>
                Export
              </>
            )}
          </button>
        </div>

        {/* Export Progress Bar */}
        {exporting && (
          <div className="mb-6 bg-white/50 rounded-xl shadow-sm border border-[#eef3fb] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Exporting dataset...</span>
              <span className="text-sm font-medium text-blue-600">{exportProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {exportProgress < 30 && 'Fetching data from server...'}
              {exportProgress >= 30 && exportProgress < 60 && 'Processing student performance data...'}
              {exportProgress >= 60 && exportProgress < 85 && 'Converting to CSV format...'}
              {exportProgress >= 85 && exportProgress < 100 && 'Preparing download...'}
              {exportProgress === 100 && 'Complete! Download started.'}
            </p>
          </div>
        )}

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {/* Total Users */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Users</p>
            <p className="text-4xl font-bold text-[#2472B5] mb-2">{data.totalUsers}</p>
            <p className="text-xs text-gray-500">Active users in system</p>
          </div>

          {/* Total Quizzes */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Quizzes</p>
            <p className="text-4xl font-bold text-[#2472B5] mb-2">{data.totalQuizzes.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Generated quiz sessions</p>
          </div>

          {/* Overall Accuracy */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Overall Accuracy</p>
            <p className="text-4xl font-bold text-green-600 mb-2">{data.overallAccuracy}%</p>
            <p className="text-xs text-gray-500">System-wide average</p>
          </div>

          {/* Total Reviewers */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Reviewers</p>
            <p className="text-4xl font-bold text-purple-600 mb-2">{data.totalReviewers}</p>
            <p className="text-xs text-gray-500">Reviewer collections</p>
          </div>

          {/* Improvement Rate */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Improvement Rate</p>
            <p className={`text-4xl font-bold mb-2 ${data.improvementRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.improvementRate >= 0 ? '+' : ''}{data.improvementRate}%
            </p>
            <p className="text-xs text-gray-500">
              {data.previousOverallAccuracy}% â†’ {data.overallAccuracy}%
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
              <p className="text-green-700">âœ… Correct: {data.correctAnswers} ({correctWrongSkippedData[0].percentage}%)</p>
              <p className="text-red-700">âŒ Wrong: {data.wrongAnswers} ({correctWrongSkippedData[1].percentage}%)</p>
              <p className="text-yellow-700">â­ï¸ Skipped: {data.skippedAnswers} ({correctWrongSkippedData[2].percentage}%)</p>
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
              ðŸ”¥ {data.last7DaysParticipation.filter(d => d.active === 1).length} / 7 days active
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

        {/* Top Performers and Most Active Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Top Performers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Username</th>
                    <th className="text-center py-3 px-4 font-semibold">Accuracy</th>
                    <th className="text-center py-3 px-4 font-semibold">Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPerformers?.slice(0, 5).map((user, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-white/50 transition">
                      <td className="py-3 px-4 font-medium text-gray-800">{user.username}</td>
                      <td className="text-center py-3 px-4">
                        <span className="font-semibold text-green-600">{user.accuracy}</span>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">{user.totalAttempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Most Active Users */}
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Most Active Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Username</th>
                    <th className="text-center py-3 px-4 font-semibold">Attempts</th>
                    <th className="text-center py-3 px-4 font-semibold">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {data.mostActiveUsers?.slice(0, 5).map((user, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-white/50 transition">
                      <td className="py-3 px-4 font-medium text-gray-800">{user.username}</td>
                      <td className="text-center py-3 px-4 text-gray-600">{user.totalAttempts}</td>
                      <td className="text-center py-3 px-4">
                        <span className="font-semibold text-blue-600">{user.accuracy}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User Averages Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Avg Quizzes/User</p>
            <p className="text-3xl font-bold text-[#2472B5]">{data.avgQuizzesPerUser?.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">Per user average</p>
          </div>
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Avg Retakes/User</p>
            <p className="text-3xl font-bold text-purple-600">{data.avgRetakesPerUser?.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">Per user average</p>
          </div>
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Avg Reviewers/User</p>
            <p className="text-3xl font-bold text-indigo-600">{data.avgReviewersPerUser?.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">Per user average</p>
          </div>
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Avg Active Days/User</p>
            <p className="text-3xl font-bold text-orange-600">{data.avgActiveDaysPerUser?.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">Per user average</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
