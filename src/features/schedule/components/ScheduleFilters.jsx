import { FiSearch, FiCalendar, FiX } from "react-icons/fi";
import { useShowAreaListQuery } from "../../../Redux/feature/baseApi";

const TASK_TYPES = ["All", "cleaning", "maintenance"];
const STATUSES = ["All", "pending", "completed", "cancelled"];

const ScheduleFilters = ({
  search,
  onSearch,
  taskType,
  onTaskType,
  statusFilter,
  onStatusFilter,
  dateFilter,
  onDateFilter,
  areaFilter,
  onAreaFilter,
}) => {
  const { data: areaListData } = useShowAreaListQuery();
  const areas = Array.isArray(areaListData)
    ? areaListData
    : areaListData?.results || areaListData?.data || [];

  const clearDate = () => onDateFilter("");

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {/* Row 1: Search + Date + Area */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Search */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Search</span>
          <label className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Building name…"
              className="w-36 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-44"
            />
            <FiSearch className="text-slate-400" />
          </label>
        </div>

        {/* Date filter */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Date</span>
          <div className="relative flex h-9 items-center">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => onDateFilter(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={clearDate}
                className="absolute right-2 text-slate-400 hover:text-red-500"
              >
                <FiX className="text-xs" />
              </button>
            )}
          </div>
        </div>

        {/* Area filter */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Area</span>
          <select
            value={areaFilter}
            onChange={(e) => onAreaFilter(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Task Type */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold text-slate-700">Task Type</span>
        {TASK_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onTaskType(type)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
              taskType === type
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {type === "All" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Row 3: Status */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold text-slate-700">Status</span>
        {STATUSES.map((s) => {
          const colors = {
            All: statusFilter === s ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            pending: statusFilter === s ? "bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200",
            completed: statusFilter === s ? "bg-green-500 text-white" : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200",
            cancelled: statusFilter === s ? "bg-red-500 text-white" : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200",
          };
          return (
            <button
              key={s}
              type="button"
              onClick={() => onStatusFilter(s === "All" ? "" : s)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${colors[s]}`}
            >
              {s === "All" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ScheduleFilters;
