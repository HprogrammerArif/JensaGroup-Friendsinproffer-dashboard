import { FiPlus, FiSearch } from "react-icons/fi";

const MiniAdminHeader = ({
  search,
  onSearch,
  onCreate,
  title = "User Management",
  subtitle = "Manage your mini admin, cleaners & staff",
  listTitle = "All Mini Admin list",
  buttonLabel = "New Mini Admin",
}) => {
  return (
    <header className="mb-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">{title}</h1>
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        </div>

        <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <input
            type="text"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search"
            className="w-40 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-52"
          />
          <FiSearch className="text-slate-400" />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-700 sm:text-lg">{listTitle}</h2>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          <FiPlus className="text-base" />
          {buttonLabel}
        </button>
      </div>
    </header>
  );
};

export default MiniAdminHeader;
