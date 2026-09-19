import { useState } from "react";
import { useParams } from "react-router";
import HouseMaintenanceDetailsHeader from "./components/HouseMaintenanceDetailsHeader";
import MaintenanceIssuesTable from "./components/MaintenanceIssuesTable";
import ReportIssueModal from "./components/ReportIssueModal";
import { useShowMaintenanceDetailsQuery, useShowMaintenanceFilterDataQuery } from "../../Redux/feature/baseApi";

const HouseMaintenenceDetails = () => {
  const { buildingId } = useParams();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const getApiStatus = (tab) => {
    if (tab === "Pending") return "pending";
    if (tab === "In Progress") return "processing";
    return "";
  };

  const { data: allData, isLoading: isAllLoading } = useShowMaintenanceDetailsQuery(buildingId, {
    skip: activeTab !== "All"
  });

  const { data: filteredData, isLoading: isFilterLoading } = useShowMaintenanceFilterDataQuery({
    id: buildingId,
    issue_type: "maintenance",
    status: getApiStatus(activeTab)
  }, {
    skip: activeTab === "All"
  });

  const isLoading = activeTab === "All" ? isAllLoading : isFilterLoading;
  const currentData = activeTab === "All" ? allData : filteredData;

  const issuesData = currentData?.results?.issue_data || (Array.isArray(currentData?.results) ? currentData?.results : []);
  const stats = currentData?.results?.stats || { pending: 0, processing: 0, completed: 0 };
  
  const openCount = (stats.pending || 0) + (stats.processing || 0);
  const buildingName = issuesData[0]?.building?.name || "Building";

  const filtered = issuesData.filter((issue) => {
    const title = issue.description || "";
    const property = issue.apartment?.flat_number || "";
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) ||
      property.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const formattedIssues = filtered.map(issue => ({
    id: issue.id,
    title: issue.issue_type === "maintenance" ? "Maintenance" : "Rule Breaking",
    description: issue.description || "N/A",
    date: new Date(issue.created_at).toLocaleDateString(),
    property: `Flat ${issue.apartment?.flat_number}`,
    priority: issue.priority === "high" ? "High" : issue.priority === "medium" ? "Medium" : "Low",
    status: issue.status === "processing" ? "In Progress" : issue.status === "completed" ? "Done" : "Pending",
    reportedBy: issue.reported_by_or_solved_by_data?.reported_by || "Unknown",
    solvedBy: issue.reported_by_or_solved_by_data?.is_solved ? issue.reported_by_or_solved_by_data?.reported_by : "N/A"
  }));

  return (
    <main className="min-h-screen bg-slate-100 p-3 sm:p-5 lg:p-6">
      <HouseMaintenanceDetailsHeader
        buildingName={buildingName}
        openCount={openCount}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearch={setSearch}
        onAddIssue={() => setIsReportModalOpen(true)}
      />

      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultBuildingId={buildingId}
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : (
        <MaintenanceIssuesTable issues={formattedIssues} />
      )}
    </main>
  );
};

export default HouseMaintenenceDetails;