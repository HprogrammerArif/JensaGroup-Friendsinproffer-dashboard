import { useEffect, useRef, useState } from "react";
import { FiCalendar, FiClock, FiImage, FiUpload, FiX } from "react-icons/fi";
import { useShowScheduleAllDataQuery, useGetUsersByAreaAndRoleQuery } from "../../../Redux/feature/baseApi";
import { toast } from "react-toastify";

const ScheduleTaskModal = ({ isOpen, onClose, onSubmit, task = null }) => {
  const inputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const {data: showScheduleAllData} = useShowScheduleAllDataQuery();
  const [form, setForm] = useState({
    area: "",
    building: "",
    flat: "",
    assigned_to: [],
    task_type: "cleaning",
    date: "",
    time: "",
    note: "",
  });

  const role = form.task_type === "cleaning" ? "cleaner" : "maintainer";
  const { data: usersData, isFetching: isUsersLoading } = useGetUsersByAreaAndRoleQuery(
    { area_id: form.area, role },
    { skip: !form.area }
  );
  const assignedUsers = usersData?.results || [];

  useEffect(() => {
    if (task) {
      let assignedToArr = [];
      if (Array.isArray(task.assigned_to_data)) {
        assignedToArr = task.assigned_to_data.map(u => u.id);
      } else if (task.assigned_to_data?.id) {
        assignedToArr = [task.assigned_to_data.id];
      } else if (Array.isArray(task.assigned_to)) {
        assignedToArr = task.assigned_to.map(u => typeof u === 'object' ? u.id : u);
      } else if (task.assigned_to) {
        assignedToArr = [task.assigned_to];
      }

      setForm({
        area: task.area_data?.id || task.area || "",
        building: task.building_data?.id || task.building || "",
        flat: task.flat_data?.id || task.flat || "",
        assigned_to: assignedToArr,
        task_type: task.task_type || "cleaning",
        date: task.date || "",
        time: task.time || "",
        note: task.note || "",
      });
      setPhotos([]);
    } else {
      setForm({
        area: "",
        building: "",
        flat: "",
        assigned_to: [],
        task_type: "cleaning",
        date: "",
        time: "",
        note: "",
      });
      setPhotos([]);
    }
  }, [task, isOpen]);

  useEffect(() => {
    return () => {
      photos.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [photos]);

  if (!isOpen) {
    return null;
  }

  const update = (key) => (event) => {
    setForm((current) => {
      let value = event.target.value;
      const newForm = { ...current, [key]: value };
      if (key === "area") {
        newForm.building = "";
        newForm.flat = "";
        newForm.assigned_to = [];
      } else if (key === "building") {
        newForm.flat = "";
        newForm.assigned_to = [];
      } else if (key === "flat") {
        newForm.assigned_to = [];
      }
      return newForm;
    });
  };

  const areas = Array.isArray(showScheduleAllData) ? showScheduleAllData : (showScheduleAllData?.data || []);
  const selectedAreaObj = areas.find((a) => a.id?.toString() === form.area?.toString());
  const buildings = selectedAreaObj?.buildings || [];
  const selectedBuildingObj = buildings.find((b) => b.id?.toString() === form.building?.toString());
  const flats = selectedBuildingObj?.apartments || [];

  const handlePhoto = (event) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const nextImages = files.map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((current) => [...current, ...nextImages]);
    event.target.value = "";
  };

  const removePhoto = (imageId) => {
    setPhotos((current) => {
      const target = current.find((image) => image.id === imageId);
      if (target) {
        URL.revokeObjectURL(target.preview);
      }
      return current.filter((image) => image.id !== imageId);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (form.assigned_to.length === 0) {
      toast.error("Please select at least one user to assign!");
      return;
    }

    const formData = new FormData();
    formData.append("area", form.area);
    formData.append("building", form.building);
    formData.append("flat", form.flat);
    
    if (Array.isArray(form.assigned_to)) {
      form.assigned_to.forEach(user_id => {
        formData.append("assigned_to", user_id);
      });
    }
    
    formData.append("task_type", form.task_type);
    formData.append("date", form.date);
    formData.append("time", form.time);
    if (form.note) formData.append("note", form.note);

    photos.forEach((image, index) => {
      formData.append(`referance_photos[${index}].photo`, image.file);
    });

    onSubmit(formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-3 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={task ? "Edit Schedule Task" : "Schedule New Task"}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-3xl font-bold text-slate-800">
            {task ? "Edit Schedule Task" : "Schedule New Task"}
          </h2>
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
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhoto}
            className="hidden"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Area (City) *</span>
              <select
                required
                value={form.area}
                onChange={update("area")}
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Area</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Building *</span>
              <select
                required
                value={form.building}
                onChange={update("building")}
                onFocus={(e) => {
                  if (!form.area) {
                    e.target.blur();
                    toast.error("Please select an Area first!");
                  }
                }}
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 disabled:bg-slate-50"
                disabled={!form.area}
              >
                <option value="">Select Building</option>
                {buildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Flat (Property) *</span>
              <select
                required
                value={form.flat}
                onChange={update("flat")}
                onFocus={(e) => {
                  if (!form.building) {
                    e.target.blur();
                    toast.error("Please select a Building first!");
                  }
                }}
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 disabled:bg-slate-50"
                disabled={!form.building}
              >
                <option value="">Select Flat</option>
                {flats.map((flat) => (
                  <option key={flat.id} value={flat.id}>
                    {flat.flat_number}
                  </option>
                ))}
              </select>
            </label>

            <div className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Assign To *</span>
              <div 
                className={`w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 max-h-40 overflow-y-auto custom-scrollbar ${(!form.flat || isUsersLoading) ? 'opacity-60 bg-slate-50 pointer-events-none' : ''}`}
                onClick={() => {
                  if (!form.flat) {
                    toast.error("Please select a Flat first!");
                  }
                }}
              >
                {isUsersLoading ? (
                  <div className="py-1 text-slate-400 text-sm">Loading...</div>
                ) : assignedUsers.length === 0 ? (
                  <div className="py-1 text-slate-400 text-sm">No users available</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {assignedUsers.map((user) => {
                      const isChecked = form.assigned_to.includes(user.id);
                      return (
                        <label key={user.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setForm(curr => {
                                const newAssigned = checked 
                                  ? [...curr.assigned_to, user.id]
                                  : curr.assigned_to.filter(id => id !== user.id);
                                return { ...curr, assigned_to: newAssigned };
                              });
                            }}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="cursor-pointer">{user.user_profile?.full_name || user.phone_or_email}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-medium text-slate-500">Task Type *</span>
              <select
                required
                value={form.task_type}
                onChange={update("task_type")}
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Date *</span>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={update("date")}
                  className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <FiCalendar className="pointer-events-none absolute right-3 top-3.5 text-slate-400" />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Time *</span>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={update("time")}
                  className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <FiClock className="pointer-events-none absolute right-3 top-3.5 text-slate-400" />
              </div>
            </label>

            {/* Note */}
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-medium text-slate-500">Note (optional)</span>
              <textarea
                value={form.note}
                onChange={update("note")}
                rows={3}
                placeholder="Add any special instructions or notes…"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </label>
          </div>

          <section className="rounded-xl border border-slate-200 p-3 sm:p-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">
              <span className="inline-flex items-center gap-2">
                <FiImage className="text-slate-500" />
                Upload Reference Photos
              </span>
            </h3>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-blue-300 bg-blue-50/50 text-blue-500 transition hover:bg-blue-50"
            >
              <span className="text-center text-sm font-semibold">
                <FiUpload className="mx-auto mb-2 text-4xl" />
                Tap to Upload Photo
              </span>
            </button>

            {photos.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photos.map((image) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-lg border border-slate-200"
                  >
                    <img
                      src={image.preview}
                      alt="Reference preview"
                      className="h-24 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(image.id)}
                      className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-600 opacity-100 shadow-sm transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <FiX className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              {task ? "Update" : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleTaskModal;
