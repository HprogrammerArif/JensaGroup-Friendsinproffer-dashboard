import { useState } from "react";
import { FiShield } from "react-icons/fi";
import IssueDetailsModal from "./IssueDetailsModal";

const formatTitle = (typeStr) => {
  if (!typeStr) return "Rule Violation";
  return typeStr.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const RuleBreakingIssues = ({ issues = [] }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <FiShield className="text-base text-red-500" />
        <h3 className="text-base font-bold text-red-600">Rule-Breaking Issue</h3>
      </div>

      <ul className="space-y-3">
        {issues.length > 0 ? issues.slice(0, 5).map((issue, index) => (
          <li
            key={index}
            className="flex items-center justify-between gap-3 rounded-lg border border-red-100 bg-white p-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                {issue.title || formatTitle(issue.violate_type)}
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
        )) : <p className="text-sm text-slate-500">No rule-breaking issues found.</p>}
      </ul>

      <IssueDetailsModal
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        issue={selectedIssue}
      />
    </div>
  );
};

export default RuleBreakingIssues;
