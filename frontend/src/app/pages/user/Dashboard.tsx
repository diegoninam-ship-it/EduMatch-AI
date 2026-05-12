import { Target, BookOpen, ArrowRight, Play, Flame, Clock, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getRutaActiva, getModulos, getSesiones } from "../../../api/estudiante";

export function UserDashboard() {
  const navigate = useNavigate();
  const nombre = localStorage.getItem("nombre") ?? "Estudiante";

  const [ruta, setRuta] = useState<any>(null);
  const [modulos, setModulos] = useState<any[]>([]);
  const [sesiones, setSesiones] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rutaData = await getRutaActiva();
        setRuta(rutaData);
        if (rutaData?.id) {
          const modulosData = await getModulos(rutaData.id);
          setModulos(modulosData);
        }
      } catch {}
      try {
        const sesionesData = await getSesiones();
        setSesiones(sesionesData);
      } catch {}
    };
    fetchData();
  }, []);

  const completados = modulos.filter((m) => m.estado === "COMPLETADO").length;
  const total = modulos.length || 1;
  const progreso = ruta?.progresoGeneral ?? 0;
  const sesionesCompletadas = sesiones.filter((s) => s.estado === "COMPLETADA").length;
  const moduloActual = modulos.find((m) => m.estado === "EN_PROGRESO") ?? modulos.find((m) => m.estado === "PENDIENTE");
  const modulosRecientes = [...modulos].sort((a, b) => b.orden - a.orden).slice(0, 3);

  return (
    <div className="relative min-h-full p-8 space-y-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[280px] bg-[#6366F1]/6 rounded-full blur-[100px]" style={{ animation: "float-c 9s ease-in-out infinite" }} />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-400/4 rounded-full blur-[80px]" style={{ animation: "float-a 12s ease-in-out infinite" }} />
      </div>

      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Panel del estudiante</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Hola, {nombre.split(" ")[0]}</h1>
        <p className="text-slate-400 text-sm mt-0.5">Continúa donde lo dejaste</p>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-4">
        {[
          { icon: Flame,  label: "Racha",       value: "7 días",                                              color: "text-orange-500",  bg: "bg-orange-50"    },
          { icon: Clock,  label: "Esta semana", value: "— h",                                                 color: "text-[#6366F1]",   bg: "bg-[#6366F1]/8"  },
          { icon: Target, label: "Completados", value: modulos.length > 0 ? `${completados}/${total}` : "—", color: "text-emerald-500", bg: "bg-emerald-50"   },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#6366F1]/8 cursor-default">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-slate-800 tabular-nums tracking-tight">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/70 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Progreso general</h2>
              <p className="text-xs text-slate-400 mt-0.5">{ruta?.materia ?? "Sin ruta activa"}</p>
            </div>
            <span className="text-4xl font-bold text-slate-800 tabular-nums">{progreso}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#6366F1] rounded-full transition-all duration-700" style={{ width: `${progreso}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-2.5">
            {modulos.length > 0 ? `${completados} de ${total} temas completados` : "Aún no tienes módulos asignados"}
          </p>
          <div className="mt-5 space-y-2.5">
            {modulosRecientes.length > 0 ? modulosRecientes.map((m) => (
              <div key={m.nombre} className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.estado === "COMPLETADO" ? "bg-emerald-400" : m.estado === "EN_PROGRESO" ? "bg-[#6366F1]" : "bg-slate-300"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{m.nombre}</p>
                  <p className="text-xs text-slate-400">{m.estado === "COMPLETADO" ? "Completado" : m.estado === "EN_PROGRESO" ? "En progreso" : "Pendiente"}</p>
                </div>
              </div>
            )) : <p className="text-xs text-slate-400">No hay actividad reciente</p>}
          </div>
        </div>

        <div className="bg-white border border-slate-200/70 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#6366F1]" />
            <h2 className="text-sm font-semibold text-slate-700">Ruta activa</h2>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-1">{ruta?.materia ?? "Sin ruta activa"}</h3>
            <p className="text-sm text-slate-400 mb-4">{moduloActual ? `Tema actual: ${moduloActual.nombre}` : "Completa el onboarding para generar tu ruta"}</p>
            <div className="bg-[#F8F9FC] border border-slate-200/60 rounded-xl p-3 mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#6366F1] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  {moduloActual ? `Continúa con: ${moduloActual.nombre}` : "Tu ruta será generada al completar el onboarding"}
                </p>
              </div>
            </div>
          </div>
          <Button className="w-full h-10 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]" onClick={() => navigate("/user/learning-path")}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Ver ruta completa
          </Button>
        </div>
      </div>

      <div className="relative z-10 bg-[#6366F1] rounded-2xl p-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-white/70" />
              <p className="text-sm font-semibold text-white/70">Próxima acción</p>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{moduloActual?.nombre ?? "Sin tarea pendiente"}</h3>
            <p className="text-white/60 text-sm">{moduloActual ? `Tiempo estimado: ${moduloActual.horasEstimadas ?? "—"} h` : "Completa tu perfil para comenzar"}</p>
          </div>
          <Button className="h-10 bg-white/15 hover:bg-white/25 text-white rounded-xl text-sm font-semibold backdrop-blur-sm border border-white/10 transition-all duration-150 active:scale-[0.98] px-5" onClick={() => navigate("/user/learning-path")}>
            <Play className="w-4 h-4 mr-2" />
            Continuar
          </Button>
        </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#6366F1]" />
          <h2 className="text-sm font-semibold text-slate-700">Análisis de rendimiento IA</h2>
          <div className="ml-auto flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }} />
            <span className="text-xs font-semibold text-emerald-700">Actualizado</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Velocidad de aprendizaje", value: "+18%",                      sub: "vs semana anterior",      color: "text-emerald-600" },
            { label: "Tasa de retención",         value: "87%",                       sub: "en ejercicios recientes", color: "text-[#6366F1]"   },
            { label: "Sesiones completadas",      value: String(sesionesCompletadas), sub: "en total",                color: "text-slate-800"   },
            { label: "Módulos completados",       value: modulos.length > 0 ? String(completados) : "—", sub: "de tu ruta", color: "text-orange-500" },
          ].map((m) => (
            <div key={m.label} className="text-center p-3 bg-[#F8F9FC] rounded-xl border border-slate-200/60">
              <p className={`text-2xl font-bold tabular-nums ${m.color}`}>{m.value}</p>
              <p className="text-xs font-medium text-slate-600 mt-1">{m.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}