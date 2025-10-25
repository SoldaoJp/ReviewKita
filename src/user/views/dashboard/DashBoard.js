// src/components/dashboard/Dashboard.js
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../components/sidebar/Topbar";
import ProgressTracker from "../components/dashboard/ProgressTracker";
import RightPanel from "../components/dashboard/RightPanel";
import SubjectTracker from "../components/dashboard/SubjectTracker";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import { getAllReviewers } from "../../services/reviewerService";
import { getUserActivityDays } from "../../services/userActivityService";
import { useReviewerContext } from "../../controllers/context/ReviewerContext";

export default function Dashboard() {
  // State for selected month/year
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { reviewerUpdateTrigger } = useReviewerContext();
  const navigate = useNavigate();
  
  // Get month and year from selected date
  const monthName = selectedDate.toLocaleString('default', { month: 'long' });
  const year = selectedDate.getFullYear();
  
  // Get the first day of the month and total days
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  
  // Active days (days when user opened a reviewer)
  // Map of day number to activity count
  const [activeDayCounts, setActiveDayCounts] = useState({});
  
  // Get current date for comparison
  const today = new Date();
  const isCurrentMonth = selectedDate.getMonth() === today.getMonth() && 
                         selectedDate.getFullYear() === today.getFullYear();
  
  // Navigation handlers
  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Fetch reviewers and user activity days
  useEffect(() => {
    const fetchReviewersAndActivity = async () => {
      try {
        setLoading(true);
        const response = await getAllReviewers(1000); // Pass limit as first parameter
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
        // Fetch user activity days for calendar
        const activityRes = await getUserActivityDays();
        // activityRes should be array of YYYY-MM-DD strings
        // Count occurrences per day in current month
        const dayCounts = {};
        if (Array.isArray(activityRes)) {
          activityRes.forEach(dateStr => {
            // Expect format YYYY-MM-DD; avoid local timezone offset by parsing parts
            const [y, m, d] = String(dateStr).split('-').map(Number);
            if (!y || !m || !d) return;
            const monthIdx = m - 1; // JS months 0-11
            if (monthIdx === selectedDate.getMonth() && y === selectedDate.getFullYear()) {
              dayCounts[d] = (dayCounts[d] || 0) + 1;
            }
          });
        }
        console.log('Active day counts for calendar:', dayCounts, 'Raw activity:', activityRes);
        setActiveDayCounts(dayCounts);
      } catch (error) {
        console.error('Error fetching reviewers or activity days:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewersAndActivity();

    // Listen for real-time activity logging and refresh calendar
    const onActivityLogged = () => {
      // Only refresh the activity days quickly (avoid reloading reviewers list)
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

  // Calculate quiz progress data
  const getQuizProgressData = () => {
    if (loading || reviewers.length === 0) {
      return [];
    }

    return reviewers.map(reviewer => {
      // For now, set to 0% since quiz data isn't available yet
      // You can update this logic when quiz completion data is available
      const percent = 0;
      const status = "0/40 TBA";
      
      let colorClass = "red";
      if (percent >= 75) colorClass = "green";
      else if (percent >= 25) colorClass = "orange";

      return {
        name: reviewer.title,
        percent,
        status,
        colorClass
      };
    });
  };

  // Calculate progress tracker data (quiz scores over time)
  const getProgressTrackerData = () => {
    if (loading || reviewers.length === 0) {
      return { data: [], legends: [] };
    }

    // Get unique dates from reviewers
    const dates = reviewers
      .map(r => new Date(r.extractedDate || r.createdAt))
      .sort((a, b) => a - b);

    // Create 5 data points spanning the date range
    const dataPoints = [];
    if (dates.length > 0) {
      const firstDate = dates[0];
      const lastDate = dates[dates.length - 1] || firstDate;
      const timeSpan = lastDate - firstDate || 1;

      for (let i = 0; i < 5; i++) {
        const pointDate = new Date(firstDate.getTime() + (timeSpan * i / 4));
        const formattedDate = `${(pointDate.getMonth() + 1).toString().padStart(2, '0')}/${pointDate.getDate().toString().padStart(2, '0')}`;
        
        const dataPoint = { date: formattedDate };
        
        // For each reviewer, add quiz score (0 for now since quiz not implemented)
        reviewers.forEach((reviewer, idx) => {
          const key = `reviewer${idx}`;
          dataPoint[key] = 0; // Will be actual quiz score when implemented
        });
        
        dataPoints.push(dataPoint);
      }
    }

    // Create color palette - extended to support more reviewers
    const colors = ['#3B82F6', '#EC4899', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#F97316', '#06B6D4'];
    
    // Create legends from ALL reviewers
    const legends = reviewers.map((reviewer, idx) => ({
      key: `reviewer${idx}`,
      name: reviewer.title,
      color: colors[idx % colors.length],
      value: 0 // Will be actual quiz score when implemented
    }));

    return { data: dataPoints, legends };
  };

  // Calculate subject tracker data (time spent on each reviewer)
  const getSubjectTrackerData = () => {
    if (loading || reviewers.length === 0) {
      return [];
    }

    // For now, we'll use a placeholder calculation
    // In the future, you can track actual time spent when user opens reviewers
    // This could be stored in a separate analytics collection or user activity log

    // Extended color palette to support more reviewers
    const colors = ['#3B82F6', '#EC4899', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#F97316', '#06B6D4'];
    
    // Calculate percentage based on ALL reviewers (placeholder logic)
    // You'll want to replace this with actual time tracking data
    const total = reviewers.length;
    
    return reviewers.map((reviewer, idx) => {
      // Placeholder: distribute percentages more evenly across all reviewers
      // In reality, this should come from time tracking data
      const basePercentage = Math.max(5, Math.round(100 / total));
      
      return {
        name: reviewer.title,
        value: basePercentage,
        color: colors[idx % colors.length]
      };
    });
  };

  const progressTrackerData = getProgressTrackerData();
  const subjectTrackerData = getSubjectTrackerData();
  
  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      <Topbar />
      
      {/* Main Grid Layout: 12 columns, compact rows */}
      <div className="grid grid-cols-12 gap-2">
        {/* Top Row: Welcome Card (8 cols), Streak (4 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-between" data-search-section="welcome">
          <WelcomeCard />
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div data-search-section="progress"><ProgressTracker data={progressTrackerData.data} legends={progressTrackerData.legends} /></div>
            <div data-search-section="subjects"><SubjectTracker data={subjectTrackerData} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1" data-search-section="quick-actions">
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
                // Color scale: 1 = blue-200, 2 = blue-400, 3+ = blue-600
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
          <div className="bg-white/50 rounded-2xl p-4 shadow-sm border border-[#eef3fb] flex flex-col">
            <h3 className="font-bold text-gray-700 mb-3 text-sm">Quiz Progress</h3>
            {loading ? (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500">Loading...</p>
              </div>
            ) : reviewers.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500">No reviewers yet</p>
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" style={{ maxHeight: '180px' }}>
                {getQuizProgressData().map((quiz, idx) => (
                  <div key={idx} className={`bg-${quiz.colorClass}-50 border border-${quiz.colorClass}-200 rounded-lg p-2.5`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`text-${quiz.colorClass}-600 font-bold text-sm min-w-[35px]`}>{quiz.percent}%</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs text-gray-800 truncate">{quiz.name}</div>
                        <div className="text-[10px] text-gray-500">{quiz.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
