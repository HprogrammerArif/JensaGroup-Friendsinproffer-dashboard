import { FiClock, FiUser, FiEdit } from "react-icons/fi";

const typeStyles = {
  cleaning: "bg-green-100 text-green-600",
  maintenance: "bg-orange-100 text-orange-500",
};

const Row = ({ task, onEdit }) => (
  <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
    <td className="px-4 py-3 text-sm text-slate-500">
      <span className="inline-flex items-center gap-2">
        <FiClock className="text-slate-400" />
        {`${task.date} ; ${task.time}`}
      </span>
    </td>
    <td className="px-4 py-3 text-sm">
      <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${typeStyles[task.task_type] || "bg-slate-100 text-slate-600"}`}>
        {task.task_type}
      </span>
    </td>
    <td className="px-4 py-3 text-sm text-slate-600">{task.building_data?.name || task.building}</td>
    <td className="px-4 py-3 text-sm text-slate-600">{task.flat_data?.flat_number || task.flat}</td>
    <td className="px-4 py-3 text-sm text-slate-600">
      <span className="inline-flex items-center gap-2">
        <FiUser className="text-slate-400" />
        {task.assigned_to_data?.name || task.assigned_to}
      </span>
    </td>
    <td className="px-4 py-3 text-sm text-slate-500">
      <button
        type="button"
        onClick={() => onEdit(task)}
        className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-blue-600 transition hover:bg-blue-50"
        aria-label={`Edit task ${task.id}`}
      >
        <FiEdit /> Edit
      </button>
    </td>
  </tr>
);

const Card = ({ task, onEdit }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-start justify-between">
      <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${typeStyles[task.task_type] || "bg-slate-100 text-slate-600"}`}>
        {task.task_type}
      </span>
      <button
        type="button"
        onClick={() => onEdit(task)}
        className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-blue-600 transition hover:bg-blue-50"
        aria-label={`Edit task ${task.id}`}
      >
        <FiEdit /> Edit
      </button>
    </div>

    <p className="text-sm font-semibold text-slate-800">{task.building_data?.name || task.building}</p>
    <p className="mt-0.5 text-sm text-slate-500">{task.flat_data?.flat_number || task.flat}</p>

    <dl className="mt-3 grid grid-cols-1 gap-y-2 text-xs sm:grid-cols-2 sm:gap-x-3">
      <div>
        <dt className="text-slate-400">Date & Time</dt>
        <dd className="font-medium text-slate-600">{`${task.date} ; ${task.time}`}</dd>
      </div>
      <div>
        <dt className="text-slate-400">Assigned To</dt>
        <dd className="font-medium text-slate-600">{task.assigned_to_data?.name || task.assigned_to}</dd>
      </div>
    </dl>
  </article>
);

const ScheduleTasksTable = ({ tasks, onEdit }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-20 text-slate-400">
        <p className="text-lg font-semibold">No tasks found</p>
        <p className="mt-1 text-sm">Try changing task type or filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50">
              {["Date & Time", "Type", "Building", "Property", "Assigned To", "Actions"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <Row key={task.id} task={task} onEdit={onEdit} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {tasks.map((task) => (
          <Card key={task.id} task={task} onEdit={onEdit} />
        ))}
      </div>
    </>
  );
};

export default ScheduleTasksTable;
