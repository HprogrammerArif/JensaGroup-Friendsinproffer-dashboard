import { FiChevronRight, FiMapPin } from "react-icons/fi";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { LuClock3 } from "react-icons/lu";

const MaintenanceBuildingCard = ({ building, onViewDetails }) => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
    <div className="flex items-start gap-3 p-3 sm:gap-4 sm:p-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
        <img
          src={building.image}
          alt={building.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-slate-800">{building.name}</p>
        <div className="mt-0.5 flex items-center gap-1">
          <FiMapPin className="shrink-0 text-xs text-blue-500" />
          <span className="text-xs font-medium text-blue-500">{building.city}</span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-500">
            <HiOutlineExclamationCircle className="text-sm text-red-500" />
            {building.highPriority} High Priority
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-500">
            <LuClock3 className="text-sm" />
            {building.pendingCount} Pending
          </span>
        </div>
      </div>
    </div>

    <button
      type="button"
      onClick={() => onViewDetails(building.id)}
      className="cursor-pointer flex w-full items-center justify-center gap-1 border-t border-slate-100 bg-slate-50 py-2.5 text-sm font-semibold text-blue-500 transition hover:bg-slate-100"
    >
      View Details
      <FiChevronRight className="text-xs" />
    </button>
  </div>
);

export default MaintenanceBuildingCard;
