import { useState } from "react";
import { HiClock, HiUser, HiHome, HiEye } from "react-icons/hi2";
import IssueDetailsModal from "../../dashboard/components/IssueDetailsModal";

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "processing":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const dateObj = new Date(dateStr);
  const dateFormatted = dateObj.toLocaleDateString("en-GB");
  const timeFormatted = dateObj.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateFormatted} ; ${timeFormatted}`;
};

const TableRow = ({ row, onOpenDetails }) => {
  const areaName = row.building?.area_data?.name || row.building?.city || "N/A";
  const buildingName = row.building?.name || "N/A";
  const propertyName = row.apartment?.flat_number ? `Flat ${row.apartment.flat_number}` : "N/A";
  const completedBy = row.issued_by_data?.username || row.issued_by_data?.email || "N/A";
  const taskText =
    row.issue_type === "rule_breaking" || row.issue_type === "rule-breaking"
      ? row.violate_type?.replace(/_/g, " ") || row.description
      : row.description && row.description !== "no"
      ? row.description
      : row.issue_type || "Issue Reported";

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
        <span className="flex items-center gap-1.5 font-medium">
          <HiClock className="shrink-0 text-slate-400" />
          {formatDate(row.created_at)}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-slate-700">{areaName}</td>
      <td className="px-4 py-3 text-sm text-slate-700">{buildingName}</td>
      <td className="px-4 py-3 text-sm text-slate-700">{propertyName}</td>
      <td className="px-4 py-3 text-sm text-slate-700">
        <span className="flex items-center gap-1.5">
          <HiUser className="shrink-0 text-slate-400" />
          {completedBy}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-slate-700 capitalize max-w-xs truncate">{taskText}</td>
      <td className="px-4 py-3 text-sm">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getStatusBadge(
            row.status
          )}`}
        >
          {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "N/A"}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onOpenDetails(row)}
          className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <HiEye className="text-sm" />
          Open
        </button>
      </td>
    </tr>
  );
};

const MobileCard = ({ row, onOpenDetails }) => {
  const buildingName = row.building?.name || "N/A";
  const propertyName = row.apartment?.flat_number ? `Flat ${row.apartment.flat_number}` : "N/A";
  const completedBy = row.issued_by_data?.username || row.issued_by_data?.email || "N/A";
  const taskText =
    row.issue_type === "rule_breaking" || row.issue_type === "rule-breaking"
      ? row.violate_type?.replace(/_/g, " ") || row.description
      : row.description && row.description !== "no"
      ? row.description
      : row.issue_type || "Issue Reported";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <HiClock className="shrink-0 text-slate-400" />
          {formatDate(row.created_at)}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold border ${getStatusBadge(
            row.status
          )}`}
        >
          {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "N/A"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-slate-400 block">Building</span>
          <span className="text-slate-700 font-medium">{buildingName}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Property</span>
          <span className="text-slate-700 font-medium">{propertyName}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Issued By</span>
          <span className="text-slate-700 font-medium truncate flex items-center gap-1">
            <HiUser className="text-slate-400 shrink-0" />
            {completedBy}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Task / Issue</span>
          <span className="text-slate-700 font-medium capitalize truncate block">{taskText}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <button
          onClick={() => onOpenDetails(row)}
          className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <HiEye className="text-sm" />
          Open Details
        </button>
      </div>
    </div>
  );
};

const ReportsTable = ({ rows = [], isLoading }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs md:block">
        <table className="min-w-175 w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-left">
              {["Date & Time", "Area", "Building", "Property", "Issued By", "Task / Issue", "Status", "Actions"].map(
                (col) => (
                  <th key={col} className="px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                  Loading reports...
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id} row={row} onOpenDetails={(issue) => setSelectedIssue(issue)} />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                  No reports found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-xs">
            Loading reports...
          </div>
        ) : rows.length > 0 ? (
          rows.map((row) => (
            <MobileCard key={row.id} row={row} onOpenDetails={(issue) => setSelectedIssue(issue)} />
          ))
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-xs">
            No reports found for the selected filters.
          </div>
        )}
      </div>

      {/* Details Modal */}
      <IssueDetailsModal
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        issue={selectedIssue}
      />
    </>
  );
};

export default ReportsTable;
