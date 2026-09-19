import { useState } from "react";
import { useParams } from "react-router";
import AddPropertyModal from "./components/AddPropertyModal";
import BuildingFlatsHeader from "./components/BuildingFlatsHeader";
import FlatsTable from "./components/FlatsTable";
import { useShowAllBuildingDataQuery, useShowAllApartmentDataQuery } from "../../Redux/feature/baseApi";

const BuildingFlatsList = () => {
  const { buildingId } = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFlat, setEditingFlat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: buildingsData } = useShowAllBuildingDataQuery();
  const { data: apartmentsData, isLoading, isError } = useShowAllApartmentDataQuery(buildingId);

  const building = buildingsData?.results?.find((b) => String(b.id) === String(buildingId));

  const handleEditFlat = (flat) => {
    setEditingFlat(flat);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingFlat(null);
    setIsAddModalOpen(false);
  };

  const apartments = Array.isArray(apartmentsData)
    ? apartmentsData
    : (apartmentsData?.apartments || apartmentsData?.results || []);

  console.log(apartments, "apartmentsData")
  const filteredApartments = apartments.filter((apt) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      apt.flat_number?.toLowerCase().includes(q) ||
      apt.bed_configuration?.toLowerCase().includes(q) ||
      String(apt.people)?.includes(q)
    );
  });
 console.log(filteredApartments, "filteredApartments")
  return (
    <main className="min-h-screen bg-slate-100 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto w-full">
        <BuildingFlatsHeader
          name={building?.name || "Building"}
          city={building?.city || ""}
          propertyCount={building?.property_count || apartments.length}
          onAddProperty={() => setIsAddModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {isLoading && (
          <div className="py-10 text-center text-slate-500">Loading apartments...</div>
        )}
        {isError && (
          <div className="py-10 text-center text-red-500">Failed to load apartments.</div>
        )}
        {!isLoading && !isError && (
          <FlatsTable
            flats={filteredApartments}
            buildingId={buildingId}
            onEditFlat={handleEditFlat}
          />
        )}
      </div>

      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        buildingId={buildingId}
        editingFlat={editingFlat}
      />
    </main>
  );
};

export default BuildingFlatsList;