// src/components/dashboard/Dashboard.js
import Topbar from "../sidebar/Topbar";
import ProgressTracker from "./ProgressTracker";
import RightPanel from "./RightPanel";
import SubjectTracker from "./SubjectTracker";
import WelcomeCard from "./WelcomeCard";

export default function Dashboard() {
  return (
    <div className="flex-1 bg-[#eaf6fb]">
      <div className="p-8">
        <Topbar />
        <div className="mb-6">
          
          <WelcomeCard />
          
        
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProgressTracker />
              <SubjectTracker />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-white rounded-xl p-4 card-shadow font-medium hover:bg-gray-50 transition">
                View Reviewers
              </button>
              <button className="flex-1 bg-white rounded-xl p-4 card-shadow font-medium hover:bg-gray-50 transition">
                View Profile
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-12 lg:col-span-4">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
