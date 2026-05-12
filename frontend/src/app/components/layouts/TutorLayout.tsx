import { Outlet, NavLink, useNavigate } from "react-router";
import { Home, Calendar, Clock, User, LogOut, GraduationCap } from "lucide-react";

export function TutorLayout() {
  const navigate = useNavigate();

  const navItems = [
    { to: "/tutor", icon: Home, label: "Dashboard", end: true },
    { to: "/tutor/availability", icon: Clock, label: "Disponibilidad" },
    { to: "/tutor/sessions", icon: Calendar, label: "Sesiones" },
    { to: "/tutor/profile", icon: User, label: "Perfil" },
  ];

  return (
    <div className="flex h-screen bg-[#F1F3F9]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0C0E16] border-r border-white/[0.04] flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#6366F1]/25">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-white text-sm leading-none">EduMatch AI</span>
              <p className="text-[10px] text-slate-600 leading-none mt-1">Tutor</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/[0.04] mx-4 mb-2" />

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm ${
                  isActive
                    ? "bg-[#6366F1]/12 text-white font-medium"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? "text-[#818CF8]" : "text-slate-600"
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] flex-shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-5">
          <div className="h-px bg-white/[0.04] mb-3" />
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-white/[0.04] hover:text-slate-300 transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
