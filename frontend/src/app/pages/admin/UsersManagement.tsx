import { useEffect, useState } from "react";
import { Search, MoreVertical, UserCheck, UserX, Eye, Mail, CheckCircle2, XCircle, Activity } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Switch } from "../../components/ui/switch";
import { getUsuarios, toggleUsuario } from "../../../api/admin";

const users = [
  { id: 1, name: "Carlos Mendoza", email: "carlos.mendoza@email.com", level: "Intermedio", sessionsCompleted: 23, hoursTotal: 47, joinDate: "2025-01-15", status: "active", lastActive: "Hace 2 horas", aiLevel: "Intermedio-Avanzado" },
  { id: 2, name: "Ana Rodríguez", email: "ana.rodriguez@email.com", level: "Avanzado", sessionsCompleted: 45, hoursTotal: 92, joinDate: "2024-11-20", status: "active", lastActive: "Hace 1 día", aiLevel: "Avanzado" },
  { id: 3, name: "Luis Pérez", email: "luis.perez@email.com", level: "Principiante", sessionsCompleted: 8, hoursTotal: 16, joinDate: "2026-02-10", status: "active", lastActive: "Hace 3 horas", aiLevel: "Principiante-Intermedio" },
  { id: 4, name: "María García", email: "maria.garcia@email.com", level: "Intermedio", sessionsCompleted: 31, hoursTotal: 65, joinDate: "2025-03-05", status: "inactive", lastActive: "Hace 7 días", aiLevel: "Intermedio" },
  { id: 5, name: "Jorge Sánchez", email: "jorge.sanchez@email.com", level: "Avanzado", sessionsCompleted: 58, hoursTotal: 118, joinDate: "2024-09-12", status: "active", lastActive: "Hace 30 min", aiLevel: "Experto" },
  { id: 6, name: "Laura Hernández", email: "laura.hernandez@email.com", level: "Principiante", sessionsCompleted: 12, hoursTotal: 24, joinDate: "2026-01-22", status: "active", lastActive: "Hace 5 horas", aiLevel: "Principiante" },
];

const levelColors: Record<string, string> = {
  Principiante: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermedio:   "bg-[#6366F1]/8 text-[#6366F1] border-[#6366F1]/20",
  Avanzado:     "bg-slate-100 text-slate-700 border-slate-200",
};

export function UsersManagement() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getUsuarios()
      .then(setUsuarios)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id: number, activo: boolean) => {
    await toggleUsuario(id, !activo);
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo: !activo } : u));
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");

    const listaUsuarios = usuarios.length > 0 ? usuarios : users;

  const filteredUsers = listaUsuarios.filter((user) => {
    const nombre = user.name ?? user.nombre ?? "";
    const email  = user.email ?? user.correo ?? "";
    const matchesSearch = nombre.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || (user.status ?? (user.activo ? "active" : "inactive")) === filterStatus;
    const matchesLevel  = filterLevel  === "all" || user.level === filterLevel;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  const totalSessions = listaUsuarios.reduce((a, u) => a + (u.sessionsCompleted ?? 0), 0);
  const activeCount   = listaUsuarios.filter(u => u.status === "active" || u.activo === true).length;
  const inactiveCount = listaUsuarios.filter(u => u.status === "inactive" || u.activo === false).length;

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/3 w-[480px] h-[300px] bg-[#6366F1]/5 rounded-full blur-[100px]" style={{ animation: "float-a 9s ease-in-out infinite" }} />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-[#14B8A6]/4 rounded-full blur-[80px]" style={{ animation: "float-b 12s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Administración</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Gestión de usuarios</h1>
        <p className="text-slate-400 text-sm mt-1">Administra y supervisa todos los usuarios de la plataforma</p>
      </div>

      {/* Stat cards */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        {[
          { label: "Total usuarios",   value: users.length,  icon: UserCheck,    iconBg: "bg-[#6366F1]/10", iconColor: "text-[#6366F1]" },
          { label: "Activos",          value: activeCount,   icon: CheckCircle2, iconBg: "bg-emerald-50",    iconColor: "text-emerald-500" },
          { label: "Inactivos",        value: inactiveCount, icon: XCircle,      iconBg: "bg-red-50",        iconColor: "text-red-400" },
          { label: "Sesiones totales", value: totalSessions, icon: Activity,     iconBg: "bg-amber-50",      iconColor: "text-amber-500" },
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

      {/* Filters */}
      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl p-5">
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 h-10 rounded-xl border-slate-200 text-sm bg-[#F8F9FC]" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 text-sm bg-[#F8F9FC]"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos los estados</SelectItem><SelectItem value="active">Activos</SelectItem><SelectItem value="inactive">Inactivos</SelectItem></SelectContent>
          </Select>
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 text-sm bg-[#F8F9FC]"><SelectValue placeholder="Nivel" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos los niveles</SelectItem><SelectItem value="Principiante">Principiante</SelectItem><SelectItem value="Intermedio">Intermedio</SelectItem><SelectItem value="Avanzado">Avanzado</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Usuarios <span className="text-slate-400 font-normal">({filteredUsers.length})</span></h2>
          <Button className="h-9 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-medium transition-all active:scale-[0.98] shadow-sm shadow-[#6366F1]/20">
            + Agregar usuario
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100">
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide pl-6">Usuario</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Nivel actual</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Nivel IA</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Sesiones</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Horas</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Última actividad</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Estado</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-slate-50 hover:bg-[#6366F1]/[0.025] transition-colors">
                <TableCell className="pl-6 py-4">
                  <p className="font-semibold text-slate-800">{user.name ?? user.nombre}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{user.email ?? user.correo}</p>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${levelColors[user.level] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>{user.level}</span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#6366F1]/8 text-[#6366F1] border border-[#6366F1]/20">{user.aiLevel}</span>
                </TableCell>
                <TableCell className="font-bold text-slate-700 tabular-nums">{user.sessionsCompleted ?? 0}</TableCell>
                <TableCell className="font-bold text-slate-700 tabular-nums">{user.hoursTotal ?? 0}h</TableCell>
                <TableCell className="text-sm text-slate-400">{user.lastActive}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={user.status === "active" || user.activo === true}
                      onCheckedChange={() => handleToggle(user.id, user.activo ?? user.status === "active")}
                    />
                    <span className={`text-xs font-medium ${user.status === "active" || user.activo === true ? "text-emerald-600" : "text-slate-400"}`}>{user.status === "active" || user.activo === true ? "Activo" : "Inactivo"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem className="rounded-lg"><Eye className="w-4 h-4 mr-2" />Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg"><Mail className="w-4 h-4 mr-2" />Enviar email</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg text-red-500"><UserX className="w-4 h-4 mr-2" />Desactivar</DropdownMenuItem>
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
