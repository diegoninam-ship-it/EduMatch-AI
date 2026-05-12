import { Mail, MapPin, DollarSign, BookOpen, Star, Plus, Camera, Bell, CalendarClock, MessageSquare, Award, GraduationCap, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { actualizarPerfilDocente } from "../../../api/docente";

const tutorProfile = {
  name: "María González",
  email: "tutor.demo@edumatch.com",
  location: "Ciudad de México",
  hourlyRate: 25,
  experience: "8 años",
  bio: "Especialista en Matemáticas Avanzadas con enfoque en Cálculo y Álgebra. Experiencia docente en nivel preparatoria y universidad.",
  subjects: ["Matemáticas Avanzadas", "Cálculo Diferencial", "Cálculo Integral", "Álgebra Lineal"],
  totalSessions: 127,
  rating: 4.9,
};

const initialCerts = [
  { id: 1, title: "Licenciatura en Matemáticas", institution: "UNAM", year: "2016" },
  { id: 2, title: "Maestría en Ciencias",         institution: "IPN",  year: "2019" },
];

export function TutorProfile() {
  const handleSaveProfile = async () => {
  try {
    const biografia  = (document.getElementById("bio")        as HTMLTextAreaElement)?.value;
    const ubicacion  = (document.getElementById("location")   as HTMLInputElement)?.value;
    const tarifaHora = (document.getElementById("hourlyRate") as HTMLInputElement)?.value;
    await actualizarPerfilDocente({ biografia, ubicacion, tarifaHora: Number(tarifaHora) });
    toast.success("Perfil actualizado correctamente");
  } catch {
    toast.error("Error al guardar el perfil");
  }
};
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    sessionReminder: true,
    newStudent: true,
    weeklyReport: false,
    newRating: true,
  });
  const [certs, setCerts] = useState(initialCerts);
  const [newCert, setNewCert] = useState({ title: "", institution: "", year: "" });
  const [showCertForm, setShowCertForm] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      toast.success("Foto actualizada");
    }
  };
    useEffect(() => {
    const nombre = localStorage.getItem("nombre");
    if (nombre) document.title = `Perfil - ${nombre}`;
  }, []);

  const toggleNotification = (key: keyof typeof notifications) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  const handleAddCert = () => {
    if (!newCert.title || !newCert.institution) return;
    setCerts([...certs, { id: Date.now(), ...newCert }]);
    setNewCert({ title: "", institution: "", year: "" });
    setShowCertForm(false);
    toast.success("Certificación agregada");
  };

  const handleDeleteCert = (id: number) => {
    setCerts(certs.filter(c => c.id !== id));
    toast.success("Certificación eliminada");
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
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Tutor</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Perfil</h1>
        <p className="text-slate-400 text-sm mt-1">Gestiona tu información personal</p>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="col-span-1 space-y-5">
          {/* Avatar card */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6">
            <div className="flex flex-col items-center text-center">
              {/* Photo upload */}
              <div className="relative mb-1 group">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Foto de perfil" className="w-20 h-20 rounded-2xl object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[#6366F1] flex items-center justify-center text-white text-2xl font-bold">MG</div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  title="Cambiar foto"
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#6366F1] font-medium hover:text-[#4F46E5] transition-colors mb-3"
              >
                Cambiar foto
              </button>
              <h2 className="text-xl font-bold text-slate-800">{tutorProfile.name}</h2>
              <p className="text-slate-400 text-sm mt-0.5 mb-1">{tutorProfile.email}</p>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
                <MapPin className="w-3.5 h-3.5" />
                <span>{tutorProfile.location}</span>
              </div>
              <span className="inline-flex px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {tutorProfile.experience} experiencia
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Estadísticas</h3>
            {[
              { label: "Sesiones totales", value: String(tutorProfile.totalSessions), color: "text-[#6366F1]" },
              { label: "Calificación",     value: `${tutorProfile.rating}/5.0`,        color: "text-amber-500" },
              { label: "Tarifa por hora",  value: `$${tutorProfile.hourlyRate}`,        color: "text-emerald-600" },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className={`text-xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Subjects */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Materias que enseño</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tutorProfile.subjects.map((subject, idx) => (
                <span key={idx} className="inline-flex px-3 py-1 rounded-lg text-xs font-semibold bg-[#F8F9FC] text-slate-600 border border-slate-200/60">
                  {subject}
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
              <Mail className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Información personal</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre completo</Label>
                  <Input id="name" defaultValue={tutorProfile.name} className="mt-1.5 rounded-xl border-slate-200" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Correo electrónico</Label>
                  <Input id="email" type="email" defaultValue={tutorProfile.email} className="mt-1.5 rounded-xl border-slate-200" />
                </div>
              </div>
              <div>
                <Label htmlFor="location" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ubicación</Label>
                <Input id="location" defaultValue={tutorProfile.location} className="mt-1.5 rounded-xl border-slate-200" />
              </div>
              <div>
                <Label htmlFor="bio" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Biografía</Label>
                <Textarea id="bio" defaultValue={tutorProfile.bio} rows={4} className="mt-1.5 rounded-xl border-slate-200 resize-none" />
              </div>
              <Button className="h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold px-5 transition-all duration-150 active:scale-[0.97]" onClick={handleSaveProfile}>
                Guardar cambios
              </Button>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Precio por sesión</h3>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="hourlyRate" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tarifa por hora (USD)</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-9 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-200">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                  </div>
                  <Input id="hourlyRate" type="number" defaultValue={tutorProfile.hourlyRate} className="flex-1 rounded-xl border-slate-200" />
                </div>
              </div>
              <Button className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold px-5 flex-shrink-0 transition-all duration-150 active:scale-[0.97]">
                Actualizar precio
              </Button>
            </div>
          </div>

          {/* Certificaciones */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-700">Certificaciones y educación</h3>
              </div>
              <button
                onClick={() => setShowCertForm(!showCertForm)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-[#6366F1] border border-dashed border-[#6366F1]/30 hover:border-[#6366F1]/60 transition-colors"
              >
                <Plus className="w-3 h-3" /> Agregar
              </button>
            </div>

            {showCertForm && (
              <div className="mb-4 p-4 bg-[#F8F9FC] border border-slate-200/60 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Título / Certificación</Label>
                    <Input
                      placeholder="Ej. Licenciatura en Física"
                      value={newCert.title}
                      onChange={e => setNewCert({ ...newCert, title: e.target.value })}
                      className="mt-1.5 rounded-xl border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Institución</Label>
                    <Input
                      placeholder="Ej. UNAM"
                      value={newCert.institution}
                      onChange={e => setNewCert({ ...newCert, institution: e.target.value })}
                      className="mt-1.5 rounded-xl border-slate-200 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Año</Label>
                    <Input
                      placeholder="Ej. 2020"
                      value={newCert.year}
                      onChange={e => setNewCert({ ...newCert, year: e.target.value })}
                      className="mt-1.5 rounded-xl border-slate-200 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddCert} className="h-8 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-semibold px-4">
                    Guardar
                  </Button>
                  <Button onClick={() => setShowCertForm(false)} variant="outline" className="h-8 rounded-xl text-xs font-semibold px-4 border-slate-200">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {certs.map(cert => (
                <div key={cert.id} className="flex items-center gap-3 p-3 bg-[#F8F9FC] border border-slate-200/60 rounded-xl group">
                  <div className="w-8 h-8 bg-[#6366F1]/8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-[#6366F1]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{cert.title}</p>
                    <p className="text-xs text-slate-400">{cert.institution}{cert.year ? ` · ${cert.year}` : ""}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-150"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notificaciones */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Preferencias de notificaciones</h3>
            </div>
            <div className="space-y-1">
              {[
                { key: "sessionReminder" as const, icon: CalendarClock, label: "Recordatorio de sesión",    desc: "Aviso 30 min antes de cada clase" },
                { key: "newStudent"      as const, icon: Star,          label: "Nuevo estudiante asignado", desc: "Cuando la IA te asigna un nuevo alumno" },
                { key: "weeklyReport"    as const, icon: MessageSquare, label: "Reporte semanal",           desc: "Resumen de rendimiento cada lunes" },
                { key: "newRating"       as const, icon: Award,         label: "Nueva calificación",        desc: "Cuando un estudiante te evalúa" },
              ].map(({ key, icon: Icon, label, desc }) => {
                const enabled = notifications[key];
                return (
                  <div key={key} className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0">
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
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? "bg-[#6366F1]" : "bg-slate-200"}`}
                      aria-pressed={enabled}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                );
              })}
            </div>
            <Button
              className="mt-4 h-9 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-semibold px-4 transition-all duration-150 active:scale-[0.97]"
              onClick={() => toast.success("Preferencias guardadas")}
            >
              Guardar preferencias
            </Button>
          </div>

          {/* AI badge */}
          <div className="bg-[#0C0E16] rounded-2xl p-5 overflow-hidden relative">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#6366F1]/8 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">Perfil verificado por IA</p>
                <p className="text-slate-500 text-xs">Tu perfil tiene un match rate del 98% con los estudiantes de tu área</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-2xl font-bold text-white tabular-nums">{tutorProfile.rating}</span>
                <span className="text-slate-500 text-sm">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
