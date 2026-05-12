import { useState, useEffect } from "react";
import { Calendar, Clock, Video, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { getSesiones } from "../../../api/estudiante";
import { toast } from "sonner";

type TabValue = "scheduled" | "completed" | "cancelled";

const statusConfig = {
  PROGRAMADA:  { bg: "bg-[#6366F1]/8",  text: "text-[#6366F1]",   border: "border-[#6366F1]/20", icon: Clock,        label: "Programada" },
  COMPLETADA:  { bg: "bg-emerald-50",    text: "text-emerald-700",  border: "border-emerald-200",  icon: CheckCircle2, label: "Completada"  },
  CANCELADA:   { bg: "bg-red-50",        text: "text-red-600",      border: "border-red-200",      icon: XCircle,      label: "Cancelada"   },
};

export function Sessions() {
  const [tab, setTab] = useState<TabValue>("scheduled");
  const [sesiones, setSesiones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSesiones()
      .then(setSesiones)
      .catch(() => setSesiones([]))
      .finally(() => setLoading(false));
  }, []);

  const programadas = sesiones.filter((s) => s.estado === "PROGRAMADA");
  const completadas  = sesiones.filter((s) => s.estado === "COMPLETADA");
  const canceladas   = sesiones.filter((s) => s.estado === "CANCELADA");

  const tabMap: Record<TabValue, any[]> = {
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

  return (
    <div className="relative min-h-full p-8 space-y-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[460px] h-[260px] bg-[#6366F1]/6 rounded-full blur-[100px]" style={{ animation: "float-c 9s ease-in-out infinite" }} />
      </div>

      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Estudiante</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Mis Sesiones</h1>
        <p className="text-slate-400 text-sm mt-1">Historial y próximas sesiones con tutores</p>
      </div>

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

      {/* Loading */}
      {loading && (
        <div className="relative z-10 text-center py-12 text-slate-400 text-sm">Cargando sesiones...</div>
      )}

      {/* Programadas — cards */}
      {!loading && tab === "scheduled" && (
        <div className="relative z-10 space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200/70 rounded-2xl p-10 text-center">
              <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No tienes sesiones programadas</p>
            </div>
          ) : filtered.map((s) => (
            <div key={s.id} className="bg-white border border-slate-200/70 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#6366F1]/6 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h3 className="font-bold text-slate-800">{s.docente?.usuario?.nombre ?? "Tutor"}</h3>
                  <p className="text-sm text-slate-600 font-medium">{s.materia}</p>
                  <p className="text-xs text-slate-400">{s.tema}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#6366F1]/8 text-[#6366F1] border border-[#6366F1]/20">
                  <Clock className="w-3 h-3" /> Programada
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { icon: Calendar, label: "Fecha",      value: new Date(s.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long" }), color: "text-[#6366F1]",   bg: "bg-[#6366F1]/8" },
                  { icon: Clock,    label: "Horario",    value: `${s.horaInicio} - ${s.horaFin}`,                                                  color: "text-slate-600",  bg: "bg-slate-100"   },
                  { icon: Video,    label: "Plataforma", value: s.plataforma ?? "Zoom",                                                            color: "text-emerald-600", bg: "bg-emerald-50"  },
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
              {s.linkReunion && (
                <Button
                  className="w-full h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold"
                  onClick={() => window.open(s.linkReunion, "_blank")}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Unirse a la sesión
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Completadas / Canceladas — lista */}
      {!loading && (tab === "completed" || tab === "cancelled") && (
        <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">{labels[tab]}</p>
            <button className="flex items-center gap-1 text-xs text-[#6366F1] font-medium">
              Ver todo <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {filtered.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-slate-400">Sin sesiones {tab === "completed" ? "completadas" : "canceladas"}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((s) => {
                const cfg = statusConfig[s.estado as keyof typeof statusConfig];
                const Icon = cfg.icon;
                return (
                  <div key={s.id} className="px-6 py-4 hover:bg-[#6366F1]/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                        <Icon className={`w-4 h-4 ${cfg.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{s.docente?.usuario?.nombre ?? "Tutor"}</p>
                        <p className="text-xs text-slate-400">{s.materia} · {s.tema} · {new Date(s.fecha).toLocaleDateString("es-ES")} · {s.horaInicio} - {s.horaFin}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>
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