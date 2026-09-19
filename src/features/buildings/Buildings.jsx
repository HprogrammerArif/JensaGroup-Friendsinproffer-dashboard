import { useState } from "react";
import BuildingCardGrid from "./components/BuildingCardGrid";
import AddBuildingModal from "./components/AddBuildingModal";
import BuildingsHeader from "./components/BuildingsHeader";

const Buildings = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEditBuilding = (building) => {
    setEditingBuilding(building);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingBuilding(null);
    setIsAddModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-slate-100 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto w-full">
        <BuildingsHeader 
          onAddBuilding={() => setIsAddModalOpen(true)} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <BuildingCardGrid 
          searchQuery={searchQuery}
          onEditBuilding={handleEditBuilding}
        />
      </div>

      <AddBuildingModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        editingBuilding={editingBuilding}
      />
    </main>
  );
};

export default Buildings;