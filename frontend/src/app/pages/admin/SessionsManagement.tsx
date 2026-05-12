import { useEffect, useState } from "react";
import { Calendar, Clock, Video, CheckCircle2, XCircle, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { getSesionesAdmin } from "../../../api/admin";

const allSessions = [
  { id: 1, student: "Carlos Mendoza", tutor: "María González", subject: "Matemáticas Avanzadas", topic: "Aplicaciones de Derivadas", date: "2026-04-01", time: "16:00 – 17:00", status: "scheduled",   price: 25 },
  { id: 2, student: "Ana Pérez",       tutor: "María González", subject: "Álgebra Lineal",         topic: "Matrices",                  date: "2026-04-01", time: "18:00 – 19:00", status: "scheduled",   price: 25 },
  { id: 3, student: "Luis García",     tutor: "Jorge López",    subject: "Física",                 topic: "Dinámica",                   date: "2026-04-01", time: "15:00 – 16:00", status: "in-progress", price: 32 },
  { id: 4, student: "Carlos Mendoza",  tutor: "María González", subject: "Matemáticas Avanzadas", topic: "Derivadas",                  date: "2026-03-28", time: "16:00 – 17:00", status: "completed",   price: 25 },
  { id: 5, student: "Luis García",     tutor: "Carlos Ramírez", subject: "Física",                 topic: "Cinemática",                 date: "2026-03-26", time: "14:00 – 15:00", status: "completed",   price: 30 },
  { id: 6, student: "María Torres",    tutor: "Ana Martínez",   subject: "Estadística",            topic: "Distribuciones",             date: "2026-03-24", time: "17:00 – 18:00", status: "completed",   price: 28 },
  { id: 7, student: "Ana Pérez",       tutor: "Jorge López",    subject: "Álgebra Lineal",         topic: "Sistemas de Ecuaciones",     date: "2026-03-22", time: "18:00 – 19:00", status: "cancelled",   price: 32 },
];

const statusConfig = {
  scheduled:   { icon: Clock,        label: "Programada",  bg: "bg-[#6366F1]/8",  text: "text-[#6366F1]",  border: "border-[#6366F1]/20", dot: "bg-[#6366F1]" },
  "in-progress":{ icon: Video,       label: "En curso",    bg: "bg-emerald-50",   text: "text-emerald-700",border: "border-emerald-200",  dot: "bg-emerald-500" },
  completed:   { icon: CheckCircle2, label: "Completada",  bg: "bg-slate-100",    text: "text-slate-600",  border: "border-slate-200",    dot: "bg-slate-400" },
  cancelled:   { icon: XCircle,      label: "Cancelada",   bg: "bg-red-50",       text: "text-red-600",    border: "border-red-200",      dot: "bg-red-400" },
};

const tabs = [
  { value: "all",         label: "Todas",       count: allSessions.length },
  { value: "scheduled",   label: "Programadas", count: allSessions.filter(s => s.status === "scheduled").length },
  { value: "in-progress", label: "En curso",    count: allSessions.filter(s => s.status === "in-progress").length },
  { value: "completed",   label: "Completadas", count: allSessions.filter(s => s.status === "completed").length },
  { value: "cancelled",   label: "Canceladas",  count: allSessions.filter(s => s.status === "cancelled").length },
];

export function SessionsManagement() {
  const [sesionesApi, setSesionesApi] = useState<any[]>([]);

useEffect(() => {
  getSesionesAdmin()
    .then(setSesionesApi)
    .catch(() => {});
}, []);

const sessions = sesionesApi.length > 0
  ? sesionesApi.map((s: any) => ({
      id:      s.id,
      student: s.estudiante?.usuario?.nombre ?? "—",
      tutor:   s.docente?.usuario?.nombre ?? "—",
      subject: s.materia ?? "—",
      topic:   s.notas ?? "—",
      date:    s.fecha ?? "",
      time:    s.hora_inicio ? `${s.hora_inicio} – ${s.hora_fin ?? ""}` : "—",
      status:  s.estado === "PROGRAMADA" ? "scheduled"
             : s.estado === "EN_PROGRESO" ? "in-progress"
             : s.estado === "COMPLETADA"  ? "completed"
             : "cancelled",
      price: s.precio ?? 0,
    }))
  : allSessions;
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = sessions.filter(s => statusFilter === "all" || s.status === statusFilter);

  const stats = {
    scheduled:  sessions.filter(s => s.status === "scheduled").length,
    inProgress: sessions.filter(s => s.status === "in-progress").length,
    completed:  sessions.filter(s => s.status === "completed").length,
    cancelled:  sessions.filter(s => s.status === "cancelled").length,
  };

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[420px] h-[280px] bg-[#6366F1]/5 rounded-full blur-[90px]" style={{ animation: "float-b 9s ease-in-out infinite" }} />
        <div className="absolute bottom-20 right-1/3 w-60 h-60 bg-emerald-400/4 rounded-full blur-[80px]" style={{ animation: "float-c 11s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Administración</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Sesiones</h1>
        <p className="text-slate-400 text-sm mt-1">Gestión de todas las sesiones de tutoría</p>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        {[
          { label: "Programadas", value: stats.scheduled,  icon: Clock,        iconBg: "bg-[#6366F1]/10", iconColor: "text-[#6366F1]" },
          { label: "En curso",    value: stats.inProgress, icon: Video,        iconBg: "bg-emerald-50",    iconColor: "text-emerald-500" },
          { label: "Completadas", value: stats.completed,  icon: CheckCircle2, iconBg: "bg-slate-100",     iconColor: "text-slate-500" },
          { label: "Canceladas",  value: stats.cancelled,  icon: XCircle,      iconBg: "bg-red-50",        iconColor: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#6366F1]/8 cursor-default">
            <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <p className="text-4xl font-bold text-slate-800 tabular-nums tracking-tight">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl p-1.5 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
              statusFilter === tab.value
                ? "bg-[#6366F1] text-white shadow-sm shadow-[#6366F1]/25"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold tabular-nums ${statusFilter === tab.value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sessions list */}
      <div className="relative z-10 space-y-3">
        {filtered.map((session) => {
          const cfg = statusConfig[session.status as keyof typeof statusConfig];
          const StatusIcon = cfg.icon;
          return (
            <div key={session.id} className="bg-white border border-slate-200/70 rounded-2xl p-5 hover:shadow-lg hover:shadow-[#6366F1]/6 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 tabular-nums">#{session.id}</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </div>
                <span className="text-lg font-bold text-emerald-600 tabular-nums">${session.price}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Estudiante</p>
                  <p className="font-semibold text-slate-800">{session.student}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Tutor</p>
                  <p className="font-semibold text-slate-800">{session.tutor}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 bg-[#F8F9FC] rounded-xl p-3 border border-slate-200/60">
                {[
                  { label: "Materia",  value: session.subject },
                  { label: "Tema",     value: session.topic },
                  { label: "Fecha",    value: new Date(session.date).toLocaleDateString("es-ES") },
                  { label: "Horario",  value: session.time },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-slate-700">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
