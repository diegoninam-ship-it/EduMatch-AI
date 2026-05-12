import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Clock, Lock, HelpCircle, Filter, Sparkles } from "lucide-react";
import { getRutaActiva, getModulos, completarModulo } from "../../../api/estudiante";
import { toast } from "sonner";

const estadoConfig = {
  COMPLETADO:  { label: "Completado",  color: "text-emerald-600", bg: "bg-emerald-50",    border: "border-emerald-200", icon: CheckCircle2 },
  EN_PROGRESO: { label: "En progreso", color: "text-[#6366F1]",   bg: "bg-[#6366F1]/8",  border: "border-[#6366F1]/20", icon: Clock       },
  PENDIENTE:   { label: "Pendiente",   color: "text-slate-400",   bg: "bg-slate-50",      border: "border-slate-200",   icon: Lock        },
};

export function LearningPath() {
  const [ruta, setRuta]       = useState<any>(null);
  const [modulos, setModulos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus]   = useState("todos");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rutaData = await getRutaActiva();
        setRuta(rutaData);
        if (rutaData?.id) {
          const modulosData = await getModulos(rutaData.id);
          setModulos(modulosData);
        }
      } catch {
        // sin ruta activa
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCompletar = async (moduloId: number) => {
    try {
      await completarModulo(moduloId);
      setModulos((prev) =>
        prev.map((m) => m.id === moduloId ? { ...m, estado: "COMPLETADO" } : m)
      );
      toast.success("Módulo marcado como completado");
    } catch {
      toast.error("Error al actualizar el módulo");
    }
  };

  const completados = modulos.filter((m) => m.estado === "COMPLETADO").length;
  const progreso    = modulos.length > 0 ? Math.round((completados / modulos.length) * 100) : 0;

  const filtrados = modulos.filter((m) => {
    if (filterStatus === "todos") return true;
    return m.estado === filterStatus.toUpperCase();
  });

  return (
    <div className="relative min-h-full p-8 space-y-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[460px] h-[260px] bg-[#6366F1]/6 rounded-full blur-[100px]" style={{ animation: "float-c 9s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Estudiante</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Ruta de Aprendizaje</h1>
        <p className="text-slate-400 text-sm mt-1">Tu plan de estudio personalizado por IA</p>
      </div>

      {loading && (
        <div className="relative z-10 text-center py-20 text-slate-400 text-sm">Cargando tu ruta...</div>
      )}

      {!loading && !ruta && (
        <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl p-12 text-center">
          <Sparkles className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold mb-1">Aún no tienes una ruta activa</p>
          <p className="text-slate-400 text-sm">Completa el onboarding para que la IA genere tu ruta personalizada</p>
        </div>
      )}

      {!loading && ruta && (
        <>
          {/* Resumen */}
          <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{ruta.materia}</h2>
                <p className="text-sm text-slate-400 mt-0.5">Nivel: {ruta.nivel} · {modulos.length} módulos en total</p>
              </div>
              <span className="text-4xl font-bold text-[#6366F1] tabular-nums">{progreso}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6366F1] rounded-full transition-all duration-700"
                style={{ width: `${progreso}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">{completados} de {modulos.length} módulos completados</p>
          </div>

          {/* Filtros */}
          <div className="relative z-10 flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            {["todos", "PENDIENTE", "EN_PROGRESO", "COMPLETADO"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                  filterStatus === f
                    ? "bg-[#6366F1] text-white border-[#6366F1]"
                    : "bg-white text-slate-500 border-slate-200 hover:border-[#6366F1]/40 hover:text-[#6366F1]"
                }`}
              >
                {f === "todos" ? "Todos" : f === "PENDIENTE" ? "Pendientes" : f === "EN_PROGRESO" ? "En progreso" : "Completados"}
              </button>
            ))}
          </div>

          {/* Lista de módulos */}
          <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700">Módulos</h2>
              <span className="ml-auto text-xs text-slate-400">{filtrados.length} módulo{filtrados.length !== 1 ? "s" : ""}</span>
            </div>

            {filtrados.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-400">Sin módulos para este filtro</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filtrados.map((modulo) => {
                  const cfg = estadoConfig[modulo.estado as keyof typeof estadoConfig];
                  const Icon = cfg.icon;
                  const puedeCompletar = modulo.estado !== "COMPLETADO";
                  return (
                    <div key={modulo.id} className="px-6 py-4 hover:bg-[#6366F1]/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                          <Icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold text-slate-800 text-sm">{modulo.nombre}</p>
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{modulo.descripcion} · {modulo.horasEstimadas ?? "—"} h estimadas</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {puedeCompletar && modulo.estado !== "PENDIENTE" && (
                            <button
                              onClick={() => handleCompletar(modulo.id)}
                              className="h-8 px-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-all duration-150"
                            >
                              Marcar completado
                            </button>
                          )}
                          {modulo.estado === "PENDIENTE" && (
                            <button
                              disabled
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 cursor-not-allowed"
                              title="Completa los módulos anteriores primero"
                            >
                              <HelpCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}