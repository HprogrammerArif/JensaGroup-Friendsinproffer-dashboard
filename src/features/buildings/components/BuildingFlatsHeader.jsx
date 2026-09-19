import { FiArrowLeft, FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router";

const BuildingFlatsHeader = ({ name, city, propertyCount, onAddProperty, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => navigate("/buildings")}
          className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          aria-label="Go back"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-800">{name}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {city} &bull; {propertyCount} Properties
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-52">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            placeholder="Search"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          onClick={onAddProperty}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-[0.99]"
        >
          <FiPlus className="text-base" />
          Add Property
        </button>
      </div>
    </header>
  );
};

export default BuildingFlatsHeader;
