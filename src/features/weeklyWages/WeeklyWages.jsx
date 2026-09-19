import React, { useState } from "react";
import { FiSettings, FiRefreshCw, FiDollarSign, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast } from "react-toastify";
import GenerateWagesModal from "./GenerateWagesModal";
import WeeklyWagesTable from "./WeeklyWagesTable";
import WagesConfigModal from "./WagesConfigModal";
import {
  useShowWeeklyWagesQuery,
  useShowWeeklyWagesConfigQuery,
} from "../../Redux/feature/baseApi";

const WeeklyWages = () => {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const { data: wagesData, isLoading: wagesLoading, refetch: refetchWages } =
    useShowWeeklyWagesQuery();
  const { data: configData, isLoading: configLoading } = useShowWeeklyWagesConfigQuery();

  const wages = Array.isArray(wagesData)
    ? wagesData
    : wagesData?.results || wagesData?.data || [];

  const configs = Array.isArray(configData)
    ? configData
    : configData?.results || configData?.data || [];

  const handleWagesGenerated = () => {
    refetchWages();
  };

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Weekly Wages Overview</h1>
          <p className="text-slate-500 mt-1">Review and generate cleaner wages for any date range</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition text-sm"
          >
            <FiSettings className="text-base" />
            Configure Rates
          </button>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
          >
            <FiDollarSign className="text-base" />
            Generate Wages
          </button>
        </div>
      </div>

      {/* Config Summary (collapsible) */}
      {configs.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowConfig((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <span className="flex items-center gap-2">
              <FiSettings className="text-slate-400" />
              Rate Configurations ({configs.length} cleaners configured)
            </span>
            {showConfig ? (
              <FiChevronUp className="text-slate-400" />
            ) : (
              <FiChevronDown className="text-slate-400" />
            )}
          </button>
          {showConfig && (
            <div className="overflow-x-auto border-t border-slate-100">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {["Cleaner", "Rate per Task (£)", "Config ID"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {configLoading ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-4 text-slate-400">
                        Loading…
                      </td>
                    </tr>
                  ) : (
                    configs.map((cfg) => (
                      <tr
                        key={cfg.id}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-5 py-3 font-medium text-slate-700">
                          {cfg.cleaner_name ||
                            cfg.cleaner_data?.user_profile?.full_name ||
                            `Cleaner #${cfg.cleaner}`}
                        </td>
                        <td className="px-5 py-3 text-green-700 font-semibold">
                          £{cfg.rate_per_task}
                        </td>
                        <td className="px-5 py-3 text-slate-400">#{cfg.id}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Wages Table */}
      <div className="bg-white rounded-xl shadow border border-slate-200 flex-1 overflow-hidden">
        {wagesLoading ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <FiRefreshCw className="animate-spin mr-2" />
            Loading wages…
          </div>
        ) : wages.length > 0 ? (
          <WeeklyWagesTable wagesData={wages} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <FiDollarSign className="text-4xl mb-3 text-slate-300" />
            <p className="font-medium">No wages data available</p>
            <p className="text-sm mt-1">
              Click &quot;Generate Wages&quot; to fetch data for a specific date range.
            </p>
          </div>
        )}
      </div>

      <GenerateWagesModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSuccess={handleWagesGenerated}
      />

      <WagesConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
};

export default WeeklyWages;
