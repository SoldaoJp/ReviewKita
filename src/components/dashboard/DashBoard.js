// src/components/dashboard/Dashboard.js
import { useState, useEffect } from "react";
import Topbar from "../sidebar/Topbar";
import ProgressTracker from "./ProgressTracker";
import RightPanel from "./RightPanel";
import SubjectTracker from "./SubjectTracker";
import WelcomeCard from "./WelcomeCard";
import { getAllReviewers } from "../../services/reviewerService";

export default function Dashboard() {
  // State for selected month/year
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get month and year from selected date
  const monthName = selectedDate.toLocaleString('default', { month: 'long' });
  const year = selectedDate.getFullYear();
  
  // Get the first day of the month and total days
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  
  // Sample active days (days when user opened a reviewer)
  const activeDays = [2, 5, 9, 12, 13, 14, 17, 23, 25];
  
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

  // Fetch reviewers
  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        setLoading(true);
        const response = await getAllReviewers(1, 1000);
        if (response.success && Array.isArray(response.data)) {
          setReviewers(response.data);
        } else if (Array.isArray(response)) {
          setReviewers(response);
        }
      } catch (error) {
        console.error('Error fetching reviewers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewers();
  }, []);

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
  
  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      <Topbar />
      
      {/* Main Grid Layout: 12 columns, compact rows */}
      <div className="grid grid-cols-12 gap-2">
        {/* Top Row: Welcome Card (8 cols), Streak (4 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-between" data-search-section="welcome">
          <WelcomeCard />
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div data-search-section="progress"><ProgressTracker /></div>
            <div data-search-section="subjects"><SubjectTracker /></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1" data-search-section="quick-actions">
            <button className="w-full bg-white/50 rounded-xl p-4 card-shadow font-medium hover:bg-white/60 transition text-gray-700 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Reviewers
            </button>
            <button className="w-full bg-white/50 rounded-xl p-4 card-shadow font-medium hover:bg-white/60 transition text-gray-700 flex items-center justify-center gap-2">
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
                const isActive = activeDays.includes(day);
                const isToday = isCurrentMonth && day === today.getDate();
                
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all
                      ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600'}
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
          <div className="bg-white/50 rounded-2xl p-4 shadow-sm border border-[#eef3fb] flex-1">
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
              <div className="space-y-2.5">
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
