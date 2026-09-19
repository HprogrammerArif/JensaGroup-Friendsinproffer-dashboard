import { FiArrowLeft, FiSearch, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router";

const TABS = ["All", "Pending", "In Progress"];

const HouseMaintenanceDetailsHeader = ({
  buildingName,
  openCount,
  activeTab,
  onTabChange,
  search,
  onSearch,
  onAddIssue,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/maintenance")}
            className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-100"
            aria-label="Back to maintenance"
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
              {buildingName} - Maintenance
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {openCount} Open Issues
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-xs focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search"
              className="w-36 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-48"
            />
            <FiSearch className="shrink-0 text-slate-400" />
          </label>

          <button
            type="button"
            onClick={onAddIssue}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 sm:text-sm"
          >
            <FiPlus className="text-base" />
            <span>Add Issue</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-semibold text-slate-500 sm:text-sm">Status</span>
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HouseMaintenanceDetailsHeader;
