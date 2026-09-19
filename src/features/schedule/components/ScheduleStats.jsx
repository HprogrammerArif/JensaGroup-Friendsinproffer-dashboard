const ScheduleStats = ({ stats }) => {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <article
          key={item.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className={`mt-1 text-3xl font-bold ${item.valueColor}`}>{item.value}</p>
        </article>
      ))}
    </section>
  );
};

export default ScheduleStats;
