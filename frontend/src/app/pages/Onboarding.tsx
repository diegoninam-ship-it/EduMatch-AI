import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Sparkles, Brain, ArrowRight, Check, Clock } from "lucide-react";
import { toast } from "sonner";

const availableSubjects = [
  "Matemáticas",
  "Física",
  "Química",
  "Programación",
  "Inglés",
  "Estadística",
  "Cálculo",
  "Álgebra",
];

const levelOptions = [
  { value: "basico", label: "Básico", description: "Empezando desde cero" },
  { value: "intermedio", label: "Intermedio", description: "Tengo conocimientos previos" },
  { value: "avanzado", label: "Avanzado", description: "Busco profundizar" },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subjects: [] as string[],
    level: "",
    goal: "",
    hoursPerWeek: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const toggleSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.includes(subject)
        ? formData.subjects.filter((s) => s !== subject)
        : [...formData.subjects, subject],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.subjects.length === 0) {
      toast.error("Selecciona al menos una materia de interés");
      return;
    }
    if (!formData.level) {
      toast.error("Selecciona tu nivel actual");
      return;
    }
    if (!formData.goal.trim()) {
      toast.error("Describe tu objetivo de aprendizaje");
      return;
    }

    setIsLoading(true);
    try {
      const { actualizarPerfil } = await import("../../api/estudiante");
      await actualizarPerfil({
        nivel: formData.level,
        objetivos: formData.goal,
        horasDisponibles: formData.hoursPerWeek,
        horarioPreferido: formData.subjects.join(", "),
      });
      toast.success("Ruta de aprendizaje generada por IA");
      navigate("/user");
    } catch (error: any) {
      toast.error("Error al guardar tu perfil. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#080B14] flex items-center justify-center p-6">
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#6366F1]/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#14B8A6]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-9 h-9 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366F1]/30">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">EduMatch AI</span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" />
            <span className="text-[#818CF8] text-xs font-medium">Configuración inicial</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Personaliza tu experiencia
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            La IA creará tu ruta de aprendizaje basada en tus preferencias y objetivos.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1020] border border-white/[0.06] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Subjects */}
            <div className="space-y-3">
              <Label className="text-white font-semibold text-sm">
                ¿Qué materias te interesan?
              </Label>
              <p className="text-slate-500 text-xs">Selecciona todas las que desees aprender</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {availableSubjects.map((subject) => {
                  const selected = formData.subjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => toggleSubject(subject)}
                      className={`
                        relative p-3.5 rounded-xl border text-sm font-medium transition-all duration-150
                        ${selected
                          ? "border-[#6366F1] bg-[#6366F1]/10 text-[#818CF8]"
                          : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/[0.15] hover:text-slate-200"
                        }
                      `}
                    >
                      {selected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#6366F1] rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      {subject}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level */}
            <div className="space-y-3">
              <Label className="text-white font-semibold text-sm">
                ¿Cuál es tu nivel actual?
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {levelOptions.map((option) => {
                  const selected = formData.level === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, level: option.value })}
                      className={`
                        p-4 rounded-xl border text-left transition-all duration-150
                        ${selected
                          ? "border-[#6366F1] bg-[#6366F1]/10"
                          : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-semibold text-sm ${selected ? "text-[#818CF8]" : "text-white"}`}>
                          {option.label}
                        </p>
                        {selected && (
                          <div className="w-4 h-4 bg-[#6366F1] rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Goal */}
            <div className="space-y-3">
              <Label htmlFor="goal" className="text-white font-semibold text-sm">
                ¿Cuál es tu objetivo de aprendizaje?
              </Label>
              <p className="text-slate-500 text-xs">
                Ejemplo: "Prepararme para un examen", "Mejorar en mi trabajo"
              </p>
              <Textarea
                id="goal"
                placeholder="Describe tu objetivo principal..."
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                required
                rows={3}
                className="resize-none bg-white/[0.05] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1]"
              />
            </div>

            {/* Hours per week — HU-05 */}
            <div className="space-y-3">
              <Label className="text-white font-semibold text-sm">
                ¿Cuántas horas por semana puedes dedicar?
              </Label>
              <p className="text-slate-500 text-xs">La IA ajustará el ritmo de tu ruta según tu disponibilidad</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {[
                  { value: "1-3",  label: "1 – 3 h",  desc: "Ritmo ligero"   },
                  { value: "4-6",  label: "4 – 6 h",  desc: "Ritmo moderado" },
                  { value: "7-10", label: "7 – 10 h", desc: "Ritmo intenso"  },
                  { value: "10+",  label: "10 h +",   desc: "Dedicación total"},
                ].map((opt) => {
                  const selected = formData.hoursPerWeek === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, hoursPerWeek: opt.value })}
                      className={`
                        relative p-3.5 rounded-xl border text-left transition-all duration-150
                        ${selected
                          ? "border-[#6366F1] bg-[#6366F1]/10"
                          : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Clock className={`w-3.5 h-3.5 ${selected ? "text-[#818CF8]" : "text-slate-500"}`} />
                        {selected && (
                          <div className="w-4 h-4 bg-[#6366F1] rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className={`font-semibold text-sm mt-1 ${selected ? "text-[#818CF8]" : "text-white"}`}>{opt.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI info box */}
            <div className="flex items-start gap-3 bg-[#6366F1]/8 border border-[#6366F1]/15 rounded-xl p-4">
              <Brain className="w-4 h-4 text-[#818CF8] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium mb-1.5">La IA usará esta información para:</p>
                <ul className="text-slate-400 text-xs space-y-1">
                  <li>→ Crear tu ruta de aprendizaje personalizada</li>
                  <li>→ Asignar los mejores tutores según tu perfil</li>
                  <li>→ Adaptar el contenido a tu nivel y objetivos</li>
                </ul>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#6366F1]/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generando tu ruta con IA...
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Comenzar mi aprendizaje
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-5">
          Podrás modificar estas preferencias más adelante en tu perfil
        </p>
      </div>
    </div>
  );
}
