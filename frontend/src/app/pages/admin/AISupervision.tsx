import { useState } from "react";
import { Brain, TrendingUp, AlertCircle, CheckCircle2, XCircle, RefreshCw, Sparkles, Target, Database, Zap, FileText, BarChart3, Users, Clock, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { AIBadge } from "../../components/AIBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";

interface AIDecision {
  id: number;
  timestamp: string;
  type: string;
  student: string;
  decision: string;
  reasoning: string;
  confidence: number;
  status: "active" | "overridden" | "validated";
  impact: string;
  dataAnalyzed?: { metric: string; value: string }[];
  outcome?: string;
}

const aiDecisions: AIDecision[] = [
  { id: 1, timestamp: "2026-04-01 14:23", type: "Asignación de Tutor",    student: "Carlos Mendoza", decision: "María González asignada para Matemáticas Avanzadas", reasoning: "Match del 98% basado en: estilo de aprendizaje visual del estudiante, especialidad del tutor en matemáticas avanzadas, disponibilidad horaria compatible, y calificaciones previas de 4.9/5.0 con estudiantes de nivel similar.", confidence: 98, status: "active",     impact: "Alta probabilidad de mejora en rendimiento", dataAnalyzed: [{ metric: "Estilo de aprendizaje", value: "Visual (87%)" }, { metric: "Especialidad tutor", value: "Matemáticas Avanzadas" }, { metric: "Disponibilidad horaria", value: "95% compatible" }, { metric: "Historial tutor", value: "4.9/5.0 (124 sesiones)" }, { metric: "Casos similares", value: "34 matches exitosos" }], outcome: "Sesión programada para hoy 16:00" },
  { id: 2, timestamp: "2026-04-01 13:45", type: "Ruta de Aprendizaje",    student: "Ana Rodríguez",  decision: "Módulo de Cálculo Avanzado desbloqueado", reasoning: "El estudiante completó el 92% del módulo anterior con calificaciones superiores al 85% en todas las evaluaciones.", confidence: 88, status: "active",     impact: "Aceleración del progreso académico", dataAnalyzed: [{ metric: "Progreso módulo anterior", value: "92% completado" }, { metric: "Calificaciones promedio", value: "87.5%" }, { metric: "Tiempo de respuesta", value: "15% más rápido" }, { metric: "Conceptos dominados", value: "18 de 20" }, { metric: "Predicción de éxito", value: "91%" }], outcome: "Módulo desbloqueado - Usuario notificado" },
  { id: 3, timestamp: "2026-04-01 12:10", type: "Intervención Académica", student: "Luis Pérez",     decision: "Sesión de refuerzo sugerida en Álgebra Lineal", reasoning: "Detección de bajo rendimiento (62%) en los últimos 3 ejercicios de matrices.", confidence: 92, status: "validated",   impact: "Prevención de rezago académico", dataAnalyzed: [{ metric: "Rendimiento reciente", value: "62%" }, { metric: "Tendencia", value: "-18% vs semana anterior" }, { metric: "Tiempo de estudio", value: "Reducido 30%" }, { metric: "Conceptos problemáticos", value: "Operaciones con matrices" }, { metric: "Riesgo de rezago", value: "Alto (78%)" }], outcome: "Sesión programada con Jorge López - 03 Abr 18:00" },
  { id: 4, timestamp: "2026-04-01 11:30", type: "Nivel Estimado",         student: "María García",   decision: "Actualización de nivel: Intermedio → Avanzado", reasoning: "Análisis de 23 temas completados con promedio de 87%. Consistencia en resultados durante 3 meses.", confidence: 90, status: "active",     impact: "Acceso a contenido más desafiante", dataAnalyzed: [{ metric: "Temas completados", value: "23" }, { metric: "Promedio general", value: "87.3%" }, { metric: "Consistencia", value: "3 meses con >85%" }, { metric: "Evaluaciones superadas", value: "12 de 12" }, { metric: "Comparación con pares", value: "Top 15%" }], outcome: "Nivel actualizado - Contenido avanzado disponible" },
  { id: 5, timestamp: "2026-04-01 10:15", type: "Asignación de Tutor",    student: "Jorge Sánchez",  decision: "Carlos Ramírez asignado para Física Avanzada", reasoning: "Match del 91% considerando especialización en física del tutor.", confidence: 91, status: "overridden", impact: "Admin asignó manualmente a otro tutor por solicitud especial", dataAnalyzed: [{ metric: "Especialización", value: "Física Cuántica (Ph.D.)" }, { metric: "Compatibilidad horaria", value: "89%" }, { metric: "Nivel del estudiante", value: "Experto" }, { metric: "Rating tutor", value: "4.8/5.0" }, { metric: "Sesiones previas", value: "89 completadas" }], outcome: "Override por admin - Asignado a Laura Martínez" },
  { id: 6, timestamp: "2026-04-01 09:22", type: "Recomendación",          student: "Laura Hernández",decision: "Ejercicios adicionales de Probabilidad Básica", reasoning: "El tiempo de resolución de problemas es 25% superior al promedio del grupo.", confidence: 85, status: "active",     impact: "Fortalecimiento de bases conceptuales", dataAnalyzed: [{ metric: "Tiempo de resolución", value: "25% más lento" }, { metric: "Tasa de aciertos", value: "68%" }, { metric: "Ejercicios completados", value: "12 de 20" }, { metric: "Conceptos débiles", value: "Distribuciones (3)" }, { metric: "Recomendación", value: "5 ejercicios graduales" }], outcome: "Ejercicios asignados - En progreso (2/5)" },
  { id: 7, timestamp: "2026-03-31 16:45", type: "Alerta de Riesgo",       student: "Pedro Martínez", decision: "Riesgo de abandono detectado - Intervención inmediata", reasoning: "Patrones preocupantes: 3 sesiones canceladas en 2 semanas, sin login en los últimos 5 días.", confidence: 87, status: "validated",   impact: "Prevención de deserción estudiantil", dataAnalyzed: [{ metric: "Sesiones canceladas", value: "3 (2 semanas)" }, { metric: "Tiempo de estudio", value: "-40% vs promedio" }, { metric: "Último login", value: "Hace 5 días" }, { metric: "Engagement score", value: "23/100 (crítico)" }, { metric: "Probabilidad abandono", value: "78%" }], outcome: "Coordinador contactó al estudiante" },
  { id: 8, timestamp: "2026-03-31 14:20", type: "Optimización de Ruta",   student: "Sofía Ramírez",  decision: "Reordenación de módulos: Estadística antes que Probabilidad Avanzada", reasoning: "El perfil de la estudiante muestra mayor afinidad con aplicaciones prácticas.", confidence: 83, status: "active",     impact: "Mejor comprensión y retención de conceptos", dataAnalyzed: [{ metric: "Perfil de aprendizaje", value: "Práctico (82%)" }, { metric: "Rendimiento en teoría", value: "72%" }, { metric: "Rendimiento en práctica", value: "89%" }, { metric: "Casos similares", value: "523 estudiantes" }, { metric: "Tasa de éxito esperada", value: "+24% comprensión" }], outcome: "Ruta reordenada - Cambio aplicado" },
];

const statusConfig = {
  active:     { label: "Activa",    bg: "bg-[#6366F1]/8",  text: "text-[#6366F1]",   border: "border-[#6366F1]/20", dot: "bg-[#6366F1]",   icon: CheckCircle2 },
  overridden: { label: "Anulada",   bg: "bg-red-50",        text: "text-red-600",      border: "border-red-200",      dot: "bg-red-400",     icon: XCircle },
  validated:  { label: "Validada",  bg: "bg-emerald-50",    text: "text-emerald-700",  border: "border-emerald-200",  dot: "bg-emerald-400", icon: CheckCircle2 },
};

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  "Asignación de Tutor":    { bg: "bg-[#6366F1]/8",  text: "text-[#6366F1]",   border: "border-[#6366F1]/20" },
  "Ruta de Aprendizaje":    { bg: "bg-teal-50",       text: "text-teal-700",     border: "border-teal-200" },
  "Intervención Académica": { bg: "bg-amber-50",      text: "text-amber-700",    border: "border-amber-200" },
  "Nivel Estimado":         { bg: "bg-emerald-50",    text: "text-emerald-700",  border: "border-emerald-200" },
  "Recomendación":          { bg: "bg-yellow-50",     text: "text-yellow-700",   border: "border-yellow-200" },
  "Alerta de Riesgo":       { bg: "bg-red-50",        text: "text-red-600",      border: "border-red-200" },
  "Optimización de Ruta":   { bg: "bg-slate-100",     text: "text-slate-600",    border: "border-slate-200" },
};

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 93 ? "bg-emerald-400" : value >= 85 ? "bg-[#6366F1]" : "bg-amber-400";
  const textColor = value >= 93 ? "text-emerald-600" : value >= 85 ? "text-[#6366F1]" : "text-amber-600";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%`, animation: "bar-grow 0.8s ease-out" }} />
      </div>
      <span className={`text-xs font-bold tabular-nums ${textColor}`}>{value}%</span>
    </div>
  );
}

type TabValue = "all" | "active" | "validated" | "overridden";

export function AISupervision() {
  const [selectedDecision, setSelectedDecision] = useState<AIDecision | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const counts = {
    all: aiDecisions.length,
    active: aiDecisions.filter(d => d.status === "active").length,
    validated: aiDecisions.filter(d => d.status === "validated").length,
    overridden: aiDecisions.filter(d => d.status === "overridden").length,
  };

  const filtered = activeTab === "all" ? aiDecisions : aiDecisions.filter(d => d.status === activeTab);

  const handleValidate = (_id: number) => toast.success("Decisión validada correctamente");
  const handleOverride = (_id: number) => toast.success("Decisión anulada. Se notificó al sistema.");

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#6366F1]/8 rounded-full blur-[120px]" style={{ animation: "float-c 8s ease-in-out infinite" }} />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-[#14B8A6]/5 rounded-full blur-[100px]" style={{ animation: "float-a 12s ease-in-out infinite" }} />
        <div className="absolute top-1/2 right-10 w-56 h-56 bg-[#6366F1]/5 rounded-full blur-[80px]" style={{ animation: "float-b 10s ease-in-out infinite" }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #6366F1 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Administración</p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Historial de IA</h1>
          <AIBadge />
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }} />
            <span className="text-xs font-semibold text-emerald-700">En vivo</span>
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-1">Monitorea y supervisa todas las decisiones automatizadas del sistema inteligente</p>
      </div>

      {/* Metrics */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        {/* Hero metrics card */}
        <div className="col-span-2 bg-[#0C0E16] rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#6366F1]/20 cursor-default">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/12 rounded-full blur-3xl" />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-[#6366F1]/6 to-transparent" style={{ animation: "scan-line 4s ease-in-out infinite" }} />
            </div>
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.6) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-[#6366F1]/20 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#818CF8]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Motor IA</p>
                <p className="text-slate-500 text-xs">EduMatch Intelligence v3.2</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-4xl font-bold text-white tabular-nums tracking-tight">342</p>
                <p className="text-slate-400 text-xs mt-1">Decisiones totales</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#818CF8] tabular-nums tracking-tight">89%</p>
                <p className="text-slate-400 text-xs mt-1">Precisión promedio</p>
              </div>
            </div>
          </div>
        </div>

        {[
          { label: "Validadas",  value: 156, sub: "45% del total",  icon: CheckCircle2, iconBg: "bg-emerald-50",  iconColor: "text-emerald-500" },
          { label: "Anuladas",   value: 12,  sub: "3.5% del total", icon: XCircle,      iconBg: "bg-red-50",      iconColor: "text-red-400" },
          { label: "Latencia",   value: "0.3s", sub: "promedio IA",  icon: Zap,          iconBg: "bg-amber-50",    iconColor: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#6366F1]/8 cursor-default">
            <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <p className="text-4xl font-bold text-slate-800 tabular-nums tracking-tight">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">{s.label}</p>
            <p className="text-xs text-slate-300 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Decisions list */}
      <div className="relative z-10 space-y-4">
        {/* Tab strip */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 bg-slate-100/80 rounded-xl p-1 border border-slate-200/60">
            {(["all", "active", "validated", "overridden"] as TabValue[]).map((tab) => {
              const labels: Record<TabValue, string> = { all: "Todas", active: "Activas", validated: "Validadas", overridden: "Anuladas" };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    activeTab === tab
                      ? "bg-white text-[#6366F1] shadow-sm border border-slate-200/70"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {labels[tab]} ({counts[tab]})
                </button>
              );
            })}
          </div>
          <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-600 text-xs h-8">
            <Filter className="w-3 h-3 mr-1.5" />
            Filtros
          </Button>
        </div>

        {filtered.map((decision, idx) => {
          const cfg = statusConfig[decision.status];
          const typeCfg = typeColors[decision.type] ?? { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" };
          const StatusIcon = cfg.icon;
          return (
            <div
              key={decision.id}
              className="bg-white border border-slate-200/70 rounded-2xl p-5 hover:shadow-lg hover:shadow-[#6366F1]/6 hover:-translate-y-0.5 transition-all duration-200"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${typeCfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 border ${typeCfg.border}`}>
                  <Sparkles className={`w-4 h-4 ${typeCfg.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${typeCfg.bg} ${typeCfg.text} ${typeCfg.border}`}>
                      {decision.type}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <StatusIcon className="w-3 h-3" /> {cfg.label}
                    </span>
                    <span className="text-xs text-slate-400 tabular-nums ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {decision.timestamp}
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm mb-0.5">{decision.decision}</p>
                  <p className="text-xs text-slate-400 mb-3">{decision.student}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-400 mb-1">Confianza IA</p>
                      <ConfidenceBar value={decision.confidence} />
                    </div>
                    <button
                      onClick={() => setSelectedDecision(decision)}
                      className="flex-shrink-0 flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#4F46E5] font-semibold transition-colors"
                    >
                      Ver detalle <FileText className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Detail Dialog */}
      {selectedDecision && (
        <Dialog open={!!selectedDecision} onOpenChange={() => setSelectedDecision(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#6366F1]" />
                Análisis detallado — Decisión IA
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-sm">
                ID #{selectedDecision.id} · {selectedDecision.timestamp}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Type + Status */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Tipo de decisión", content: <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${(typeColors[selectedDecision.type] ?? { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" }).bg} ${(typeColors[selectedDecision.type] ?? { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" }).text} ${(typeColors[selectedDecision.type] ?? { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" }).border}`}>{selectedDecision.type}</span> },
                  { label: "Estado", content: <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusConfig[selectedDecision.status].bg} ${statusConfig[selectedDecision.status].text} ${statusConfig[selectedDecision.status].border}`}>{statusConfig[selectedDecision.status].label}</span> },
                ].map((item) => (
                  <div key={item.label} className="bg-[#F8F9FC] border border-slate-200/60 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-1.5">{item.label}</p>
                    {item.content}
                  </div>
                ))}
              </div>

              {/* Student */}
              <div className="bg-[#6366F1]/5 border border-[#6366F1]/15 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#6366F1]" />
                  <p className="text-xs font-semibold text-[#6366F1]">Estudiante afectado</p>
                </div>
                <p className="text-lg font-bold text-slate-800">{selectedDecision.student}</p>
              </div>

              {/* Decision */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs font-semibold text-emerald-700">Decisión tomada</p>
                </div>
                <p className="text-sm font-semibold text-slate-800">{selectedDecision.decision}</p>
              </div>

              {/* Reasoning */}
              <div className="bg-[#F8F9FC] border border-slate-200/60 rounded-xl p-4">
                <div className="flex items-start gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#6366F1] mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-semibold text-[#6366F1]">Razonamiento del sistema IA</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedDecision.reasoning}</p>
              </div>

              {/* Data analyzed */}
              {selectedDecision.dataAnalyzed && selectedDecision.dataAnalyzed.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-600">Datos analizados por la IA</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDecision.dataAnalyzed.map((data, idx) => (
                      <div key={idx} className="bg-[#F8F9FC] border border-slate-200/60 rounded-xl p-3">
                        <p className="text-xs text-slate-400 mb-0.5">{data.metric}</p>
                        <p className="text-sm font-semibold text-slate-800">{data.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confidence */}
              <div className="bg-[#F8F9FC] border border-slate-200/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-600">Nivel de confianza de la IA</p>
                  <span className="text-2xl font-bold text-slate-800 tabular-nums">{selectedDecision.confidence}%</span>
                </div>
                <ConfidenceBar value={selectedDecision.confidence} />
              </div>

              {/* Impact */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-amber-600" />
                  <p className="text-xs font-semibold text-amber-700">Impacto esperado</p>
                </div>
                <p className="text-sm font-semibold text-slate-800">{selectedDecision.impact}</p>
              </div>

              {/* Outcome */}
              {selectedDecision.outcome && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-teal-600" />
                    <p className="text-xs font-semibold text-teal-700">Resultado</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{selectedDecision.outcome}</p>
                </div>
              )}

              {/* Actions */}
              {selectedDecision.status === "active" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm"
                    onClick={() => handleValidate(selectedDecision.id)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Validar decisión
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 h-10 text-red-600 border-red-200 hover:bg-red-50 rounded-xl font-semibold text-sm">
                        <XCircle className="w-4 h-4 mr-2" />
                        Anular (Override)
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>Anular decisión de IA</DialogTitle>
                        <DialogDescription>Proporciona una justificación. Esta información mejora el modelo.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div>
                          <Label htmlFor="reason" className="text-sm font-semibold text-slate-700">Razón del override</Label>
                          <Textarea id="reason" placeholder="El estudiante solicitó específicamente otro tutor..." rows={4} className="mt-2 rounded-xl" />
                        </div>
                        <Button className="w-full h-10 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold" onClick={() => handleOverride(selectedDecision.id)}>
                          Confirmar anulación
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {selectedDecision.status === "validated" && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-sm font-medium text-emerald-800">Decisión validada por un administrador</p>
                </div>
              )}
              {selectedDecision.status === "overridden" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-800">Decisión anulada manualmente por un administrador</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
