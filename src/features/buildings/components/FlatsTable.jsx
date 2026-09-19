import { useState } from "react";
import { FiChevronRight, FiEdit2, FiMenu, FiTrash2, FiUsers } from "react-icons/fi";
import { LuBed } from "react-icons/lu";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDeleteApartmentDataMutation } from "../../../Redux/feature/baseApi";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const FlatRow = ({ flat, buildingId, onEditFlat }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteApartment, { isLoading: isDeleting }] = useDeleteApartmentDataMutation();

  console.log(flat, "flat")

  const handleDelete = async () => {
    try {
      await deleteApartment(flat.id).unwrap();
      toast.success("Property deleted successfully!");
    } catch (error) {
      const errData = error?.data;
      if (errData && typeof errData === "object") {
        const firstMsg = Object.values(errData).flat()[0];
        toast.error(firstMsg || "Failed to delete property");
      } else {
        toast.error("Failed to delete property");
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm sm:flex-nowrap">
      

      <span className="min-w-20 text-sm font-semibold text-slate-800">
        Flat {flat.flat_number}
      </span>

      <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-1">
        <p className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
          <LuBed className="shrink-0 text-slate-400" />
          {flat.bad_room} Bed{flat.bad_room !== 1 ? "s" : ""}
          {flat.bed_configuration ? ` (${flat.bed_configuration})` : ""}
        </p>

        <p className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
          <FiUsers className="shrink-0 text-slate-400" />
          {flat.people} {flat.people !== 1 ? "People" : "Person"}
        </p>

        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            flat.is_available
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {flat.is_available ? "Available" : "Occupied"}
        </span>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onEditFlat(flat)}
          aria-label="Edit flat"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <FiEdit2 className="text-sm" />
        </button>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isDeleting}
          aria-label="Delete flat"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-400 transition hover:bg-red-100 hover:text-red-500 disabled:opacity-50"
        >
          <FiTrash2 className="text-sm" />
        </button>

        <button
          type="button"
          onClick={() => navigate(`/flats/${flat.id}`)}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          Open
          <FiChevronRight className="text-xs" />
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Property"
        message={`Are you sure you want to delete Flat ${flat.flat_number}?`}
      />
    </div>
  );
};

const FlatsTable = ({ flats = [], buildingId, onEditFlat }) => {
  if (flats.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
        <p className="text-sm text-slate-500">No properties found in this building.</p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      {flats.map((flat) => (
        <FlatRow
          key={flat.id}
          flat={flat}
          buildingId={buildingId}
          onEditFlat={onEditFlat}
        />
      ))}
    </section>
  );
};

export default FlatsTable;
