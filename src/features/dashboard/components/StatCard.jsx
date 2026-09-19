const colorVariants = {
  blue: {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    valueColor: "text-blue-600",
  },
  green: {
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    valueColor: "text-green-600",
  },
  purple: {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    valueColor: "text-purple-600",
  },
  orange: {
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    valueColor: "text-orange-600",
  },
};

const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  color = "blue",
  coloredValue = false,
}) => {
  const v = colorVariants[color];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`shrink-0 rounded-lg p-2.5 ${v.iconBg}`}>
          <Icon className={`text-xl ${v.iconColor}`} />
        </div>

        <div className="min-w-0">
          <p className="text-sm leading-tight text-slate-500">{label}</p>
          <p
            className={`mt-1 text-3xl font-bold leading-none ${
              coloredValue ? v.valueColor : "text-slate-800"
            }`}
          >
            {value}
          </p>
          {sub && <p className="mt-1.5 text-xs text-slate-400">{sub}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
