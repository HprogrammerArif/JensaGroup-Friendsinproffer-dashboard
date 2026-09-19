import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useCreateApartmentDataMutation,
  useUpdateApartmentDataMutation,
} from "../../../Redux/feature/baseApi";

const AddPropertyModal = ({ isOpen, onClose, buildingId, editingFlat }) => {
  const [form, setForm] = useState({
    flat_number: "",
    bad_room: "",
    bed_configuration: "",
    people: "",
    note: "",
  });

  const [createApartment, { isLoading: isCreating }] = useCreateApartmentDataMutation();
  const [updateApartment, { isLoading: isUpdating }] = useUpdateApartmentDataMutation();

  useEffect(() => {
    if (isOpen) {
      if (editingFlat) {
        setForm({
          flat_number: editingFlat.flat_number || "",
          bad_room: editingFlat.bad_room || "",
          bed_configuration: editingFlat.bed_configuration || "",
          people: editingFlat.people || "",
          note: editingFlat.note || "",
        });
      } else {
        setForm({ flat_number: "", bad_room: "", bed_configuration: "", people: "", note: "" });
      }
    }
  }, [isOpen, editingFlat]);

  if (!isOpen) return null;

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFlat) {
        await updateApartment({
          id: editingFlat.id,
          data: { ...form, building: buildingId },
        }).unwrap();
        toast.success("Property updated successfully!");
      } else {
        await createApartment({
          ...form,
          building: buildingId,
          bad_room: Number(form.bad_room),
          people: Number(form.people),
        }).unwrap();
        toast.success("Property added successfully!");
      }
      onClose();
    } catch (error) {
      const errData = error?.data;
      if (errData && typeof errData === "object") {
        const firstMsg = Object.values(errData).flat()[0];
        toast.error(firstMsg || "An error occurred");
      } else {
        toast.error("An error occurred");
      }
      console.error("Mutation error:", error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={editingFlat ? "Edit Property" : "Add New Property"}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {editingFlat ? "Edit Property" : "Add New Property"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
            aria-label="Close modal"
          >
            <FiX className="text-lg text-red-500" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Flat Number *
              </label>
              <input
                type="text"
                required
                value={form.flat_number}
                onChange={handleChange("flat_number")}
                placeholder="e.g. 101, 2A, Unit 5"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Bedrooms *
              </label>
              <input
                type="number"
                required
                min="1"
                value={form.bad_room}
                onChange={handleChange("bad_room")}
                placeholder="e.g. 2"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Bed Configuration
              </label>
              <input
                type="text"
                value={form.bed_configuration}
                onChange={handleChange("bed_configuration")}
                placeholder="e.g. 1 King, 2 Twins"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                People *
              </label>
              <input
                type="number"
                required
                min="1"
                value={form.people}
                onChange={handleChange("people")}
                placeholder="e.g. 5"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Note
              </label>
              <textarea
                rows={2}
                value={form.note}
                onChange={handleChange("note")}
                placeholder="Optional note..."
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : (editingFlat ? "Update" : "Add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;
