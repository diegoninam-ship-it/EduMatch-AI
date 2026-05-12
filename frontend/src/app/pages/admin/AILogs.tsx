import { Brain, Sparkles, Target, Map, UserCheck, AlertTriangle, RefreshCcw, Lightbulb, CalendarClock, CheckCircle2 } from "lucide-react";

const aiLogs = [
  { id: 1, type: "route_generated",         student: "Carlos Mendoza", action: "Ruta de aprendizaje generada: Matemáticas Avanzadas",    details: "15 temas organizados según nivel intermedio y objetivos declarados", confidence: 94, timestamp: "2026-04-01 16:23:45", status: "success" },
  { id: 2, type: "tutor_assigned",           student: "Ana Pérez",      action: "Tutor asignado automáticamente: María González",          details: "98% compatibilidad basada en estilo de aprendizaje visual y especialidad en Cálculo", confidence: 98, timestamp: "2026-04-01 15:45:12", status: "success" },
  { id: 3, type: "intervention_early_warning", student: "Luis García",  action: "Alerta temprana: bajo rendimiento detectado en Álgebra",  details: "62% en últimas 3 evaluaciones. Sesión de refuerzo programada automáticamente", confidence: 89, timestamp: "2026-04-01 14:30:28", status: "success" },
  { id: 4, type: "route_adapted",            student: "María Torres",   action: "Ruta adaptada: contenido simplificado en módulo actual",  details: "Análisis de patrón de errores sugiere más tiempo en conceptos básicos", confidence: 87, timestamp: "2026-04-01 13:15:33", status: "success" },
  { id: 5, type: "recommendation",           student: "Jorge Sánchez",  action: "Recomendación proactiva: módulo avanzado desbloqueado",   details: "92% rendimiento consistente en últimos 5 módulos", confidence: 94, timestamp: "2026-04-01 11:50:17", status: "success" },
  { id: 6, type: "route_generated",          student: "Laura Fernández",action: "Ruta de aprendizaje generada: Física Básica",             details: "12 temas organizados con enfoque práctico según preferencias del estudiante", confidence: 91, timestamp: "2026-03-31 18:42:05", status: "success" },
  { id: 7, type: "tutor_assigned",           student: "Pedro Ramírez",  action: "Tutor asignado automáticamente: Carlos Ramírez",          details: "95% compatibilidad por disponibilidad horaria y experiencia en nivel básico", confidence: 95, timestamp: "2026-03-31 16:20:44", status: "success" },
  { id: 8, type: "intervention_schedule",    student: "Sofía López",    action: "Sesión adicional programada automáticamente",             details: "Dificultad detectada en integrales. Tutor especializado asignado", confidence: 90, timestamp: "2026-03-31 15:05:22", status: "success" },
];

const logTypeConfig: Record<string, { icon: typeof Brain; bg: string; text: string; border: string; label: string }> = {
  route_generated:           { icon: Map,            bg: "bg-[#6366F1]/8",  text: "text-[#6366F1]",  border: "border-[#6366F1]/20", label: "Ruta generada" },
  tutor_assigned:            { icon: UserCheck,      bg: "bg-emerald-50",   text: "text-emerald-700",border: "border-emerald-200",  label: "Tutor asignado" },
  intervention_early_warning:{ icon: AlertTriangle,  bg: "bg-amber-50",     text: "text-amber-700",  border: "border-amber-200",    label: "Alerta temprana" },
  route_adapted:             { icon: RefreshCcw,     bg: "bg-teal-50",      text: "text-teal-700",   border: "border-teal-200",     label: "Ruta adaptada" },
  recommendation:            { icon: Lightbulb,      bg: "bg-yellow-50",    text: "text-yellow-700", border: "border-yellow-200",   label: "Recomendación" },
  intervention_schedule:     { icon: CalendarClock,  bg: "bg-slate-100",    text: "text-slate-600",  border: "border-slate-200",    label: "Intervención" },
};

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 93 ? "bg-emerald-400" : value >= 85 ? "bg-[#6366F1]" : "bg-amber-400";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${value}%`, animation: "bar-grow 0.8s ease-out" }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${value >= 93 ? "text-emerald-600" : value >= 85 ? "text-[#6366F1]" : "text-amber-600"}`}>
        {value}%
      </span>
    </div>
  );
}

