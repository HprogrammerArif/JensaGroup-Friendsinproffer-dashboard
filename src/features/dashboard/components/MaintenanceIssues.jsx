import { useState } from "react";
import { FiTool } from "react-icons/fi";
import IssueDetailsModal from "./IssueDetailsModal";

const MaintenanceIssues = ({ issues = [] }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FiTool className="text-base text-slate-600" />
        <h3 className="text-base font-bold text-slate-800">
          Maintenance High Priority Issues
        </h3>
      </div>

      <ul className="space-y-3">
        {issues.length > 0 ? issues.slice(0, 5).map((issue, index) => (
          <li key={index} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                {issue.title || (issue.description && issue.description !== 'no' ? issue.description : 'Maintenance Request')}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {issue.apartment?.flat_number ? `Flat ${issue.apartment.flat_number} · ${issue.building?.name}` : issue.location}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedIssue(issue)}
              className="shrink-0 rounded-lg bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-[0.98]"
            >
              View
            </button>
          </li>
        )) : <p className="text-sm text-slate-500">No maintenance issues found.</p>}
      </ul>

      <IssueDetailsModal
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        issue={selectedIssue}
      />
    </div>
  );
};

export default MaintenanceIssues;
