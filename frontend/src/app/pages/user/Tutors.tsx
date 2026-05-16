import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Star, Sparkles, Clock, BookOpen, Search, X,
  Calendar, ChevronRight, Award, CheckCircle2, Video,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import {
  getTutores, getTutorMaterias, getTutorDisponibilidad, crearSesion,
} from "../../../api/estudiante";
import { toast } from "sonner";

interface TutorUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Tutor {
  id: string;
  user: TutorUser;
  biography: string;
  experienceYears: number;
  hourlyRate: number | string;
  rating: number | string;
  isAvailable: boolean;
}

interface TutorSubject {
  id: string;
  subject: { id: string; name: string };
}

interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const DAYS_ES: Record<string, string> = {
  MONDAY: "Lunes", TUESDAY: "Martes", WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves", FRIDAY: "Viernes", SATURDAY: "Sábado", SUNDAY: "Domingo",
};

const MOCK_TUTORS: Tutor[] = [
  { id: "1", user: { id: "u1", firstName: "María", lastName: "González", email: "maria@edumatch.com" }, biography: "Experta en Matemáticas Avanzadas con 8 años de experiencia universitaria. Metodología visual y estructurada.", experienceYears: 8, hourlyRate: 25, rating: 4.9, isAvailable: true },
  { id: "2", user: { id: "u2", firstName: "Carlos", lastName: "Ramírez", email: "carlos@edumatch.com" }, biography: "Físico computacional con PhD. Especialista en modelos matemáticos y simulación numérica.", experienceYears: 12, hourlyRate: 30, rating: 4.8, isAvailable: true },
  { id: "3", user: { id: "u3", firstName: "Jorge", lastName: "López", email: "jorge@edumatch.com" }, biography: "Maestría en Álgebra Lineal. Metodología basada en intuición geométrica y resolución de problemas.", experienceYears: 6, hourlyRate: 32, rating: 4.9, isAvailable: true },
  { id: "4", user: { id: "u4", firstName: "Ana", lastName: "Martínez", email: "ana@edumatch.com" }, biography: "Estadística aplicada, análisis de datos y aprendizaje automático. Proyectos con Python y R.", experienceYears: 5, hourlyRate: 28, rating: 4.7, isAvailable: true },
  { id: "5", user: { id: "u5", firstName: "Laura", lastName: "Fernández", email: "laura@edumatch.com" }, biography: "Cálculo Integral y Diferencial. Enfoque en comprensión conceptual y resolución paso a paso.", experienceYears: 4, hourlyRate: 24, rating: 4.6, isAvailable: true },
  { id: "6", user: { id: "u6", firstName: "Roberto", lastName: "Sánchez", email: "roberto@edumatch.com" }, biography: "Matemáticas Aplicadas e Ingeniería. Docente universitario activo con enfoque en aplicaciones reales.", experienceYears: 10, hourlyRate: 29, rating: 4.8, isAvailable: false },
];

function TutorAvatar({ tutor, size = "lg" }: { tutor: Tutor; size?: "sm" | "lg" }) {
  const name = `${tutor.user?.firstName ?? ""} ${tutor.user?.lastName ?? ""}`.trim();
  const chars = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "T";
  const cls = size === "lg" ? "w-16 h-16 text-xl" : "w-10 h-10 text-sm";
  return (
    <div className={`${cls} rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]`}>
      {chars}
    </div>
  );
}

function StarRow({ rating }: { rating: number | string }) {
  const r = Number(rating) || 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3 h-3 ${i <= Math.round(r) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
      ))}
      <span className="text-xs font-bold text-slate-700 ml-1 tabular-nums">{r.toFixed(1)}</span>
    </div>
  );
}

