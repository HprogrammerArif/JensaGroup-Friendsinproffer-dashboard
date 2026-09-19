import React from "react";

const WeeklyWagesTable = ({ wagesData }) => {
  if (!wagesData || wagesData.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto w-full h-full custom-scrollbar">
      <table className="w-full text-sm text-left whitespace-nowrap min-w-max border-collapse border border-slate-200">
        <thead className="text-xs text-slate-700 bg-slate-50 sticky top-0 z-10 uppercase">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 font-semibold border border-slate-200 text-center w-16"
            >
              SL No.
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold border border-slate-200"
            >
              Cleaner Name
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold border border-slate-200"
            >
              Cleaner Phone
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold border border-slate-200 text-center"
            >
              Total Tasks
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold border border-slate-200 text-center"
            >
              Total Wages (£)
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold border border-slate-200"
            >
              Properties Worked
            </th>
          </tr>
        </thead>
        <tbody>
          {wagesData.map((wage, index) => (
            <tr
              key={wage.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              } hover:bg-slate-100 transition-colors`}
            >
              <td className="px-6 py-4 text-center font-medium text-slate-600 border border-slate-200">
                {index + 1}
              </td>
              <td className="px-6 py-4 font-medium text-slate-800 border border-slate-200">
                {wage.cleaner_name}
              </td>
              <td className="px-6 py-4 text-slate-600 border border-slate-200">
                {wage.cleaner_phone || "-"}
              </td>
              <td className="px-6 py-4 text-center border border-slate-200">
                <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {wage.total_tasks}
                </span>
              </td>
              <td className="px-6 py-4 text-center border border-slate-200">
                <span className="inline-flex items-center justify-center bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {wage.total_wages != null ? `£${wage.total_wages}` : "—"}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600 whitespace-normal border border-slate-200">
                {wage.properties_worked && wage.properties_worked.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {wage.properties_worked.map((property) => (
                      <span
                        key={property.id}
                        className="inline-block bg-slate-100 text-slate-700 border border-slate-200 rounded px-2 py-1 text-xs"
                      >
                        {property.name}
                        {property.city ? ` (${property.city})` : ""}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No properties</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyWagesTable;
