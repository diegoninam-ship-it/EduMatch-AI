import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Calendar, Clock, Video, CheckCircle2, XCircle,
  ChevronRight, Star, MessageSquare,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { getSesiones, getMisSesiones, cancelarSesion } from "../../../api/estudiante";
import { toast } from "sonner";

type TabValue = "scheduled" | "completed" | "cancelled";

interface Sesion {
  id: string;
  tutorName: string;
  subject: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  meetingUrl?: string;
  notes?: string;
  estado: string;
}

function mapSpringSession(s: any): Sesion {
  return {
    id: s.id,
    tutorName: s.tutor?.user ? `${s.tutor.user.firstName} ${s.tutor.user.lastName}` : "Tutor",
    subject: s.subject?.name ?? "—",
    sessionDate: s.sessionDate ?? "",
    startTime: s.startTime ?? "",
    endTime: s.endTime ?? "",
    meetingUrl: s.meetingUrl,
    notes: s.notes,
    estado: s.status ?? "PENDING",
  };
}

function mapDjangoSession(s: any): Sesion {
  return {
    id: s.id,
    tutorName: s.docente?.usuario?.nombre ?? "Tutor",
    subject: s.materia ?? "—",
    sessionDate: s.fecha ?? "",
    startTime: s.horaInicio ?? "",
    endTime: s.horaFin ?? "",
    meetingUrl: s.linkReunion,
    notes: s.notas,
    estado: s.estado ?? "PROGRAMADA",
  };
}

const isScheduledState = (e: string) => ["PROGRAMADA", "PENDING", "CONFIRMED"].includes(e);
const isCompletedState = (e: string) => ["COMPLETADA", "COMPLETED"].includes(e);
const isCancelledState = (e: string) => ["CANCELADA", "CANCELLED"].includes(e);

