import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Calendar, Clock, Users, Video, CheckCircle2,
  XCircle, ChevronRight, FileText, X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { getSesionesDocente, getMisSesionesDocente, cambiarEstadoSesion } from "../../../api/docente";

type TabValue = "scheduled" | "completed" | "cancelled";

interface Sesion {
  id: string;
  student: string;
  subject: string;
  topic: string;
  date: string;
  time: string;
  platform: string;
  status: TabValue;
  meetingLink?: string;
}

const MOCK_SESSIONS: Sesion[] = [
  { id: "m1", student: "Carlos Mendoza", subject: "Matemáticas Avanzadas", topic: "Aplicaciones de Derivadas", date: "2026-05-20", time: "16:00 - 17:00", platform: "Zoom", status: "scheduled", meetingLink: "https://zoom.us/j/123456789" },
  { id: "m2", student: "Ana Pérez",       subject: "Álgebra Lineal",         topic: "Matrices",                  date: "2026-05-21", time: "18:00 - 19:00", platform: "Zoom", status: "scheduled", meetingLink: "https://zoom.us/j/987654321" },
  { id: "m3", student: "Luis García",     subject: "Física",                 topic: "Cinemática",                 date: "2026-05-10", time: "14:00 - 15:00", platform: "Zoom", status: "completed" },
  { id: "m4", student: "María Torres",    subject: "Cálculo",                topic: "Límites",                    date: "2026-05-08", time: "17:00 - 18:00", platform: "Zoom", status: "completed" },
  { id: "m5", student: "Ana Pérez",       subject: "Álgebra Lineal",         topic: "Sistemas de Ecuaciones",    date: "2026-05-05", time: "18:00 - 19:00", platform: "Zoom", status: "cancelled" },
];

function mapSpring(s: any): Sesion {
  const raw = s.status ?? "PENDING";
  const status: TabValue =
    ["PROGRAMADA", "PENDING", "CONFIRMED"].includes(raw) ? "scheduled"
    : ["COMPLETADA", "COMPLETED"].includes(raw) ? "completed"
    : "cancelled";
  return {
    id: s.id,
    student: s.student?.user
      ? `${s.student.user.firstName} ${s.student.user.lastName}`
      : s.student?.firstName
      ? `${s.student.firstName} ${s.student.lastName}`
      : "Estudiante",
    subject: s.subject?.name ?? s.materia ?? "—",
    topic: s.notes ?? s.tema ?? "—",
    date: s.sessionDate ?? s.fecha ?? "",
    time: s.startTime ? `${s.startTime} - ${s.endTime}` : "—",
    platform: "Zoom",
    status,
    meetingLink: s.meetingUrl ?? s.linkReunion,
  };
}

function mapDjango(s: any): Sesion {
  const raw = s.estado ?? "PROGRAMADA";
  const status: TabValue =
    raw === "PROGRAMADA" ? "scheduled"
    : raw === "COMPLETADA" ? "completed"
    : "cancelled";
  return {
    id: s.id,
    student: s.estudiante?.usuario?.nombre ?? "Estudiante",
    subject: s.materia ?? "—",
    topic: s.tema ?? "—",
    date: s.fecha ?? "",
    time: s.horaInicio ? `${s.horaInicio} - ${s.horaFin}` : "—",
    platform: s.plataforma ?? "Zoom",
    status,
    meetingLink: s.linkReunion,
  };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  } catch {
    return dateStr;
  }
}

const statusConfig = {
  scheduled: { bg: "bg-[#6366F1]/8",  text: "text-[#6366F1]",  border: "border-[#6366F1]/20", icon: Clock,        label: "Programada" },
  completed: { bg: "bg-emerald-50",    text: "text-emerald-700", border: "border-emerald-200",  icon: CheckCircle2, label: "Completada" },
  cancelled: { bg: "bg-red-50",        text: "text-red-600",     border: "border-red-200",      icon: XCircle,      label: "Cancelada" },
};

