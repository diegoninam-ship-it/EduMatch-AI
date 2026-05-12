import { Star, Sparkles, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";

const tutors = [
  { id: 1, name: "María González",  specialty: "Matemáticas Avanzadas",    rating: 4.9, hourlyRate: 25, aiRecommended: true,  sessions: 124 },
  { id: 2, name: "Carlos Ramírez",  specialty: "Física y Matemáticas",      rating: 4.8, hourlyRate: 30, aiRecommended: true,  sessions: 89 },
  { id: 3, name: "Jorge López",     specialty: "Álgebra Lineal",             rating: 4.9, hourlyRate: 32, aiRecommended: true,  sessions: 107 },
  { id: 4, name: "Ana Martínez",    specialty: "Estadística",                rating: 4.7, hourlyRate: 28, aiRecommended: false, sessions: 63 },
  { id: 5, name: "Laura Fernández", specialty: "Cálculo Integral",           rating: 4.6, hourlyRate: 24, aiRecommended: false, sessions: 51 },
  { id: 6, name: "Roberto Sánchez", specialty: "Matemáticas Aplicadas",      rating: 4.8, hourlyRate: 29, aiRecommended: false, sessions: 78 },
];

function Initials({ name, recommended }: { name: string; recommended: boolean }) {
  const chars = name.split(" ").map(n => n[0]).join("").slice(0, 2);
  return (
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${recommended ? "bg-[#6366F1]" : "bg-slate-300"}`}>
      {chars}
    </div>
  );
}

export function Tutors() {
  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[280px] bg-[#6366F1]/6 rounded-full blur-[100px]" style={{ animation: "float-c 9s ease-in-out infinite" }} />
        <div className="absolute bottom-10 right-8 w-64 h-64 bg-emerald-400/4 rounded-full blur-[80px]" style={{ animation: "float-a 12s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Estudiante</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Tutores</h1>
        <p className="text-slate-400 text-sm mt-1">Encuentra y agenda sesiones con tutores</p>
      </div>

      {/* AI recommendation strip */}
      <div className="relative z-10 bg-[#0C0E16] rounded-2xl p-5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#6366F1]/8 rounded-full blur-3xl" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 right-0 h-6 bg-gradient-to-b from-transparent via-[#6366F1]/4 to-transparent" style={{ animation: "scan-line 5s ease-in-out infinite" }} />
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#6366F1]/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#818CF8]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">IA recomendó 3 tutores para ti</p>
            <p className="text-slate-500 text-xs">Basado en tu estilo de aprendizaje visual y nivel intermedio en Matemáticas</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-full px-3 py-1 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }} />
            <span className="text-xs font-semibold text-emerald-400">98% match</span>
          </div>
        </div>
      </div>

      {/* Tutors grid */}
      <div className="relative z-10 grid grid-cols-3 gap-4">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            className={`bg-white rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-default border ${
              tutor.aiRecommended
                ? "border-[#6366F1]/25 hover:shadow-[#6366F1]/12"
                : "border-slate-200/70 hover:shadow-slate-200/60"
            }`}
          >
            {/* Top */}
            <div className="flex items-start gap-3 mb-4">
              <Initials name={tutor.name} recommended={tutor.aiRecommended} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm leading-tight">{tutor.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{tutor.specialty}</p>
                {tutor.aiRecommended && (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold bg-[#6366F1]/8 text-[#6366F1] border border-[#6366F1]/20">
                    <Sparkles className="w-3 h-3" /> Recomendado IA
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-[#F8F9FC] rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-center gap-0.5 mb-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <p className="text-sm font-bold text-slate-800 tabular-nums">{tutor.rating}</p>
                </div>
                <p className="text-xs text-slate-400">Rating</p>
              </div>
              <div className="text-center p-2 bg-[#F8F9FC] rounded-xl border border-slate-200/60">
                <p className="text-sm font-bold text-slate-800 tabular-nums">{tutor.sessions}</p>
                <p className="text-xs text-slate-400">Sesiones</p>
              </div>
              <div className="text-center p-2 bg-[#F8F9FC] rounded-xl border border-slate-200/60">
                <p className="text-sm font-bold text-slate-800 tabular-nums">${tutor.hourlyRate}</p>
                <p className="text-xs text-slate-400">por hora</p>
              </div>
            </div>

            <Button
              className={`w-full h-9 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.97] ${
                tutor.aiRecommended
                  ? "bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                  : "bg-slate-900 hover:bg-slate-700 text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Agendar sesión
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
