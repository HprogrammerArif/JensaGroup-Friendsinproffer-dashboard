import { FiBell, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useShowProfileInformationQuery } from "../../../Redux/feature/baseApi";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const {data: showProfileInformation, isLoading} = useShowProfileInformationQuery();
  const profile = showProfileInformation?.[0];

  console.log(showProfileInformation);

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Super Admin Dashboard</h2>
        <p className="text-sm text-slate-500">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search"
            className="w-44 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 lg:w-60"
          />
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/notifications")}
          aria-label="Notifications"
          className="rounded-full border border-slate-200 bg-white p-2 transition hover:bg-slate-50"
        >
          <FiBell className="text-lg text-slate-500" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full  text-sm font-semibold text-white">
<img
  src={
    profile?.avatar ||
    "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1751196563/b170870007dfa419295d949814474ab2_t_qm2pcq.jpg"
  }
  alt=""
  className="w-full h-full object-cover rounded-full"
/>          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-slate-800">
  {profile?.full_name}
</p>

<p className="text-xs leading-tight text-slate-400">
  {profile?.email}
</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
