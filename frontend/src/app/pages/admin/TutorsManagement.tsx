import { useEffect, useState } from "react";
import { Search, Star, Plus, MoreVertical, Eye, Edit, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { getDocentes, verificarDocente } from "../../../api/admin";

const tutors = [
  { id: 1, name: "María González", email: "maria.gonzalez@tutors.com", specialty: "Matemáticas Avanzadas", subjects: ["Álgebra", "Cálculo", "Geometría"], rating: 4.9, reviews: 127, hourlyRate: 25, sessionsCompleted: 234, status: "active", availability: "Disponible", certification: "Maestría en Matemáticas" },
  { id: 2, name: "Carlos Ramírez", email: "carlos.ramirez@tutors.com", specialty: "Física y Matemáticas", subjects: ["Física", "Cálculo", "Probabilidad"], rating: 4.8, reviews: 98, hourlyRate: 30, sessionsCompleted: 189, status: "active", availability: "Disponible", certification: "PhD en Física" },
  { id: 3, name: "Ana Martínez", email: "ana.martinez@tutors.com", specialty: "Estadística", subjects: ["Estadística", "Probabilidad", "Datos"], rating: 4.7, reviews: 85, hourlyRate: 28, sessionsCompleted: 156, status: "active", availability: "Limitada", certification: "Maestría en Estadística" },
  { id: 4, name: "Jorge López", email: "jorge.lopez@tutors.com", specialty: "Álgebra Lineal", subjects: ["Álgebra Lineal", "Matrices"], rating: 4.9, reviews: 156, hourlyRate: 32, sessionsCompleted: 267, status: "active", availability: "Disponible", certification: "Maestría en Matemáticas Aplicadas" },
  { id: 5, name: "Laura Fernández", email: "laura.fernandez@tutors.com", specialty: "Cálculo Integral", subjects: ["Cálculo", "Integrales"], rating: 4.6, reviews: 72, hourlyRate: 24, sessionsCompleted: 134, status: "pending", availability: "Disponible", certification: "Licenciatura en Matemáticas" },
];

export function TutorsManagement() {
  const [docentes, setDocentes] = useState<any[]>([]);

  useEffect(() => {
    getDocentes()
      .then(setDocentes)
      .catch(() => {});
  }, []);

  const handleVerificar = async (id: number, verificado: boolean) => {
    await verificarDocente(id, !verificado);
    setDocentes(prev => prev.map(d => d.id === id ? { ...d, verificado: !verificado } : d));
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSpecialty, setFilterSpecialty] = useState("all");

    const listaTutores = docentes.length > 0 ? docentes.map((d: any) => ({
    id:                d.id,
    name:              d.usuario?.nombre ?? "—",
    email:             d.usuario?.correo ?? "—",
    specialty:         d.biografia ?? "—",
    subjects:          [],
    rating:            d.rating_promedio ?? 0,
    reviews:           d.total_sesiones ?? 0,
    hourlyRate:        d.tarifa_hora ?? 0,
    sessionsCompleted: d.total_sesiones ?? 0,
    status:            d.verificado ? "active" : "pending",
    availability:      "Disponible",
    certification:     d.experiencia ?? "—",
  })) : tutors;

  const filtered = listaTutores.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    const matchesSpec   = filterSpecialty === "all" || t.specialty.includes(filterSpecialty);
    return matchesSearch && matchesStatus && matchesSpec;
  });

  const avgRating = listaTutores.length > 0
    ? (listaTutores.reduce((a, t) => a + Number(t.rating), 0) / listaTutores.length).toFixed(1)
    : "0.0";

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 right-1/3 w-[400px] h-[300px] bg-[#6366F1]/5 rounded-full blur-[90px]" style={{ animation: "float-b 10s ease-in-out infinite" }} />
        <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-emerald-400/4 rounded-full blur-[80px]" style={{ animation: "float-a 13s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Administración</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Gestión de tutores</h1>
        <p className="text-slate-400 text-sm mt-1">Supervisa y administra todos los tutores de la plataforma</p>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        {[
          { label: "Total tutores",       value: listaTutores.length,                                       icon: CheckCircle2, iconBg: "bg-[#6366F1]/10", iconColor: "text-[#6366F1]",   suffix: "" },
          { label: "Activos",             value: listaTutores.filter(t => t.status === "active").length,    icon: CheckCircle2, iconBg: "bg-emerald-50",    iconColor: "text-emerald-500", suffix: "" },
          { label: "Pendientes",          value: listaTutores.filter(t => t.status === "pending").length,    icon: Clock,        iconBg: "bg-amber-50",      iconColor: "text-amber-500",   suffix: "" },
          { label: "Calificación promedio", value: avgRating,                                          icon: Star,         iconBg: "bg-yellow-50",     iconColor: "text-yellow-500",  suffix: "★" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#6366F1]/8 cursor-default">
            <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <p className="text-4xl font-bold text-slate-800 tabular-nums tracking-tight">{s.value}{s.suffix}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl p-5">
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input placeholder="Buscar por nombre o especialidad..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 h-10 rounded-xl border-slate-200 text-sm bg-[#F8F9FC]" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 text-sm bg-[#F8F9FC]"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos los estados</SelectItem><SelectItem value="active">Activos</SelectItem><SelectItem value="pending">Pendientes</SelectItem></SelectContent>
          </Select>
          <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 text-sm bg-[#F8F9FC]"><SelectValue placeholder="Especialidad" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todas</SelectItem><SelectItem value="Matemáticas">Matemáticas</SelectItem><SelectItem value="Física">Física</SelectItem><SelectItem value="Estadística">Estadística</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Tutores <span className="text-slate-400 font-normal">({filtered.length})</span></h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-9 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-medium transition-all active:scale-[0.98] shadow-sm shadow-[#6366F1]/20">
                <Plus className="w-4 h-4 mr-1.5" /> Agregar tutor
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle>Agregar nuevo tutor</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div><Label>Nombre completo</Label><Input placeholder="Ej: Juan Pérez" className="mt-1.5 rounded-xl" /></div>
                <div><Label>Email</Label><Input type="email" placeholder="juan@tutors.com" className="mt-1.5 rounded-xl" /></div>
                <div><Label>Especialidad</Label><Input placeholder="Ej: Matemáticas Avanzadas" className="mt-1.5 rounded-xl" /></div>
                <div><Label>Tarifa por hora ($)</Label><Input type="number" placeholder="25" className="mt-1.5 rounded-xl" /></div>
                <div><Label>Certificación</Label><Textarea placeholder="Títulos y certificaciones..." className="mt-1.5 rounded-xl" /></div>
                <Button className="w-full bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl">Guardar tutor</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100">
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide pl-6">Tutor</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Especialidad</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Calificación</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tarifa/h</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Sesiones</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Disponibilidad</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Estado</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((tutor) => (
              <TableRow key={tutor.id} className="border-slate-50 hover:bg-[#6366F1]/[0.025] transition-colors">
                <TableCell className="pl-6 py-4">
                  <p className="font-semibold text-slate-800">{tutor.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{tutor.email}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium text-slate-700">{tutor.specialty}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tutor.subjects.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md">{s}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-700 tabular-nums">{tutor.rating}</span>
                    <span className="text-slate-400 text-xs">({tutor.reviews})</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-800 tabular-nums">${tutor.hourlyRate}</TableCell>
                <TableCell className="font-bold text-slate-700 tabular-nums">{tutor.sessionsCompleted}</TableCell>
                <TableCell>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium border ${tutor.availability === "Disponible" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{tutor.availability}</span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium border ${tutor.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : tutor.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {tutor.status === "active" ? "Activo" : tutor.status === "pending" ? "Pendiente" : "Inactivo"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem className="rounded-lg"><Eye className="w-4 h-4 mr-2" />Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg"><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                      {tutor.status === "pending" && (
  <DropdownMenuItem
    className="rounded-lg text-emerald-600"
    onClick={() => handleVerificar(tutor.id, false)}
  >
    <CheckCircle2 className="w-4 h-4 mr-2" />Aprobar
  </DropdownMenuItem>
)}
                      <DropdownMenuItem className="rounded-lg text-red-500"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
