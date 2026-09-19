import { FiPlus, FiSearch } from "react-icons/fi";

const BuildingsHeader = ({ onAddBuilding, searchQuery, setSearchQuery }) => {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Building Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your property buildings and locations
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-52">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          onClick={onAddBuilding}
          className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-[0.99]"
        >
          <FiPlus className="text-base" />
          Add Building
        </button>
      </div>
    </header>
  );
};

export default BuildingsHeader;
