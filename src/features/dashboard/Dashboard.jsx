import {
  FiAlertCircle,
  FiCheckSquare,
  FiClipboard,
  FiClock,
  FiHome,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import DashboardHeader from "./components/DashboardHeader";
import MaintenanceIssues from "./components/MaintenanceIssues";
import RecentActivity from "./components/RecentActivity";
import RuleBreakingIssues from "./components/RuleBreakingIssues";
import StatCard from "./components/StatCard";
import UpcomingTasks from "./components/UpcomingTasks";
import { useShowDashboardDataQuery } from "../../Redux/feature/baseApi";

// Removed hardcoded stats, generating dynamically inside the component

const Dashboard = () => {
  const {data: showAllDashboardData, isLoading} = useShowDashboardDataQuery();

  const data = showAllDashboardData || {};

  const overviewStats = [
    {
      label: "Total Buildings",
      value: data.buildings_data?.total_building || "0",
      sub: `${data.buildings_data?.total_apartment || 0} apartments`,
      icon: HiOutlineBuildingOffice2,
      color: "blue",
    },
    {
      label: "Total Properties",
      value: data.buildings_data?.total_apartment || "0",
      sub: "",
      icon: FiHome,
      color: "green",
    },
    {
      label: "Today's Cleaning Tasks",
      value: data.today_data?.cleaning_task?.total || "0",
      sub: `${data.today_data?.cleaning_task?.completed || 0} completed`,
      icon: FiCheckSquare,
      color: "purple",
    },
    {
      label: "Pending Maintenance Issues",
      value: data.today_data?.pending_maintainance_issues?.total || "0",
      sub: `${data.today_data?.pending_maintainance_issues?.top_priority || 0} high priority`,
      icon: FiClock,
      color: "orange",
    },
  ];

  const performanceStats = [
    { label: "Task Completion", value: `${Math.round(data.this_week_performance?.task_completion_rate || 0)}%`, icon: FiTrendingUp, color: "blue" },
    { label: "Tasks Completed", value: data.this_week_performance?.task_completed || "0", icon: FiClipboard, color: "green" },
    { label: "Active Cleaners", value: data.staff_count?.active_cleaners || "0", icon: FiUsers, color: "purple" },
    { label: "Issues Resolved", value: data.this_week_performance?.issue_resolved_this_week || "0", icon: FiAlertCircle, color: "orange" },
  ];
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <DashboardHeader />

      {/* ── Overview Stats ── */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* ── This Week's Performance ── */}
      <section className="mb-6">
        <h3 className="mb-4 text-base font-bold text-slate-800">
          This Week&apos;s Performance
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {performanceStats.map((stat) => (
            <StatCard key={stat.label} {...stat} coloredValue />
          ))}
        </div>
      </section>

      {/* ── Recent Activity + Upcoming Tasks ── */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentActivity activities={data.recent_activity || []} />
        <UpcomingTasks tasks={data.upcomming_task_today || []} />
      </div>

      {/* ── Maintenance + Rule-Breaking ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MaintenanceIssues issues={data.recent_maintenance_issues || []} />
        <RuleBreakingIssues issues={data.recnt_rule_braking_issues || []} />
      </div>
    </div>
  );
};

export default Dashboard;