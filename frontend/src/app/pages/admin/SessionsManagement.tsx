import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, Video, CheckCircle2, XCircle, Users, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { getSesionesAdmin } from "../../../api/admin";
import { toast } from "sonner";

interface Sesion {
  id: number | string;
  student: string;
  tutor: string;
  subject: string;
  topic: string;
  date: string;
  time: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  price: number;
}

const MOCK_SESSIONS: Sesion[] = [
  { id: 1, student: "Carlos Mendoza", tutor: "María González", subject: "Matemáticas Avanzadas", topic: "Aplicaciones de Derivadas", date: "2026-04-01", time: "16:00 – 17:00", status: "scheduled",   price: 25 },
  { id: 2, student: "Ana Pérez",       tutor: "María González", subject: "Álgebra Lineal",         topic: "Matrices",                  date: "2026-04-01", time: "18:00 – 19:00", status: "scheduled",   price: 25 },
  { id: 3, student: "Luis García",     tutor: "Jorge López",    subject: "Física",                 topic: "Dinámica",                   date: "2026-04-01", time: "15:00 – 16:00", status: "in-progress", price: 32 },
  { id: 4, student: "Carlos Mendoza",  tutor: "María González", subject: "Matemáticas Avanzadas", topic: "Derivadas",                  date: "2026-03-28", time: "16:00 – 17:00", status: "completed",   price: 25 },
  { id: 5, student: "Luis García",     tutor: "Carlos Ramírez", subject: "Física",                 topic: "Cinemática",                 date: "2026-03-26", time: "14:00 – 15:00", status: "completed",   price: 30 },
  { id: 6, student: "María Torres",    tutor: "Ana Martínez",   subject: "Estadística",            topic: "Distribuciones",             date: "2026-03-24", time: "17:00 – 18:00", status: "completed",   price: 28 },
  { id: 7, student: "Ana Pérez",       tutor: "Jorge López",    subject: "Álgebra Lineal",         topic: "Sistemas de Ecuaciones",     date: "2026-03-22", time: "18:00 – 19:00", status: "cancelled",   price: 32 },
];

const statusConfig = {
  scheduled:   { icon: Clock,        label: "Programada",  bg: "bg-[#6366F1]/8",  text: "text-[#6366F1]",   border: "border-[#6366F1]/20", dot: "bg-[#6366F1]" },
  "in-progress":{ icon: Video,       label: "En curso",    bg: "bg-emerald-50",   text: "text-emerald-700", border: "border-emerald-200",  dot: "bg-emerald-500" },
  completed:   { icon: CheckCircle2, label: "Completada",  bg: "bg-slate-100",    text: "text-slate-600",   border: "border-slate-200",    dot: "bg-slate-400" },
  cancelled:   { icon: XCircle,      label: "Cancelada",   bg: "bg-red-50",       text: "text-red-600",     border: "border-red-200",      dot: "bg-red-400" },
};

function mapApiSession(s: any): Sesion {
  // SessionSerializer devuelve: student_name, tutor_name, subject_name, session_date, start_time, end_time, status, notes
  const raw = s.status ?? s.estado ?? "PENDING";
  const status: Sesion["status"] =
    ["PENDING", "CONFIRMED", "PROGRAMADA"].includes(raw)   ? "scheduled"
    : ["IN_PROGRESS", "EN_PROGRESO"].includes(raw)         ? "in-progress"
    : ["COMPLETED", "COMPLETADA"].includes(raw)            ? "completed"
    : "cancelled";
  return {
    id: s.id,
    student: s.student_name ?? "—",
    tutor:   s.tutor_name   ?? "—",
    subject: s.subject_name ?? s.subject?.name ?? "—",
    topic:   s.notes        ?? "—",
    date:    s.session_date ?? "",
    time:    s.start_time   ? `${s.start_time} – ${s.end_time ?? ""}` : "—",
    status,
    price:   s.price ?? 0,
  };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("es-ES");
  } catch {
    return dateStr;
  }
}

