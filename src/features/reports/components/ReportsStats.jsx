import { HiCheckCircle, HiClock, HiWrenchScrewdriver, HiFolder } from "react-icons/hi2";

const ReportsStats = ({ stats = {} }) => {
  const statItems = [
    {
      label: "Total Reports",
      value: stats?.total_count ?? 0,
      icon: HiFolder,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Pending Issues",
      value: stats?.pending ?? 0,
      icon: HiClock,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      label: "Processing Issues",
      value: stats?.processing ?? 0,
      icon: HiWrenchScrewdriver,
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      label: "Completed Issues",
      value: stats?.completed ?? 0,
      icon: HiCheckCircle,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map(({ label, value, icon: Icon, iconColor, bgColor }) => (
        <article
          key={label}
          className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bgColor}`}>
            <Icon className={`text-xl ${iconColor}`} />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
          </div>
        </article>
      ))}
    </section>
  );
};

export default ReportsStats;
