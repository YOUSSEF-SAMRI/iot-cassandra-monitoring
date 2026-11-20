
function StatCard({ title, value, unit, icon: Icon }) {
  return (
    <div className="bg-[#142536] p-6 rounded-xl border border-slate-700/50 shadow-lg hover:border-cyan-500/40 transition-all duration-300">

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">
          {title}
        </p>

        <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-3xl font-bold text-slate-100">
          {value}
        </h2>

        {unit && (
          <p className="text-sm text-slate-500 mt-2">
            {unit}
          </p>
        )}
      </div>

    </div>
  );
}

export default StatCard;