const TAB_OPTIONS = [
  { value: "all",         label: "Todas" },
  { value: "scheduled",   label: "Programadas" },
  { value: "in-progress", label: "En curso" },
  { value: "completed",   label: "Completadas" },
  { value: "cancelled",   label: "Canceladas" },
];

export function SessionsManagement() {
  const [sessions, setSessions] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchSessions = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    getSesionesAdmin()
      .then((data) => {
        const list = Array.isArray(data) ? data.map(mapApiSession) : [];
        setSessions(list.length > 0 ? list : MOCK_SESSIONS);
      })
      .catch(() => setSessions(MOCK_SESSIONS))
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const filtered = sessions.filter((s) => statusFilter === "all" || s.status === statusFilter);

  const stats = {
    scheduled:  sessions.filter((s) => s.status === "scheduled").length,
    inProgress: sessions.filter((s) => s.status === "in-progress").length,
    completed:  sessions.filter((s) => s.status === "completed").length,
    cancelled:  sessions.filter((s) => s.status === "cancelled").length,
  };

  const tabs = TAB_OPTIONS.map((t) => ({
    ...t,
    count: t.value === "all" ? sessions.length : sessions.filter((s) => s.status === t.value).length,
  }));

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[420px] h-[280px] bg-[#6366F1]/5 rounded-full blur-[90px]" style={{ animation: "float-b 9s ease-in-out infinite" }} />
        <div className="absolute bottom-20 right-1/3 w-60 h-60 bg-emerald-400/4 rounded-full blur-[80px]" style={{ animation: "float-c 11s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Sesiones</h1>
          <p className="text-slate-400 text-sm mt-1">Supervisión de todas las sesiones de tutoría</p>
        </div>
        <Button
          variant="outline"
          className="h-9 px-4 rounded-xl text-sm border-slate-200 text-slate-600 hover:bg-slate-50"
          onClick={() => fetchSessions(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        {[
          { label: "Programadas", value: stats.scheduled,  icon: Clock,        iconBg: "bg-[#6366F1]/10", iconColor: "text-[#6366F1]"   },
          { label: "En curso",    value: stats.inProgress, icon: Video,        iconBg: "bg-emerald-50",    iconColor: "text-emerald-500" },
          { label: "Completadas", value: stats.completed,  icon: CheckCircle2, iconBg: "bg-slate-100",     iconColor: "text-slate-500"   },
          { label: "Canceladas",  value: stats.cancelled,  icon: XCircle,      iconBg: "bg-red-50",        iconColor: "text-red-400"     },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#6366F1]/8 cursor-default">
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

      {/* Loading */}
      {loading && (
        <div className="relative z-10 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200/70 rounded-2xl p-5 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="flex gap-3">
                  <div className="h-6 bg-slate-100 rounded w-16" />
                  <div className="h-6 bg-slate-200 rounded w-24" />
                </div>
                <div className="h-6 bg-slate-100 rounded w-12" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-5 bg-slate-100 rounded" />
                <div className="h-5 bg-slate-100 rounded" />
              </div>
              <div className="h-12 bg-slate-50 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Sessions list */}
      {!loading && (
        <div className="relative z-10 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200/70 rounded-2xl p-12 text-center">
              <Users className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Sin sesiones para este filtro</p>
            </div>
          ) : (
            filtered.map((session, idx) => {
              const cfg = statusConfig[session.status];
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, ease: [0.22, 0.61, 0.36, 1] }}
                  className="bg-white border border-slate-200/70 rounded-2xl p-5 hover:shadow-lg hover:shadow-[#6366F1]/6 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 tabular-nums">#{session.id}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <StatusIcon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>
                    {session.price > 0 && (
                      <span className="text-lg font-bold text-emerald-600 tabular-nums">${session.price}</span>
                    )}
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
                      { label: "Tema",     value: session.topic !== "—" ? session.topic : "—" },
                      { label: "Fecha",    value: formatDate(session.date) },
                      { label: "Horario",  value: session.time },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                        <p className="text-sm font-medium text-slate-700">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
