import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, useInView } from "motion/react";
import {
  Users, GraduationCap, Calendar, Activity,
  TrendingUp, ArrowUpRight, Brain, Zap,
  Shield, ChevronRight, Sparkles,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { getStats } from "../../../api/admin";

/* ─── live clock ─────────────────────────────────────────────── */
function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ─── fade-up helper ─────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── chart data ─────────────────────────────────────────────── */
const sessionData = [
  { day: "Lun", sessions: 38, revenue: 950 },
  { day: "Mar", sessions: 52, revenue: 1300 },
  { day: "Mié", sessions: 47, revenue: 1175 },
  { day: "Jue", sessions: 61, revenue: 1525 },
  { day: "Vie", sessions: 74, revenue: 1850 },
  { day: "Sáb", sessions: 55, revenue: 1375 },
  { day: "Dom", sessions: 23, revenue: 575 },
];

/* ─── activity data ──────────────────────────────────────────── */
const activity = [
  { id: 1, type: "user",    msg: "Nuevo usuario: Carlos Mendoza",              time: "5 min",  dot: "bg-emerald-400" },
  { id: 2, type: "session", msg: "Sesión completada: M. González — C. Mendoza", time: "12 min", dot: "bg-[#818CF8]" },
  { id: 3, type: "tutor",   msg: "Tutor activado: Jorge López",                time: "23 min", dot: "bg-[#818CF8]" },
  { id: 4, type: "payment", msg: "Pago procesado: $25.00 — Sesión #3421",      time: "35 min", dot: "bg-amber-400" },
  { id: 5, type: "ai",      msg: "Ruta IA generada para: Ana Pérez",           time: "1 h",    dot: "bg-[#818CF8]" },
  { id: 6, type: "session", msg: "Sesión agendada: Luis García — M. González", time: "2 h",    dot: "bg-slate-400" },
  { id: 7, type: "user",    msg: "Nuevo usuario: Laura Martínez",              time: "3 h",    dot: "bg-emerald-400" },
  { id: 8, type: "payment", msg: "Pago procesado: $30.00 — Sesión #3420",      time: "4 h",    dot: "bg-amber-400" },
];

/* ─── quick actions ──────────────────────────────────────────── */
const quickActions = [
  { label: "Gestionar usuarios",  icon: Users,         path: "/admin/users",    color: "text-[#818CF8]", bg: "bg-[#6366F1]/10" },
  { label: "Ver tutores",         icon: GraduationCap, path: "/admin/tutors",   color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Revisar sesiones",    icon: Calendar,      path: "/admin/sessions", color: "text-amber-400",   bg: "bg-amber-400/10" },
  { label: "Supervisión IA",      icon: Brain,         path: "/admin/ai-logs",  color: "text-[#818CF8]", bg: "bg-[#6366F1]/10" },
];

/* ─── custom chart tooltip ───────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0C0E16] border border-white/[0.08] rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="text-slate-400 mb-1.5 text-xs font-medium">{label}</p>
      <p className="text-white font-bold tabular-nums">{payload[0].value} sesiones</p>
      <p className="text-emerald-400 font-semibold tabular-nums">${payload[1]?.value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export function AdminDashboard() {
  
  const navigate = useNavigate();
  const nombre = localStorage.getItem("nombre") ?? "Admin";
  const [apiStats, setApiStats] = useState<any>(null);

  useEffect(() => {
    getStats()
      .then(setApiStats)
      .catch(() => {});
  }, []);
  const now = useClock();

  const dateStr = now.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
  const timeStr = now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      const statsCards = [
    { label: "Total usuarios",   value: String(apiStats?.totalUsuarios   ?? "—"), sub: `${apiStats?.totalEstudiantes ?? "—"} estudiantes`, icon: Users,         iconBg: "bg-[#6366F1]/15",  iconColor: "text-[#818CF8]",  trend: "+12%", trendUp: true },
    { label: "Total tutores",    value: String(apiStats?.totalDocentes    ?? "—"), sub: `${apiStats?.docentesVerificados ?? "—"} verificados`, icon: GraduationCap, iconBg: "bg-emerald-400/10", iconColor: "text-emerald-400", trend: "+8%",  trendUp: true },
    { label: "Sesiones activas", value: String(apiStats?.sesionesHoy     ?? "—"), sub: `${apiStats?.totalSesiones ?? "—"} totales`,        icon: Calendar,      iconBg: "bg-amber-400/10",   iconColor: "text-amber-400",  trend: "+5%",  trendUp: true },
    { label: "Ingresos semana",  value: "$7,750",                                  sub: "350 transacc.",                                     icon: TrendingUp,    iconBg: "bg-teal-400/10",    iconColor: "text-teal-400",   trend: "+18%", trendUp: true },
  ];

  return (
    <div className="relative min-h-full overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO GREETING — dark cinematic panel
      ══════════════════════════════════════════════ */}
      <div className="relative bg-[#0C0E16] overflow-hidden">
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#6366F1]/12 rounded-full blur-[100px]" style={{ animation: "float-a 9s ease-in-out infinite" }} />
          <div className="absolute -bottom-10 right-1/3 w-64 h-64 bg-[#14B8A6]/8 rounded-full blur-[80px]"  style={{ animation: "float-b 12s ease-in-out infinite" }} />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #6366F1 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          {/* Scan line */}
          <div
            className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#6366F1]/5 to-transparent pointer-events-none"
            style={{ animation: "scan-line 6s ease-in-out infinite" }}
          />
        </div>

        <div className="relative z-10 px-8 py-10 flex items-start justify-between gap-6 flex-wrap">
          {/* Left: greeting */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366F1]/30">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none mb-0.5">Administrador</p>
                <p className="text-white font-semibold text-sm leading-none">admin.master</p>
              </div>
            </div>

            <h1
              className="text-white font-bold leading-tight tracking-tight mt-4"
              style={{ fontSize: "clamp(2rem, 3vw, 3.25rem)" }}
            >
              Panel de control
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm capitalize">{dateStr}</p>
          </div>

          {/* Right: live clock + status */}
          <div className="flex flex-col items-end gap-3">
            {/* Live clock */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-5 py-3 text-right">
              <p className="text-white font-bold tabular-nums tracking-tight" style={{ fontSize: "1.75rem", fontVariantNumeric: "tabular-nums" }}>
                {timeStr}
              </p>
              <p className="text-slate-500 text-xs mt-0.5 capitalize">{dateStr}</p>
            </div>
            {/* System status */}
            <div className="flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3.5 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
              <span className="text-emerald-400 text-xs font-semibold">Sistema operativo</span>
            </div>
          </div>
        </div>

        {/* Quick action strip at bottom of hero */}
        <div className="relative z-10 flex items-center gap-2 px-8 pb-6">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-[#6366F1]/30 rounded-xl px-4 py-2.5 transition-all duration-150 group"
            >
              <div className={`w-6 h-6 ${action.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <action.icon className={`w-3.5 h-3.5 ${action.color}`} />
              </div>
              <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors whitespace-nowrap">
                {action.label}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          STATS GRID
      ══════════════════════════════════════════════ */}
      <div className="px-8 py-7 bg-[#F1F3F9]">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statsCards.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.07}>
              <div className="bg-white border border-slate-200/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#6366F1]/8 cursor-default group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center`}>
                    <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-500">
                    <TrendingUp className="w-3 h-3" />
                    {s.trend}
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-800 tabular-nums tracking-tight">{s.value}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
                <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">{s.sub}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* ══════════════════════════════════════════════
            TWO-COLUMN: Chart + Activity
        ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-3 gap-4 grid-flow-dense">

          {/* Chart — 2 cols */}
          <FadeUp delay={0.1} className="col-span-2">
            <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-[#6366F1]/6 transition-all duration-300">
              {/* Chart header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">Sesiones esta semana</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Actividad e ingresos por día</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#6366F1]" />
                    Sesiones
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                    Ingresos
                  </div>
                  <button className="flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#4F46E5] font-medium transition-colors">
                    Ver detalle <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Chart body */}
              <div className="px-4 py-4 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sessionData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#34D399" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#6366F1", strokeWidth: 1, strokeDasharray: "4 4" }} />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stroke="#6366F1"
                      strokeWidth={2.5}
                      fill="url(#gradSessions)"
                      dot={{ r: 4, fill: "#6366F1", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#6366F1", stroke: "#fff", strokeWidth: 2 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#34D399"
                      strokeWidth={2}
                      fill="url(#gradRevenue)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Chart footer summary */}
              <div className="flex items-center gap-6 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                {[
                  { label: "Pico semanal",   value: "74",    sub: "viernes" },
                  { label: "Promedio diario", value: "50",    sub: "sesiones/día" },
                  { label: "Total semana",    value: "350",   sub: "sesiones" },
                  { label: "Ingresos",        value: "$7,750",sub: "esta semana" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-lg font-bold text-slate-800 tabular-nums">{item.value}</p>
                    <p className="text-xs text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Activity feed — 1 col */}
          <FadeUp delay={0.2} className="col-span-1">
            <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-[#6366F1]/6 transition-all duration-300 h-full">
              <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-semibold text-slate-700">Actividad reciente</h2>
                </div>
                <button className="flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#4F46E5] font-medium transition-colors">
                  Ver todo <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="divide-y divide-slate-50 overflow-y-auto max-h-[360px]">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${item.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-600 leading-snug">{item.msg}</p>
                      <p className="text-xs text-slate-400 mt-0.5 tabular-nums">Hace {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* ══════════════════════════════════════════════
            AI SYSTEM STATUS BAR
        ══════════════════════════════════════════════ */}
        <FadeUp delay={0.3} className="mt-4">
          <div className="bg-[#0C0E16] rounded-2xl p-5 relative overflow-hidden border border-white/[0.04]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-full bg-[#6366F1]/8 rounded-full blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle, #6366F1 1px, transparent 1px)", backgroundSize: "20px 20px" }}
              />
            </div>
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6366F1]/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-[#818CF8]" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Motor IA — EduMatch Intelligence v2.1</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
                    <p className="text-slate-500 text-xs">Operativo · Latencia 0.3s · 342 decisiones hoy</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {[
                  { icon: Zap,      label: "Precisión",   value: "89%",  color: "text-[#818CF8]" },
                  { icon: Sparkles, label: "Rutas activas",value: "1,247",color: "text-emerald-400" },
                  { icon: Shield,   label: "Validadas",    value: "156",  color: "text-amber-400" },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <div className="flex items-center gap-1.5 justify-center mb-0.5">
                      <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                      <p className={`text-lg font-bold tabular-nums ${m.color}`}>{m.value}</p>
                    </div>
                    <p className="text-slate-600 text-xs">{m.label}</p>
                  </div>
                ))}

                <button
                  onClick={() => navigate("/admin/ai-logs")}
                  className="flex items-center gap-2 bg-[#6366F1]/15 hover:bg-[#6366F1]/25 border border-[#6366F1]/25 text-[#818CF8] text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 active:scale-95"
                >
                  Ver logs <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
