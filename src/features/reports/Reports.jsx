import { useMemo, useState } from "react";
import { HiArrowDownTray } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import ReportsStats from "./components/ReportsStats";
import ReportsFilters from "./components/ReportsFilters";
import ReportsTable from "./components/ReportsTable";
import ReportIssueModal from "../maintenance/components/ReportIssueModal";
import { useGetReportIssueListQuery, useGetCompletionReportListQuery } from "../../Redux/feature/baseApi";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    area: "",
    building: "",
    flat: "",
    date_type: "",
    status: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const queryParams = useMemo(() => {
    const params = {};
    if (activeTab) params.issue_type = activeTab;
    if (filters.date_type) params.date_type = filters.date_type;
    if (filters.status) params.status = filters.status;
    if (filters.area) params.area = filters.area;
    if (filters.building) params.building = filters.building;
    if (filters.flat) params.flat = filters.flat;
    return params;
  }, [activeTab, filters]);

  const { data: reportData, isLoading } = useGetReportIssueListQuery(queryParams);

  // ── Completion Reports ──
  const [completionStatus, setCompletionStatus] = useState("");
  const { data: completionData, isLoading: completionLoading } = useGetCompletionReportListQuery(
    completionStatus ? { status: completionStatus } : {}
  );
  const completionReports = Array.isArray(completionData)
    ? completionData
    : completionData?.results || completionData?.data || [];

  const stats = reportData?.results?.stats || reportData?.stats || {};

  const rawIssues = Array.isArray(reportData?.results?.issue_data)
    ? reportData.results.issue_data
    : Array.isArray(reportData?.results)
    ? reportData.results
    : Array.isArray(reportData?.issue_data)
    ? reportData.issue_data
    : Array.isArray(reportData)
    ? reportData
    : [];

  const filteredRows = useMemo(() => {
    return rawIssues.filter((item) => {
      if (filters.area) {
        const itemAreaId = item.building?.area || item.building?.area_data?.id;
        if (itemAreaId && itemAreaId.toString() !== filters.area.toString()) {
          return false;
        }
      }
      if (filters.building) {
        const itemBuildingId = item.building?.id;
        if (itemBuildingId && itemBuildingId.toString() !== filters.building.toString()) {
          return false;
        }
      }
      if (filters.flat) {
        const itemFlatId = item.apartment?.id;
        if (itemFlatId && itemFlatId.toString() !== filters.flat.toString()) {
          return false;
        }
      }
      if (filters.status) {
        if (item.status?.toLowerCase() !== filters.status.toLowerCase()) {
          return false;
        }
      }
      if (activeTab) {
        const itemType = item.issue_type?.toLowerCase().replace("-", "_");
        const tabType = activeTab.toLowerCase().replace("-", "_");
        if (itemType && itemType !== tabType) {
          return false;
        }
      }
      return true;
    });
  }, [rawIssues, filters, activeTab]);

  const handleExportCSV = () => {
    if (!filteredRows.length) return;
    const headers = ["ID", "Created At", "Area", "Building", "Flat", "Issued By", "Issue Type", "Description", "Status"];
    const csvRows = [headers.join(",")];

    filteredRows.forEach((row) => {
      const area = row.building?.area_data?.name || row.building?.city || "";
      const building = row.building?.name || "";
      const flat = row.apartment?.flat_number ? `Flat ${row.apartment.flat_number}` : "";
      const issuedBy = row.issued_by_data?.username || row.issued_by_data?.email || "";
      const issueType = row.issue_type || "";
      const description = (row.description || row.violate_type || "").replace(/"/g, '""');
      const status = row.status || "";

      const values = [
        row.id,
        `"${row.created_at || ""}"`,
        `"${area}"`,
        `"${building}"`,
        `"${flat}"`,
        `"${issuedBy}"`,
        `"${issueType}"`,
        `"${description}"`,
        `"${status}"`,
      ];
      csvRows.push(values.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Reports_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Reports &amp; Overview</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">Analyze performance and track history</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"
          >
            <HiArrowDownTray className="text-base text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700"
          >
            <FiPlus className="text-base" />
            <span>Report Issue</span>
          </button>
        </div>
      </div>

      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Stats */}
      <ReportsStats stats={stats} />

      {/* Filters + Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4 sm:p-5">
        <ReportsFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <ReportsTable rows={filteredRows} isLoading={isLoading} />
      </div>

      {/* Completion Reports Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-800">Completion Reports</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-1">Filter by status:</span>
            {["", "processing", "completed", "can_not_do"].map((s) => (
              <button
                key={s || "all"}
                type="button"
                onClick={() => setCompletionStatus(s)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  completionStatus === s
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s === "" ? "All" : s === "can_not_do" ? "Cannot Do" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {completionLoading ? (
          <div className="py-10 text-center text-slate-400">Loading completion reports…</div>
        ) : completionReports.length === 0 ? (
          <div className="py-10 text-center text-slate-400">No completion reports found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["#", "Report Issue", "Status", "Parts Cost", "Labour Cost", "Additional Notes", "Created At"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {completionReports.map((cr, idx) => (
                  <tr key={cr.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3 text-slate-700">#{cr.report_issue || cr.report_issue_id || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        cr.status === "completed" ? "bg-green-50 text-green-700 border-green-200" :
                        cr.status === "can_not_do" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {cr.status === "can_not_do" ? "Cannot Do" : cr.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{cr.parts_cost ? `£${cr.parts_cost}` : "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{cr.labour_cost ? `£${cr.labour_cost}` : "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{cr.additional_notes || cr.why_cannot_do || "—"}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {cr.created_at ? new Date(cr.created_at).toLocaleDateString("en-GB") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
