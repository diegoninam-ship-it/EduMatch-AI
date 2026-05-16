import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import {
  Search, Star, Plus, MoreVertical, Eye, CheckCircle2,
  Clock, RefreshCw, XCircle, Trash2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  getDocentes, getTutoresV1, verificarDocente,
  registrarUsuarioTutor, crearTutor, eliminarTutor,
} from "../../../api/admin";
import { toast } from "sonner";

interface Tutor {
  id: number | string;
  name: string;
  email: string;
  specialty: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  sessionsCompleted: number;
  status: "active" | "pending" | "inactive";
  availability: string;
  certification: string;
}

const MOCK_TUTORS: Tutor[] = [
  { id: 1, name: "María González",  email: "maria@tutors.com",  specialty: "Matemáticas Avanzadas", rating: 4.9, reviews: 127, hourlyRate: 25, sessionsCompleted: 234, status: "active",  availability: "Disponible", certification: "Maestría en Matemáticas" },
  { id: 2, name: "Carlos Ramírez",  email: "carlos@tutors.com", specialty: "Física y Matemáticas",  rating: 4.8, reviews: 98,  hourlyRate: 30, sessionsCompleted: 189, status: "active",  availability: "Disponible", certification: "PhD en Física" },
  { id: 3, name: "Ana Martínez",    email: "ana@tutors.com",    specialty: "Estadística",            rating: 4.7, reviews: 85,  hourlyRate: 28, sessionsCompleted: 156, status: "active",  availability: "Limitada",   certification: "Maestría en Estadística" },
  { id: 4, name: "Jorge López",     email: "jorge@tutors.com",  specialty: "Álgebra Lineal",         rating: 4.9, reviews: 156, hourlyRate: 32, sessionsCompleted: 267, status: "active",  availability: "Disponible", certification: "Maestría en Matemáticas Aplicadas" },
  { id: 5, name: "Laura Fernández", email: "laura@tutors.com",  specialty: "Cálculo Integral",       rating: 4.6, reviews: 72,  hourlyRate: 24, sessionsCompleted: 134, status: "pending", availability: "Disponible", certification: "Licenciatura en Matemáticas" },
];

function mapApiTutor(d: any): Tutor {
  // TutorSerializer devuelve: full_name, email (top-level), biography, rating, hourly_rate, experience_years, is_available
  return {
    id: d.id,
    name: d.full_name ?? (`${d.user?.first_name ?? ""} ${d.user?.last_name ?? ""}`.trim() || "—"),
    email: d.email ?? d.user?.email ?? "—",
    specialty: d.biography ?? "—",
    rating: Number(d.rating ?? 0),
    reviews: 0,
    hourlyRate: Number(d.hourly_rate ?? 0),
    sessionsCompleted: 0,
    status: d.is_available ? "active" : "pending",
    availability: d.is_available ? "Disponible" : "Ocupado",
    certification: d.experience_years != null ? `${d.experience_years} años de experiencia` : "—",
  };
}

