import { FiUser } from "react-icons/fi";

const UpcomingTasks = ({ tasks = [] }) => {
  
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-slate-800">Upcoming Tasks Today</h3>

      <ul className="divide-y divide-slate-100">
        {tasks.length > 0 ? tasks.slice(0, 5).map((task, index) => (
          <li
            key={index}
            className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">{task.title || `${task.task_type} task`}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {task.building ? `Flat ${task.flat_number || 'N/A'} · ${task.building}` : task.location}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-blue-500">
                <FiUser className="shrink-0 text-[10px]" />
                {task.assigned_to || task.assignee || 'Unassigned'}
              </p>
            </div>
            <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-blue-500">
              {task.time}
            </span>
          </li>
        )) : <p className="text-sm text-slate-500">No upcoming tasks today.</p>}
      </ul>
    </div>
  );
};

export default UpcomingTasks;
