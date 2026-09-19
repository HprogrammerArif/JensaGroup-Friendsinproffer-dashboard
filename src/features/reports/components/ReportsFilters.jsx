import { useShowScheduleAllDataQuery } from "../../../Redux/feature/baseApi";

const TABS = [
  { label: "All Reports", value: "" },
  { label: "Cleaning Completion", value: "cleaning" },
  { label: "Maintenance History", value: "maintenance" },
  { label: "Rule-Breaking Issue", value: "rule_breaking" },
];

const DATE_OPTIONS = [
  { label: "All Dates", value: "" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "this_week" },
  { label: "Last Week", value: "last_week" },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
];

const ReportsFilters = ({ activeTab, onTabChange, filters, onFilterChange }) => {
  const { data: showScheduleAllData } = useShowScheduleAllDataQuery();
  const areas = Array.isArray(showScheduleAllData) ? showScheduleAllData : showScheduleAllData?.data || [];

  const selectedAreaObj = areas.find((a) => a.id?.toString() === filters.area?.toString());
  const buildings = selectedAreaObj?.buildings || [];
  const selectedBuildingObj = buildings.find((b) => b.id?.toString() === filters.building?.toString());
  const flats = selectedBuildingObj?.apartments || [];

  const handleAreaChange = (e) => {
    const areaVal = e.target.value;
    onFilterChange({
      area: areaVal,
      building: "",
      flat: "",
    });
  };

  const handleBuildingChange = (e) => {
    const bVal = e.target.value;
    onFilterChange({
      building: bVal,
      flat: "",
    });
  };

  const handleFlatChange = (e) => {
    onFilterChange({ flat: e.target.value });
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.value
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Area */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Area (City)</span>
          <select
            value={filters.area || ""}
            onChange={handleAreaChange}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 cursor-pointer"
          >
            <option value="">All Areas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        {/* Building */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Building</span>
          <select
            value={filters.building || ""}
            onChange={handleBuildingChange}
            disabled={!filters.area}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
          >
            <option value="">All Buildings</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        {/* Flat */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Flat (Property)</span>
          <select
            value={filters.flat || ""}
            onChange={handleFlatChange}
            disabled={!filters.building}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
          >
            <option value="">All Flats</option>
            {flats.map((f) => (
              <option key={f.id} value={f.id}>
                Flat {f.flat_number}
              </option>
            ))}
          </select>
        </label>

        {/* Date Type */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Date Range</span>
          <select
            value={filters.date_type || ""}
            onChange={(e) => onFilterChange({ date_type: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 cursor-pointer"
          >
            {DATE_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>

        {/* Status */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600">Status</span>
          <select
            value={filters.status || ""}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default ReportsFilters;
