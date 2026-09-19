import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(true);

  const handleSidebarNavigate = () => {
    if (window.matchMedia("(max-width: 779px)").matches) {
      setShowSidebarOnMobile(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* =========================== Left Sidebar ============================ */}
      <section
        className={`${showSidebarOnMobile ? "block" : "hidden"} w-full md:block md:w-auto`}
      >
        <Sidebar onNavigate={handleSidebarNavigate} />
      </section>










      {/* =========================== Main Content ============================ */}
      <section
        className={`${showSidebarOnMobile ? "hidden" : "block"} relative w-full overflow-y-auto md:block md:flex-1`}
      >
        <button
          type="button"
          onClick={() => setShowSidebarOnMobile(true)}
          className="fixed left-4 top-4 z-20 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
          aria-label="Open sidebar"
        >
          <FiMenu className="text-lg" />
        </button>

        <Outlet />
      </section>
    </div>
  );
};

export default MainLayout;