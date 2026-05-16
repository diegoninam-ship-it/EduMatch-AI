import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { BookOpen, Plus, Edit, Trash2, ChevronDown, ChevronRight, Users, Clock, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  getMateriasAdmin, crearMateria, actualizarMateria, eliminarMateria,
  getModulosAdmin, crearModulo, actualizarModulo, eliminarModulo,
} from "../../../api/admin";
import { toast } from "sonner";

interface Tema    { id: number | string; title: string; description: string; order: number; }
interface Subject { id: number | string; name: string; description: string; is_active: boolean; }

const MOCK_SUBJECTS: Subject[] = [
  { id: 1, name: "Matemáticas Avanzadas",     description: "Curso completo de matemáticas nivel universitario", is_active: true  },
  { id: 2, name: "Física General",             description: "Fundamentos de física clásica y moderna",           is_active: true  },
  { id: 3, name: "Probabilidad y Estadística", description: "Teoría de probabilidad y estadística aplicada",      is_active: true  },
  { id: 4, name: "Programación en Python",     description: "Fundamentos y aplicaciones de Python",              is_active: false },
];

const MOCK_MODULES: Record<number | string, Tema[]> = {
  1: [
    { id: 1, title: "Álgebra Lineal",          description: "Vectores, matrices y sistemas lineales",        order: 1 },
    { id: 2, title: "Cálculo Diferencial",      description: "Límites, derivadas y aplicaciones",            order: 2 },
    { id: 3, title: "Cálculo Integral",         description: "Integrales y técnicas de integración",         order: 3 },
  ],
  2: [
    { id: 4, title: "Mecánica Clásica",         description: "Cinemática y dinámica",                        order: 1 },
    { id: 5, title: "Termodinámica",            description: "Leyes de la termodinámica",                    order: 2 },
  ],
  3: [
    { id: 6, title: "Probabilidad Básica",      description: "Eventos, espacios muestrales",                 order: 1 },
    { id: 7, title: "Distribuciones",           description: "Distribuciones discretas y continuas",         order: 2 },
  ],
  4: [
    { id: 8, title: "Sintaxis Básica",          description: "Variables, tipos de datos, control de flujo",  order: 1 },
    { id: 9, title: "POO en Python",            description: "Clases, objetos y herencia",                   order: 2 },
  ],
};

function mapSubject(s: any): Subject {
  return { id: s.id, name: s.name ?? "—", description: s.description ?? "—", is_active: s.is_active ?? true };
}

function mapModulo(m: any): Tema {
  return { id: m.id, title: m.title ?? "—", description: m.description ?? "—", order: m.order ?? 0 };
}

function parseApiError(err: unknown): string {
  try {
    const parsed = JSON.parse((err as Error).message);
    const vals = Object.values(parsed).flat() as string[];
    if (vals.length) return vals.join(". ");
  } catch {}
  return "Ocurrió un error inesperado";
}

const EMPTY_MATERIA = { name: "", description: "" };
const EMPTY_TEMA    = { title: "", description: "" };

