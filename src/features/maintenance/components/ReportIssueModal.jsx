import { useState, useEffect, useRef } from "react";
import { FiX, FiUpload, FiImage, FiAlertCircle, FiCheck, FiInfo } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useCreateReportIssueMutation,
  useShowScheduleDataQuery,
  useShowAllBuildingDataQuery,
} from "../../../Redux/feature/baseApi";

const VIOLATION_OPTIONS = [
  { value: "smoking_in_property", label: "Smoking inside property" },
  { value: "excessive_noise", label: "Excessive noise / Unauthorized party" },
  { value: "unauthorized_pet", label: "Unauthorized pets" },
  { value: "overstay_or_extra_guests", label: "Overstay / Unregistered guests" },
  { value: "property_damage", label: "Property damage / Vandalism" },
  { value: "other", label: "Other rule violation" },
];

const ReportIssueModal = ({ isOpen, onClose, defaultBuildingId = null }) => {
  const fileInputRef = useRef(null);

  const [issueType, setIssueType] = useState("maintenance"); // 'maintenance' | 'rule_breaking'
  const [selectedBuilding, setSelectedBuilding] = useState(defaultBuildingId || "");
  const [taskId, setTaskId] = useState("");
  const [customTaskId, setCustomTaskId] = useState(false);
  const [priority, setPriority] = useState("medium"); // 'high' | 'medium' | 'low'
  const [violateType, setViolateType] = useState("smoking_in_property");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // Queries
  const { data: scheduleData, isLoading: isScheduleLoading } = useShowScheduleDataQuery({});
  const { data: buildingsData } = useShowAllBuildingDataQuery();
  const [createReportIssue, { isLoading: isSubmitting }] = useCreateReportIssueMutation();

  const allTasks = scheduleData?.results?.schedule_tasks || [];
  const buildings = buildingsData?.results || [];

  // Reset or sync when modal opens / defaultBuildingId changes
  useEffect(() => {
    if (isOpen) {
      if (defaultBuildingId) {
        setSelectedBuilding(defaultBuildingId.toString());
      }
    } else {
      // Reset form
      setIssueType("maintenance");
      setTaskId("");
      setCustomTaskId(false);
      setPriority("medium");
      setViolateType("smoking_in_property");
      setDescription("");
      setFile(null);
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  }, [isOpen, defaultBuildingId]);

  // Filter tasks by selected building (if any selected)
  const filteredTasks = allTasks.filter((t) => {
    if (!selectedBuilding) return true;
    const bId = t.building_data?.id || t.building;
    return bId && bId.toString() === selectedBuilding.toString();
  });

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Check size limit (max 20MB)
    if (selected.size > 20 * 1024 * 1024) {
      toast.error("File size cannot exceed 20MB.");
      return;
    }

    setFile(selected);
    if (selected.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selected));
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskId) {
      toast.error("Please select or enter a Schedule Task ID.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please provide a description of the issue.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("task", taskId);
      formData.append("issue_type", issueType);
      formData.append("description", description.trim());

      if (issueType === "maintenance") {
        formData.append("priority", priority);
      } else {
        formData.append("violate_type", violateType);
      }

      if (file) {
        formData.append("photo_or_video", file);
      }

      await createReportIssue(formData).unwrap();
      toast.success("Issue reported successfully!");
      onClose();
    } catch (err) {
      const errMsg =
        err?.data?.message ||
        err?.data?.detail ||
        (typeof err?.data === "string" ? err.data : null) ||
        (err?.data ? JSON.stringify(err.data) : "Failed to report issue. Please try again.");
      toast.error(errMsg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs sm:p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              Report New Issue
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Create a maintenance or rule-breaking issue for a property
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Issue Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Issue Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIssueType("maintenance")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                  issueType === "maintenance"
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Maintenance Issue
              </button>
              <button
                type="button"
                onClick={() => setIssueType("rule_breaking")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                  issueType === "rule_breaking"
                    ? "border-red-500 bg-red-50 text-red-700 shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Rule Breaking
              </button>
            </div>
          </div>

          {/* Building & Task Filter */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Link to Schedule Task <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomTaskId(!customTaskId)}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                {customTaskId ? "Select from list" : "Enter Task ID manually"}
              </button>
            </div>

            {!customTaskId ? (
              <>
                {/* Building Filter dropdown */}
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Filter by Building (Optional)</label>
                  <select
                    value={selectedBuilding}
                    onChange={(e) => {
                      setSelectedBuilding(e.target.value);
                      setTaskId("");
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">All Buildings</option>
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} {b.city ? `(${b.city})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task Selection */}
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Scheduled Task {isScheduleLoading && "(Loading tasks...)"}
                  </label>
                  <select
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">-- Choose a scheduled task --</option>
                    {filteredTasks.map((t) => {
                      const bName = t.building_data?.name || `Building #${t.building || ""}`;
                      const fNumber = t.flat_data?.flat_number ? `Flat ${t.flat_data.flat_number}` : `Flat #${t.flat || ""}`;
                      const dateStr = t.date ? ` on ${t.date}` : "";
                      return (
                        <option key={t.id} value={t.id}>
                          Task #{t.id} — {bName} ({fNumber}){dateStr} [{t.task_type || "task"}]
                        </option>
                      );
                    })}
                  </select>

                  {filteredTasks.length === 0 && !isScheduleLoading && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                      <FiAlertCircle />
                      No scheduled tasks found for this selection. Switch to manual Task ID or assign a schedule first.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Schedule Task ID (e.g. 90, 92)
                </label>
                <input
                  type="number"
                  value={taskId}
                  onChange={(e) => setTaskId(e.target.value)}
                  placeholder="Enter numerical Task ID"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}
          </div>

          {/* Conditional: Priority for Maintenance vs Violate Type for Rule Breaking */}
          {issueType === "maintenance" ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "low", label: "Low", color: "border-slate-200 text-slate-700 bg-slate-50 active:bg-slate-100" },
                  { value: "medium", label: "Medium", color: "border-amber-200 text-amber-700 bg-amber-50" },
                  { value: "high", label: "High", color: "border-red-200 text-red-700 bg-red-50" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPriority(item.value)}
                    className={`rounded-xl border py-2 text-xs font-semibold capitalize transition ${
                      priority === item.value
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-xs ring-2 ring-blue-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Violation Type <span className="text-red-500">*</span>
              </label>
              <select
                value={violateType}
                onChange={(e) => setViolateType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {VIOLATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                issueType === "maintenance"
                  ? "Describe the maintenance issue in detail (e.g. Water leaking under the kitchen sink, heater not turning on...)"
                  : "Describe the rule breaking violation (e.g. Guest was found smoking inside the property...)"
              }
              required
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
            />
          </div>

          {/* Photo or Video Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Photo or Video Evidence (Optional)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 transition hover:border-blue-400 hover:bg-blue-50/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FiUpload className="text-lg" />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-700">
                  Click to upload photo or video
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  PNG, JPG, MP4 up to 20MB
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FiImage className="text-xl" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="truncate text-xs font-semibold text-slate-800 max-w-[220px]">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-red-600"
                  title="Remove file"
                >
                  <FiX className="text-base" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FiCheck />
                  <span>Report Issue</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueModal;
