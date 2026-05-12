import { Clock, Plus, Edit, X, CalendarDays, Ban } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { getDisponibilidad, agregarDisponibilidad, eliminarDisponibilidad } from "../../../api/docente";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const initialSchedule = [
  { id: 1, day: "Lunes",     startTime: "16:00", endTime: "20:00", status: "available" },
  { id: 2, day: "Martes",    startTime: "16:00", endTime: "20:00", status: "available" },
  { id: 3, day: "Miércoles", startTime: "16:00", endTime: "20:00", status: "available" },
  { id: 4, day: "Jueves",    startTime: "16:00", endTime: "20:00", status: "available" },
  { id: 5, day: "Viernes",   startTime: "17:00", endTime: "21:00", status: "available" },
];

export function Availability() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ day: "", startTime: "", endTime: "" });
  const [blockedDates, setBlockedDates] = useState<{ id: number; date: string; reason: string }[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState({ date: "", reason: "" });
  useEffect(() => {
    getDisponibilidad()
      .then((data) => {
        if (data && data.length > 0) {
          setSchedule(data.map((d: any) => ({
            id:        d.id,
            day:       d.dia,
            startTime: d.horaInicio,
            endTime:   d.horaFin,
            status:    d.estado === "DISPONIBLE" ? "available" : "blocked",
          })));
        }
      })
      .catch(() => {});
  }, []);

    const handleAddSlot = async () => {
    if (!newSlot.day || !newSlot.startTime || !newSlot.endTime) {
      toast.error("Completa todos los campos");
      return;
    }
    try {
      const saved = await agregarDisponibilidad({
        dia:        newSlot.day,
        horaInicio: newSlot.startTime,
        horaFin:    newSlot.endTime,
        estado:     "DISPONIBLE",
      });
      setSchedule([...schedule, {
        id:        saved.id,
        day:       saved.dia,
        startTime: saved.horaInicio,
        endTime:   saved.horaFin,
        status:    "available",
      }]);
      setNewSlot({ day: "", startTime: "", endTime: "" });
      setIsAddDialogOpen(false);
      toast.success("Horario agregado correctamente");
    } catch {
      toast.error("Error al guardar el horario");
    }
  };

  const handleBlockSlot = (id: number) => {
    setSchedule(schedule.map(slot => slot.id === id ? { ...slot, status: slot.status === "available" ? "blocked" : "available" } : slot));
    toast.success("Horario actualizado");
  };

    const handleDeleteSlot = async (id: number) => {
    try {
      await eliminarDisponibilidad(id);
      setSchedule(schedule.filter(slot => slot.id !== id));
      toast.success("Horario eliminado");
    } catch {
      toast.error("Error al eliminar el horario");
    }
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate.date) { toast.error("Selecciona una fecha"); return; }
    setBlockedDates([...blockedDates, { id: Date.now(), ...newBlockedDate }]);
    setNewBlockedDate({ date: "", reason: "" });
    toast.success("Fecha bloqueada");
  };

  const handleRemoveBlockedDate = (id: number) => {
    setBlockedDates(blockedDates.filter(d => d.id !== id));
    toast.success("Excepción eliminada");
  };

  const groupedSchedule = daysOfWeek.map(day => ({
    day,
    slots: schedule.filter(slot => slot.day === day),
  }));

  const totalHours = schedule
    .filter(s => s.status === "available")
    .reduce((sum, s) => {
      const start = parseInt(s.startTime.split(":")[0]);
      const end = parseInt(s.endTime.split(":")[0]);
      return sum + (end - start);
    }, 0);

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[460px] h-[260px] bg-[#6366F1]/6 rounded-full blur-[100px]" style={{ animation: "float-c 9s ease-in-out infinite" }} />
        <div className="absolute bottom-10 right-8 w-64 h-64 bg-emerald-400/4 rounded-full blur-[80px]" style={{ animation: "float-a 12s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Tutor</p>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Disponibilidad</h1>
          <p className="text-slate-400 text-sm mt-1">Gestiona tus horarios disponibles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold px-4 transition-all duration-150 active:scale-[0.97]">
              <Plus className="w-4 h-4 mr-1.5" />
              Agregar horario
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Agregar nuevo horario</DialogTitle>
              <DialogDescription className="text-slate-400">Define un nuevo bloque de tiempo disponible</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-sm font-semibold text-slate-700">Día de la semana</Label>
                <Select value={newSlot.day} onValueChange={v => setNewSlot({ ...newSlot, day: v })}>
                  <SelectTrigger className="mt-1.5 rounded-xl">
                    <SelectValue placeholder="Selecciona un día" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {daysOfWeek.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { field: "startTime", label: "Hora de inicio", placeholder: "Inicio" },
                  { field: "endTime",   label: "Hora de fin",    placeholder: "Fin" },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <Label className="text-sm font-semibold text-slate-700">{label}</Label>
                    <Select value={(newSlot as any)[field]} onValueChange={v => setNewSlot({ ...newSlot, [field]: v })}>
                      <SelectTrigger className="mt-1.5 rounded-xl">
                        <SelectValue placeholder={placeholder} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, "0");
                          return <SelectItem key={hour} value={`${hour}:00`}>{hour}:00</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <Button className="w-full h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-semibold" onClick={handleAddSlot}>
                Agregar horario
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary strip */}
      <div className="relative z-10 grid grid-cols-3 gap-4">
        {[
          { label: "Días activos",   value: String(schedule.filter(s => s.status === "available").map(s => s.day).filter((v, i, a) => a.indexOf(v) === i).length), icon: CalendarDays, bg: "bg-[#6366F1]/8", color: "text-[#6366F1]" },
          { label: "Horas semanales",value: String(totalHours), icon: Clock, bg: "bg-emerald-50", color: "text-emerald-500" },
          { label: "Bloqueados",     value: String(schedule.filter(s => s.status === "blocked").length), icon: X, bg: "bg-amber-50", color: "text-amber-500" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#6366F1]/8 cursor-default">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-4xl font-bold text-slate-800 tabular-nums tracking-tight">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Blocked dates — exceptions */}
      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <Ban className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Excepciones por fecha</h2>
          <span className="ml-1 text-xs text-slate-400">— días específicos sin disponibilidad</span>
        </div>

        {/* Add form */}
        <div className="px-6 py-4 border-b border-slate-100 bg-[#F8F9FC]">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</Label>
              <Input
                type="date"
                value={newBlockedDate.date}
                onChange={e => setNewBlockedDate({ ...newBlockedDate, date: e.target.value })}
                className="mt-1.5 rounded-xl border-slate-200 w-44 text-sm"
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Motivo (opcional)</Label>
              <Input
                placeholder="Ej. Día festivo, viaje..."
                value={newBlockedDate.reason}
                onChange={e => setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })}
                className="mt-1.5 rounded-xl border-slate-200 text-sm"
              />
            </div>
            <Button
              className="h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold px-4 flex-shrink-0 transition-all duration-150 active:scale-[0.97]"
              onClick={handleAddBlockedDate}
            >
              <Ban className="w-4 h-4 mr-1.5" />
              Bloquear fecha
            </Button>
          </div>
        </div>

        {/* List */}
        {blockedDates.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <CalendarDays className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Sin excepciones configuradas</p>
            <p className="text-xs text-slate-300 mt-0.5">Las fechas bloqueadas aquí anulan tu horario semanal</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {blockedDates.map(bd => (
              <div key={bd.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-10 h-10 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Ban className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(bd.date + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  {bd.reason && <p className="text-xs text-slate-400 mt-0.5">{bd.reason}</p>}
                </div>
                <span className="inline-flex px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 flex-shrink-0">
                  Bloqueado
                </span>
                <button
                  onClick={() => handleRemoveBlockedDate(bd.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150 flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly schedule */}
      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <Clock className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Horarios semanales</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {groupedSchedule.map(({ day, slots }) => (
            <div key={day} className="px-6 py-4">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-sm font-semibold text-slate-700 w-24 flex-shrink-0">{day}</p>
                {slots.length === 0 && <p className="text-xs text-slate-400">Sin horarios configurados</p>}
              </div>
              {slots.length > 0 && (
                <div className="space-y-2 ml-24">
                  {slots.map(slot => {
                    const available = slot.status === "available";
                    return (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-150 ${
                          available ? "bg-emerald-50/60 border-emerald-200" : "bg-slate-100 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className={`w-4 h-4 ${available ? "text-emerald-500" : "text-slate-400"}`} />
                          <span className="text-sm font-semibold text-slate-700 tabular-nums">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-semibold border ${
                            available ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {available ? "Disponible" : "Bloqueado"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs rounded-lg border-slate-200 text-slate-600 hover:border-[#6366F1]/40 hover:text-[#6366F1]"
                            onClick={() => handleBlockSlot(slot.id)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            {available ? "Bloquear" : "Desbloquear"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteSlot(slot.id)}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
