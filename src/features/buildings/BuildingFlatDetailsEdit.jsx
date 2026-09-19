import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiFileText, FiImage, FiUpload, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";

const INITIAL_FORM = {
  beds: "2",
  occupancy: "5",
  beddingConfig: "e.g. 1 King, 1 Single",
  adminNotes: "",
};

const INITIAL_PHOTOS = [
  {
    id: "photo-1",
    src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=400&q=80",
    isObjectUrl: false,
  },
  {
    id: "photo-2",
    src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80",
    isObjectUrl: false,
  },
  {
    id: "photo-3",
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80",
    isObjectUrl: false,
  },
];

const SectionCard = ({ title, icon: Icon, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <div className="mb-4 flex items-center gap-2 text-slate-800">
      <Icon className="text-slate-500" />
      <h2 className="text-sm font-semibold sm:text-base">{title}</h2>
    </div>
    {children}
  </section>
);

const Field = ({ label, value, onChange, placeholder, type = "text" }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-medium text-slate-500">{label}</span>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    />
  </label>
);

const PhotoTile = ({ photo, onRemove }) => (
  <div className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
    <img src={photo.src} alt="Reference" className="h-full w-full object-cover" />
    <button
      type="button"
      onClick={() => onRemove(photo.id)}
      className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 opacity-100 shadow-sm transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
      aria-label="Remove photo"
    >
      <FiX className="text-sm" />
    </button>
  </div>
);

const UploadTile = ({ onUpload, inputRef }) => (
  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50 px-3 text-center transition hover:border-blue-300 hover:bg-blue-100/70">
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      multiple
      onChange={onUpload}
      className="hidden"
    />
    <span className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
      <FiUpload className="text-lg" />
    </span>
    <span className="text-sm font-semibold text-blue-600">Tap to Upload</span>
    <span className="mt-1 text-xs text-blue-400">Reference photos</span>
  </label>
);

const BuildingFlatDetailsEdit = () => {
  const navigate = useNavigate();
  const { buildingId, flatId } = useParams();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM);
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);

  useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        if (photo.isObjectUrl) {
          URL.revokeObjectURL(photo.src);
        }
      });
    };
  }, [photos]);

  const updateField = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }));
  };

  const handleUpload = (event) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const nextPhotos = files.map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`,
      src: URL.createObjectURL(file),
      isObjectUrl: true,
    }));

    setPhotos((current) => [...current, ...nextPhotos]);
    event.target.value = "";
  };

  const handleRemovePhoto = (photoId) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === photoId);

      if (target?.isObjectUrl) {
        URL.revokeObjectURL(target.src);
      }

      return current.filter((photo) => photo.id !== photoId);
    });
  };

  const handleCancel = () => {
    navigate(`/flats/${flatId}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      buildingId,
      flatId,
      ...form,
      referencePhotosCount: photos.length,
    });
    navigate(`/flats/${flatId}`);
  };

  return (
    <main className="min-h-screen bg-slate-100 p-3 sm:p-5 lg:p-6">
      <form onSubmit={handleSubmit} className="mx-auto w-full space-y-4 lg:space-y-5">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition hover:bg-blue-100"
              aria-label="Back to flat details"
            >
              <FiArrowLeft />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">Flat {flatId}</h1>
              <p className="mt-1 text-sm text-slate-500">Conditioning House • Bradford</p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </header>

        <SectionCard title="Property Information" icon={FiFileText}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field
              label="Number of Beds"
              value={form.beds}
              onChange={updateField("beds")}
              placeholder="e.g. 2"
              type="number"
            />
            <Field
              label="Occupancy"
              value={form.occupancy}
              onChange={updateField("occupancy")}
              placeholder="e.g. 5"
              type="number"
            />
            <Field
              label="Bedding Configuration"
              value={form.beddingConfig}
              onChange={updateField("beddingConfig")}
              placeholder="e.g. 1 King, 1 Single"
            />
          </div>
        </SectionCard>

        <SectionCard title="Admin Notes" icon={FiFileText}>
          <label className="block">
            <span className="sr-only">Admin Notes</span>
            <textarea
              value={form.adminNotes}
              onChange={updateField("adminNotes")}
              rows={4}
              placeholder="Add any special notes or instructions..."
              className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </SectionCard>

        <SectionCard title="Reference Photos" icon={FiImage}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {photos.map((photo) => (
              <PhotoTile key={photo.id} photo={photo} onRemove={handleRemovePhoto} />
            ))}
            <UploadTile onUpload={handleUpload} inputRef={fileInputRef} />
          </div>
        </SectionCard>
      </form>
    </main>
  );
};

export default BuildingFlatDetailsEdit;