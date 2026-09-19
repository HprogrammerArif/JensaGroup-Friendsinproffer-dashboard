import { useEffect, useMemo, useRef, useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { 
  useCreateBuildingDataMutation, 
  useUpdateBuildingDataMutation,
  useShowScheduleAllDataQuery,
  useShowAreaListQuery,
  useCreateAreaMutation
} from "../../../Redux/feature/baseApi";

const AddBuildingModal = ({ isOpen, onClose, editingBuilding }) => {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    city: "",
    full_address: "",
    area: "",
  });
  const [areaSearch, setAreaSearch] = useState("");
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);

  const [createBuilding, { isLoading: isCreating }] = useCreateBuildingDataMutation();
  const [updateBuilding, { isLoading: isUpdating }] = useUpdateBuildingDataMutation();
  const { data: areaData } = useShowScheduleAllDataQuery();
  const { data: areaListData } = useShowAreaListQuery();
  const [createArea, { isLoading: isCreatingArea }] = useCreateAreaMutation();

  const areas = useMemo(() => {
    const list1 = Array.isArray(areaData) ? areaData : (areaData?.data || []);
    const list2 = Array.isArray(areaListData)
      ? areaListData
      : (areaListData?.results || areaListData?.data || []);

    const map = new Map();
    [...list1, ...list2].forEach((item) => {
      if (item && (item.id !== undefined || item.name)) {
        const key = item.id !== undefined ? String(item.id) : item.name;
        if (!map.has(key)) {
          map.set(key, { id: item.id, name: item.name });
        }
      }
    });

    return Array.from(map.values());
  }, [areaData, areaListData]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAreaDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (editingBuilding) {
        const areaId = editingBuilding.area 
          ? (typeof editingBuilding.area === "object" ? editingBuilding.area.id : editingBuilding.area) 
          : "";
        const areaName = editingBuilding.area 
          ? (typeof editingBuilding.area === "object" 
              ? (editingBuilding.area.name || "") 
              : (areas.find(a => String(a.id) === String(editingBuilding.area))?.name || "")) 
          : "";

        setForm({
          name: editingBuilding.name || "",
          city: editingBuilding.city || "",
          full_address: editingBuilding.full_address || "",
          area: areaId,
        });
        setAreaSearch(areaName);

        if (editingBuilding.avatar) {
          setSelectedImage({
            preview: editingBuilding.avatar,
            isExisting: true
          });
        } else {
          setSelectedImage(null);
        }
      } else {
        setForm({ name: "", city: "", full_address: "", area: "" });
        setAreaSearch("");
        setSelectedImage(null);
      }
      setShowAreaDropdown(false);
    }
  }, [isOpen, editingBuilding, areas]);

  useEffect(() => {
    return () => {
      if (selectedImage && !selectedImage.isExisting) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    };
  }, [selectedImage]);

  if (!isOpen) {
    return null;
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImage((current) => {
      if (current && !current.isExisting) {
        URL.revokeObjectURL(current.preview);
      }
      return {
        file,
        preview: URL.createObjectURL(file),
        isExisting: false
      };
    });
  };

  const handleAddNewArea = async () => {
    const trimmed = areaSearch.trim();
    if (!trimmed) return;

    const existing = areas.find(a => a.name?.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      setForm(prev => ({ ...prev, area: existing.id }));
      setAreaSearch(existing.name);
      setShowAreaDropdown(false);
      return;
    }

    try {
      const res = await createArea({ name: trimmed }).unwrap();
      toast.success("Area added successfully!");
      if (res?.id) {
        setForm(prev => ({ ...prev, area: res.id }));
        setAreaSearch(res.name || trimmed);
      }
      setShowAreaDropdown(false);
    } catch (error) {
      const msg = error?.data?.name?.[0] || error?.data?.message || "Failed to add area";
      toast.error(msg);
    }
  };

  const handleChange = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingBuilding) {
        // For update: build FormData, only include avatar if a NEW file was selected
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("city", form.city);
        formData.append("full_address", form.full_address);
        if (form.area) {
          formData.append("area", form.area);
        }
        if (selectedImage && selectedImage.file) {
          formData.append("avatar", selectedImage.file);
        }
        await updateBuilding({ id: editingBuilding.id, data: formData }).unwrap();
        toast.success("Building updated successfully!");
      } else {
        // For create: build FormData with all fields including avatar file
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("city", form.city);
        formData.append("full_address", form.full_address);
        if (form.area) {
          formData.append("area", form.area);
        }
        if (selectedImage && selectedImage.file) {
          formData.append("avatar", selectedImage.file);
        }
        await createBuilding(formData).unwrap();
        toast.success("Building created successfully!");
      }
      onClose();
    } catch (error) {
      const errData = error?.data;
      if (errData && typeof errData === "object") {
        // Show first error message from response
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/35 p-3 sm:p-6 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={editingBuilding ? "Edit Building" : "Add New Building"}
      >
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {editingBuilding ? "Edit Building" : "Add New Building"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
            aria-label="Close modal"
          >
            <FiX className="text-lg cursor-pointer" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mx-auto flex h-32 w-44 overflow-hidden rounded-lg border border-dashed border-blue-300 bg-blue-50/40 text-blue-500 transition hover:bg-blue-50"
          >
            {selectedImage ? (
              <img
                src={selectedImage.preview}
                alt="Selected building"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full flex-col items-center justify-center">
                <FiImage className="text-4xl" />
                <span className="mt-2 text-center text-sm font-semibold leading-tight">
                  Upload Building
                  <br />
                  Photo
                </span>
              </span>
            )}
          </button>

          {selectedImage && selectedImage.file ? (
            <p className="text-center text-xs font-medium text-slate-500">
              {selectedImage.file.name}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Building Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={handleChange("name")}
                placeholder="e.g., Condition House"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">City *</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={handleChange("city")}
                placeholder="e.g., London"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            
            <div className="sm:col-span-2 relative" ref={dropdownRef}>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Area Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search and select area..."
                  value={areaSearch}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAreaSearch(val);
                    setShowAreaDropdown(true);
                    
                    const matched = areas.find(a => a.name?.toLowerCase() === val.toLowerCase());
                    if (matched) {
                      setForm(prev => ({ ...prev, area: matched.id }));
                    } else {
                      setForm(prev => ({ ...prev, area: "" }));
                    }
                  }}
                  onFocus={() => setShowAreaDropdown(true)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={handleAddNewArea}
                  disabled={isCreatingArea || !areaSearch.trim()}
                  className="shrink-0 rounded-md bg-blue-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
                >
                  {isCreatingArea ? "Adding..." : "Add"}
                </button>
              </div>
              
              {showAreaDropdown && (
                <ul className="absolute z-[110] left-0 top-full mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                  {areas.filter(area => 
                    area.name?.toLowerCase().includes(areaSearch.toLowerCase())
                  ).length === 0 ? (
                    <li className="px-3 py-2 text-sm text-slate-400 flex items-center justify-between">
                      <span>No matching areas found</span>
                      {areaSearch.trim() && (
                        <button
                          type="button"
                          onClick={handleAddNewArea}
                          disabled={isCreatingArea}
                          className="text-xs text-blue-500 hover:underline font-semibold"
                        >
                          + Add &quot;{areaSearch}&quot;
                        </button>
                      )}
                    </li>
                  ) : (
                    areas.filter(area => 
                      area.name?.toLowerCase().includes(areaSearch.toLowerCase())
                    ).map((area) => (
                      <li
                        key={area.id || area.name}
                        onClick={() => {
                          setForm(prev => ({ ...prev, area: area.id }));
                          setAreaSearch(area.name);
                          setShowAreaDropdown(false);
                        }}
                        className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-between"
                      >
                        <span>{area.name}</span>
                        {String(form.area) === String(area.id) && (
                          <span className="text-xs text-blue-500 font-semibold">Selected</span>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Full Address *
            </label>
            <textarea
              rows={3}
              required
              value={form.full_address}
              onChange={handleChange("full_address")}
              placeholder="e.g., 123 City Centre, London"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
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
              {isLoading ? "Saving..." : (editingBuilding ? "Update" : "Add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBuildingModal;
