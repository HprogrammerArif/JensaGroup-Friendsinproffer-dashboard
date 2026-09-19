import {
  FiCalendar,
  FiChevronDown,
  FiDollarSign,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
  FiTool,
  FiUser,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { NavLink, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

const navItems = [
  { label: "Dashboard", icon: FiGrid, to: "/dashboard" },
  { label: "Buildings", icon: HiOutlineBuildingOffice2, to: "/buildings" },
  { label: "Maintenance", icon: FiTool, to: "/maintenance" },
  { label: "Schedule", icon: FiCalendar, to: "/schedule" },
  {
    label: "User Management",
    icon: FiUser,
    hasChevron: true,
    to: "/user-management",
    children: [
      { label: "Mini Admin", to: "/user-management/mini-admin" },
      { label: "Cleaners", to: "/user-management/cleaners" },
      {
        label: "Maintenance Worker",
        to: "/user-management/maintenance-worker",
      },
    ],
  },
  { label: "Weekly Wages", icon: FiDollarSign, to: "/weekly-wages" },
  { label: "Reports", icon: FiFileText, to: "/reports" },
  { label: "Team Messaging", icon: FiMessageSquare, to: "/team-messaging" },
];

const Sidebar = ({ onNavigate = () => { } }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(
    location.pathname.startsWith("/user-management")
  );

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    if (location.pathname.startsWith("/user-management")) {
      setIsUserMenuOpen(true);
    }
  }, [location.pathname]);

  return (
    <aside className="h-screen w-full max-w-none border-r border-slate-200 bg-slate-50 px-5 py-8 sm:px-6 lg:max-w-75 lg:px-7">
      <div className="flex h-full flex-col">
        <h1 className=" text-xl sm:text-4xl font-extrabold leading-none tracking-tight ">
          <span className="text-blue-500">Jensa</span>{" "}
          <span className="text-slate-800">Group</span>
        </h1>

        <nav className="mt-10">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              // ========================== Nested Menu Under User Management ========================== \\
              if (item.children) {
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen((current) => !current)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium transition ${isUserMenuOpen
                        ? "text-blue-500"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                        }`}
                    >
                      <Icon className="shrink-0 text-[21px]" />
                      <span>{item.label}</span>
                      <FiChevronDown
                        className={`ml-auto text-[20px] transition ${isUserMenuOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isUserMenuOpen ? (
                      <ul className="mt-1 space-y-1 pl-10">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <NavLink
                              to={child.to}
                              onClick={onNavigate}
                              className={({ isActive }) =>
                                `block w-full rounded-md px-2 py-1.5 text-left text-lg font-medium transition ${isActive
                                  ? "text-white bg-blue-500"
                                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                                }`
                              }
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium transition ${isActive
                        ? "text-white bg-blue-500"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }`
                    }
                  >
                    <Icon className={`shrink-0 text-[21px]`} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto space-y-2">
          <NavLink
            to="/profile-settings"
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium transition ${isActive
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`
            }
          >
            <div className="relative">
              <FiUser className="text-[21px]" />
              <FiSettings className="absolute -bottom-1 -right-1 rounded-full bg-slate-50 text-[12px]" />
            </div>
            <span>Profile &amp; Settings</span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-lg font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut className=" " />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
