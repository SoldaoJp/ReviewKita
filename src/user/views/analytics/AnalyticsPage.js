import { useState } from 'react';
import Topbar from '../components/sidebar/Topbar';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const [selectedCluster, setSelectedCluster] = useState('overall');

  // Sample data - replace with real API data
  const overallAccuracyData = [
    { name: 'Correct', value: 75, color: '#22C55E' },
    { name: 'Wrong', value: 15, color: '#EF4444' },
    { name: 'Skipped', value: 10, color: '#F59E0B' },
  ];

  const perSubjectAccuracyData = [
    { subject: 'Math', accuracy: 85 },
    { subject: 'Science', accuracy: 78 },
    { subject: 'History', accuracy: 92 },
    { subject: 'English', accuracy: 88 },
    { subject: 'Programming', accuracy: 95 },
  ];

  const avgTimePerQuestionData = [
    { subject: 'Math', avgTime: 45 },
    { subject: 'Science', avgTime: 38 },
    { subject: 'History', avgTime: 52 },
    { subject: 'English', avgTime: 40 },
    { subject: 'Programming', avgTime: 65 },
  ];

  const correctVsWrongData = [
    { week: 'Week 1', correct: 120, wrong: 25, skipped: 15 },
    { week: 'Week 2', correct: 145, wrong: 20, skipped: 10 },
    { week: 'Week 3', correct: 160, wrong: 18, skipped: 8 },
    { week: 'Week 4', correct: 175, wrong: 15, skipped: 5 },
  ];

  const perSubjectSpeedData = [
    { subject: 'Math', speed: 1.2 },
    { subject: 'Science', speed: 1.5 },
    { subject: 'History', speed: 0.9 },
    { subject: 'English', speed: 1.3 },
    { subject: 'Programming', speed: 0.8 },
  ];

  const difficultyPerformanceData = [
    { difficulty: 'Easy', correct: 95, wrong: 5 },
    { difficulty: 'Medium', correct: 78, wrong: 22 },
    { difficulty: 'Hard', correct: 52, wrong: 48 },
  ];

  const weakestSubjectsData = [
    { subject: 'History', score: 65 },
    { subject: 'Science', score: 72 },
    { subject: 'English', score: 78 },
    { subject: 'Math', score: 82 },
    { subject: 'Programming', score: 88 },
  ];

  const improvementData = [
    { attempt: 'Attempt 1', score: 65 },
    { attempt: 'Attempt 2', score: 72 },
    { attempt: 'Attempt 3', score: 78 },
    { attempt: 'Attempt 4', score: 85 },
    { attempt: 'Current', score: 90 },
  ];

  const subjectMasteryData = [
    { subject: 'Math', mastery: 85 },
    { subject: 'Science', mastery: 78 },
    { subject: 'History', mastery: 92 },
    { subject: 'English', mastery: 88 },
    { subject: 'Programming', mastery: 95 },
  ];

  const streakData = [
    { day: 'Mon', streak: 5 },
    { day: 'Tue', streak: 6 },
    { day: 'Wed', streak: 7 },
    { day: 'Thu', streak: 8 },
    { day: 'Fri', streak: 9 },
    { day: 'Sat', streak: 10 },
    { day: 'Sun', streak: 11 },
  ];

  const rateData = [
    { month: 'Jan', correct: 85, wrong: 10, skipped: 5 },
    { month: 'Feb', correct: 88, wrong: 8, skipped: 4 },
    { month: 'Mar', correct: 90, wrong: 7, skipped: 3 },
    { month: 'Apr', correct: 92, wrong: 6, skipped: 2 },
  ];

  const COLORS = ['#22C55E', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'];

  const renderOverallCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Overall Accuracy Pie */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Overall Accuracy</h3>
        <p className="text-sm text-gray-500 mb-4">Your performance breakdown across all quizzes</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={overallAccuracyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {overallAccuracyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">✅ 75% correct answers across all attempts</p>
      </div>

      {/* Correct vs Wrong vs Skipped */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Correct vs Wrong vs Skipped</h3>
        <p className="text-sm text-gray-500 mb-4">Weekly trend of your quiz responses</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={correctVsWrongData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="correct" stroke="#22C55E" strokeWidth={2} />
            <Line type="monotone" dataKey="wrong" stroke="#EF4444" strokeWidth={2} />
            <Line type="monotone" dataKey="skipped" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">📈 Correct answers increased by 45% over 4 weeks</p>
      </div>

      {/* Per Subject Accuracy */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per Subject Accuracy</h3>
        <p className="text-sm text-gray-500 mb-4">How well you perform in each subject</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={perSubjectAccuracyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">🎯 Programming has the highest accuracy (95%)</p>
      </div>

      {/* Average Time per Question */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Time per Question</h3>
        <p className="text-sm text-gray-500 mb-4">Time spent per question by subject (seconds)</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={avgTimePerQuestionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgTime" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">⏱️ Programming takes the most time (65s avg)</p>
      </div>
    </div>
  );

  const renderDescriptiveCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Overall Accuracy - same as overall */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Overall Accuracy</h3>
        <p className="text-sm text-gray-500 mb-4">Snapshot of your current performance</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={overallAccuracyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {overallAccuracyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Correct vs Wrong vs Skipped */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Response Breakdown</h3>
        <p className="text-sm text-gray-500 mb-4">Weekly trends in your answer patterns</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={correctVsWrongData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="correct" stroke="#22C55E" strokeWidth={2} />
            <Line type="monotone" dataKey="wrong" stroke="#EF4444" strokeWidth={2} />
            <Line type="monotone" dataKey="skipped" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Per Subject Accuracy */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per Subject Accuracy</h3>
        <p className="text-sm text-gray-500 mb-4">Subject-wise performance distribution</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={perSubjectAccuracyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Average Time */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Time per Question</h3>
        <p className="text-sm text-gray-500 mb-4">Time efficiency by subject</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={avgTimePerQuestionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgTime" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAnalyticalCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Per Subject Speed */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per Subject Speed</h3>
        <p className="text-sm text-gray-500 mb-4">Questions answered per minute by subject</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={perSubjectSpeedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="speed" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">⚡ Science has the fastest response speed (1.5 q/min)</p>
      </div>

      {/* Difficulty Performance */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Difficulty Performance</h3>
        <p className="text-sm text-gray-500 mb-4">How you perform across difficulty levels</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={difficultyPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="difficulty" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="correct" fill="#22C55E" radius={[8, 8, 0, 0]} />
            <Bar dataKey="wrong" fill="#EF4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">📊 95% accuracy on easy questions, 52% on hard</p>
      </div>

      {/* Weakest Subjects */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Weakest Subjects</h3>
        <p className="text-sm text-gray-500 mb-4">Subjects ranked by performance (lowest to highest)</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weakestSubjectsData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="subject" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#F59E0B" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">💡 Focus on History to improve overall score</p>
      </div>

      {/* Improvement vs Last Attempt */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Improvement vs Last Attempt</h3>
        <p className="text-sm text-gray-500 mb-4">Your progress trajectory over attempts</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={improvementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="attempt" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">🚀 38% improvement since first attempt</p>
      </div>
    </div>
  );

  const renderPredictiveCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Improvement Trend */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Improvement vs Last Attempt</h3>
        <p className="text-sm text-gray-500 mb-4">Predicted future performance based on current trajectory</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={improvementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="attempt" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">🔮 Projected score for next attempt: 94%</p>
      </div>

      {/* Subject Mastery Score */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Subject Mastery Score</h3>
        <p className="text-sm text-gray-500 mb-4">Comprehensive mastery radar across all subjects</p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={subjectMasteryData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Mastery" dataKey="mastery" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">🎯 Programming mastery is nearly complete (95%)</p>
      </div>

      {/* Streak */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Streak</h3>
        <p className="text-sm text-gray-500 mb-4">Consistency indicator and predicted continuation</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={streakData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="streak" stroke="#F59E0B" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">🔥 11-day streak! Keep going for milestone rewards</p>
      </div>

      {/* Correct/Wrong/Skipped Rate */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Answer Rate Trends</h3>
        <p className="text-sm text-gray-500 mb-4">Monthly trends predicting future answer patterns</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="correct" stroke="#22C55E" strokeWidth={2} />
            <Line type="monotone" dataKey="wrong" stroke="#EF4444" strokeWidth={2} />
            <Line type="monotone" dataKey="skipped" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">📈 Predicted next month: 94% correct, 4% wrong, 2% skipped</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Topbar />

          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
            <div className="relative">
              <select
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="overall">Overall</option>
                <option value="descriptive">Descriptive</option>
                <option value="analytical">Analytical</option>
                <option value="predictive">Predictive</option>
              </select>
            </div>
          </div>

          {selectedCluster === 'overall' && renderOverallCharts()}
          {selectedCluster === 'descriptive' && renderDescriptiveCharts()}
          {selectedCluster === 'analytical' && renderAnalyticalCharts()}
          {selectedCluster === 'predictive' && renderPredictiveCharts()}
        </div>
      </main>
    </div>
  );
}
