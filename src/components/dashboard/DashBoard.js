// src/components/dashboard/Dashboard.js
import Topbar from "../sidebar/Topbar";
import ProgressTracker from "./ProgressTracker";
import RightPanel from "./RightPanel";
import SubjectTracker from "./SubjectTracker";
import WelcomeCard from "./WelcomeCard";

export default function Dashboard() {
  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      <Topbar />
      
      {/* Main Grid Layout: 12 columns, compact rows */}
      <div className="grid grid-cols-12 gap-2">
        {/* Top Row: Welcome Card (8 cols), Streak (4 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-between" data-search-section="welcome">
          <WelcomeCard />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div data-search-section="progress"><ProgressTracker /></div>
            <div data-search-section="subjects"><SubjectTracker /></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2" data-search-section="quick-actions">
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
          <div className="bg-[#fbfdff] rounded-2xl p-4 shadow-sm border border-[#eef3fb]">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">5</div>
              <div className="text-xs text-gray-400">Days Streak</div>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }).map((_, i) => {
                const active = [2,13,14,9,12,5,17,23,25].includes(i);
                return (
                  <div
                    key={i}
                    className={`w-full aspect-square rounded-md ${active ? "bg-blue-600" : "bg-gray-200"}`}
                  />
                );
              })}
            </div>
            <div className="mt-2 grid grid-cols-7 text-[9px] text-gray-400 gap-1">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>
          </div>
          <div className="bg-[#fbfdff] rounded-2xl p-4 shadow-sm border border-[#eef3fb] flex-1">
            <h3 className="font-bold text-gray-700 mb-3 text-sm">Quiz Progress</h3>
            <div className="space-y-2.5">
              {[
                { name: "Advanced Programming", percent: 0, status: "0/40 TBA", colorClass: "red" },
                { name: "IAS", percent: 0, status: "0/40 TBA", colorClass: "red" },
                { name: "Data Scalability", percent: 25, status: "10/40 Need improvement", colorClass: "orange" },
                { name: "Networking 2", percent: 75, status: "30/40 Getting there", colorClass: "green" },
                { name: "Quantitative Methods", percent: 90, status: "40/40 Expertised", colorClass: "green" }
              ].map((quiz, idx) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
