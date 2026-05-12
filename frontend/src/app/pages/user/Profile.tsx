import { User, Mail, MapPin, Target, Clock, BookOpen, Plus, Camera, Bell, CalendarClock, MessageSquare, Star } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

const userProfile = {
  name: "Carlos Mendoza",
  email: "carlos.mendoza@email.com",
  location: "Ciudad de México",
  currentLevel: "Intermedio",
  goals: "Dominar Cálculo y Álgebra Lineal para ingresar a Ingeniería",
  totalHours: 47,
  completedTopics: 23,
  interests: ["Matemáticas", "Física", "Programación"],
  studyPattern: "Tardes (16:00 - 20:00)",
  preferredSessionLength: "60 minutos",
};

export function Profile() {
  const handleSaveProfile = async () => {
    try {
      const { actualizarPerfil } = await import("../../../api/estudiante");
      const nombre = (document.getElementById("name") as HTMLInputElement)?.value;
      const ubicacion = (document.getElementById("location") as HTMLInputElement)?.value;
      const objetivos = (document.getElementById("goals") as HTMLTextAreaElement)?.value;
      await actualizarPerfil({ nombre, ubicacion, objetivos });
      toast.success("Perfil actualizado correctamente");
    } catch {
      toast.error("Error al guardar el perfil");
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    sessionReminder: true,
    newMessage: true,
    weeklyProgress: false,
    newRating: true,
  });
    useEffect(() => {
    const nombre = localStorage.getItem("nombre");
    if (nombre) setAvatarPreview(null); // solo para forzar re-render
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      toast.success("Foto actualizada");
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[260px] bg-[#6366F1]/6 rounded-full blur-[100px]" style={{ animation: "float-c 9s ease-in-out infinite" }} />
        <div className="absolute bottom-10 right-8 w-64 h-64 bg-emerald-400/4 rounded-full blur-[80px]" style={{ animation: "float-b 12s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Estudiante</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Perfil</h1>
        <p className="text-slate-400 text-sm mt-1">Gestiona tu información personal</p>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="col-span-1 space-y-5">
          {/* Avatar card */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6">
            <div className="flex flex-col items-center text-center">
              {/* HU-06 — Photo upload */}
              <div className="relative mb-4 group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Foto de perfil"
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[#6366F1] flex items-center justify-center text-white text-2xl font-bold">CM</div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  title="Cambiar foto"
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#6366F1] font-medium hover:text-[#4F46E5] transition-colors mb-3"
              >
                Cambiar foto
              </button>
              <h2 className="text-xl font-bold text-slate-800">{userProfile.name}</h2>
              <p className="text-slate-400 text-sm mt-0.5 mb-2">{userProfile.email}</p>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
                <MapPin className="w-3.5 h-3.5" />
                <span>{userProfile.location}</span>
              </div>
              <span className="inline-flex px-3 py-1 rounded-lg text-xs font-semibold bg-[#6366F1]/8 text-[#6366F1] border border-[#6366F1]/20">
                {userProfile.currentLevel}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">Estadísticas</h3>
            {[
              { label: "Horas totales",      value: String(userProfile.totalHours), icon: Clock,   color: "text-[#6366F1]",   bg: "bg-[#6366F1]/8" },
              { label: "Temas completados",  value: String(userProfile.completedTopics), icon: Target, color: "text-emerald-500", bg: "bg-emerald-50" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <p className="text-sm text-slate-600">{s.label}</p>
                  <p className="text-xl font-bold text-slate-800 tabular-nums">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interests */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Áreas de interés</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map((interest, idx) => (
                <span key={idx} className="inline-flex px-3 py-1 rounded-lg text-xs font-semibold bg-[#F8F9FC] text-slate-600 border border-slate-200/60">
                  {interest}
                </span>
              ))}
              <button className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-[#6366F1] border border-dashed border-[#6366F1]/30 hover:border-[#6366F1]/60 transition-colors">
                <Plus className="w-3 h-3" /> Agregar
              </button>
            </div>
          </div>
        </div>

        {/* Main form area */}
        <div className="col-span-2 space-y-5">
          {/* Personal info */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Información personal</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre completo</Label>
                  <Input id="name" defaultValue={userProfile.name} className="mt-1.5 rounded-xl border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Correo electrónico</Label>
                  <Input id="email" type="email" defaultValue={userProfile.email} className="mt-1.5 rounded-xl border-slate-200" />
                </div>
              </div>
              <div>
                <Label htmlFor="location" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ubicación</Label>
                <Input id="location" defaultValue={userProfile.location} className="mt-1.5 rounded-xl border-slate-200" />
              </div>
              <div>
                <Label htmlFor="goals" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Objetivos de aprendizaje</Label>
                <Textarea id="goals" defaultValue={userProfile.goals} rows={3} className="mt-1.5 rounded-xl border-slate-200 resize-none" />
              </div>
              <Button className="h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold px-5 transition-all duration-150 active:scale-[0.97]" onClick={handleSaveProfile}>
                Guardar cambios
              </Button>
            </div>
          </div>

          {/* Level & preferences */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Nivel y preferencias</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nivel actual</Label>
                  <div className="mt-1.5 h-10 px-3 flex items-center rounded-xl border border-slate-200 bg-[#F8F9FC]">
                    <span className="inline-flex px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#6366F1]/8 text-[#6366F1] border border-[#6366F1]/20">{userProfile.currentLevel}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Horario preferido</Label>
                  <Input defaultValue={userProfile.studyPattern} className="mt-1.5 rounded-xl border-slate-200" readOnly />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Duración de sesión preferida</Label>
                <Input defaultValue={userProfile.preferredSessionLength} className="mt-1.5 rounded-xl border-slate-200" readOnly />
              </div>
            </div>
          </div>

          {/* HU-08 — Notification preferences */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Preferencias de notificaciones</h3>
            </div>
            <div className="space-y-1">
              {[
                { key: "sessionReminder" as const, icon: CalendarClock, label: "Recordatorio de sesión",    desc: "Recibe un aviso 30 min antes de cada sesión" },
                { key: "newMessage"      as const, icon: MessageSquare, label: "Nuevos mensajes",           desc: "Notificación cuando un tutor te escribe" },
                { key: "weeklyProgress"  as const, icon: Target,        label: "Resumen semanal",           desc: "Reporte de progreso cada lunes" },
                { key: "newRating"       as const, icon: Star,          label: "Calificaciones recibidas",  desc: "Aviso cuando un tutor califica tu sesión" },
              ].map(({ key, icon: Icon, label, desc }) => {
                const enabled = notifications[key];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${enabled ? "bg-[#6366F1]/8" : "bg-slate-100"}`}>
                        <Icon className={`w-4 h-4 transition-colors duration-200 ${enabled ? "text-[#6366F1]" : "text-slate-400"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{label}</p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleNotification(key)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
                        enabled ? "bg-[#6366F1]" : "bg-slate-200"
                      }`}
                      aria-pressed={enabled}
                      title={enabled ? "Desactivar" : "Activar"}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                          enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
            <Button
              className="mt-4 h-9 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-semibold px-4 transition-all duration-150 active:scale-[0.97]"
              onClick={() => toast.success("Preferencias de notificaciones guardadas")}
            >
              Guardar preferencias
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
