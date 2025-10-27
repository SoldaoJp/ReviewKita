import { useEffect, useState } from "react";
import { getAllAttempts, getAttemptById } from "../services/quizHistoryService";
import Topbar from "./components/sidebar/Topbar";
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function QuizHistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedQuizId, setExpandedQuizId] = useState(null);

  const getScoreColor = (percent) => {
    if (percent >= 80) {
      return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
    } else if (percent >= 60) {
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
    } else if (percent >= 40) {
      return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
    } else {
      return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
    }
  };

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const list = await getAllAttempts();
        setAttempts(list);
        setError(null);
      } catch (e) {
        setError('Failed to load quiz history.');
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const filtered = attempts;

  const selected = selectedId ? attempts.find(a => {
    if (a.id === selectedId) return a;
    return a.retakes?.find(r => r.id === selectedId);
  })?.id === selectedId 
    ? attempts.find(a => a.id === selectedId)
    : attempts.flatMap(a => a.retakes || []).find(r => r.id === selectedId) 
    : null;

  const toggleExpand = (quizId) => {
    setExpandedQuizId(expandedQuizId === quizId ? null : quizId);
  };

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      <Topbar />
      <h1 className="text-xl font-bold mb-6">Quiz History</h1>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">No finished quizzes yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb]">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-2">Title</th>
                <th className="text-left px-4 py-2">Reviewer</th>
                <th className="text-left px-4 py-2">Score</th>
                <th className="text-left px-4 py-2">Finished</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const scoreColors = getScoreColor(a.score_percent ?? 0);
                const hasRetakes = a.retakes && a.retakes.length > 0;
                const isExpanded = expandedQuizId === a.id;
                
                return (
                  <>
                    <tr key={a.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                          {hasRetakes && (
                            <button 
                              onClick={() => toggleExpand(a.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          )}
                          {a.title || 'Untitled Quiz'}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-700">{a.reviewer_title || 'Unknown'}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-2 py-1 rounded-full ${scoreColors.bg} ${scoreColors.text} font-semibold`}>
                          {a.score_percent ?? 'N/A'}%
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">{new Date(a.submitted_at).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => setSelectedId(a.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded">
                          <Info className="w-4 h-4" /> Details
                        </button>
                      </td>
                    </tr>
                    
                    {/* Retakes rows */}
                    {isExpanded && hasRetakes && a.retakes.map((retake, idx) => {
                      const retakeScoreColors = getScoreColor(retake.score_percent ?? 0);
                      return (
                        <tr key={retake.id} className="border-t bg-blue-50/30">
                          <td className="px-4 py-2 pl-12 text-gray-700">
                            <span className="text-xs text-blue-600 font-medium mr-2">RETAKE {idx + 1}</span>
                            {retake.title || 'Retake Quiz'}
                          </td>
                          <td className="px-4 py-2 text-gray-600 text-sm">{a.reviewer_title || 'Unknown'}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-block px-2 py-1 rounded-full ${retakeScoreColors.bg} ${retakeScoreColors.text} font-semibold text-xs`}>
                              {retake.score_percent ?? 'N/A'}%
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-600 text-sm">{new Date(retake.submitted_at).toLocaleString()}</td>
                          <td className="px-4 py-2">
                            <button onClick={() => setSelectedId(retake.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded text-sm">
                              <Info className="w-4 h-4" /> Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[90vw] max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{selected.title}</div>
                <div className="text-xs text-gray-500">{selected.reviewer_title || 'Unknown reviewer'} â€¢ {new Date(selected.submitted_at).toLocaleString()}</div>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-gray-500 hover:text-gray-700">âœ•</button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="mb-4">
                {(() => {
                  const scoreColors = getScoreColor(selected.score_percent ?? 0);
                  return (
                    <span className={`inline-block px-3 py-1.5 rounded-lg ${scoreColors.bg} ${scoreColors.text} font-semibold border ${scoreColors.border}`}>
                      Score: {selected.score_percent}%
                    </span>
                  );
                })()}
              </div>
              <div className="space-y-4">
                {selected.details?.map((detail, idx) => (
                  <div key={idx} className="border rounded p-3">
                    <div className="font-medium text-gray-800 mb-2">{detail.numberedQuestion}</div>
                    <div className="text-sm space-y-1">
                      <div><strong>Your answer:</strong> {detail.userAnswer || 'â€”'}</div>
                      <div><strong>Correct answer:</strong> {detail.correctAnswer}</div>
                    </div>
                    {detail.explanation && (
                      <div className="mt-2 text-sm text-gray-700"><strong>Explanation:</strong> {detail.explanation}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="px-5 py-3 border-t flex justify-end">
              <button onClick={() => setSelectedId(null)} className="px-4 py-2 bg-black text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


