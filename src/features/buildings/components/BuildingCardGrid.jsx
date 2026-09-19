import {
    FiChevronRight,
    FiEdit2,
    FiHome,
    FiMapPin,
    FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "react-toastify";
import { 
    useShowAllBuildingDataQuery, 
    useDeleteBuildingDataMutation 
} from "../../../Redux/feature/baseApi";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const BuildingCard = ({ building, onEditBuilding }) => {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteBuildingData, { isLoading: isDeleting }] = useDeleteBuildingDataMutation();

    const handleDelete = async () => {
        try {
            await deleteBuildingData(building.id).unwrap();
            toast.success("Building deleted successfully");
        } catch (error) {
            toast.error(error?.data?.detail || "Failed to delete building");
            console.error("Delete building error:", error);
        }
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm relative">
            <div className="mb-3 flex items-start gap-3">
                <img
                    src={building.avatar || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=240&q=80"}
                    alt={building.name}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    loading="lazy"
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-lg font-semibold text-slate-800">{building.name}</h3>
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(true)}
                            disabled={isDeleting}
                            aria-label="Delete building"
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-400 transition hover:bg-red-100 hover:text-red-500 disabled:opacity-50"
                        >
                            <FiTrash2 className="text-sm" />
                        </button>
                    </div>

                    <p className="mt-1 flex items-center gap-1 text-sm text-blue-500">
                        <FiMapPin className="text-xs" />
                        {building.city}
                    </p>

                    <p className="mt-3 text-sm text-slate-500 truncate">{building.full_address}</p>
                    <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500">
                        <FiHome className="text-xs" />
                        {building.property_count || 0} Properties
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => onEditBuilding(building)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                >
                    <FiEdit2 className="text-xs" />
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => navigate(`/buildings/${building.id}`)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                >
                    Open
                    <FiChevronRight className="text-xs" />
                </button>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Building"
                message="Are you sure delete this building?"
            />
        </article>
    );
};

const BuildingCardGrid = ({ searchQuery, onEditBuilding }) => {
    const { data: buildingsData, isLoading, isError } = useShowAllBuildingDataQuery();

    if (isLoading) {
        return <div className="py-10 text-center text-slate-500">Loading buildings...</div>;
    }

    if (isError) {
        return <div className="py-10 text-center text-red-500">Failed to load buildings.</div>;
    }

    const buildings = buildingsData?.results || [];

    // Filter buildings based on search query
    const filteredBuildings = buildings.filter((building) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            building.name?.toLowerCase().includes(query) ||
            building.city?.toLowerCase().includes(query) ||
            building.full_address?.toLowerCase().includes(query)
        );
    });

    if (filteredBuildings.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
                <p className="text-sm text-slate-500">No buildings found matching "{searchQuery}"</p>
            </div>
        );
    }

    return (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredBuildings.map((building) => (
                <BuildingCard 
                    key={building.id} 
                    building={building} 
                    onEditBuilding={onEditBuilding}
                />
            ))}
        </section>
    );
};

export default BuildingCardGrid;