export function TutorsManagement() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [verifying, setVerifying] = useState<number | string | null>(null);
  const [deleting, setDeleting] = useState<number | string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    nombre: "", correo: "", password: "", passwordConfirm: "",
    biography: "", experienceYears: "", hourlyRate: "",
  });

  const resetForm = () => {
    setForm({ nombre: "", correo: "", password: "", passwordConfirm: "", biography: "", experienceYears: "", hourlyRate: "" });
    setFormError("");
  };

  const fetchTutors = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    getTutoresV1()
      .then((data) => {
        const list = Array.isArray(data) ? data.map(mapApiTutor) : [];
        setTutors(list.length > 0 ? list : MOCK_TUTORS);
      })
      .catch(() =>
        getDocentes()
          .then((data) => {
            const list = Array.isArray(data) ? data.map(mapApiTutor) : [];
            setTutors(list.length > 0 ? list : MOCK_TUTORS);
          })
          .catch(() => setTutors(MOCK_TUTORS))
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchTutors(); }, [fetchTutors]);

  const handleAddTutor = async () => {
    if (!form.nombre || !form.correo || !form.password) {
      setFormError("Completa los campos obligatorios");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setFormError("Las contraseñas no coinciden");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const { user } = await registrarUsuarioTutor({
        nombre: form.nombre,
        correo: form.correo,
        password: form.password,
        password_confirm: form.passwordConfirm,
      });
      await crearTutor({
        user: user.id,
        biography: form.biography,
        experience_years: parseInt(form.experienceYears) || 0,
        hourly_rate: parseFloat(form.hourlyRate) || 0,
        is_available: true,
      });
      toast.success("Tutor registrado exitosamente");
      setAddOpen(false);
      resetForm();
      fetchTutors(true);
    } catch (err: unknown) {
      let msg = "Error al registrar el tutor";
      try {
        const parsed = JSON.parse((err as Error).message);
        const vals = Object.values(parsed).flat() as string[];
        if (vals.length) msg = vals.join(". ");
      } catch {}
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (id: number | string) => {
    setDeleting(id);
    try {
      await eliminarTutor(id);
      setTutors((prev) => prev.filter((t) => t.id !== id));
      toast.success("Tutor eliminado");
    } catch {
      toast.error("No se pudo eliminar el tutor");
    } finally {
      setDeleting(null);
    }
  };

  const handleVerificar = async (id: number | string, activo: boolean) => {
    setVerifying(id);
    try {
      await verificarDocente(Number(id), !activo);
      setTutors((prev) => prev.map((t) => t.id === id ? { ...t, status: !activo ? "active" : "pending" } : t));
      toast.success(!activo ? "Tutor verificado y activado" : "Tutor desactivado");
    } catch {
      toast.error("No se pudo actualizar el estado del tutor");
    } finally {
      setVerifying(null);
    }
  };

  const filtered = tutors.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const avgRating = tutors.length > 0
    ? (tutors.reduce((a, t) => a + t.rating, 0) / tutors.length).toFixed(1)
    : "—";

  const activeCount  = tutors.filter((t) => t.status === "active").length;
  const pendingCount = tutors.filter((t) => t.status === "pending").length;

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 right-1/3 w-[400px] h-[300px] bg-[#6366F1]/5 rounded-full blur-[90px]" style={{ animation: "float-b 10s ease-in-out infinite" }} />
        <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-emerald-400/4 rounded-full blur-[80px]" style={{ animation: "float-a 13s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Gestión de tutores</h1>
          <p className="text-slate-400 text-sm mt-1">Supervisa y administra todos los tutores de la plataforma</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-9 px-3 rounded-xl text-sm border-slate-200 text-slate-600 hover:bg-slate-50"
            onClick={() => fetchTutors(true)}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            className="h-9 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-medium shadow-sm shadow-[#6366F1]/20 active:scale-[0.98]"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Agregar tutor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        {[
          { label: "Total tutores",        value: tutors.length,  icon: CheckCircle2, iconBg: "bg-[#6366F1]/10", iconColor: "text-[#6366F1]"   },
          { label: "Activos",              value: activeCount,    icon: CheckCircle2, iconBg: "bg-emerald-50",    iconColor: "text-emerald-500" },
          { label: "Pendientes",           value: pendingCount,   icon: Clock,        iconBg: "bg-amber-50",      iconColor: "text-amber-500"   },
          { label: "Rating promedio",      value: avgRating,      icon: Star,         iconBg: "bg-yellow-50",     iconColor: "text-yellow-500"  },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#6366F1]/8 cursor-default">
            <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <p className="text-4xl font-bold text-slate-800 tabular-nums tracking-tight">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl p-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, email o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 rounded-xl border-slate-200 text-sm bg-[#F8F9FC]"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 text-sm bg-[#F8F9FC]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">
            Tutores <span className="text-slate-400 font-normal">({filtered.length})</span>
          </h2>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3 h-3" /> {pendingCount} pendientes de verificar
            </span>
          )}
        </div>

        {loading ? (
          <div className="divide-y divide-slate-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-6 py-4 animate-pulse flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
                <div className="h-4 bg-slate-100 rounded w-1/4" />
                <div className="h-4 bg-slate-100 rounded w-16" />
                <div className="h-4 bg-slate-200 rounded w-12" />
                <div className="h-7 bg-slate-100 rounded-lg w-20" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100">
                <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide pl-6">Tutor</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Especialidad</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Rating</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tarifa/h</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Sesiones</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Estado</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-sm text-slate-400">
                    Sin tutores para este filtro
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((tutor, idx) => (
                  <motion.tr
                    key={tutor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-slate-50 hover:bg-[#6366F1]/[0.025] transition-colors"
                  >
                    <TableCell className="pl-6 py-4">
                      <p className="font-semibold text-slate-800">{tutor.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{tutor.email}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-slate-700">{tutor.specialty}</p>
                      {tutor.certification !== "—" && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">{tutor.certification}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-700 tabular-nums">{tutor.rating.toFixed(1)}</span>
                        <span className="text-slate-400 text-xs">({tutor.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-800 tabular-nums">${tutor.hourlyRate}</TableCell>
                    <TableCell className="font-bold text-slate-700 tabular-nums">{tutor.sessionsCompleted}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium border ${
                        tutor.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : tutor.status === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}>
                        {tutor.status === "active" ? "Activo" : tutor.status === "pending" ? "Pendiente" : "Inactivo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl min-w-40">
                          <DropdownMenuItem className="rounded-lg cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" /> Ver perfil
                          </DropdownMenuItem>
                          {tutor.status === "pending" && (
                            <DropdownMenuItem
                              className="rounded-lg text-emerald-600 cursor-pointer"
                              onClick={() => handleVerificar(tutor.id, false)}
                              disabled={verifying === tutor.id}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              {verifying === tutor.id ? "Verificando..." : "Aprobar tutor"}
                            </DropdownMenuItem>
                          )}
                          {tutor.status === "active" && (
                            <DropdownMenuItem
                              className="rounded-lg text-amber-600 cursor-pointer"
                              onClick={() => handleVerificar(tutor.id, true)}
                              disabled={verifying === tutor.id}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              {verifying === tutor.id ? "..." : "Desactivar"}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="rounded-lg text-red-600 cursor-pointer"
                            onClick={() => handleEliminar(tutor.id)}
                            disabled={deleting === tutor.id}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deleting === tutor.id ? "Eliminando..." : "Eliminar"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Tutor Dialog */}
      <Dialog open={addOpen} onOpenChange={(v) => { setAddOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">Agregar nuevo tutor</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre completo *</Label>
              <Input
                placeholder="Ej: Juan Pérez"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="mt-1.5 rounded-xl border-slate-200 bg-[#F8F9FC]"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Correo electrónico *</Label>
              <Input
                type="email"
                placeholder="juan@tutors.com"
                value={form.correo}
                onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))}
                className="mt-1.5 rounded-xl border-slate-200 bg-[#F8F9FC]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contraseña *</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="mt-1.5 rounded-xl border-slate-200 bg-[#F8F9FC]"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmar *</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.passwordConfirm}
                  onChange={(e) => setForm((f) => ({ ...f, passwordConfirm: e.target.value }))}
                  className="mt-1.5 rounded-xl border-slate-200 bg-[#F8F9FC]"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Biografía / Especialidad</Label>
              <Textarea
                placeholder="Especialidad, títulos y experiencia del tutor..."
                value={form.biography}
                onChange={(e) => setForm((f) => ({ ...f, biography: e.target.value }))}
                className="mt-1.5 rounded-xl resize-none border-slate-200 bg-[#F8F9FC]"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Años de experiencia</Label>
                <Input
                  type="number"
                  placeholder="3"
                  value={form.experienceYears}
                  onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))}
                  className="mt-1.5 rounded-xl border-slate-200 bg-[#F8F9FC]"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarifa por hora ($)</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={form.hourlyRate}
                  onChange={(e) => setForm((f) => ({ ...f, hourlyRate: e.target.value }))}
                  className="mt-1.5 rounded-xl border-slate-200 bg-[#F8F9FC]"
                />
              </div>
            </div>
            {formError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{formError}</p>
            )}
            <Button
              className="w-full h-11 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98] shadow-sm shadow-[#6366F1]/20 disabled:opacity-60"
              onClick={handleAddTutor}
              disabled={saving}
            >
              {saving ? "Registrando tutor..." : "Guardar tutor"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
