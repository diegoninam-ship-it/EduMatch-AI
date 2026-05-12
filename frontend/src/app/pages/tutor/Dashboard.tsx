import { useState, useEffect } from "react";
import { Calendar, Clock, Users, Video, Star, TrendingUp, Zap, ChevronRight, CheckCircle2, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import { getSesionesDocente, getPerfilDocente } from "../../../api/docente";

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const todaySessions = [
  { id: 1, student: "Carlos Mendoza", subject: "Matemáticas Avanzadas", topic: "Aplicaciones de Derivadas", time: "16:00 - 17:00", status: "confirmed", meetingLink: "https://zoom.us/j/123456789" },
  { id: 2, student: "Ana Pérez",       subject: "Álgebra Lineal",         topic: "Matrices",                  time: "18:00 - 19:00", status: "confirmed", meetingLink: "https://zoom.us/j/987654321" },
];

const upcomingSessions = [
  { id: 3, student: "Carlos Mendoza", subject: "Matemáticas Avanzadas", topic: "Optimización",  date: "Mié 23 Abr", time: "16:00 - 17:00" },
  { id: 4, student: "Luis García",    subject: "Física",                 topic: "Dinámica",      date: "Jue 24 Abr", time: "15:00 - 16:00" },
  { id: 5, student: "María Torres",   subject: "Cálculo",                topic: "Integrales",    date: "Vie 25 Abr", time: "17:00 - 18:00" },
];

export function TutorDashboard() {
    const nombre = localStorage.getItem("nombre") ?? "Tutor";
  const [sesiones, setSesiones] = useState<any[]>([]);
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    getSesionesDocente()
      .then(setSesiones)
      .catch(() => {});
    getPerfilDocente()
      .then(setPerfil)
      .catch(() => {});
  }, []);

  const programadas = sesiones.filter(s => s.estado === "PROGRAMADA").length;
  const completadas  = sesiones.filter(s => s.estado === "COMPLETADA").length;
  const canceladas   = sesiones.filter(s => s.estado === "CANCELADA").length;
  const proximaSesion = sesiones.find(s => s.estado === "PROGRAMADA");
  const now = useClock();
  const timeStr = now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });

  const handleJoinSession = (meetingLink: string) => {
    window.open(meetingLink, "_blank");
  };

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[320px] bg-[#6366F1]/6 rounded-full blur-[110px]" style={{ animation: "float-c 9s ease-in-out infinite" }} />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-emerald-400/5 rounded-full blur-[90px]" style={{ animation: "float-a 12s ease-in-out infinite" }} />
        <div className="absolute top-1/2 right-10 w-56 h-56 bg-[#6366F1]/4 rounded-full blur-[70px]" style={{ animation: "float-b 11s ease-in-out infinite" }} />
      </div>

      {/* Hero panel */}
      <div className="relative z-10 bg-[#0C0E16] rounded-2xl p-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#6366F1]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-emerald-400/6 rounded-full blur-2xl" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-[#6366F1]/5 to-transparent" style={{ animation: "scan-line 4s ease-in-out infinite" }} />
          </div>
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }} />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Panel del Tutor</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-1">Hola, {nombre.split(" ")[0]}</h1>
            <p className="text-slate-400 text-sm capitalize">{dateStr}</p>
            <div className="flex items-center gap-4 mt-5">
              {[
                { label: "Sesiones hoy",   value: String(programadas),                                          color: "text-[#818CF8]"  },
                { label: "Completadas",    value: String(completadas),                                           color: "text-emerald-400" },
                { label: "Rating promedio",value: perfil?.ratingPromedio ? `${perfil.ratingPromedio}` : "4.9",  color: "text-amber-400"  },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold text-white tabular-nums tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>{timeStr}</p>
            <p className="text-xs text-slate-500 mt-1.5 uppercase tracking-wider">hora local</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-4">
        {/* Stat cards */}
        {[
          { label: "Sesiones totales",   value: String(completadas + programadas), sub: "en total",         icon: Clock, iconBg: "bg-[#6366F1]/10", iconColor: "text-[#6366F1]"  },
          { label: "Programadas",        value: String(programadas),               sub: "próximas",         icon: Users, iconBg: "bg-emerald-50",   iconColor: "text-emerald-500" },
          { label: "Valoración media",   value: perfil?.ratingPromedio ? `${perfil.ratingPromedio}/5` : "—", sub: "de 5.0 estrellas", icon: Star, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#6366F1]/8 cursor-default">
            <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <p className="text-4xl font-bold text-slate-800 tabular-nums tracking-tight">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">{s.label}</p>
            <p className="text-xs text-slate-300 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Today's sessions */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-[#6366F1]" />
          <h2 className="text-sm font-semibold text-slate-700">Sesiones de hoy</h2>
        </div>
        {todaySessions.map((session, idx) => (
          <div
            key={session.id}
            className="bg-white border border-slate-200/70 rounded-2xl p-5 hover:shadow-lg hover:shadow-[#6366F1]/6 hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0 border border-[#6366F1]/20">
                <Users className="w-4 h-4 text-[#6366F1]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Confirmada
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 tabular-nums ml-auto">
                    <Clock className="w-3 h-3" /> {session.time}
                  </span>
                </div>
                <p className="font-bold text-slate-800 text-sm mb-0.5">{session.student}</p>
                <p className="text-xs text-slate-400">{session.subject} · {session.topic}</p>
              </div>
              <Button
                className="flex-shrink-0 h-9 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold px-4 transition-all duration-150 active:scale-[0.97]"
                onClick={() => handleJoinSession(session.meetingLink)}
              >
                <Video className="w-3.5 h-3.5 mr-1.5" />
                Iniciar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming sessions */}
      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700">Próximas sesiones</h2>
          </div>
          <button className="flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#4F46E5] font-medium transition-colors">
            Ver agenda <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="flex items-center gap-5 px-6 py-4 hover:bg-[#6366F1]/[0.02] transition-colors group">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                <Calendar className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm mb-0.5">{session.student}</p>
                <p className="text-xs text-slate-400">{session.subject} · {session.topic}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-slate-700">{session.date}</p>
                <p className="text-xs text-[#6366F1] font-medium mt-0.5">{session.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI insight strip */}
      <div className="relative z-10 bg-[#0C0E16] rounded-2xl p-5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 w-48 h-48 bg-[#6366F1]/8 rounded-full blur-3xl" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 right-0 h-6 bg-gradient-to-b from-transparent via-[#6366F1]/4 to-transparent" style={{ animation: "scan-line 5s ease-in-out infinite" }} />
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#6366F1]/20 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#818CF8]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">IA Insight</p>
              <p className="text-slate-500 text-xs">Basado en el rendimiento de tus estudiantes esta semana</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {[
              { label: "Mejora promedio", value: "+12%", color: "text-emerald-400" },
              { label: "Temas críticos",   value: "2",    color: "text-amber-400" },
              { label: "Match IA",         value: "97%",  color: "text-[#818CF8]" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <p className={`text-xl font-bold tabular-nums ${m.color}`}>{m.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
              </div>
            ))}
            <button className="flex items-center gap-1.5 text-xs text-[#818CF8] hover:text-[#6366F1] font-medium transition-colors">
              Ver análisis <TrendingUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