export function AILogs() {
  const stats = {
    totalEvents:      aiLogs.length,
    routesGenerated:  aiLogs.filter(l => l.type === "route_generated").length,
    tutorsAssigned:   aiLogs.filter(l => l.type === "tutor_assigned").length,
    interventions:    aiLogs.filter(l => l.type.includes("intervention")).length,
  };

  const avgConfidence = Math.round(aiLogs.reduce((a, l) => a + l.confidence, 0) / aiLogs.length);

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Animated background — more prominent for AI page */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#6366F1]/8 rounded-full blur-[120px]" style={{ animation: "float-c 8s ease-in-out infinite" }} />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-[#14B8A6]/5 rounded-full blur-[100px]" style={{ animation: "float-a 12s ease-in-out infinite" }} />
        <div className="absolute top-1/2 right-10 w-56 h-56 bg-[#6366F1]/5 rounded-full blur-[80px]" style={{ animation: "float-b 10s ease-in-out infinite" }} />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #6366F1 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Administración</p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Logs IA</h1>
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }} />
            <span className="text-xs font-semibold text-emerald-700">En vivo</span>
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-1">Registro de decisiones y eventos del sistema inteligente</p>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        {/* Hero AI card */}
        <div className="col-span-2 bg-[#0C0E16] rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#6366F1]/20 cursor-default">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/12 rounded-full blur-3xl" />
            {/* Scan line animation */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-[#6366F1]/6 to-transparent"
                style={{ animation: "scan-line 4s ease-in-out infinite" }}
              />
            </div>
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.6) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-[#6366F1]/20 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#818CF8]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Motor IA</p>
                <p className="text-slate-500 text-xs">EduMatch Intelligence v2.1</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-4xl font-bold text-white tabular-nums tracking-tight">{stats.totalEvents}</p>
                <p className="text-slate-400 text-xs mt-1">Eventos totales</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#818CF8] tabular-nums tracking-tight">{avgConfidence}%</p>
                <p className="text-slate-400 text-xs mt-1">Confianza promedio</p>
              </div>
            </div>
          </div>
        </div>

        {[
          { label: "Rutas generadas",  value: stats.routesGenerated, icon: Map,       iconBg: "bg-[#6366F1]/10", iconColor: "text-[#6366F1]" },
          { label: "Tutores asignados",value: stats.tutorsAssigned,  icon: UserCheck, iconBg: "bg-emerald-50",    iconColor: "text-emerald-500" },
          { label: "Intervenciones",   value: stats.interventions,   icon: Target,    iconBg: "bg-amber-50",      iconColor: "text-amber-500" },
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

      {/* Logs list */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#6366F1]" />
          <h2 className="text-sm font-semibold text-slate-700">Eventos recientes</h2>
        </div>
        {aiLogs.map((log, idx) => {
          const cfg = logTypeConfig[log.type];
          const LogIcon = cfg.icon;
          return (
            <div
              key={log.id}
              className="bg-white border border-slate-200/70 rounded-2xl p-5 hover:shadow-lg hover:shadow-[#6366F1]/6 hover:-translate-y-0.5 transition-all duration-200"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 border ${cfg.border}`}>
                  <LogIcon className={`w-4.5 h-4.5 ${cfg.text}`} style={{ width: 18, height: 18 }} />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Top row */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>{cfg.label}</span>
                    <span className="text-xs text-slate-400 tabular-nums">{log.timestamp}</span>
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium ml-auto">
                      <CheckCircle2 className="w-3 h-3" /> Exitoso
                    </span>
                  </div>

                  {/* Action */}
                  <p className="font-bold text-slate-800 text-sm mb-0.5">{log.action}</p>
                  <p className="text-xs text-slate-400 mb-3">{log.student}</p>

                  {/* Details box */}
                  <div className="bg-[#F8F9FC] border border-slate-200/60 rounded-xl p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#6366F1] mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-600 leading-relaxed">{log.details}</p>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-400 flex-shrink-0">Confianza IA</span>
                    <div className="flex-1">
                      <ConfidenceBar value={log.confidence} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
