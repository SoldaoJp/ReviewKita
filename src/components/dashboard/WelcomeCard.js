// src/components/dashboard/WelcomeCard.js
export default function WelcomeCard({ user }) {
  return (
    <div className="bg-[#fbfdff] rounded-2xl p-6 shadow-sm border border-[#eef3fb]">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl leading-tight font-bold text-gray-900">
            Welcome Back,
            <br />
            <span className="block">{user?.name ?? "Ahron"}</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">Smarter studying starts here</p>

          <button className="mt-5 inline-flex items-center gap-3 bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-95 transition">
            Start Quiz
          </button>
        </div>

        {/* small decorative control / illustration aligned to top right like sample */}
        <div className="w-20 h-20 bg-[#f3f9ff] rounded-lg flex items-center justify-center">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <rect x="4.5" y="6" width="15" height="10" rx="2" stroke="#3B82F6" strokeWidth="1.25" />
            <path d="M8 10h8" stroke="#3B82F6" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
