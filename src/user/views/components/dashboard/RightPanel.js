import QuizProgress from "./QuizProgress";

export default function RightPanel({ data }) {
  const streak = data?.streak ?? { days: 5, marks: [2,13,14,9,12,5,17,23,25] };

  return (
    <div className="space-y-6">
      {/* Days Streak (top small card) */}
      <div className="bg-white/50 rounded-2xl p-5 shadow-sm border border-[#eef3fb]">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">{streak?.days ?? 5}</div>
          <div className="text-xs text-gray-400">Days Streak</div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, i) => {
            const active = streak.marks.includes(i);
            return (
              <div
                key={i}
                className={`w-6 h-6 rounded-md ${active ? "bg-blue-600" : "bg-gray-200"}`}
              />
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-7 text-[10px] text-gray-400 gap-1">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>
      </div>

      {/* Quiz Progress stack (uses separate component) */}
      <QuizProgress quizzes={data?.quizzes} />
    </div>
  );
}