function FeedbackDialog({
  open, onClose, sesion,
}: { open: boolean; onClose: () => void; sesion: Sesion | null }) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { toast.error("Selecciona una calificación"); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Feedback enviado. ¡Gracias por tu valoración!");
    setSubmitting(false);
    setRating(0); setComment("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-800">Calificar sesión</DialogTitle>
        </DialogHeader>
        {sesion && (
          <p className="text-xs text-slate-500 -mt-1 mb-3">
            {sesion.tutorName} — {sesion.subject}
          </p>
        )}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Calificación</p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onMouseEnter={() => setHoveredStar(i)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(i)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`w-9 h-9 transition-colors duration-100 ${
                      i <= (hoveredStar || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 hover:text-amber-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-slate-500 mt-2">
                {["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"][rating]}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Comentario (opcional)</p>
            <textarea
              rows={3}
              placeholder="Comparte tu experiencia con este tutor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 bg-[#F8F9FC] border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
            />
          </div>
          <Button
            className="w-full h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
            onClick={handleSubmit}
            disabled={submitting}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {submitting ? "Enviando..." : "Enviar feedback"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  } catch {
    return dateStr;
  }
}

export function Sessions() {
  const [tab, setTab] = useState<TabValue>("scheduled");
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSesion, setFeedbackSesion] = useState<Sesion | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchSessions = useCallback(() => {
    setLoading(true);
    getMisSesiones()
      .then((data) => {
        setSesiones(Array.isArray(data) ? data.map(mapSpringSession) : []);
        setLoading(false);
      })
      .catch(() => {
        getSesiones()
          .then((data) => setSesiones(Array.isArray(data) ? data.map(mapDjangoSession) : []))
          .catch(() => setSesiones([]))
          .finally(() => setLoading(false));
      });
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const programadas = sesiones.filter((s) => isScheduledState(s.estado));
  const completadas = sesiones.filter((s) => isCompletedState(s.estado));
  const canceladas  = sesiones.filter((s) => isCancelledState(s.estado));

  const tabMap: Record<TabValue, Sesion[]> = {
    scheduled: programadas,
    completed:  completadas,
    cancelled:  canceladas,
  };
  const filtered = tabMap[tab];

  const labels: Record<TabValue, string> = {
    scheduled: "Programadas",
    completed:  "Completadas",
    cancelled:  "Canceladas",
  };

  const handleCancel = async (id: string) => {
    setCancelling(id);
    try {
      await cancelarSesion(id);
      toast.success("Sesión cancelada exitosamente");
      fetchSessions();
    } catch {
      toast.error("No se pudo cancelar la sesión. Intenta de nuevo.");
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="relative min-h-full p-8 space-y-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[460px] h-[260px] bg-[#6366F1]/6 rounded-full blur-[100px]" style={{ animation: "float-c 9s ease-in-out infinite" }} />
        <div className="absolute bottom-16 right-10 w-64 h-64 bg-emerald-400/4 rounded-full blur-[80px]" style={{ animation: "float-a 12s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Mis Sesiones</h1>
        <p className="text-slate-400 text-sm mt-1">Historial y próximas sesiones con tutores</p>
      </div>

      {/* Summary stats */}
      {!loading && (
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { label: "Programadas", count: programadas.length, tc: "text-[#6366F1]",  bg: "bg-[#6366F1]/8 border-[#6366F1]/15" },
            { label: "Completadas", count: completadas.length, tc: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
            { label: "Canceladas",  count: canceladas.length,  tc: "text-red-500",     bg: "bg-red-50 border-red-200" },
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
          {(["scheduled", "completed", "cancelled"] as TabValue[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                tab === t ? "bg-white text-[#6366F1] shadow-sm border border-slate-200/70" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {labels[t]} ({tabMap[t].length})
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="relative z-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200/70 rounded-2xl p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-40" />
                  <div className="h-3 bg-slate-100 rounded w-28" />
                </div>
                <div className="h-7 bg-slate-100 rounded-lg w-24" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((j) => <div key={j} className="h-16 bg-slate-100 rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Programadas — card view */}
      {!loading && tab === "scheduled" && (
        <div className="relative z-10 space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200/70 rounded-2xl p-12 text-center">
              <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600 mb-1">Sin sesiones programadas</p>
              <p className="text-xs text-slate-400">Explora tutores y agenda tu primera sesión</p>
            </div>
          ) : (
            filtered.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
                className="bg-white border border-slate-200/70 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#6366F1]/6 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800">{s.tutorName}</h3>
                    <p className="text-sm text-slate-600 font-medium">{s.subject}</p>
                    {s.notes && <p className="text-xs text-slate-400 mt-0.5 italic">{s.notes}</p>}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#6366F1]/8 text-[#6366F1] border border-[#6366F1]/20">
                    <Clock className="w-3 h-3" /> Programada
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { icon: Calendar, label: "Fecha",    value: formatDate(s.sessionDate), color: "text-[#6366F1]",   bg: "bg-[#6366F1]/8" },
                    { icon: Clock,    label: "Horario",  value: s.startTime ? `${s.startTime} – ${s.endTime}` : "Por confirmar", color: "text-slate-600",   bg: "bg-slate-100"  },
                    { icon: Video,    label: "Enlace",   value: s.meetingUrl ? "Disponible" : "Por confirmar", color: "text-emerald-600", bg: "bg-emerald-50" },
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

                <div className="flex gap-3">
                  {s.meetingUrl && (
                    <Button
                      className="flex-1 h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold"
                      onClick={() => window.open(s.meetingUrl, "_blank")}
                    >
                      <Video className="w-4 h-4 mr-2" /> Unirse a la sesión
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="h-10 px-4 rounded-xl text-sm font-semibold border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all active:scale-[0.97]"
                    onClick={() => handleCancel(s.id)}
                    disabled={cancelling === s.id}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    {cancelling === s.id ? "Cancelando..." : "Cancelar"}
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Completadas — list with feedback */}
      {!loading && tab === "completed" && (
        <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">Sesiones completadas</p>
            <button className="flex items-center gap-1 text-xs text-[#6366F1] font-medium">
              Historial completo <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <CheckCircle2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Sin sesiones completadas aún</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((s) => (
                <div key={s.id} className="px-6 py-4 hover:bg-[#6366F1]/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-50 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{s.tutorName}</p>
                      <p className="text-xs text-slate-400">
                        {s.subject} · {formatDate(s.sessionDate)} · {s.startTime} – {s.endTime}
                      </p>
                    </div>
                    <button
                      onClick={() => { setFeedbackSesion(s); setFeedbackOpen(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:border-[#6366F1]/30 hover:text-[#6366F1] hover:bg-[#6366F1]/4 transition-all flex-shrink-0"
                    >
                      <Star className="w-3.5 h-3.5" /> Calificar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Canceladas */}
      {!loading && tab === "cancelled" && (
        <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">Sesiones canceladas</p>
          </div>
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <XCircle className="w-7 h-7 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Sin sesiones canceladas</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((s) => (
                <div key={s.id} className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50 border border-red-200">
                      <XCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{s.tutorName}</p>
                      <p className="text-xs text-slate-400">
                        {s.subject} · {formatDate(s.sessionDate)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border bg-red-50 text-red-600 border-red-200 flex-shrink-0">
                      <XCircle className="w-3 h-3" /> Cancelada
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <FeedbackDialog
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        sesion={feedbackSesion}
      />
    </div>
  );
}
