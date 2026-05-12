import { useState } from "react";
import { BookOpen, Plus, Edit, Trash2, ChevronDown, ChevronRight, Users, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

interface Topic  { id: number; name: string; description: string; estimatedHours: number; difficulty: string; }
interface Subject { id: number; name: string; category: string; description: string; totalTopics: number; enrolledStudents: number; topics: Topic[]; }

const subjects: Subject[] = [
  { id: 1, name: "Matemáticas Avanzadas", category: "Matemáticas", description: "Curso completo de matemáticas nivel universitario", totalTopics: 15, enrolledStudents: 234,
    topics: [
      { id: 1, name: "Álgebra Lineal", description: "Vectores, matrices y sistemas lineales", estimatedHours: 12, difficulty: "Intermedio" },
      { id: 2, name: "Cálculo Diferencial", description: "Límites, derivadas y aplicaciones", estimatedHours: 15, difficulty: "Intermedio" },
      { id: 3, name: "Cálculo Integral", description: "Integrales y técnicas de integración", estimatedHours: 15, difficulty: "Avanzado" },
      { id: 4, name: "Ecuaciones Diferenciales", description: "EDO y aplicaciones", estimatedHours: 18, difficulty: "Avanzado" },
    ]},
  { id: 2, name: "Física General", category: "Física", description: "Fundamentos de física clásica y moderna", totalTopics: 12, enrolledStudents: 189,
    topics: [
      { id: 5, name: "Mecánica Clásica", description: "Cinemática y dinámica", estimatedHours: 14, difficulty: "Intermedio" },
      { id: 6, name: "Termodinámica", description: "Leyes de la termodinámica", estimatedHours: 10, difficulty: "Intermedio" },
      { id: 7, name: "Electromagnetismo", description: "Campos eléctricos y magnéticos", estimatedHours: 16, difficulty: "Avanzado" },
    ]},
  { id: 3, name: "Probabilidad y Estadística", category: "Matemáticas", description: "Teoría de probabilidad y estadística aplicada", totalTopics: 10, enrolledStudents: 156,
    topics: [
      { id: 8, name: "Probabilidad Básica", description: "Eventos, espacios muestrales", estimatedHours: 8, difficulty: "Principiante" },
      { id: 9, name: "Distribuciones", description: "Distribuciones discretas y continuas", estimatedHours: 12, difficulty: "Intermedio" },
      { id: 10, name: "Estadística Inferencial", description: "Estimación e hipótesis", estimatedHours: 14, difficulty: "Avanzado" },
    ]},
  { id: 4, name: "Programación en Python", category: "Programación", description: "Fundamentos y aplicaciones de Python", totalTopics: 20, enrolledStudents: 312,
    topics: [
      { id: 11, name: "Sintaxis Básica", description: "Variables, tipos de datos, control de flujo", estimatedHours: 10, difficulty: "Principiante" },
      { id: 12, name: "POO en Python", description: "Clases, objetos y herencia", estimatedHours: 12, difficulty: "Intermedio" },
      { id: 13, name: "Análisis de Datos", description: "Pandas y NumPy", estimatedHours: 15, difficulty: "Intermedio" },
    ]},
];

const difficultyConfig: Record<string, { bg: string; text: string; border: string }> = {
  Principiante: { bg: "bg-emerald-50",    text: "text-emerald-700", border: "border-emerald-200" },
  Intermedio:   { bg: "bg-[#6366F1]/8",   text: "text-[#6366F1]",  border: "border-[#6366F1]/20" },
  Avanzado:     { bg: "bg-slate-100",     text: "text-slate-600",  border: "border-slate-200" },
};

const categoryColors: Record<string, string> = {
  Matemáticas:  "bg-[#6366F1]/8 text-[#6366F1] border-[#6366F1]/20",
  Física:       "bg-amber-50 text-amber-700 border-amber-200",
  Programación: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function SubjectsManagement() {
  const [openSubjects, setOpenSubjects] = useState<number[]>([1]);

  const toggle = (id: number) => setOpenSubjects(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const totalTopics    = subjects.reduce((a, s) => a + s.topics.length, 0);
  const totalStudents  = subjects.reduce((a, s) => a + s.enrolledStudents, 0);
  const totalHours     = subjects.reduce((a, s) => a + s.topics.reduce((b, t) => b + t.estimatedHours, 0), 0);

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-72 bg-[#6366F1]/5 rounded-full blur-[100px]" style={{ animation: "float-a 11s ease-in-out infinite" }} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-amber-400/4 rounded-full blur-[80px]"  style={{ animation: "float-c 8s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Administración</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Materias y temas</h1>
        <p className="text-slate-400 text-sm mt-1">Gestiona el catálogo de materias y contenidos</p>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        {[
          { label: "Total materias",    value: subjects.length, icon: BookOpen, iconBg: "bg-[#6366F1]/10", iconColor: "text-[#6366F1]" },
          { label: "Total temas",       value: totalTopics,     icon: BookOpen, iconBg: "bg-amber-50",      iconColor: "text-amber-500" },
          { label: "Estudiantes",       value: totalStudents,   icon: Users,    iconBg: "bg-emerald-50",    iconColor: "text-emerald-500" },
          { label: "Horas de contenido", value: totalHours,     icon: Clock,    iconBg: "bg-slate-100",     iconColor: "text-slate-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#6366F1]/8 cursor-default">
            <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <p className="text-4xl font-bold text-slate-800 tabular-nums tracking-tight">{s.value.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Action */}
      <div className="relative z-10 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-9 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-medium transition-all active:scale-[0.98] shadow-sm shadow-[#6366F1]/20">
              <Plus className="w-4 h-4 mr-1.5" /> Agregar materia
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader><DialogTitle>Agregar nueva materia</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div><Label>Nombre de la materia</Label><Input placeholder="Ej: Cálculo Vectorial" className="mt-1.5 rounded-xl" /></div>
              <div><Label>Categoría</Label><Input placeholder="Ej: Matemáticas" className="mt-1.5 rounded-xl" /></div>
              <div><Label>Descripción</Label><Textarea placeholder="Breve descripción..." rows={3} className="mt-1.5 rounded-xl resize-none" /></div>
              <Button className="w-full bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl">Guardar materia</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subject cards */}
      <div className="relative z-10 space-y-3">
        {subjects.map((subject) => {
          const isOpen = openSubjects.includes(subject.id);
          const catColor = categoryColors[subject.category] ?? "bg-slate-100 text-slate-600 border-slate-200";
          return (
            <div key={subject.id} className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#6366F1]/6">
              {/* Header row */}
              <div className="flex items-center gap-4 px-6 py-5">
                <button onClick={() => toggle(subject.id)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center flex-shrink-0 transition-colors">
                  {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </button>
                <div className="flex-1 cursor-pointer" onClick={() => toggle(subject.id)}>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-base font-bold text-slate-800">{subject.name}</h3>
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${catColor}`}>{subject.category}</span>
                  </div>
                  <p className="text-sm text-slate-400">{subject.description}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><BookOpen className="w-3 h-3" />{subject.totalTopics} temas</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" />{subject.enrolledStudents} estudiantes</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs border-slate-200 hover:border-[#6366F1] hover:text-[#6366F1]">
                        <Plus className="w-3 h-3 mr-1" /> Agregar tema
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                      <DialogHeader><DialogTitle>Agregar tema a {subject.name}</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div><Label>Nombre del tema</Label><Input placeholder="Ej: Transformaciones Lineales" className="mt-1.5 rounded-xl" /></div>
                        <div><Label>Descripción</Label><Textarea rows={2} className="mt-1.5 rounded-xl resize-none" /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><Label>Horas estimadas</Label><Input type="number" placeholder="10" className="mt-1.5 rounded-xl" /></div>
                          <div><Label>Dificultad</Label><Input placeholder="Intermedio" className="mt-1.5 rounded-xl" /></div>
                        </div>
                        <Button className="w-full bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl">Guardar tema</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100"><Edit className="w-4 h-4 text-slate-400" /></Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></Button>
                </div>
              </div>

              {/* Topics */}
              {isOpen && (
                <div className="border-t border-slate-100 px-6 py-4">
                  <div className="space-y-2">
                    {subject.topics.map((topic) => {
                      const dc = difficultyConfig[topic.difficulty] ?? difficultyConfig.Intermedio;
                      return (
                        <div key={topic.id} className="flex items-center gap-4 p-4 bg-[#F8F9FC] rounded-xl border border-slate-200/60 hover:border-[#6366F1]/20 hover:bg-[#6366F1]/[0.02] transition-all group">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 text-sm">{topic.name}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">{topic.description}</p>
                            <div className="flex items-center gap-2.5 mt-2">
                              <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${dc.bg} ${dc.text} ${dc.border}`}>{topic.difficulty}</span>
                              <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{topic.estimatedHours} horas</span>
                            </div>
                          </div>
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:bg-white"><Edit className="w-3.5 h-3.5 text-slate-400" /></Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
