import { useEffect, useMemo, useRef, useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { 
  useShowScheduleAllDataQuery, 
  useShowAreaListQuery, 
  useCreateAreaMutation 
} from "../../../Redux/feature/baseApi";
import PhoneOrEmailInput from "../../../components/common/PhoneOrEmailInput";

/**
 * Shared modal for adding OR editing a Cleaner, Maintenance Worker, or Mini Admin.
 *
 * Props:
 *  - isOpen       : boolean
 *  - onClose      : () => void
 *  - onSubmit     : (payload, id?) => Promise<void>   parent handles mutation + role injection
 *  - title        : string
 *  - submitLabel  : string
 *  - editUser     : object | null  — when set, modal is in "edit" mode and form is pre-filled
 *  - role         : string         — role of the user to be appended to formData
 */
const AddMiniAdminModal = ({ isOpen, onClose, onSubmit, title = "Add New User", submitLabel = "Add", editUser = null, role = "" }) => {
  const inputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [areaError, setAreaError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAreaInput, setCustomAreaInput] = useState("");

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

  const emptyForm = {
    phone_or_email: "",
    password: "",
    assigned_areas: [],
    full_name: "",
    email: "",
    city: "",
    state: "",
    full_address: "",
  };

  const [form, setForm] = useState(emptyForm);

  // Pre-fill form when editing
  useEffect(() => {
    if (isOpen) {
      if (editUser) {
        setForm({
          phone_or_email: editUser.phone_or_email || "",
          password: "",                                             // don't pre-fill password
          assigned_areas: editUser.assigned_areas || [],
          full_name: editUser.user_profile?.full_name || "",
          email: editUser.user_profile?.email || "",
          city: editUser.user_profile?.city || "",
          state: editUser.user_profile?.state || "",
          full_address: editUser.user_profile?.full_address || "",
        });
      } else {
        setForm(emptyForm);
      }
      setPhoto(null);
      setAreaError("");
      setIsSubmitting(false);
      setCustomAreaInput("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editUser]);

  useEffect(() => {
    return () => {
      if (photo?.preview) URL.revokeObjectURL(photo.preview);
    };
  }, [photo]);

  if (!isOpen) return null;

  const updateField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const toggleArea = (areaId) => {
    setAreaError("");
    setForm((prev) => {
      const already = prev.assigned_areas.some((id) => String(id) === String(areaId));
      return {
        ...prev,
        assigned_areas: already
          ? prev.assigned_areas.filter((id) => String(id) !== String(areaId))
          : [...prev.assigned_areas, areaId],
      };
    });
  };

  const handleAddCustomArea = async () => {
    const trimmed = customAreaInput.trim();
    if (!trimmed) return;

    // Check if it matches an existing database area name
    const existing = areas.find(a => a.name?.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      setAreaError("");
      setForm((prev) => {
        if (prev.assigned_areas.some((id) => String(id) === String(existing.id))) return prev;
        return {
          ...prev,
          assigned_areas: [...prev.assigned_areas, existing.id],
        };
      });
      setCustomAreaInput("");
      return;
    }

    try {
      const res = await createArea({ name: trimmed }).unwrap();
      toast.success("Area added successfully!");
      const newAreaId = res?.id;
      setAreaError("");
      if (newAreaId) {
        setForm((prev) => ({
          ...prev,
          assigned_areas: [...prev.assigned_areas, newAreaId],
        }));
      }
      setCustomAreaInput("");
    } catch (error) {
      const msg = error?.data?.name?.[0] || error?.data?.message || "Failed to add area";
      toast.error(msg);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photo?.preview) URL.revokeObjectURL(photo.preview);
    setPhoto({ file, preview: URL.createObjectURL(file) });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.assigned_areas.length === 0) {
      setAreaError("Please assign at least one area.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("phone_or_email", form.phone_or_email);

    form.assigned_areas.forEach((areaId) => {
      formData.append("assigned_areas", areaId);
    });

    if (form.full_name) formData.append("user_profile.full_name", form.full_name);
    if (form.email) formData.append("user_profile.email", form.email);
    if (form.city) formData.append("user_profile.city", form.city);
    if (form.state) formData.append("user_profile.state", form.state);
    if (form.full_address) formData.append("user_profile.full_address", form.full_address);

    // Only include password on create (or if user filled it in on edit)
    if (!editUser || form.password) {
      formData.append("password", form.password);
    }

    if (photo?.file) {
      formData.append("user_profile.avatar", photo.file);
    }

    if (role) {
      formData.append("role", role);
    }

    try {
      // Pass id when editing so parent can call update mutation
      await onSubmit(formData, editUser?.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-3 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
            aria-label="Close modal"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Hidden file input */}
          <input ref={inputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />

          {/* Avatar upload */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mx-auto flex h-32 w-44 items-center justify-center overflow-hidden rounded-lg border border-dashed border-blue-300 bg-blue-50/40 text-blue-500 transition hover:bg-blue-50"
          >
            {photo ? (
              <img src={photo.preview} alt="User avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-center text-sm font-semibold leading-tight">
                <FiImage className="mx-auto mb-2 text-4xl" />
                Upload Photo
                <br />
                <span className="text-xs font-normal text-slate-400">(optional)</span>
              </span>
            )}
          </button>

          {/* Login Info */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Login Information</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 items-end">
              <PhoneOrEmailInput
                name="phone_or_email"
                label=""
                value={form.phone_or_email}
                onChange={(val) => setForm((prev) => ({ ...prev, phone_or_email: val }))}
                required
              />
              <input
                type="password"
                required={!editUser}
                value={form.password}
                onChange={updateField("password")}
                placeholder={editUser ? "New Password (leave blank to keep)" : "Initial Password *"}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </section>

          {/* Personal Info */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Personal Information</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={form.full_name}
                onChange={updateField("full_name")}
                placeholder="Full Name"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="Personal Email"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </section>

          {/* Address Info */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Address Information</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={form.city}
                onChange={updateField("city")}
                placeholder="City"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="text"
                value={form.state}
                onChange={updateField("state")}
                placeholder="State / Province"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <textarea
              value={form.full_address}
              onChange={updateField("full_address")}
              rows={3}
              placeholder="Full Address"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </section>

          {/* Assign Areas */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">
              Assign Area(s) *
              {areaError ? <span className="ml-2 text-xs font-normal text-red-500">{areaError}</span> : null}
            </h3>

            <div className="flex flex-wrap gap-2">
              {areas.map((area) => {
                const selected = form.assigned_areas.some((id) => String(id) === String(area.id));
                return (
                  <button
                    key={area.id || area.name}
                    type="button"
                    onClick={() => toggleArea(area.id)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${selected
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                  >
                    {area.name}
                  </button>
                );
              })}

              {/* Custom manual/text selected areas */}
              {form.assigned_areas
                .filter((id) => {
                  const isNumber = !isNaN(Number(id));
                  if (!isNumber) return true;
                  return !areas.some((a) => String(a.id) === String(id));
                })
                .map((customArea) => (
                  <button
                    key={customArea}
                    type="button"
                    onClick={() => toggleArea(customArea)}
                    className="rounded-full border border-blue-500 bg-blue-500 text-white px-4 py-1.5 text-xs font-semibold transition"
                  >
                    {customArea}
                  </button>
                ))}
            </div>

            {/* Manual input for custom areas */}
            <div className="flex gap-2 max-w-xs mt-2">
              <input
                type="text"
                placeholder="Enter area name..."
                value={customAreaInput}
                onChange={(e) => setCustomAreaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomArea();
                  }
                }}
                className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={handleAddCustomArea}
                disabled={isCreatingArea || !customAreaInput.trim()}
                className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
              >
                {isCreatingArea ? "Adding..." : "Add"}
              </button>
            </div>
          </section>

          {/* Actions */}
          <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMiniAdminModal;
