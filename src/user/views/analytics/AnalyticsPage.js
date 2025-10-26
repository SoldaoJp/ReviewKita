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
  ScatterChart,
  Scatter,
} from 'recharts';

export default function AnalyticsPage() {
  const [selectedCluster, setSelectedCluster] = useState('overall');

  // Sample data - replace with real API data
  const overallAccuracyData = [
    { name: 'Correct', value: 75, color: '#22C55E' },
    { name: 'Wrong', value: 15, color: '#EF4444' },
    { name: 'Skipped', value: 10, color: '#F59E0B' },
  ];

  const analyticsMetrics = {
    overallAccuracy: 78.5,
    totalQuestionsTaken: 450,
    correctAnswers: 354,
    wrongAnswers: 78,
    skippedAnswers: 18,
    averageTimePerQuestion: 45.2,
    streakDays: 12,
    previousOverallAccuracy: 72.1,
    improvementRate: 6.4,
  };

  const perSubjectAccuracyData = [
    { subject: 'Math', accuracy: 85, totalItems: 120, correctItems: 102, timePerQuestion: 48, mastery: 88 },
    { subject: 'Science', accuracy: 78, totalItems: 95, correctItems: 74, timePerQuestion: 42, mastery: 80 },
    { subject: 'History', accuracy: 92, totalItems: 85, correctItems: 78, timePerQuestion: 38, mastery: 91 },
    { subject: 'English', accuracy: 88, totalItems: 80, correctItems: 70, timePerQuestion: 40, mastery: 86 },
    { subject: 'Programming', accuracy: 95, totalItems: 70, correctItems: 67, timePerQuestion: 65, mastery: 96 },
  ];

  // Calculate weakest subject
  const weakestSubject = perSubjectAccuracyData.reduce((min, current) =>
    current.accuracy < min.accuracy ? current : min
  );

  // Subject coverage data
  const subjectCoverageData = perSubjectAccuracyData.map(subject => ({
    name: subject.subject,
    coverage: ((subject.totalItems / analyticsMetrics.totalQuestionsTaken) * 100).toFixed(1),
  }));

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

  const subjectMasteryData = perSubjectAccuracyData;

  const streakData = [
    { day: 'Mon', active: 1 },
    { day: 'Tue', active: 1 },
    { day: 'Wed', active: 1 },
    { day: 'Thu', active: 0 },
    { day: 'Fri', active: 1 },
    { day: 'Sat', active: 1 },
    { day: 'Sun', active: 1 },
  ];

  const rateData = [
    { month: 'Jan', correct: 85, wrong: 10, skipped: 5 },
    { month: 'Feb', correct: 88, wrong: 8, skipped: 4 },
    { month: 'Mar', correct: 90, wrong: 7, skipped: 3 },
    { month: 'Apr', correct: 92, wrong: 6, skipped: 2 },
  ];

  const COLORS = ['#22C55E', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'];

  const renderOverallCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {/* Overall Accuracy KPI */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Overall Accuracy</p>
        <p className="text-4xl font-bold text-[#2472B5] mb-2">{analyticsMetrics.overallAccuracy}%</p>
        <p className="text-xs text-gray-500">
          {analyticsMetrics.correctAnswers}/{analyticsMetrics.totalQuestionsTaken} correct
        </p>
      </div>

      {/* Improvement Rate */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Improvement Rate</p>
        <p className={`text-4xl font-bold mb-2 ${analyticsMetrics.improvementRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {analyticsMetrics.improvementRate >= 0 ? '+' : ''}{analyticsMetrics.improvementRate}%
        </p>
        <p className="text-xs text-gray-500">
          vs previous: {analyticsMetrics.previousOverallAccuracy}%
        </p>
      </div>

      {/* Average Time per Question */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Avg Time/Question</p>
        <p className="text-4xl font-bold text-[#2472B5] mb-2">{analyticsMetrics.averageTimePerQuestion}s</p>
        <p className="text-xs text-gray-500">Overall speed indicator</p>
      </div>

      {/* Current Streak */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Current Streak</p>
        <p className="text-4xl font-bold text-orange-500 mb-2">🔥 {analyticsMetrics.streakDays}</p>
        <p className="text-xs text-gray-500">Consecutive active days</p>
      </div>

      {/* Weakest Subject */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Weakest Subject</p>
        <p className="text-lg font-bold text-red-600 mb-2">{weakestSubject.subject}</p>
        <p className="text-xs text-gray-500">
          {weakestSubject.accuracy}% — Focus on this next
        </p>
      </div>
    </div>
  );

  const renderOverallChartsGrid = () => (
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
              label={({ value }) => `${value}%`}
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
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar dataKey="accuracy" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">🎯 Programming has the highest accuracy (95%)</p>
      </div>

      {/* Per-Subject Coverage */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per-Subject Coverage</h3>
        <p className="text-sm text-gray-500 mb-4">Percentage of total questions per subject</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectCoverageData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="coverage" fill="#10B981" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
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
            <Bar dataKey="avgTime" name="Average Time (seconds)" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">⏱️ Programming takes the most time (65s avg)</p>
      </div>

      {/* Per-Subject Speed */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per-Subject Speed</h3>
        <p className="text-sm text-gray-500 mb-4">Questions answered per minute by subject</p>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="category"
              dataKey="subject"
              name="Subject"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis type="number" dataKey="speed" name="Questions/min" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter
              name="Speed"
              data={perSubjectSpeedData}
              fill="#F59E0B"
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">⚡ Science has the fastest response speed (1.5 q/min)</p>
      </div>
    </div>
  );

  const renderDescriptiveCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Correct vs Wrong vs Skipped - Bar Chart */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Answer Distribution</h3>
        <p className="text-sm text-gray-500 mb-4">Counts and percentages of answers</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={overallAccuracyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ value }) => `${value}%`}
            >
              {overallAccuracyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2 text-sm">
          <p className="text-green-700">✅ Correct: {analyticsMetrics.correctAnswers} ({((analyticsMetrics.correctAnswers / analyticsMetrics.totalQuestionsTaken) * 100).toFixed(1)}%)</p>
          <p className="text-red-700">❌ Wrong: {analyticsMetrics.wrongAnswers} ({((analyticsMetrics.wrongAnswers / analyticsMetrics.totalQuestionsTaken) * 100).toFixed(1)}%)</p>
          <p className="text-yellow-700">⏭️ Skipped: {analyticsMetrics.skippedAnswers} ({((analyticsMetrics.skippedAnswers / analyticsMetrics.totalQuestionsTaken) * 100).toFixed(1)}%)</p>
        </div>
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
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar dataKey="accuracy" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-Subject Coverage */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per-Subject Coverage</h3>
        <p className="text-sm text-gray-500 mb-4">Percentage of items answered per subject</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectCoverageData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="coverage" fill="#10B981" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Average Time per Question */}
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
            <Bar dataKey="avgTime" name="Average Time (seconds)" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
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
            <Bar dataKey="speed" name="Questions per Minute" fill="#10B981" radius={[8, 8, 0, 0]} />
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
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar dataKey="score" fill="#F59E0B" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-3">💡 Focus on History to improve overall score</p>
      </div>

      {/* Subject Mastery Score */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Subject Mastery Score</h3>
        <p className="text-sm text-gray-500 mb-4">Long-term progress weighted by item count</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={subjectMasteryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
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
    </div>
  );

  const renderPredictiveCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Improvement Trend */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Improvement Rate</h3>
        <p className="text-sm text-gray-500 mb-4">Your progress trajectory and predicted future performance</p>
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
        <p className="text-sm text-gray-600 mt-3">🔮 Projected score for next attempt: 94% | 🚀 38% improvement since first attempt</p>
      </div>

      {/* Subject Mastery Score Radar */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Subject Mastery Radar</h3>
        <p className="text-sm text-gray-500 mb-4">Comprehensive mastery across all subjects</p>
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

      {/* Streak & Consistency */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Streak & Consistency</h3>
        <p className="text-sm text-gray-500 mb-4">Last 7 days participation (engagement driver)</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={streakData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 1]} />
            <Tooltip formatter={() => 'Active'} />
            <Bar
              dataKey="active"
              fill="#14B8A6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-4 text-sm text-gray-600">
          🔥 {streakData.filter(d => d.active === 1).length} / 7 days active | Current streak: {analyticsMetrics.streakDays} days
        </p>
      </div>

      {/* Correct/Wrong/Skipped Rate Trends */}
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

      {/* Subject Details Table */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6 md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance Details</h3>
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
              {perSubjectAccuracyData.map((subject, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-white/50 transition">
                  <td className="py-3 px-4 font-medium text-gray-800">{subject.subject}</td>
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
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Topbar />

          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
            <div className="flex items-center gap-3">
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
          </div>

          {selectedCluster === 'overall' && (
            <>
              {renderOverallCharts()}
              <div className="mt-8">
                {renderOverallChartsGrid()}
              </div>
            </>
          )}
          {selectedCluster === 'descriptive' && renderDescriptiveCharts()}
          {selectedCluster === 'analytical' && renderAnalyticalCharts()}
          {selectedCluster === 'predictive' && renderPredictiveCharts()}
        </div>
      </main>
    </div>
  );
}
