// Full class strings so Tailwind v4 can scan them
const barColor = {
  orange: "bg-orange-400",
  green: "bg-green-400",
  blue: "bg-blue-400",
  purple: "bg-purple-400",
};

const getColor = (type) => {
  switch (type) {
    case "task_completed": return "green";
    case "task_assigned": return "purple";
    default: return "blue";
  }
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Math.floor((new Date() - new Date(dateStr)) / 60000); // minutes
  if (diff < 60) return `${Math.max(1, diff)} mins ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-slate-800">Recent Activity</h3>

      <ul className="space-y-4">
        {activities.length > 0 ? activities.slice(0, 5).map((activity, index) => (
          <li key={index} className="flex items-start gap-3">
            <div
              className={`mt-1 h-full min-h-8 w-1 shrink-0 rounded-full ${barColor[getColor(activity.type)]}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-700">{activity.title}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {activity.payload?.building ? `Flat ${activity.payload?.flat_number || 'N/A'} · ${activity.payload?.building}` : activity.message}
              </p>
            </div>
            <span className="shrink-0 whitespace-nowrap text-xs text-slate-400">
              {timeAgo(activity.created_at)}
            </span>
          </li>
        )) : <p className="text-sm text-slate-500">No recent activity found.</p>}
      </ul>
    </div>
  );
};

export default RecentActivity;
