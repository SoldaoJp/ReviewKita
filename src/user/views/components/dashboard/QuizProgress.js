export default function QuizProgress({ quizzes = [] }) {
    // fallback demo
    if (!quizzes || quizzes.length === 0) {
      quizzes = [
        { title: "Advanced Programming", pct: 0, done: 0 },
        { title: "IAS", pct: 0, done: 0 },
        { title: "Data Scalability", pct: 25, done: 10, note: "Need improvement" },
        { title: "Networking 2", pct: 75, done: 30, note: "Getting there" },
      ];
    }
  
    const badgeStyle = (pct) => {
      if (pct >= 75) return "border-green-200 bg-green-50 text-green-700";
      if (pct >= 50) return "border-yellow-200 bg-yellow-50 text-yellow-700";
      if (pct >= 25) return "border-orange-200 bg-orange-50 text-orange-700";
      return "border-red-200 bg-red-50 text-red-700";
    };
  
    return (
      <div className="space-y-3">
        <div className="bg-white/50 rounded-2xl p-4 shadow-sm border border-[#eef3fb]">
          <div className="text-sm font-bold text-gray-700">Quiz Progress</div>
        </div>
  
        {quizzes.map((q) => (
          <div key={q.title} className={`flex items-center justify-between p-3 rounded-xl border ${badgeStyle(q.pct)}`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${q.pct === 0 ? "border-gray-200 bg-white" : ""}`}>
                <div className={`text-xs font-bold ${q.pct>=75? "text-green-700": q.pct>=50? "text-yellow-700": q.pct>=25? "text-orange-700":"text-red-600"}`}>
                  {q.pct}%
                </div>
              </div>
  
              <div>
                <div className="text-sm font-medium text-gray-800">{q.title}</div>
                <div className="text-xs text-gray-400">{q.done}/40 {q.note ?? "TBA"}</div>
              </div>
            </div>
  
          </div>
        ))}
      </div>
    );
  }
  
