import { FiSearch, FiPlus } from "react-icons/fi";

const MaintenanceHeader = ({ search, onSearch, onAddIssue }) => (
  <div className="mb-5 space-y-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
          Maintenance Management
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          View maintenance issues by building
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-xs focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search location"
            className="w-36 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-48"
          />
          <FiSearch className="shrink-0 text-slate-400" />
        </label>

        <button
          type="button"
          onClick={onAddIssue}
          className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700"
        >
          <FiPlus className="text-base" />
          <span>Report Issue</span>
        </button>
      </div>
    </div>
  </div>
);

export default MaintenanceHeader;