export function TutorSessions() {
  const [tab, setTab] = useState<TabValue>("scheduled");
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNotes, setOpenNotes] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchSessions = useCallback(() => {
    setLoading(true);
    getMisSesionesDocente()
      .then((data) => {
        setSesiones(Array.isArray(data) ? data.map(mapSpring) : []);
        setLoading(false);
      })
      .catch(() => {
        getSesionesDocente()
          .then((data) => setSesiones(Array.isArray(data) ? data.map(mapDjango) : MOCK_SESSIONS))
          .catch(() => setSesiones(MOCK_SESSIONS))
          .finally(() => setLoading(false));
      });
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const scheduled = sesiones.filter((s) => s.status === "scheduled");
  const completed  = sesiones.filter((s) => s.status === "completed");
  const cancelled  = sesiones.filter((s) => s.status === "cancelled");

  const counts: Record<TabValue, number> = {
    scheduled: scheduled.length,
    completed:  completed.length,
    cancelled:  cancelled.length,
  };
  const filtered = sesiones.filter((s) => s.status === tab);

  const handleComplete = async (id: string) => {
    setProcessing(id);
    try {
      await cambiarEstadoSesion(id, "COMPLETED");
      toast.success("Sesión marcada como completada");
      fetchSessions();
    } catch {
      toast.error("No se pudo actualizar el estado de la sesión");
    } finally {
      setProcessing(null);
    }
  };

  const handleCancel = async (id: string) => {
    setProcessing(id);
    try {
      await cambiarEstadoSesion(id, "CANCELLED");
      toast.error("Sesión cancelada");
      fetchSessions();
    } catch {
      toast.error("No se pudo cancelar la sesión");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[460px] h-[260px] bg-[#6366F1]/6 rounded-full blur-[100px]" style={{ animation: "float-c 9s ease-in-out infinite" }} />
        <div className="absolute bottom-10 right-8 w-60 h-60 bg-emerald-400/4 rounded-full blur-[80px]" style={{ animation: "float-b 12s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Mis Sesiones</h1>
        <p className="text-slate-400 text-sm mt-1">Gestiona y actualiza el estado de tus tutorías</p>
      </div>

      {/* Summary stats */}
      {!loading && (
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { label: "Programadas", count: scheduled.length, tc: "text-[#6366F1]",  bg: "bg-[#6366F1]/8 border-[#6366F1]/15" },
            { label: "Completadas", count: completed.length,  tc: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
            { label: "Canceladas",  count: cancelled.length,  tc: "text-red-500",     bg: "bg-red-50 border-red-200" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-2xl p-4 text-center`}>
              <p className={`text-3xl font-bold tabular-nums ${s.tc}`}>{s.count}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-1 bg-slate-100/80 rounded-xl p-1 border border-slate-200/60">
          {(["scheduled", "completed", "cancelled"] as TabValue[]).map((t) => {
            const lbl: Record<TabValue, string> = { scheduled: "Programadas", completed: "Completadas", cancelled: "Canceladas" };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  tab === t ? "bg-white text-[#6366F1] shadow-sm border border-slate-200/70" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {lbl[t]} ({counts[t]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="relative z-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200/70 rounded-2xl p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-36" />
                  <div className="h-3 bg-slate-100 rounded w-24" />
                </div>
                <div className="h-7 bg-slate-100 rounded-lg w-20" />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3].map((j) => <div key={j} className="h-16 bg-slate-100 rounded-xl" />)}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
                <div className="w-28 h-10 bg-slate-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scheduled — card view with actions */}
      {!loading && tab === "scheduled" && (
        <div className="relative z-10 space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200/70 rounded-2xl p-12 text-center">
              <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600 mb-1">Sin sesiones programadas</p>
              <p className="text-xs text-slate-400">Cuando un estudiante agende contigo, aparecerá aquí</p>
            </div>
          ) : (
            filtered.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
                className="bg-white border border-slate-200/70 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#6366F1]/6 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-slate-400" />
                      <h3 className="font-bold text-slate-800">{session.student}</h3>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{session.subject}</p>
                    {session.topic !== "—" && <p className="text-xs text-slate-400">{session.topic}</p>}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#6366F1]/8 text-[#6366F1] border border-[#6366F1]/20">
                    <Clock className="w-3 h-3" /> Programada
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { icon: Calendar, label: "Fecha",      value: formatDate(session.date),             color: "text-[#6366F1]",   bg: "bg-[#6366F1]/8" },
                    { icon: Clock,    label: "Horario",    value: session.time,                           color: "text-slate-600",   bg: "bg-slate-100"   },
                    { icon: Video,    label: "Plataforma", value: session.platform,                       color: "text-emerald-600", bg: "bg-emerald-50"  },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center gap-3 bg-[#F8F9FC] border border-slate-200/60 rounded-xl p-3">
                      <div className={`w-8 h-8 ${d.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <d.icon className={`w-4 h-4 ${d.color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{d.label}</p>
                        <p className="text-sm font-semibold text-slate-700">{d.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2.5">
                  <Button
                    className="flex-1 h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
                    onClick={() => session.meetingLink ? window.open(session.meetingLink, "_blank") : undefined}
                    disabled={!session.meetingLink}
                  >
                    <Video className="w-4 h-4 mr-2" /> Iniciar sesión
                  </Button>
                  <Button
                    className="h-10 px-4 rounded-xl text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all active:scale-[0.97]"
                    onClick={() => handleComplete(session.id)}
                    disabled={processing === session.id}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    {processing === session.id ? "..." : "Completar"}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 px-3 rounded-xl text-sm font-semibold border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all active:scale-[0.97]"
                    onClick={() => handleCancel(session.id)}
                    disabled={processing === session.id}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Completed / Cancelled — compact list with notes */}
      {!loading && (tab === "completed" || tab === "cancelled") && (
        <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">
              {tab === "completed" ? "Sesiones completadas" : "Sesiones canceladas"}
            </p>
            <button className="flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#4F46E5] font-medium transition-colors">
              Ver todo <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-slate-400">
                Sin sesiones {tab === "completed" ? "completadas" : "canceladas"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((session) => {
                const cfg = statusConfig[session.status];
                const Icon = cfg.icon;
                return (
                  <div key={session.id} className="px-6 py-4 hover:bg-[#6366F1]/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                        <Icon className={`w-4 h-4 ${cfg.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Users className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <p className="font-semibold text-slate-800 text-sm">{session.student}</p>
                        </div>
                        <p className="text-xs text-slate-400">
                          {session.subject} · {session.topic !== "—" ? `${session.topic} · ` : ""}{formatDate(session.date)} · {session.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {session.status === "completed" && (
                          <button
                            onClick={() => setOpenNotes(openNotes === session.id ? null : session.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                              openNotes === session.id
                                ? "bg-[#6366F1]/8 border-[#6366F1]/20 text-[#6366F1]"
                                : "border-slate-200 text-slate-500 hover:border-[#6366F1]/30 hover:text-[#6366F1]"
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            {notes[session.id] ? "Ver notas" : "Agregar notas"}
                          </button>
                        )}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          <Icon className="w-3 h-3" /> {cfg.label}
                        </span>
                      </div>
                    </div>

                    {openNotes === session.id && (
                      <div className="mt-3 ml-14 space-y-2">
                        <textarea
                          rows={3}
                          placeholder="Escribe tus observaciones sobre el desempeño del estudiante..."
                          value={notes[session.id] ?? ""}
                          onChange={(e) => setNotes((prev) => ({ ...prev, [session.id]: e.target.value }))}
                          className="w-full px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 bg-[#F8F9FC] border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                        />
                        <button
                          onClick={() => { setOpenNotes(null); toast.success("Notas guardadas"); }}
                          className="h-8 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-semibold transition-all active:scale-[0.97]"
                        >
                          Guardar notas
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
