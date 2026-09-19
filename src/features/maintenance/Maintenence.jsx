import { useState } from "react";
import { useNavigate } from "react-router";
import MaintenanceBuildingCard from "./components/MaintenanceBuildingCard";
import MaintenanceHeader from "./components/MaintenanceHeader";
import ReportIssueModal from "./components/ReportIssueModal";
import { useShowMaintenanceDataQuery } from "../../Redux/feature/baseApi";

const Maintenence = () => {
  const { data: maintenanceData, isLoading } = useShowMaintenanceDataQuery();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const buildings = maintenanceData?.results || [];

  const filtered = buildings.filter((item) => {
    const matchesSearch = item.building?.city?.toLowerCase().includes(search.toLowerCase()) ||
      item.building?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-100 p-3 sm:p-5 lg:p-6">
      <MaintenanceHeader
        search={search}
        onSearch={setSearch}
        onAddIssue={() => setIsReportModalOpen(true)}
      />

      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <p className="text-lg font-semibold">No results found</p>
          <p className="mt-1 text-sm">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const buildingData = {
              id: item.building?.id,
              name: item.building?.name,
              city: item.building?.city,
              image: item.building?.avatar || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80",
              highPriority: item.issues_status_counter?.high_priority_maintainance_issue_count || 0,
              pendingCount: item.issues_status_counter?.pending_maintainance_issue_count || 0,
              status: item.status || "Pending",
            };
            return (
              <MaintenanceBuildingCard
                key={item.id}
                building={buildingData}
                onViewDetails={(id) => navigate(`/maintenance/${id}`)}
              />
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Maintenence;