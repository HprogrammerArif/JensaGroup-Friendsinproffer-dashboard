import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import ScheduleFilters from "./components/ScheduleFilters";
import ScheduleStats from "./components/ScheduleStats";
import ScheduleTasksTable from "./components/ScheduleTasksTable";
import ScheduleTaskModal from "./components/ScheduleTaskModal";
import {
  useCreateScheduleDataMutation,
  useShowScheduleDataQuery,
  useUpdateScheduleDataMutation,
} from "../../Redux/feature/baseApi";

const Schedule = () => {
  const [search, setSearch] = useState("");
  const [taskType, setTaskType] = useState("All");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Build query params from filters — server-side filtering for date, area, status
  const queryParams = useMemo(() => {
    const params = {};
    if (taskType !== "All") params.task_type = taskType;
    if (statusFilter) params.status = statusFilter;
    if (dateFilter) params.date = dateFilter;
    if (areaFilter) params.area = areaFilter;
    return params;
  }, [taskType, statusFilter, dateFilter, areaFilter]);

  const { data: showScheduleData, isLoading, error } = useShowScheduleDataQuery(queryParams);
  const [createScheduleData] = useCreateScheduleDataMutation();
  const [updateScheduleData] = useUpdateScheduleDataMutation();

  const rawTasks = showScheduleData?.results?.schedule_tasks || [];

  // Client-side search on building name
  const filteredTasks = useMemo(() => {
    const qSearch = search.toLowerCase().trim();
    if (!qSearch) return rawTasks;
    return rawTasks.filter((task) => {
      const buildingName = (task.building_data?.name || "").toLowerCase();
      return buildingName.includes(qSearch);
    });
  }, [search, rawTasks]);

  const stats = useMemo(() => {
    const cleaningCount = filteredTasks.filter((t) => t.task_type === "cleaning").length;
    const maintenanceCount = filteredTasks.filter((t) => t.task_type === "maintenance").length;
    const completedCount = filteredTasks.filter((t) => t.status === "completed").length;
    const pendingCount = filteredTasks.filter((t) => t.status === "pending").length;

    return [
      { label: "Total Scheduled", value: filteredTasks.length, valueColor: "text-slate-800" },
      { label: "Cleaning Tasks", value: cleaningCount, valueColor: "text-blue-500" },
      { label: "Maintenance Tasks", value: maintenanceCount, valueColor: "text-red-500" },
      { label: "Completed", value: completedCount, valueColor: "text-green-500" },
    ];
  }, [filteredTasks]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (formData) => {
    try {
      if (editingTask) {
        await updateScheduleData({ id: editingTask.id, data: formData }).unwrap();
        toast.success("Task updated successfully");
      } else {
        await createScheduleData(formData).unwrap();
        toast.success("Task scheduled successfully");
      }
      handleCloseModal();
    } catch (error) {
      const msg =
        error?.data?.message ||
        (typeof error?.data === "string" ? error.data : null) ||
        "An error occurred";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center text-slate-500">Loading schedules…</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load schedules. Please try again.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-3 sm:p-5 lg:p-6">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Schedule Management</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            View and manage cleaning and maintenance schedules
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          <FiPlus className="text-base" />
          Schedule Task
        </button>
      </header>

      <div className="space-y-4">
        <ScheduleStats stats={stats} />
        <ScheduleFilters
          search={search}
          onSearch={setSearch}
          taskType={taskType}
          onTaskType={setTaskType}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          onDateFilter={setDateFilter}
          areaFilter={areaFilter}
          onAreaFilter={setAreaFilter}
        />
        <ScheduleTasksTable tasks={filteredTasks} onEdit={handleEdit} />

        <ScheduleTaskModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseModal}
          task={editingTask}
          onSubmit={handleSubmitTask}
        />
      </div>
    </main>
  );
};

export default Schedule;
