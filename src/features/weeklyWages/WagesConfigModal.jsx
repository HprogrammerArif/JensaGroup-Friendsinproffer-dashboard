import React, { useState } from "react";
import { FiX, FiPlus, FiEdit2, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useShowWeeklyWagesConfigQuery,
  useCreateWeeklyWagesConfigMutation,
  useUpdateWeeklyWagesConfigMutation,
  useUserCleanerFilterQuery,
} from "../../Redux/feature/baseApi";

const WagesConfigModal = ({ isOpen, onClose }) => {
  const [cleanerId, setCleanerId] = useState("");
  const [rate, setRate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editRate, setEditRate] = useState("");

  const { data: configData, isLoading: configLoading } = useShowWeeklyWagesConfigQuery();
  const { data: cleanerData } = useUserCleanerFilterQuery("cleaner");
  const [createConfig, { isLoading: isCreating }] = useCreateWeeklyWagesConfigMutation();
  const [updateConfig, { isLoading: isUpdating }] = useUpdateWeeklyWagesConfigMutation();

  const configs = Array.isArray(configData)
    ? configData
    : configData?.results || configData?.data || [];

  const cleaners = cleanerData?.results || [];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!cleanerId || !rate) {
      toast.error("Please select a cleaner and enter a rate.");
      return;
    }
    try {
      await createConfig({ cleaner: Number(cleanerId), rate_per_task: Number(rate) }).unwrap();
      toast.success("Rate configured successfully!");
      setCleanerId("");
      setRate("");
    } catch (error) {
      const msg =
        error?.data?.non_field_errors?.[0] ||
        error?.data?.message ||
        "Failed to configure rate.";
      toast.error(msg);
    }
  };

  const handleUpdate = async (id) => {
    if (!editRate) return;
    try {
      await updateConfig({ id, data: { rate_per_task: Number(editRate) } }).unwrap();
      toast.success("Rate updated!");
      setEditingId(null);
      setEditRate("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update rate.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Configure Cleaner Rates</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
          >
            <FiX />
          </button>
        </div>

        {/* Add new config */}
        <form onSubmit={handleCreate} className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FiPlus />
            Set Rate for a Cleaner
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Cleaner</label>
              <select
                value={cleanerId}
                onChange={(e) => setCleanerId(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Cleaner</option>
                {cleaners.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.user_profile?.full_name || c.phone_or_email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Rate per Task (£)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g. 100"
                required
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="mt-3 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {isCreating ? "Saving…" : "Set Rate"}
          </button>
        </form>

        {/* Existing configs */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Existing Configurations
          </h3>
          {configLoading ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : configs.length === 0 ? (
            <p className="text-sm text-slate-400">No rates configured yet.</p>
          ) : (
            <ul className="space-y-2">
              {configs.map((cfg) => (
                <li
                  key={cfg.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {cfg.cleaner_name ||
                        cfg.cleaner_data?.user_profile?.full_name ||
                        `Cleaner #${cfg.cleaner}`}
                    </p>
                    {editingId === cfg.id ? (
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editRate}
                          onChange={(e) => setEditRate(e.target.value)}
                          className="w-28 rounded border border-slate-200 px-2 py-1 text-sm outline-none focus:border-blue-400"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdate(cfg.id)}
                          disabled={isUpdating}
                          className="rounded bg-green-500 px-2 py-1 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50"
                        >
                          <FiCheck />
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingId(null); setEditRate(""); }}
                          className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-slate-200"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-green-700 font-semibold mt-0.5">
                        £{cfg.rate_per_task} / task
                      </p>
                    )}
                  </div>
                  {editingId !== cfg.id && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(cfg.id);
                        setEditRate(cfg.rate_per_task);
                      }}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default WagesConfigModal;
