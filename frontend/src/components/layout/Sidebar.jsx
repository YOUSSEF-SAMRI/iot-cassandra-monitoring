
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Radio,
  Activity,
  Settings
} from "lucide-react";

function Sidebar() {
  const links = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },
    {
      name: "Sensors",
      path: "/sensors",
      icon: Radio
    }
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white p-5">
      <div className="flex items-center gap-3 mb-10">
        <Activity size={28} className="text-blue-400" />
        <h1 className="text-xl font-bold">
          IoT Monitor
        </h1>
      </div>

      <p className="text-xs text-slate-500 uppercase mb-4">
        Main Menu
      </p>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-10 border-t border-slate-800 pt-5">
        <div className="flex items-center gap-3 text-slate-400">
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
