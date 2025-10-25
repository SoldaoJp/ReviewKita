import React from "react";
import AdminLayout from './Layout';

export default function RecommendationModel() {
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Recommend Model Configuration</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/50 shadow-sm rounded-2xl border border-[#eef3fb] p-6">
              <h2 className="font-semibold text-lg mb-3">
                Recommendation Engine Settings
              </h2>

              <div className="flex items-center justify-between mb-2">
                <span>Enable Personalized Recommendations</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div
                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                      peer-focus:ring-blue-300 rounded-full peer 
                      peer-checked:after:translate-x-full 
                      peer-checked:after:border-white after:content-[''] 
                      after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:border-gray-300 after:border 
                      after:rounded-full after:h-5 after:w-5 
                      after:transition-all peer-checked:bg-sky-500"
                  ></div>
                </label>
              </div>

              <p className="text-red-500 text-sm">
                Prioritize weak topics, learning pace, and user interactions
              </p>

              <div className="flex items-center justify-between mt-4">
                <span>Activate Smart Highlight Extraction</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div
                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                      peer-focus:ring-blue-300 rounded-full peer 
                      peer-checked:after:translate-x-full 
                      peer-checked:after:border-white after:content-[''] 
                      after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:border-gray-300 after:border 
                      after:rounded-full after:h-5 after:w-5 
                      after:transition-all peer-checked:bg-sky-500"
                  ></div>
                </label>
              </div>

              <p className="text-red-500 text-sm mt-1">
                Frequent keyword searches, text swaps, term refinements, and new invitations
              </p>
            </div>

            <div className="bg-white/50 shadow-sm rounded-2xl border border-[#eef3fb] p-6">
              <h2 className="font-semibold text-lg mb-3">Model Configuration</h2>
              <div className="flex items-center space-x-3 mb-3">
                <select className="border rounded-lg px-3 py-2 w-full">
                  <option>Recommendation Strategy</option>
                </select>
                <button className="bg-sky-500 text-white px-4 py-2 rounded-lg">
                  Save
                </button>
              </div>

              <div className="bg-gray-50 border rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700">
                  Training: <span className="font-semibold">adaptive Adaptive (Default)</span>
                </p>
              </div>

              <textarea
                className="border rounded-lg w-full p-3 text-sm text-gray-700 h-32"
                defaultValue={`{ strategy: "lastxtr", 0.6;
weight_history: 0.3;
simplification_score_threshold: 0.8; }`}
              ></textarea>

              <div className="flex justify-end mt-3">
                <button className="bg-sky-500 text-white px-4 py-2 rounded-lg">
                  Save
                </button>
              </div>
            </div>

            <div className="bg-white/50 shadow-sm rounded-2xl border border-[#eef3fb] p-6">
              <h2 className="font-semibold text-lg mb-3">Automated Scheduling</h2>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  className="border rounded-lg px-3 py-2 w-full"
                  defaultValue="Daily at 3:00 AM"
                />
                <button className="bg-sky-500 text-white px-4 py-2 rounded-lg">
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/50 shadow-sm rounded-2xl border border-[#eef3fb] p-6 h-fit">
            <h2 className="font-semibold text-lg mb-3">Current Status</h2>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className="text-green-600">Active</span>
            </p>
            <p>
              <span className="font-semibold">Last Updated:</span> 10 minutes ago
            </p>
            <p>
              <span className="font-semibold">Strategy:</span> Personalized Adaptive
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


