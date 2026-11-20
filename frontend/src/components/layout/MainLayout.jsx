
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function MainLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#0B1520] text-slate-100">

      <Sidebar />

      <main className="flex-1 min-w-0 min-h-screen p-6 lg:p-8 bg-[#0B1520]">
        <Outlet />
      </main>

    </div>
  );
}

export default MainLayout;
