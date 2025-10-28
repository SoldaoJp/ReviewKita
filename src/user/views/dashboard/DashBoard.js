import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../components/sidebar/Topbar";
import ProgressTracker from "../components/dashboard/ProgressTracker";
import RightPanel from "../components/dashboard/RightPanel";
import SubjectTracker from "../components/dashboard/SubjectTracker";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import { getAllReviewers, getSubjectDistribution } from "../../services/reviewerService";
import { getUserActivityDays } from "../../services/userActivityService";
import { getPerSubjectCoverage, getAnswerRateTrends } from "../../services/analyticsService";
import { getAllAttempts } from "../../services/quizHistoryService";
import { useReviewerContext } from "../../controllers/context/ReviewerContext";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectCoverage, setSubjectCoverage] = useState([]);
  const [subjectDistribution, setSubjectDistribution] = useState(null);
  const [answerTrends, setAnswerTrends] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [expandedQuizzes, setExpandedQuizzes] = useState({});
  const { reviewerUpdateTrigger } = useReviewerContext();
  const navigate = useNavigate();
  
  const monthName = selectedDate.toLocaleString('default', { month: 'long' });
  const year = selectedDate.getFullYear();
  
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  
  const [activeDayCounts, setActiveDayCounts] = useState({});
  
  const today = new Date();
  const isCurrentMonth = selectedDate.getMonth() === today.getMonth() && 
                         selectedDate.getFullYear() === today.getFullYear();
  
  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  useEffect(() => {
    const fetchReviewersAndActivity = async () => {
      try {
        setLoading(true);
        const response = await getAllReviewers(1000);
        console.log('Fetched reviewers response:', response);
        if (response.success && Array.isArray(response.data)) {
          console.log('Setting reviewers from response.data:', response.data);
          setReviewers(response.data);
        } else if (Array.isArray(response)) {
          console.log('Setting reviewers from response array:', response);
          setReviewers(response);
        } else {
          console.log('Unexpected response format:', response);
        }
        const activityRes = await getUserActivityDays();
        const dayCounts = {};
        if (Array.isArray(activityRes)) {
          activityRes.forEach(dateStr => {
            const [y, m, d] = String(dateStr).split('-').map(Number);
            if (!y || !m || !d) return;
            const monthIdx = m - 1;
            if (monthIdx === selectedDate.getMonth() && y === selectedDate.getFullYear()) {
              dayCounts[d] = (dayCounts[d] || 0) + 1;
            }
          });
        }
        console.log('Active day counts for calendar:', dayCounts, 'Raw activity:', activityRes);
        setActiveDayCounts(dayCounts);

        try {
          const [coverageRes, trendsRes, attemptsRes, distributionRes] = await Promise.all([
            getPerSubjectCoverage(),
            getAnswerRateTrends(),
            getAllAttempts(),
            getSubjectDistribution(),
          ]);
          setSubjectCoverage(Array.isArray(coverageRes?.coverage) ? coverageRes.coverage : []);
          setAnswerTrends(Array.isArray(trendsRes?.monthly) ? trendsRes.monthly : []);
          setQuizAttempts(Array.isArray(attemptsRes) ? attemptsRes : []);
          setSubjectDistribution(distributionRes?.data || null);
        } catch (innerErr) {
          console.warn('Optional analytics fetch failed:', innerErr);
          setSubjectCoverage([]);
          setAnswerTrends([]);
          setQuizAttempts([]);
          setSubjectDistribution(null);
        }
      } catch (error) {
        console.error('Error fetching reviewers or activity days:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewersAndActivity();

    const onActivityLogged = () => {
      (async () => {
        try {
          const activityRes = await getUserActivityDays();
          const dayCounts = {};
          if (Array.isArray(activityRes)) {
            activityRes.forEach(dateStr => {
              const [y, m, d] = String(dateStr).split('-').map(Number);
              if (!y || !m || !d) return;
              const monthIdx = m - 1;
              if (monthIdx === selectedDate.getMonth() && y === selectedDate.getFullYear()) {
                dayCounts[d] = (dayCounts[d] || 0) + 1;
              }
            });
          }
          setActiveDayCounts(dayCounts);
        } catch (e) {
          console.error('Failed to refresh activity days:', e);
        }
      })();
    };
    window.addEventListener('user-activity-logged', onActivityLogged);
    return () => window.removeEventListener('user-activity-logged', onActivityLogged);
  }, [reviewerUpdateTrigger, selectedDate]);

  const getQuizProgressData = () => {
    if (loading || reviewers.length === 0) {
      return [];
    }

    return reviewers.map(reviewer => {
      const reviewerAttempts = quizAttempts.filter(
        attempt => attempt.reviewer_id === reviewer._id || attempt.reviewer_title === reviewer.title
      );

      const percent = reviewerAttempts.length > 0
        ? Math.round(
            reviewerAttempts.reduce((sum, attempt) => sum + (attempt.score_percent || 0), 0) /
            reviewerAttempts.length
          )
        : 0;

      const attemptCount = reviewerAttempts.length;
      const status = `${attemptCount} attempt${attemptCount !== 1 ? 's' : ''}`;

      let colorClass = "red";
      if (percent >= 75) colorClass = "green";
      else if (percent >= 50) colorClass = "orange";

      return {
        name: reviewer.title,
        percent,
        status,
        colorClass
      };
    });
  };

  const getProgressTrackerData = () => {
    if (loading || !answerTrends || answerTrends.length === 0) {
      return { data: [], legends: [] };
    }
    const data = answerTrends.map(m => ({
      date: m.monthName || m.month,
      correct: Number(m.correctPct || 0),
      wrong: Number(m.wrongPct || 0),
      skipped: Number(m.skippedPct || 0),
    }));
    const legends = [
      { key: 'correct', name: 'Correct %', color: '#22C55E', value: data.at(-1)?.correct || 0 },
      { key: 'wrong', name: 'Wrong %', color: '#EF4444', value: data.at(-1)?.wrong || 0 },
      { key: 'skipped', name: 'Skipped %', color: '#F59E0B', value: data.at(-1)?.skipped || 0 },
    ];
    return { data, legends };
  };

  const getSubjectTrackerData = () => {
    // Use new subject distribution API data if available
    if (subjectDistribution && subjectDistribution.subject_distribution) {
      const colors = ['#3B82F6', '#22C55E', '#FACC15', '#F97316', '#8B5CF6', '#06B6D4'];
      const subjects = Object.entries(subjectDistribution.subject_distribution);
      
      return subjects.map(([subject, percentage], idx) => ({
        name: subject,
        value: parseFloat(percentage.replace('%', '')),
        color: colors[idx % colors.length],
      }));
    }
    
    // Fallback to old subject coverage data
    if (loading || !subjectCoverage || subjectCoverage.length === 0) {
      return [];
    }
    const colors = ['#3B82F6', '#22C55E', '#FACC15', '#F97316', '#8B5CF6', '#06B6D4'];
    return subjectCoverage
      .slice(0, 6)
      .map((s, idx) => ({
        name: s.subject || 'General',
        value: Number((s.coveragePct || 0).toFixed(1)),
        color: colors[idx % colors.length],
      }));
  };

  const getQuizStatsData = () => {
    if (!quizAttempts || quizAttempts.length === 0) {
      return [
        { label: "Total Attempts", value: 0, color: "#a855f7" },
        { label: "Avg per Day", value: 0, color: "#ec4899" },
        { label: "This Month", value: 0, color: "#3b82f6" },
      ];
    }
    
    const totalAttempts = quizAttempts.length;
    
    const daysWithAttempts = new Set();
    quizAttempts.forEach(attempt => {
      if (attempt.date) {
        const date = new Date(attempt.date);
        daysWithAttempts.add(date.toDateString());
      }
    });
    
    const avgPerDay = daysWithAttempts.size > 0 ? Math.round(totalAttempts / daysWithAttempts.size) : 0;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thisMonthAttempts = quizAttempts.filter(attempt => {
      if (attempt.date) {
        const date = new Date(attempt.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }
      return false;
    }).length;
    
    return [
      { label: "Total Attempts", value: totalAttempts, color: "#a855f7" },
      { label: "Avg per Day", value: avgPerDay, color: "#ec4899" },
      { label: "This Month", value: thisMonthAttempts, color: "#3b82f6" },
    ];
  };

  const progressTrackerData = getProgressTrackerData();
  const subjectTrackerData = getSubjectTrackerData();
  const quizStatsData = getQuizStatsData();
  
  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      <Topbar />
      
      {/* Main Grid Layout: 12 columns, compact rows */}
      <div className="grid grid-cols-12 gap-2">
        {/* Top Row: Welcome Card (8 cols), Streak (4 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-between" data-search-section="welcome">
          <WelcomeCard />
          <div className="grid grid-cols-2 gap-2 mt-2.5">
            <div data-search-section="progress">
              <ProgressTracker data={progressTrackerData.data} legends={progressTrackerData.legends} quizStats={quizStatsData} />
              
              {/* Weekly Activity Chart Below Progress Tracker */}
              <div className="bg-gradient-to-br from-white via-indigo-50/20 to-violet-50/10 rounded-xl p-3 shadow-md border border-white/60 backdrop-blur-sm mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-lg">
                    <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 text-xs">Weekly Activity</h3>
                </div>

                {quizAttempts && quizAttempts.length > 0 ? (
                  <div className="bg-white/40 backdrop-blur-sm rounded-lg p-2.5">
                    <div className="w-full h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={(() => {
                          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                          const attemptsByDay = {};
                          
                          quizAttempts.forEach(attempt => {
                            if (attempt.date) {
                              try {
                                const date = new Date(attempt.date);
                                if (!isNaN(date.getTime())) {
                                  const dayName = dayNames[date.getDay()];
                                  attemptsByDay[dayName] = (attemptsByDay[dayName] || 0) + 1;
                                }
                              } catch (e) {
                                console.warn('Invalid date format:', attempt.date);
                              }
                            }
                          });
                          
                          const chartData = dayNames.map(day => ({
                            name: day.slice(0, 1),
                            value: attemptsByDay[day] || 0,
                          }));
                          
                          return chartData;
                        })()} margin={{ top: 2, right: 4, left: -12, bottom: 2 }}>
                          <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 2" strokeOpacity={0.2} />
                          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 9 }} tickMargin={2} axisLine={false} />
                          <YAxis tick={{ fill: "#9ca3af", fontSize: 9 }} width={16} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '11px' }}
                            cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                          />
                          <Bar dataKey="value" radius={[3, 3, 0, 0]} fill="#6366f1" isAnimationActive={false} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-gray-500">
                    No activity data yet
                  </div>
                )}
              </div>
            </div>
            <div data-search-section="subjects"><SubjectTracker data={subjectTrackerData} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2.5" data-search-section="quick-actions">

            <button onClick={() => navigate('/reviewer')} className="w-full bg-white/50 rounded-xl p-4 card-shadow font-medium hover:bg-white/60 transition text-gray-700 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Reviewers
            </button>
            <button onClick={() => navigate('/profile')} className="w-full bg-white/50 rounded-xl p-4 card-shadow font-medium hover:bg-white/60 transition text-gray-700 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </button>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-2" data-search-section="right-panel">
          <div className="bg-white/50 rounded-2xl p-4 shadow-sm border border-[#eef3fb]">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-3">
              <button 
                onClick={goToPreviousMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Previous month"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-gray-900">{monthName} {year}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  <span className="text-blue-600 font-semibold">5 days</span> streak
                  {!isCurrentMonth && (
                    <button 
                      onClick={goToToday}
                      className="ml-2 text-blue-600 hover:text-blue-700 underline"
                    >
                      Today
                    </button>
                  )}
                </div>
              </div>
              
              <button 
                onClick={goToNextMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Next month"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-gray-500">{d}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const count = activeDayCounts[day] || 0;
                const isActive = count > 0;
                const isToday = isCurrentMonth && day === today.getDate();
                let bgColor = 'bg-gray-100 text-gray-600';
                if (isActive) {
                  if (count >= 3) bgColor = 'bg-blue-600 text-white';
                  else if (count === 2) bgColor = 'bg-blue-400 text-white';
                  else bgColor = 'bg-blue-200 text-blue-900';
                }
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all
                      ${bgColor}
                      ${isToday && !isActive ? 'ring-2 ring-blue-400' : ''}
                      ${isToday && isActive ? 'ring-2 ring-blue-800' : ''}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-600"></div>
                <span className="text-[10px] text-gray-600">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-gray-100"></div>
                <span className="text-[10px] text-gray-600">Inactive</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded ring-2 ring-blue-400"></div>
                <span className="text-[10px] text-gray-600">Today</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 rounded-xl p-3 shadow-md border border-white/60 backdrop-blur-sm flex flex-col">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-sm">Quiz Performance</h3>
            </div>
            {loading ? (
              <div className="text-center py-3">
                <div className="inline-block">
                  <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-xs text-gray-500 mt-1">Loading...</p>
              </div>
            ) : reviewers.length === 0 ? (
              <div className="text-center py-4">
                <div className="mb-1 text-lg">📚</div>
                <p className="text-xs text-gray-600 font-medium">No quiz data yet</p>
              </div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent" style={{ maxHeight: '240px' }}>
                {getQuizProgressData().map((quiz, idx) => {
                  const isExpanded = expandedQuizzes[idx];
                  const reviewerAttempts = quizAttempts.filter(
                    attempt => attempt.reviewer_id === reviewers[idx]?._id || attempt.reviewer_title === quiz.name
                  );

                  const chartData = [
                    { name: 'Score', value: quiz.percent },
                    { name: 'Remaining', value: Math.max(0, 100 - quiz.percent) }
                  ];

                  const isGreen = quiz.colorClass === 'green';
                  const isOrange = quiz.colorClass === 'orange';
                  const scoreColor = isGreen ? '#10b981' : isOrange ? '#f59e0b' : '#ef4444';
                  const gradientFrom = isGreen ? 'from-green-500' : isOrange ? 'from-orange-500' : 'from-red-500';
                  const gradientTo = isGreen ? 'to-emerald-600' : isOrange ? 'to-amber-600' : 'to-rose-600';
                  const bgGradient = isGreen ? 'bg-gradient-to-br from-green-50 to-emerald-50' : isOrange ? 'bg-gradient-to-br from-orange-50 to-amber-50' : 'bg-gradient-to-br from-red-50 to-rose-50';
                  const borderColor = isGreen ? 'border-green-200' : isOrange ? 'border-orange-200' : 'border-red-200';
                  const badgeBg = isGreen ? 'bg-gradient-to-r from-green-500 to-emerald-600' : isOrange ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 'bg-gradient-to-r from-red-500 to-rose-600';

                  return (
                    <div key={idx} className={`${bgGradient} border ${borderColor} rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]`}>
                      {/* Header with ring chart */}
                      <div className="p-2.5">
                        <button
                          onClick={() => setExpandedQuizzes(prev => ({ ...prev, [idx]: !isExpanded }))}
                          className="w-full flex items-center gap-2.5 hover:opacity-85 transition-opacity"
                        >
                          {/* Ring Chart Container */}
                          <div className="w-14 h-14 flex-shrink-0 relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={chartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={16}
                                  outerRadius={23}
                                  dataKey="value"
                                  startAngle={90}
                                  endAngle={-270}
                                >
                                  <Cell fill={scoreColor} />
                                  <Cell fill="rgba(229, 231, 235, 0.5)" />
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                            {/* Percentage text in center */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <div className={`text-xs font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>{quiz.percent}%</div>
                            </div>
                          </div>

                          {/* Quiz info */}
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-gray-900 text-xs leading-snug">{quiz.name}</div>
                            <div className="text-[10px] text-gray-600 mt-0.5 flex items-center gap-0.5">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {quiz.status}
                            </div>
                          </div>

                          {/* Dropdown arrow with animation */}
                          <div className={`flex-shrink-0 p-1 rounded transition-all ${isExpanded ? 'bg-white/70' : 'bg-white/40'}`}>
                            <svg
                              className={`w-3.5 h-3.5 text-gray-700 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                        </button>
                      </div>

                      {/* Expandable retakes list */}
                      {isExpanded && (
                        <div className={`border-t ${borderColor} bg-white/40 backdrop-blur-sm p-2.5 space-y-1.5 max-h-32 overflow-y-auto`}>
                          {reviewerAttempts.length > 0 ? (
                            <>
                              <div className="text-[10px] font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                                <div className="h-0.5 w-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                Attempts ({reviewerAttempts.length})
                              </div>
                              {reviewerAttempts.map((attempt, attemptIdx) => (
                                <div key={attemptIdx} className="bg-white/80 backdrop-blur-sm rounded border border-gray-200/60 p-2 text-[10px] hover:border-blue-300 transition-colors">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        <span className="text-[9px] font-bold text-blue-700">#{attemptIdx + 1}</span>
                                      </div>
                                      <span className="font-semibold text-gray-800">Attempt {attemptIdx + 1}</span>
                                    </div>
                                    <span className={`font-bold px-2 py-0.5 rounded-full text-white text-[9px] ${badgeBg}`}>
                                      {attempt.score_percent}%
                                    </span>
                                  </div>
                                  {attempt.date && (
                                    <div className="text-gray-500 text-[9px] flex items-center gap-0.5 ml-6">
                                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      {new Date(attempt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </>
                          ) : (
                            <div className="text-center py-2">
                              <p className="text-[10px] text-gray-700 font-medium">No attempts yet</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