export function SubjectsManagement() {
  const [subjects,         setSubjects]         = useState<Subject[]>([]);
  const [modulesBySubject, setModulesBySubject] = useState<Record<string | number, Tema[]>>({});
  const [loading,          setLoading]          = useState(true);
  const [openSubjects,     setOpenSubjects]     = useState<(number | string)[]>([]);

  // Add materia
  const [addMateriaOpen,  setAddMateriaOpen]  = useState(false);
  const [addMateriaForm,  setAddMateriaForm]  = useState(EMPTY_MATERIA);
  const [savingMateria,   setSavingMateria]   = useState(false);

  // Edit materia
  const [editMateria,     setEditMateria]     = useState<Subject | null>(null);
  const [editMateriaForm, setEditMateriaForm] = useState(EMPTY_MATERIA);
  const [savingEditMat,   setSavingEditMat]   = useState(false);

  // Add tema
  const [addTemaFor,      setAddTemaFor]      = useState<Subject | null>(null);
  const [addTemaForm,     setAddTemaForm]     = useState(EMPTY_TEMA);
  const [savingTema,      setSavingTema]      = useState(false);

  // Edit tema
  const [editTema,        setEditTema]        = useState<{ tema: Tema; subjectId: number | string } | null>(null);
  const [editTemaForm,    setEditTemaForm]    = useState(EMPTY_TEMA);
  const [savingEditTema,  setSavingEditTema]  = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [subsRaw, modsRaw] = await Promise.all([
        getMateriasAdmin(),
        getModulosAdmin(),
      ]);
      const subs = Array.isArray(subsRaw) && subsRaw.length > 0
        ? subsRaw.map(mapSubject)
        : MOCK_SUBJECTS;
      setSubjects(subs);
      if (subs.length > 0 && !silent) setOpenSubjects([subs[0].id]);

      const grouped: Record<string | number, Tema[]> = {};
      if (Array.isArray(modsRaw) && modsRaw.length > 0) {
        modsRaw.forEach((m: any) => {
          const sid = m.subject ?? m.subject_id;
          if (sid == null) return;
          if (!grouped[sid]) grouped[sid] = [];
          grouped[sid].push(mapModulo(m));
        });
      } else {
        Object.assign(grouped, MOCK_MODULES);
      }
      setModulesBySubject(grouped);
    } catch {
      setSubjects(MOCK_SUBJECTS);
      setModulesBySubject(MOCK_MODULES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggle = (id: number | string) =>
    setOpenSubjects((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  // ── Materia CRUD ──────────────────────────────────────────────────────────

  const handleAddMateria = async () => {
    if (!addMateriaForm.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    setSavingMateria(true);
    try {
      const created = await crearMateria(addMateriaForm);
      setSubjects((prev) => [...prev, mapSubject(created)]);
      toast.success("Materia creada");
      setAddMateriaOpen(false);
      setAddMateriaForm(EMPTY_MATERIA);
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setSavingMateria(false);
    }
  };

  const openEditMateria = (subject: Subject) => {
    setEditMateria(subject);
    setEditMateriaForm({ name: subject.name, description: subject.description });
  };

  const handleEditMateria = async () => {
    if (!editMateria) return;
    setSavingEditMat(true);
    try {
      const updated = await actualizarMateria(editMateria.id, editMateriaForm);
      setSubjects((prev) => prev.map((s) => s.id === editMateria.id ? mapSubject(updated) : s));
      toast.success("Materia actualizada");
      setEditMateria(null);
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setSavingEditMat(false);
    }
  };

  const handleDeleteMateria = async (id: number | string) => {
    if (!confirm("¿Eliminar esta materia? También se eliminarán sus temas.")) return;
    try {
      await eliminarMateria(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      setModulesBySubject((prev) => { const next = { ...prev }; delete next[id]; return next; });
      toast.success("Materia eliminada");
    } catch {
      toast.error("No se pudo eliminar la materia");
    }
  };

  const handleToggleActive = async (subject: Subject) => {
    try {
      const updated = await actualizarMateria(subject.id, { is_active: !subject.is_active });
      setSubjects((prev) => prev.map((s) => s.id === subject.id ? mapSubject(updated) : s));
      toast.success(subject.is_active ? "Materia desactivada" : "Materia activada");
    } catch {
      toast.error("No se pudo cambiar el estado");
    }
  };

  // ── Tema CRUD ─────────────────────────────────────────────────────────────

  const handleAddTema = async () => {
    if (!addTemaFor || !addTemaForm.title.trim()) { toast.error("El título es obligatorio"); return; }
    setSavingTema(true);
    try {
      const existing = modulesBySubject[addTemaFor.id] ?? [];
      const created = await crearModulo({
        subject: addTemaFor.id,
        title: addTemaForm.title,
        description: addTemaForm.description,
        order: existing.length + 1,
      });
      setModulesBySubject((prev) => ({
        ...prev,
        [addTemaFor.id]: [...(prev[addTemaFor.id] ?? []), mapModulo(created)],
      }));
      toast.success("Tema agregado");
      setAddTemaFor(null);
      setAddTemaForm(EMPTY_TEMA);
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setSavingTema(false);
    }
  };

  const openEditTema = (tema: Tema, subjectId: number | string) => {
    setEditTema({ tema, subjectId });
    setEditTemaForm({ title: tema.title, description: tema.description });
  };

  const handleEditTema = async () => {
    if (!editTema) return;
    setSavingEditTema(true);
    try {
      const updated = await actualizarModulo(editTema.tema.id, editTemaForm);
      setModulesBySubject((prev) => ({
        ...prev,
        [editTema.subjectId]: (prev[editTema.subjectId] ?? []).map((t) =>
          t.id === editTema.tema.id ? mapModulo(updated) : t
        ),
      }));
      toast.success("Tema actualizado");
      setEditTema(null);
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setSavingEditTema(false);
    }
  };

  const handleDeleteTema = async (temaId: number | string, subjectId: number | string) => {
    if (!confirm("¿Eliminar este tema?")) return;
    try {
      await eliminarModulo(temaId);
      setModulesBySubject((prev) => ({
        ...prev,
        [subjectId]: (prev[subjectId] ?? []).filter((t) => t.id !== temaId),
      }));
      toast.success("Tema eliminado");
    } catch {
      toast.error("No se pudo eliminar el tema");
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────

  const totalTemas   = Object.values(modulesBySubject).reduce((a, arr) => a + arr.length, 0);
  const activeCount  = subjects.filter((s) => s.is_active).length;
  const inactiveCount = subjects.length - activeCount;

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-72 bg-[#6366F1]/5 rounded-full blur-[100px]" style={{ animation: "float-a 11s ease-in-out infinite" }} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-amber-400/4 rounded-full blur-[80px]"  style={{ animation: "float-c 8s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Materias y temas</h1>
          <p className="text-slate-400 text-sm mt-1">Gestiona el catálogo de materias y contenidos</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-9 px-3 rounded-xl text-sm border-slate-200 text-slate-600 hover:bg-slate-50"
            onClick={() => fetchData(true)}
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            className="h-9 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-medium transition-all active:scale-[0.98] shadow-sm shadow-[#6366F1]/20"
            onClick={() => setAddMateriaOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Agregar materia
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        {[
          { label: "Total materias",  value: subjects.length, icon: BookOpen,     iconBg: "bg-[#6366F1]/10", iconColor: "text-[#6366F1]"   },
          { label: "Total temas",     value: totalTemas,      icon: BookOpen,     iconBg: "bg-amber-50",      iconColor: "text-amber-500"   },
          { label: "Activas",         value: activeCount,     icon: CheckCircle2, iconBg: "bg-emerald-50",    iconColor: "text-emerald-500" },
          { label: "Inactivas",       value: inactiveCount,   icon: XCircle,      iconBg: "bg-slate-100",     iconColor: "text-slate-400"   },
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

      {/* Loading skeleton */}
      {loading && (
        <div className="relative z-10 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200/70 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-7 w-7 bg-slate-100 rounded-lg" />
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-100 rounded w-16" />
              </div>
              <div className="h-4 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Subject cards */}
      {!loading && (
        <div className="relative z-10 space-y-3">
          {subjects.length === 0 ? (
            <div className="bg-white border border-slate-200/70 rounded-2xl p-12 text-center">
              <BookOpen className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Sin materias registradas</p>
            </div>
          ) : (
            subjects.map((subject, idx) => {
              const isOpen  = openSubjects.includes(subject.id);
              const temas   = modulesBySubject[subject.id] ?? [];
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, ease: [0.22, 0.61, 0.36, 1] }}
                  className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#6366F1]/6"
                >
                  {/* Subject header */}
                  <div className="flex items-center gap-4 px-6 py-5">
                    <button
                      onClick={() => toggle(subject.id)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center flex-shrink-0 transition-colors"
                    >
                      {isOpen
                        ? <ChevronDown  className="w-4 h-4 text-slate-500" />
                        : <ChevronRight className="w-4 h-4 text-slate-500" />}
                    </button>

                    <div className="flex-1 cursor-pointer" onClick={() => toggle(subject.id)}>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="text-base font-bold text-slate-800">{subject.name}</h3>
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${
                          subject.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {subject.is_active ? "Activa" : "Inactiva"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{subject.description}</p>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />{temas.length} temas
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-xl text-xs border-slate-200 hover:border-[#6366F1] hover:text-[#6366F1]"
                        onClick={() => { setAddTemaFor(subject); setAddTemaForm(EMPTY_TEMA); }}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Agregar tema
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-xl text-xs border-slate-200 hover:border-amber-400 hover:text-amber-600"
                        onClick={() => handleToggleActive(subject)}
                        title={subject.is_active ? "Desactivar" : "Activar"}
                      >
                        {subject.is_active
                          ? <XCircle      className="w-3.5 h-3.5" />
                          : <CheckCircle2 className="w-3.5 h-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100"
                        onClick={() => openEditMateria(subject)}
                      >
                        <Edit className="w-4 h-4 text-slate-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg hover:bg-red-50"
                        onClick={() => handleDeleteMateria(subject.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>

                  {/* Temas list */}
                  {isOpen && (
                    <div className="border-t border-slate-100 px-6 py-4">
                      {temas.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">Sin temas registrados para esta materia</p>
                      ) : (
                        <div className="space-y-2">
                          {temas.map((tema) => (
                            <div
                              key={tema.id}
                              className="flex items-center gap-4 p-4 bg-[#F8F9FC] rounded-xl border border-slate-200/60 hover:border-[#6366F1]/20 hover:bg-[#6366F1]/[0.02] transition-all group"
                            >
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-800 text-sm">{tema.title}</h4>
                                <p className="text-xs text-slate-400 mt-0.5">{tema.description}</p>
                                <div className="flex items-center gap-2.5 mt-1.5">
                                  <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />Orden {tema.order}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 rounded-lg hover:bg-white"
                                  onClick={() => openEditTema(tema, subject.id)}
                                >
                                  <Edit className="w-3.5 h-3.5 text-slate-400" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 rounded-lg hover:bg-red-50"
                                  onClick={() => handleDeleteTema(tema.id, subject.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* ── Dialogs ───────────────────────────────────────────────────────── */}

      {/* Add materia */}
      <Dialog open={addMateriaOpen} onOpenChange={(v) => { setAddMateriaOpen(v); if (!v) setAddMateriaForm(EMPTY_MATERIA); }}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Agregar nueva materia</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nombre de la materia *</Label>
              <Input
                placeholder="Ej: Cálculo Vectorial"
                value={addMateriaForm.name}
                onChange={(e) => setAddMateriaForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                placeholder="Breve descripción del contenido..."
                value={addMateriaForm.description}
                onChange={(e) => setAddMateriaForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="mt-1.5 rounded-xl resize-none"
              />
            </div>
            <Button
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl disabled:opacity-60"
              onClick={handleAddMateria}
              disabled={savingMateria}
            >
              {savingMateria ? "Guardando..." : "Guardar materia"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit materia */}
      <Dialog open={!!editMateria} onOpenChange={(v) => { if (!v) setEditMateria(null); }}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Editar materia</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nombre de la materia *</Label>
              <Input
                value={editMateriaForm.name}
                onChange={(e) => setEditMateriaForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={editMateriaForm.description}
                onChange={(e) => setEditMateriaForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="mt-1.5 rounded-xl resize-none"
              />
            </div>
            <Button
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl disabled:opacity-60"
              onClick={handleEditMateria}
              disabled={savingEditMat}
            >
              {savingEditMat ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add tema */}
      <Dialog open={!!addTemaFor} onOpenChange={(v) => { if (!v) { setAddTemaFor(null); setAddTemaForm(EMPTY_TEMA); } }}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Agregar tema{addTemaFor ? ` a ${addTemaFor.name}` : ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Título del tema *</Label>
              <Input
                placeholder="Ej: Transformaciones Lineales"
                value={addTemaForm.title}
                onChange={(e) => setAddTemaForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                placeholder="Descripción breve del tema..."
                value={addTemaForm.description}
                onChange={(e) => setAddTemaForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="mt-1.5 rounded-xl resize-none"
              />
            </div>
            <Button
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl disabled:opacity-60"
              onClick={handleAddTema}
              disabled={savingTema}
            >
              {savingTema ? "Guardando..." : "Guardar tema"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit tema */}
      <Dialog open={!!editTema} onOpenChange={(v) => { if (!v) setEditTema(null); }}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Editar tema</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Título del tema *</Label>
              <Input
                value={editTemaForm.title}
                onChange={(e) => setEditTemaForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={editTemaForm.description}
                onChange={(e) => setEditTemaForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="mt-1.5 rounded-xl resize-none"
              />
            </div>
            <Button
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl disabled:opacity-60"
              onClick={handleEditTema}
              disabled={savingEditTema}
            >
              {savingEditTema ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
