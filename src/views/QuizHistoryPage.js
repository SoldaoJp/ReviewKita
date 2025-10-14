import { useEffect, useState } from "react";
import { getAllAttempts, getAttemptById } from "../services/quizHistoryService";
import Topbar from "../components/sidebar/Topbar";
import { Info } from 'lucide-react';

export default function QuizHistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      const list = getAllAttempts();
      setAttempts(list);
      setError(null);
    } catch (e) {
      setError('Failed to load quiz history.');
    } finally {
      setLoading(false);
    }
  }, []);

  const filtered = attempts; // Show all attempts; Topbar handles global search

  const selected = selectedId ? getAttemptById(selectedId) : null;

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Topbar */}
      <Topbar />
      <h1 className="text-2xl font-bold mb-6">Quiz History</h1>


      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">No finished quizzes yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
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
              {filtered.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2 font-medium text-gray-800">{a.title || 'Untitled Quiz'}</td>
                  <td className="px-4 py-2 text-gray-700">{a.reviewerTitle || 'Unknown'}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                      {a.stats?.percentage ?? 'N/A'}%
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{new Date(a.finishedAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => setSelectedId(a.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded">
                      <Info className="w-4 h-4" /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[90vw] max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{selected.title}</div>
                <div className="text-xs text-gray-500">{selected.reviewerTitle || 'Unknown reviewer'} • {new Date(selected.finishedAt).toLocaleString()}</div>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="mb-4">
                <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">Score: {selected.stats?.percentage}%</span>
              </div>
              <div className="space-y-4">
                {selected.questions?.map((q, idx) => {
                  const a = selected.answers?.[idx];
                  const isCorrect = a?.isCorrect === true;
                  const isSkipped = a?.isSkipped === true;
                  return (
                    <div key={q.id} className="border rounded p-3">
                      <div className="font-medium text-gray-800 mb-2">{idx + 1}. {q.question}</div>
                      {q.type === 'multiple-choice' ? (
                        <div className="text-sm space-y-1">
                          <div><strong>Your answer:</strong> {isSkipped ? 'Skipped' : a?.answer ?? '—'}</div>
                          <div><strong>Correct answer:</strong> {q.correct_answer} {q.options ? `(${q.options[q.correct_answer]})` : ''}</div>
                        </div>
                      ) : (
                        <div className="text-sm space-y-1">
                          <div><strong>Your answer:</strong> {isSkipped ? 'Skipped' : a?.answer ?? '—'}</div>
                          <div><strong>Correct answer:</strong> {q.identification_answer}</div>
                        </div>
                      )}
                      {q.explanation && (
                        <div className="mt-2 text-sm text-gray-700"><strong>Explanation:</strong> {q.explanation}</div>
                      )}
                    </div>
                  );
                })}
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
