import { FiTool } from "react-icons/fi";

const PRIORITY_STYLES = {
  High: "text-red-500 font-semibold",
  Medium: "text-orange-500 font-semibold",
  Low: "text-green-500 font-semibold",
};

const STATUS_STYLES = {
  Done: "text-green-500 font-semibold",
  Pending: "text-orange-400 font-semibold",
  "In Progress": "text-blue-500 font-semibold",
};

/* Desktop table row */
const TableRow = ({ issue }) => (
  <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
    <td className="py-3 pl-4 pr-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
          <FiTool className="text-xs" />
        </span>
        <div>
          <p className="font-semibold text-slate-800">{issue.title}</p>
          <p className="text-xs text-slate-400">{issue.description}</p>
        </div>
      </div>
    </td>
    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">{issue.date}</td>
    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">{issue.property}</td>
    <td className={`whitespace-nowrap px-4 py-3 text-sm ${PRIORITY_STYLES[issue.priority] ?? ""}`}>
      {issue.priority}
    </td>
    <td className={`whitespace-nowrap px-4 py-3 text-sm ${STATUS_STYLES[issue.status] ?? ""}`}>
      {issue.status}
    </td>
    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">{issue.reportedBy}</td>
    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">{issue.solvedBy}</td>
  </tr>
);

/* Mobile card */
const IssueCard = ({ issue }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
        <FiTool className="text-xs" />
      </span>
      <div>
        <p className="font-semibold text-slate-800">{issue.title}</p>
        <p className="text-xs text-slate-400">{issue.description}</p>
      </div>
    </div>

    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
      <div>
        <dt className="text-slate-400">Date</dt>
        <dd className="font-medium text-slate-600">{issue.date}</dd>
      </div>
      <div>
        <dt className="text-slate-400">Property</dt>
        <dd className="font-medium text-slate-600">{issue.property}</dd>
      </div>
      <div>
        <dt className="text-slate-400">Priority</dt>
        <dd className={PRIORITY_STYLES[issue.priority]}>{issue.priority}</dd>
      </div>
      <div>
        <dt className="text-slate-400">Status</dt>
        <dd className={STATUS_STYLES[issue.status]}>{issue.status}</dd>
      </div>
      <div>
        <dt className="text-slate-400">Reported by</dt>
        <dd className="font-medium text-slate-600">{issue.reportedBy}</dd>
      </div>
      <div>
        <dt className="text-slate-400">Solved by</dt>
        <dd className="font-medium text-slate-600">{issue.solvedBy}</dd>
      </div>
    </dl>
  </div>
);

const MaintenanceIssuesTable = ({ issues }) => {
  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-20 text-slate-400">
        <p className="text-lg font-semibold">No issues found</p>
        <p className="mt-1 text-sm">Try adjusting your filter or search</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-175 text-left text-sm">
          <thead className="border-b border-slate-100 bg-white">
            <tr>
              {["Issue", "Date", "Property", "Priority", "Status", "Reported by", "Solved by"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 first:pl-4"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <TableRow key={issue.id} issue={issue} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </>
  );
};

export default MaintenanceIssuesTable;
