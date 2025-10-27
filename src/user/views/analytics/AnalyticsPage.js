import { useState, useEffect } from 'react';
import Topbar from '../components/sidebar/Topbar';
import {
  getOverallAccuracy,
  getCorrectWrongSkipped,
  getPerSubjectAccuracy,
  getPerSubjectCoverage,
  getAverageTime,
  getPerSubjectSpeed,
  getWeakestSubject,
  getStreak,
  getSubjectMastery,
  getSubjectRanking,
  getDifficultyAnalysis,
  getImprovementTrajectory,
  getAnswerRateTrends,
} from '../../services/analyticsService';
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
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    overallAccuracy: null,
    correctWrongSkipped: null,
    perSubjectAccuracy: null,
    perSubjectCoverage: null,
    averageTime: null,
    perSubjectSpeed: null,
    weakestSubject: null,
    streak: null,
    subjectMastery: null,
    subjectRanking: null,
    difficultyAnalysis: null,
    improvementTrajectory: null,
    answerRateTrends: null,
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [
          overallAccuracyRes,
          correctWrongSkippedRes,
          perSubjectAccuracyRes,
          perSubjectCoverageRes,
          averageTimeRes,
          perSubjectSpeedRes,
          weakestSubjectRes,
          streakRes,
          subjectMasteryRes,
          subjectRankingRes,
          difficultyAnalysisRes,
          improvementTrajectoryRes,
          answerRateTrendsRes,
        ] = await Promise.all([
          getOverallAccuracy(),
          getCorrectWrongSkipped(),
          getPerSubjectAccuracy(),
          getPerSubjectCoverage(),
          getAverageTime(),
          getPerSubjectSpeed(),
          getWeakestSubject(),
          getStreak(),
          getSubjectMastery(),
          getSubjectRanking(),
          getDifficultyAnalysis(),
          getImprovementTrajectory(),
          getAnswerRateTrends(),
        ]);

        setAnalyticsData({
          overallAccuracy: overallAccuracyRes,
          correctWrongSkipped: correctWrongSkippedRes,
          perSubjectAccuracy: perSubjectAccuracyRes,
          perSubjectCoverage: perSubjectCoverageRes,
          averageTime: averageTimeRes,
          perSubjectSpeed: perSubjectSpeedRes,
          weakestSubject: weakestSubjectRes,
          streak: streakRes,
          subjectMastery: subjectMasteryRes,
          subjectRanking: subjectRankingRes,
          difficultyAnalysis: difficultyAnalysisRes,
          improvementTrajectory: improvementTrajectoryRes,
          answerRateTrends: answerRateTrendsRes,
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const processedData = {
    overallAccuracyData: analyticsData.overallAccuracy
      ? [
          { name: 'Correct', value: analyticsData.overallAccuracy.totalCorrect, color: '#22C55E' },
          { name: 'Wrong', value: analyticsData.overallAccuracy.totalQuestions - analyticsData.overallAccuracy.totalCorrect - (analyticsData.overallAccuracy.totalSkipped || 0), color: '#EF4444' },
          { name: 'Skipped', value: analyticsData.overallAccuracy.totalSkipped || 0, color: '#F59E0B' },
        ]
      : [],

    analyticsMetrics: analyticsData.overallAccuracy
      ? {
          overallAccuracy: analyticsData.overallAccuracy.accuracyPct,
          totalQuestionsTaken: analyticsData.overallAccuracy.totalQuestions,
          correctAnswers: analyticsData.overallAccuracy.totalCorrect,
          wrongAnswers: analyticsData.overallAccuracy.totalQuestions - analyticsData.overallAccuracy.totalCorrect - (analyticsData.overallAccuracy.totalSkipped || 0),
          skippedAnswers: analyticsData.overallAccuracy.totalSkipped || 0,
          totalQuizzes: analyticsData.overallAccuracy.totalQuizzes,
          totalRetakes: analyticsData.overallAccuracy.totalRetakes,
          totalAttempts: analyticsData.overallAccuracy.totalAttempts,
        }
      : {
          overallAccuracy: 0,
          totalQuestionsTaken: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          skippedAnswers: 0,
          totalQuizzes: 0,
          totalRetakes: 0,
          totalAttempts: 0,
        },

    correctVsWrongData: analyticsData.correctWrongSkipped?.weeks?.map((week) => ({
      week: `Week ${week.week}`,
      correct: week.correct,
      wrong: week.wrong,
      skipped: week.skipped,
    })) || [],

    perSubjectAccuracyData: analyticsData.perSubjectAccuracy?.perSubject?.map((subject) => ({
      subject: subject.subject,
      accuracy: subject.accuracyPct,
      totalItems: subject.totalQuestions,
      correctItems: subject.correct,
      timePerQuestion: 0,
      mastery: subject.accuracyPct,
      quizCount: subject.quizCount,
      wrong: subject.wrong,
      skipped: subject.skipped,
    })) || [],

    subjectCoverageData: analyticsData.perSubjectCoverage?.coverage?.map((subject) => ({
      name: subject.subject,
      coverage: subject.coveragePct.toFixed(1),
      totalQuestions: subject.totalQuestions,
    })) || [],

    avgTimePerQuestionData: analyticsData.averageTime?.perSubject?.map((subject) => ({
      subject: subject.subject,
      avgTime: subject.avgTimePerQSec.toFixed(1),
      totalQuestions: subject.totalQuestions,
    })) || [],

    perSubjectSpeedData: analyticsData.perSubjectSpeed?.perSubjectSpeed?.map((subject) => ({
      subject: subject.subject,
      speed: (60 / subject.avgTimePerQSec).toFixed(2),
      avgTimePerQSec: subject.avgTimePerQSec,
      totalQuestions: subject.totalQuestions,
    })) || [],

    subjectMasteryData: analyticsData.subjectMastery?.mastery?.map((subject) => ({
      subject: subject.subject,
      mastery: subject.masteryPct,
      totalAnswered: subject.totalAnswered,
      totalCorrect: subject.totalCorrect,
    })) || [],

    answerDistributionData: analyticsData.correctWrongSkipped?.overall
      ? [
          { name: 'Correct', value: analyticsData.correctWrongSkipped.overall.correct, color: '#22C55E' },
          { name: 'Wrong', value: analyticsData.correctWrongSkipped.overall.wrong, color: '#EF4444' },
          { name: 'Skipped', value: analyticsData.correctWrongSkipped.overall.skipped, color: '#F59E0B' },
        ]
      : [],

    subjectRankingData: analyticsData.subjectRanking?.ranking?.map((item) => ({
      subject: item.subject,
      score: item.score,
      rank: item.rank,
      accuracyPct: item.accuracyPct,
      avgTimePerQSec: item.avgTimePerQSec,
      correct: item.correct,
      wrong: item.wrong,
      skipped: item.skipped,
      totalQuestions: item.totalQuestions,
    })) || [],

    difficultyPerformanceData: analyticsData.difficultyAnalysis?.difficulty
      ? [
          {
            difficulty: 'Easy',
            correct: analyticsData.difficultyAnalysis.difficulty.easy.correct,
            wrong: analyticsData.difficultyAnalysis.difficulty.easy.wrong,
            skipped: analyticsData.difficultyAnalysis.difficulty.easy.skipped,
            accuracyPct: analyticsData.difficultyAnalysis.difficulty.easy.accuracyPct,
          },
          {
            difficulty: 'Medium',
            correct: analyticsData.difficultyAnalysis.difficulty.medium.correct,
            wrong: analyticsData.difficultyAnalysis.difficulty.medium.wrong,
            skipped: analyticsData.difficultyAnalysis.difficulty.medium.skipped,
            accuracyPct: analyticsData.difficultyAnalysis.difficulty.medium.accuracyPct,
          },
          {
            difficulty: 'Hard',
            correct: analyticsData.difficultyAnalysis.difficulty.hard.correct,
            wrong: analyticsData.difficultyAnalysis.difficulty.hard.wrong,
            skipped: analyticsData.difficultyAnalysis.difficulty.hard.skipped,
            accuracyPct: analyticsData.difficultyAnalysis.difficulty.hard.accuracyPct,
          },
        ]
      : [],

    improvementTrajectoryData: analyticsData.improvementTrajectory?.attempts?.map((attempt) => ({
      attempt: attempt.attemptNumber,
      score: attempt.averageScore,
      date: new Date(attempt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      totalQuizzes: attempt.totalQuizzes,
    })) || [],

    answerRateTrendsData: analyticsData.answerRateTrends?.monthly?.map((month) => ({
      month: month.monthName,
      correct: month.correctPct,
      wrong: month.wrongPct,
      skipped: month.skippedPct,
      totalQuestions: month.totalQuestions,
    })) || [],
  };

  if (analyticsData.averageTime?.perSubject) {
    processedData.perSubjectAccuracyData = processedData.perSubjectAccuracyData.map((subject) => {
      const timeData = analyticsData.averageTime.perSubject.find(
        (t) => t.subject === subject.subject
      );
      return {
        ...subject,
        timePerQuestion: timeData ? timeData.avgTimePerQSec.toFixed(1) : 0,
      };
    });
  }

  // Derived KPIs for cards
  let previousOverallAccuracy = 0;
  let improvementRate = 0;
  if (analyticsData.improvementTrajectory?.attempts?.length >= 2) {
    const attempts = analyticsData.improvementTrajectory.attempts;
    const last = attempts[attempts.length - 1]?.averageScore ?? 0;
    const prev = attempts[attempts.length - 2]?.averageScore ?? 0;
    previousOverallAccuracy = prev;
    improvementRate = +(last - prev).toFixed(1);
  } else if (analyticsData.overallAccuracy?.accuracyPct != null) {
    previousOverallAccuracy = analyticsData.overallAccuracy.accuracyPct;
    improvementRate = 0;
  }

  let averageTimePerQuestion = 0;
  if (analyticsData.averageTime?.perSubject?.length) {
    const per = analyticsData.averageTime.perSubject;
    const hasTotals = per.every(s => typeof s.totalQuestions === 'number' && s.totalQuestions > 0);
    if (hasTotals) {
      const totalWeighted = per.reduce((acc, s) => acc + (s.avgTimePerQSec * s.totalQuestions), 0);
      const qCount = per.reduce((acc, s) => acc + s.totalQuestions, 0);
      averageTimePerQuestion = qCount > 0 ? +(totalWeighted / qCount).toFixed(1) : 0;
    } else {
      const sum = per.reduce((acc, s) => acc + s.avgTimePerQSec, 0);
      averageTimePerQuestion = per.length > 0 ? +(sum / per.length).toFixed(1) : 0;
    }
  }

  const weakestSubject = analyticsData.weakestSubject?.weakestSubject
    ? {
        subject: analyticsData.weakestSubject.stats.subject,
        accuracy: analyticsData.weakestSubject.stats.accuracyPct,
        totalItems: analyticsData.weakestSubject.stats.totalQuestions,
        correctItems: analyticsData.weakestSubject.stats.correct,
        wrong: analyticsData.weakestSubject.stats.wrong,
        skipped: analyticsData.weakestSubject.stats.skipped,
        avgTime: analyticsData.weakestSubject.stats.avgTimePerQSec,
      }
    : null;

  const CustomTooltip = ({ active, payload, label, additionalData }) => {
    if (active && payload && payload.length) {
      const subject = label || payload[0].payload.subject;
      const extra = additionalData?.find((d) => d.subject === subject);

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{subject}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value}
              {entry.name === 'accuracy' && '%'}
              {entry.name === 'avgTime' && 's'}
              {entry.name === 'coverage' && '%'}
            </p>
          ))}
          {extra && (
            <>
              {extra.totalQuestions && (
                <p className="text-sm text-gray-600 mt-1">
                  Total Questions: {extra.totalQuestions}
                </p>
              )}
              {extra.quizCount && (
                <p className="text-sm text-gray-600">
                  Quiz Count: {extra.quizCount}
                </p>
              )}
              {extra.wrong !== undefined && (
                <p className="text-sm text-red-600">
                  Wrong: {extra.wrong}
                </p>
              )}
              {extra.skipped !== undefined && (
                <p className="text-sm text-yellow-600">
                  Skipped: {extra.skipped}
                </p>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const overallAccuracyData = processedData.overallAccuracyData;
  const analyticsMetrics = processedData.analyticsMetrics;

  const perSubjectAccuracyData = processedData.perSubjectAccuracyData;

  const subjectCoverageData = processedData.subjectCoverageData;

  const avgTimePerQuestionData = processedData.avgTimePerQuestionData;

  const correctVsWrongData = processedData.correctVsWrongData;

  const perSubjectSpeedData = processedData.perSubjectSpeedData;

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
        <p className={`text-4xl font-bold mb-2 ${improvementRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {improvementRate >= 0 ? '+' : ''}{improvementRate}%
        </p>
        <p className="text-xs text-gray-500">
          vs previous: {previousOverallAccuracy}%
        </p>
      </div>

      {/* Average Time per Question */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Avg Time/Question</p>
        <p className="text-4xl font-bold text-[#2472B5] mb-2">{averageTimePerQuestion}s</p>
        <p className="text-xs text-gray-500">Overall speed indicator</p>
      </div>

      {/* Current Streak */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Current Streak</p>
        <p className="text-4xl font-bold text-orange-500 mb-2">🔥 {analyticsData.streak?.streakDays || 0}</p>
        <p className="text-xs text-gray-500">Consecutive active days</p>
      </div>

      {/* Weakest Subject */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Weakest Subject</p>
        {weakestSubject ? (
          <>
            <p className="text-lg font-bold text-red-600 mb-2">{weakestSubject.subject}</p>
            <p className="text-xs text-gray-500">
              {weakestSubject.accuracy}% — Focus on this next
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold text-gray-400 mb-2">N/A</p>
            <p className="text-xs text-gray-500">No data available yet</p>
          </>
        )}
      </div>
    </div>
  );

  const renderOverallChartsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Overall Accuracy Pie */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Overall Accuracy</h3>
        <p className="text-sm text-gray-500 mb-4">Your performance breakdown across all quizzes</p>
        {overallAccuracyData.length > 0 ? (
          <>
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
            <p className="text-sm text-gray-600 mt-3">✅ {analyticsMetrics.overallAccuracy}% correct answers across all attempts</p>
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No quiz data available yet. Start taking quizzes to see your overall accuracy!</p>
          </div>
        )}
      </div>

      {/* Correct vs Wrong vs Skipped */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Correct vs Wrong vs Skipped</h3>
        <p className="text-sm text-gray-500 mb-4">Weekly trend of your quiz responses</p>
        {correctVsWrongData.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No quiz data available yet. Start taking quizzes to see your progress!</p>
          </div>
        )}
      </div>

      {/* Per Subject Accuracy */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per Subject Accuracy</h3>
        <p className="text-sm text-gray-500 mb-4">How well you perform in each subject</p>
        {perSubjectAccuracyData.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No subject data available yet. Start taking quizzes to see your accuracy!</p>
          </div>
        )}
      </div>

      {/* Per-Subject Coverage */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per-Subject Coverage</h3>
        <p className="text-sm text-gray-500 mb-4">Percentage of total questions per subject</p>
        {subjectCoverageData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectCoverageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="coverage" fill="#10B981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No subject coverage data available yet. Start taking quizzes!</p>
          </div>
        )}
      </div>

      {/* Average Time per Question */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Time per Question</h3>
        <p className="text-sm text-gray-500 mb-4">Time spent per question by subject (seconds)</p>
        {avgTimePerQuestionData.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No timing data available yet. Start taking quizzes to see your speed!</p>
          </div>
        )}
      </div>

      {/* Per-Subject Speed */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per-Subject Speed</h3>
        <p className="text-sm text-gray-500 mb-4">Questions answered per minute by subject</p>
        {perSubjectSpeedData.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No speed data available yet. Start taking quizzes to see your response speed!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDescriptiveCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Answer Distribution */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Answer Distribution</h3>
        <p className="text-sm text-gray-500 mb-4">Counts and percentages of answers</p>
        {processedData.answerDistributionData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={processedData.answerDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ value }) => `${value}%`}
                >
                  {processedData.answerDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-green-700">✅ Correct: {analyticsData.correctWrongSkipped?.overall.correct} ({((analyticsData.correctWrongSkipped?.overall.correct / analyticsData.correctWrongSkipped?.overall.total) * 100).toFixed(1)}%)</p>
              <p className="text-red-700">❌ Wrong: {analyticsData.correctWrongSkipped?.overall.wrong} ({((analyticsData.correctWrongSkipped?.overall.wrong / analyticsData.correctWrongSkipped?.overall.total) * 100).toFixed(1)}%)</p>
              <p className="text-yellow-700">⏭️ Skipped: {analyticsData.correctWrongSkipped?.overall.skipped} ({((analyticsData.correctWrongSkipped?.overall.skipped / analyticsData.correctWrongSkipped?.overall.total) * 100).toFixed(1)}%)</p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No answer distribution data available yet</p>
          </div>
        )}
      </div>

      {/* Per Subject Accuracy */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per Subject Accuracy</h3>
        <p className="text-sm text-gray-500 mb-4">Subject-wise performance distribution</p>
        {perSubjectAccuracyData.length > 0 ? (
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
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No subject data available yet</p>
          </div>
        )}
      </div>

      {/* Per-Subject Coverage */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per-Subject Coverage</h3>
        <p className="text-sm text-gray-500 mb-4">Total correct answers per subject</p>
        {perSubjectAccuracyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={perSubjectAccuracyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="subject" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="correctItems" fill="#10B981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No coverage data available yet</p>
          </div>
        )}
      </div>

      {/* Average Time */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Time per Question</h3>
        <p className="text-sm text-gray-500 mb-4">Time efficiency by subject</p>
        {avgTimePerQuestionData.length > 0 ? (
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
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No timing data available yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalyticalCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Per Subject Speed */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Per Subject Speed</h3>
        <p className="text-sm text-gray-500 mb-4">Questions answered per minute by subject</p>
        {perSubjectSpeedData.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No speed data available yet</p>
          </div>
        )}
      </div>

      {/* Difficulty Performance */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Difficulty Performance</h3>
        <p className="text-sm text-gray-500 mb-4">How you perform across difficulty levels</p>
        {processedData.difficultyPerformanceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData.difficultyPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="difficulty" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="correct" fill="#22C55E" radius={[8, 8, 0, 0]} />
              <Bar dataKey="wrong" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No difficulty data available yet</p>
          </div>
        )}
      </div>

      {/* Weakest Subjects */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Weakest Subjects</h3>
        <p className="text-sm text-gray-500 mb-4">Subjects ranked by performance (lowest to highest)</p>
        {processedData.subjectRankingData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.subjectRankingData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="subject" type="category" width={100} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="score" name="Score" fill="#F59E0B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">💡 Focus on {processedData.subjectRankingData[0]?.subject} to improve overall score</p>
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No ranking data available yet</p>
          </div>
        )}
      </div>

      {/* Subject Mastery Score */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Subject Mastery Score</h3>
        <p className="text-sm text-gray-500 mb-4">Long-term progress weighted by item count</p>
        {processedData.subjectMasteryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData.subjectMasteryData}>
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
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No mastery data available yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPredictiveCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Improvement Trend */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Improvement Rate</h3>
        <p className="text-sm text-gray-500 mb-4">Your progress trajectory and predicted future performance</p>
        {processedData.improvementTrajectoryData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData.improvementTrajectoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attempt" label={{ value: 'Attempt', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6 }} name="Average Score" />
              </LineChart>
            </ResponsiveContainer>
            {analyticsData.improvementTrajectory && (
              <p className="text-sm text-gray-600 mt-3">
                🔮 Predicted next score: {analyticsData.improvementTrajectory.predictedNextScore}% | 
                🚀 {analyticsData.improvementTrajectory.improvementPct}% improvement since first attempt
              </p>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No improvement data available yet. Keep taking quizzes to track your progress!</p>
          </div>
        )}
      </div>

      {/* Subject Mastery Score Radar */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Subject Mastery Radar</h3>
        <p className="text-sm text-gray-500 mb-4">Comprehensive mastery across all subjects</p>
        {processedData.subjectMasteryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={processedData.subjectMasteryData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Mastery" dataKey="mastery" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No mastery data available yet</p>
          </div>
        )}
      </div>

      {/* Streak & Consistency */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Streak & Consistency</h3>
        <p className="text-sm text-gray-500 mb-4">Last 7 days participation (engagement driver)</p>
        {analyticsData.streak?.last7Days ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.streak.last7Days.map((day) => ({
                date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                active: day.active,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 1]} ticks={[0, 1]} />
                <Tooltip formatter={(value) => (value === 1 ? 'Active' : 'Inactive')} />
                <Bar
                  dataKey="active"
                  fill="#14B8A6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-4 text-sm text-gray-600">
              🔥 {analyticsData.streak.last7Days.filter(d => d.active === 1).length} / 7 days active | Current streak: {analyticsData.streak.streakDays} days
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No streak data available yet</p>
          </div>
        )}
      </div>

      {/* Correct/Wrong/Skipped Rate Trends */}
      <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Answer Rate Trends</h3>
        <p className="text-sm text-gray-500 mb-4">Monthly trends predicting future answer patterns</p>
        {processedData.answerRateTrendsData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData.answerRateTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="correct" stroke="#22C55E" strokeWidth={2} name="Correct %" />
                <Line type="monotone" dataKey="wrong" stroke="#EF4444" strokeWidth={2} name="Wrong %" />
                <Line type="monotone" dataKey="skipped" stroke="#F59E0B" strokeWidth={2} name="Skipped %" />
              </LineChart>
            </ResponsiveContainer>
            {analyticsData.answerRateTrends?.predicted && (
              <p className="text-sm text-gray-600 mt-3">
                📈 Predicted {analyticsData.answerRateTrends.predicted.nextMonth}: {analyticsData.answerRateTrends.predicted.predictedCorrectPct}% correct, {analyticsData.answerRateTrends.predicted.predictedWrongPct}% wrong, {analyticsData.answerRateTrends.predicted.predictedSkippedPct}% skipped
              </p>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>No trend data available yet. Keep taking quizzes to see patterns!</p>
          </div>
        )}
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
            <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
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