function BookingDialog({
  open, onClose, tutor, materias, disponibilidad,
}: {
  open: boolean;
  onClose: () => void;
  tutor: Tutor | null;
  materias: TutorSubject[];
  disponibilidad: AvailabilitySlot[];
}) {
  const [subjectId, setSubjectId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedSlot = disponibilidad.find((s) => s.id === slotId);

  const handleSubmit = async () => {
    if (!subjectId || !slotId || !sessionDate || !tutor || !selectedSlot) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    setSubmitting(true);
    try {
      await crearSesion({
        tutorId: tutor.id,
        subjectId,
        availabilitySlotId: slotId,
        sessionDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes: notes || undefined,
      });
      toast.success("Sesión agendada exitosamente");
      onClose();
      setSubjectId(""); setSlotId(""); setSessionDate(""); setNotes("");
    } catch {
      toast.error("No se pudo agendar la sesión. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800">Agendar sesión</DialogTitle>
        </DialogHeader>
        {tutor && (
          <div className="flex items-center gap-3 p-3 bg-[#F8F9FC] rounded-xl border border-slate-200/60 mb-2">
            <TutorAvatar tutor={tutor} size="sm" />
            <div>
              <p className="font-semibold text-slate-800 text-sm">{tutor.user?.firstName} {tutor.user?.lastName}</p>
              <p className="text-xs text-slate-400">${Number(tutor.hourlyRate).toFixed(0)}/hora</p>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Materia</label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-[#F8F9FC] text-sm">
                <SelectValue placeholder="Selecciona una materia" />
              </SelectTrigger>
              <SelectContent>
                {materias.length === 0 ? (
                  <SelectItem value="none" disabled>Sin materias disponibles</SelectItem>
                ) : (
                  materias.map((m) => (
                    <SelectItem key={m.id} value={m.subject.id}>{m.subject.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Fecha de la sesión</label>
            <Input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-10 rounded-xl border-slate-200 bg-[#F8F9FC] text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Horario disponible</label>
            {disponibilidad.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center bg-[#F8F9FC] rounded-xl border border-slate-200 p-4">
                Este tutor aún no tiene horarios registrados
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {disponibilidad.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSlotId(slot.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-150 ${
                      slotId === slot.id
                        ? "border-[#6366F1] bg-[#6366F1]/8 text-[#6366F1]"
                        : "border-slate-200 bg-[#F8F9FC] text-slate-600 hover:border-[#6366F1]/40 hover:bg-[#6366F1]/4"
                    }`}
                  >
                    <p className="text-xs font-semibold">{DAYS_ES[slot.day] || slot.day}</p>
                    <p className="text-[11px] mt-0.5 opacity-80">{slot.startTime} — {slot.endTime}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Notas (opcional)</label>
            <textarea
              rows={3}
              placeholder="Describe qué necesitas trabajar en esta sesión..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 bg-[#F8F9FC] border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
            />
          </div>

          <Button
            className="w-full h-11 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] shadow-sm shadow-[#6366F1]/20"
            onClick={handleSubmit}
            disabled={submitting || materias.length === 0 || disponibilidad.length === 0}
          >
            {submitting ? "Agendando..." : "Confirmar sesión"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Tutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [materias, setMaterias] = useState<TutorSubject[]>([]);
  const [disponibilidad, setDisponibilidad] = useState<AvailabilitySlot[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    getTutores()
      .then(setTutors)
      .catch(() => setTutors(MOCK_TUTORS))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectTutor = async (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setSheetOpen(true);
    setLoadingDetail(true);
    setMaterias([]);
    setDisponibilidad([]);
    try {
      const [mat, disp] = await Promise.all([
        getTutorMaterias(tutor.id),
        getTutorDisponibilidad(tutor.id),
      ]);
      setMaterias(Array.isArray(mat) ? mat : []);
      setDisponibilidad(Array.isArray(disp) ? disp.filter((s: AvailabilitySlot) => s.isActive) : []);
    } catch {
      // keep empty arrays — detail will show "no data" states
    } finally {
      setLoadingDetail(false);
    }
  };

  const displayList = (tutors.length > 0 ? tutors : MOCK_TUTORS).filter((t) => {
    if (!search) return true;
    const name = `${t.user?.firstName ?? ""} ${t.user?.lastName ?? ""}`.toLowerCase();
    return name.includes(search.toLowerCase()) || t.biography?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="relative min-h-full p-8 space-y-8 overflow-x-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[340px] bg-[#6366F1]/6 rounded-full blur-[120px]" style={{ animation: "float-c 9s ease-in-out infinite" }} />
        <div className="absolute bottom-24 right-12 w-80 h-80 bg-violet-400/5 rounded-full blur-[90px]" style={{ animation: "float-a 12s ease-in-out infinite" }} />
        <div className="absolute top-1/3 left-6 w-52 h-52 bg-emerald-400/4 rounded-full blur-[70px]" style={{ animation: "float-b 14s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Tutores</h1>
        <p className="text-slate-400 text-sm mt-1">Explora, conecta y agenda sesiones con los mejores tutores</p>
      </div>

      {/* AI recommendation strip */}
      <div className="relative z-10 bg-[#0C0E16] rounded-2xl p-5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-56 h-56 bg-[#6366F1]/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 right-0 h-6 bg-gradient-to-b from-transparent via-[#6366F1]/5 to-transparent" style={{ animation: "scan-line 5s ease-in-out infinite" }} />
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6366F1]/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#818CF8]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">EduMatch AI seleccionó los mejores tutores para ti</p>
            <p className="text-slate-400 text-xs mt-0.5">Basado en tu estilo de aprendizaje, nivel y objetivos académicos</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-full px-3 py-1 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }} />
            <span className="text-xs font-semibold text-emerald-400">Análisis activo</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative z-10">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre o especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl border-slate-200 bg-white text-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-slate-200/70 rounded-2xl p-5 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-slate-100 rounded" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3].map((j) => <div key={j} className="h-14 bg-slate-100 rounded-xl" />)}
              </div>
              <div className="h-9 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Tutor bento grid — grid-flow-dense, 0 voids */}
      {!loading && displayList.length > 0 && (
        <div className="relative z-10 grid grid-cols-3 gap-4 grid-flow-dense">
          {displayList.map((tutor, idx) => {
            const name = `${tutor.user?.firstName ?? ""} ${tutor.user?.lastName ?? ""}`.trim();
            const isTop = idx < 3;
            return (
              <motion.div
                key={tutor.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: idx * 0.07, ease: [0.22, 0.61, 0.36, 1] }}
                onClick={() => handleSelectTutor(tutor)}
                className={`group bg-white rounded-2xl p-5 cursor-pointer border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isTop
                    ? "border-[#6366F1]/20 hover:border-[#6366F1]/40 hover:shadow-[#6366F1]/14"
                    : "border-slate-200/70 hover:border-slate-300 hover:shadow-slate-200/80"
                }`}
              >
                {/* Card header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative">
                    <TutorAvatar tutor={tutor} size="lg" />
                    {isTop && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                      </div>
                    )}
                    {tutor.isAvailable && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-[#6366F1] transition-colors duration-200">{name}</h3>
                    <div className="mt-1">
                      <StarRow rating={tutor.rating} />
                    </div>
                    {isTop && (
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#6366F1]/8 text-[#6366F1] border border-[#6366F1]/15">
                        <Sparkles className="w-2.5 h-2.5" /> IA Recomendado
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio excerpt */}
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-4">{tutor.biography}</p>

                {/* Stats mini-grid */}
                <div className="grid grid-cols-3 gap-1.5 mb-4">
                  <div className="text-center p-2 bg-[#F8F9FC] rounded-xl border border-slate-200/60">
                    <p className="text-sm font-bold text-slate-800 tabular-nums">${Number(tutor.hourlyRate).toFixed(0)}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">por hora</p>
                  </div>
                  <div className="text-center p-2 bg-[#F8F9FC] rounded-xl border border-slate-200/60">
                    <p className="text-sm font-bold text-slate-800 tabular-nums">{tutor.experienceYears}a</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">exp.</p>
                  </div>
                  <div className="text-center p-2 bg-[#F8F9FC] rounded-xl border border-slate-200/60 flex flex-col items-center justify-center">
                    <div
                      className={`w-2 h-2 rounded-full mb-1 ${tutor.isAvailable ? "bg-emerald-400" : "bg-slate-300"}`}
                      style={tutor.isAvailable ? { animation: "pulse-dot 2s ease-in-out infinite" } : {}}
                    />
                    <p className="text-[10px] text-slate-400">{tutor.isAvailable ? "Libre" : "Ocupado"}</p>
                  </div>
                </div>

                <Button
                  className={`w-full h-9 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.97] ${
                    isTop
                      ? "bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-sm shadow-[#6366F1]/20"
                      : "bg-slate-900 hover:bg-slate-700 text-white"
                  }`}
                  onClick={(e) => { e.stopPropagation(); handleSelectTutor(tutor); }}
                >
                  Ver perfil y agendar
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && displayList.length === 0 && (
        <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl p-12 text-center">
          <Search className="w-8 h-8 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 mb-1">Sin resultados para "{search}"</p>
          <p className="text-xs text-slate-400">Intenta con otro nombre o especialidad</p>
        </div>
      )}

      {/* Tutor detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full max-w-md overflow-y-auto">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-lg font-bold text-slate-800">Perfil del tutor</SheetTitle>
          </SheetHeader>

          {selectedTutor && (
            <div className="space-y-6">
              {/* Identity card */}
              <div className="flex items-start gap-4 p-4 bg-[#F8F9FC] rounded-2xl border border-slate-200/60">
                <TutorAvatar tutor={selectedTutor} size="lg" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-800 text-lg leading-tight">
                    {selectedTutor.user?.firstName} {selectedTutor.user?.lastName}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{selectedTutor.user?.email}</p>
                  <div className="mt-2">
                    <StarRow rating={selectedTutor.rating} />
                  </div>
                </div>
              </div>

              {/* Stat trio */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Award, label: "Experiencia", value: `${selectedTutor.experienceYears} años`, color: "text-[#6366F1]", bg: "bg-[#6366F1]/8" },
                  { icon: Clock, label: "Tarifa", value: `$${Number(selectedTutor.hourlyRate).toFixed(0)}/h`, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { icon: CheckCircle2, label: "Estado", value: selectedTutor.isAvailable ? "Disponible" : "No disp.", color: selectedTutor.isAvailable ? "text-emerald-600" : "text-slate-400", bg: selectedTutor.isAvailable ? "bg-emerald-50" : "bg-slate-100" },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                    <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1.5`} />
                    <p className="text-sm font-bold text-slate-800 leading-tight">{s.value}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Biography */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Sobre el tutor</p>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedTutor.biography}</p>
              </div>

              {/* Subjects */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Materias que enseña</p>
                {loadingDetail ? (
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3].map((i) => <div key={i} className="h-7 w-24 bg-slate-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : materias.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Sin materias registradas aún</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {materias.map((m) => (
                      <span key={m.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6366F1]/8 text-[#6366F1] rounded-xl text-xs font-semibold border border-[#6366F1]/15">
                        <BookOpen className="w-3 h-3" /> {m.subject.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Horarios disponibles</p>
                {loadingDetail ? (
                  <div className="space-y-2">
                    {[1, 2].map((i) => <div key={i} className="h-11 bg-slate-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : disponibilidad.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Sin horarios registrados aún</p>
                ) : (
                  <div className="space-y-2">
                    {disponibilidad.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between px-4 py-2.5 bg-[#F8F9FC] rounded-xl border border-slate-200/60">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />
                          <span className="text-sm font-semibold text-slate-700">{DAYS_ES[slot.day] || slot.day}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium tabular-nums">{slot.startTime} — {slot.endTime}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Book CTA */}
              <Button
                className="w-full h-12 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] shadow-md shadow-[#6366F1]/25 disabled:opacity-50"
                disabled={!selectedTutor.isAvailable || loadingDetail}
                onClick={() => { setSheetOpen(false); setBookingOpen(true); }}
              >
                <Video className="w-4 h-4 mr-2" />
                {selectedTutor.isAvailable ? "Agendar sesión" : "Tutor no disponible"}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Booking dialog */}
      <BookingDialog
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        tutor={selectedTutor}
        materias={materias}
        disponibilidad={disponibilidad}
      />
    </div>
  );
}
