import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Sparkles, LogIn, UserPlus, ArrowRight, Brain,
  Target, Zap, Shield, Star, BookOpen, Users, TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

/* ─── helpers ───────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── data ───────────────────────────────────────────────────────── */
const marqueeItems = [
  { icon: Brain,    text: "Rutas personalizadas por IA" },
  { icon: Users,    text: "156 tutores verificados" },
  { icon: Star,     text: "Calificación promedio 4.8" },
  { icon: Target,   text: "94% de satisfacción" },
  { icon: Zap,      text: "Matching en segundos" },
  { icon: BookOpen, text: "1,247 estudiantes activos" },
  { icon: Shield,   text: "Tutores certificados" },
  { icon: TrendingUp, text: "Progreso medible" },
];

const testimonials = [
  { name: "Ana Rodríguez",  role: "Estudiante de Ingeniería", quote: "La IA me asignó el tutor perfecto en mi primer día. Pasé Cálculo II en dos semanas.", seed: "face1", rating: 5 },
  { name: "Jorge Sánchez",  role: "Tutor de Matemáticas",    quote: "Mis sesiones están siempre llenas porque el sistema me conecta con quienes realmente necesitan mi especialidad.", seed: "face2", rating: 5 },
  { name: "María Torres",   role: "Estudiante de Física",    quote: "Mi ruta de aprendizaje se adapta sola. Cuando me atasco, el sistema ya tiene una solución antes de que la pida.", seed: "face3", rating: 5 },
];

/* ─── bento cards ────────────────────────────────────────────────── */
const bentoCards = [
  {
    id: "a", span: "md:col-span-2 md:row-span-1",
    img: "https://picsum.photos/seed/neuralnet/800/400",
    title: "Matching inteligente",
    body:  "El modelo analiza tu estilo de aprendizaje, nivel real y objetivos para conectarte con el tutor cuya metodología maximiza tu avance.",
    tag: "IA",
  },
  {
    id: "b", span: "md:col-span-1 md:row-span-2",
    img: "https://picsum.photos/seed/darkdesk/400/700",
    title: "Progreso en tiempo real",
    body:  "Dashboards adaptativos que evolucionan con cada sesión. La IA detecta patrones antes de que tú los notes.",
    tag: "Analítica",
  },
  {
    id: "c", span: "md:col-span-1 md:row-span-1",
    img: "https://picsum.photos/seed/classroom/400/300",
    title: "Tutores verificados",
    body:  "Cada tutor pasa por certificación de especialidad y entrevistas de metodología.",
    tag: "Calidad",
  },
  {
    id: "d", span: "md:col-span-1 md:row-span-1",
    img: "https://picsum.photos/seed/coding/400/300",
    title: "Ruta adaptativa",
    body:  "Si te atascas, el plan se reorganiza automáticamente para reforzar el concepto desde otro ángulo.",
    tag: "Adaptación",
  },
];

const steps = [
  { n: "01", title: "Cuéntanos tus metas",   body: "Completas un perfil inteligente. La IA mapea tu nivel, estilo y objetivos en menos de 3 minutos." },
  { n: "02", title: "Recibe tu ruta",         body: "El sistema genera una ruta de aprendizaje personalizada con los temas y el orden óptimo para ti." },
  { n: "03", title: "Conoce tu tutor",         body: "Matching automático con el tutor cuya especialidad y disponibilidad mejor encajan con tu perfil." },
  { n: "04", title: "Aprende y avanza",        body: "Cada sesión actualiza tu ruta. El progreso es medible, visible y tuyo desde el primer día." },
];

/* ─── main component ─────────────────────────────────────────────── */
export function Landing() {
  const navigate = useNavigate();
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const { loginAdmin } = await import("../../api/admin");
    const data = await loginAdmin(email, password);
    localStorage.setItem("token",     data.token);
    localStorage.setItem("rol",       data.rol);
    localStorage.setItem("nombre",    data.nombre);
    localStorage.setItem("usuarioId", String(data.usuarioId));
    toast.success(`Bienvenido, ${data.nombre}`);
    navigate("/admin");
  } catch {
    try {
      const { login } = await import("../../api/auth");
      const data = await login(email, password);
      toast.success(`Bienvenido, ${data.nombre}`);
      if (data.rol === "DOCENTE") navigate("/tutor");
      else navigate("/user");
    } catch {
      toast.error("Correo o contraseña incorrectos");
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="overflow-x-hidden w-full max-w-full bg-[#050810]">

      {/* ══════════════════════════════════════════════
          NAV — floating glass pill
      ══════════════════════════════════════════════ */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="flex items-center justify-between bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-2xl px-6 py-3 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#6366F1] rounded-lg flex items-center justify-center shadow-lg shadow-[#6366F1]/40">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">EduMatch AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {["Cómo funciona", "Tutores", "Precios"].map((item) => (
              <button key={item} className="text-slate-400 hover:text-white text-sm transition-colors duration-150">{item}</button>
            ))}
          </div>
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 active:scale-95 shadow-sm shadow-[#6366F1]/30"
          >
            Empezar gratis <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          HERO — cinematic center / split
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-dvh flex">
        {/* Background image with dark radial wash */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://picsum.photos/seed/studyroom/1920/1080"
            alt=""
            className="w-full h-full object-cover opacity-20"
            style={{ filter: "grayscale(40%) contrast(1.1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/85 to-[#050810]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-[#050810]/40" />
          {/* Ambient spotlight */}
          <div
            className="absolute top-1/4 left-1/4 w-[700px] h-[500px] bg-[#6366F1]/12 rounded-full blur-[140px]"
            style={{ animation: "spotlight 6s ease-in-out infinite" }}
          />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#14B8A6]/6 rounded-full blur-[120px]" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #6366F1 1px, transparent 1px)", backgroundSize: "36px 36px" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center px-6 lg:px-16 pt-28 pb-16 gap-12 max-w-7xl mx-auto">

          {/* LEFT: headline + stats */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-full px-4 py-1.5 mb-6 w-fit"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
              <span className="text-[#818CF8] text-xs font-semibold tracking-wide">Inteligencia Artificial aplicada a educación</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="text-white font-bold leading-[1.05] tracking-tight w-full max-w-5xl"
              style={{ fontSize: "clamp(2.8rem, 4.5vw, 5rem)" }}
            >
              Aprende con quien
              <br />
              <span className="text-[#818CF8]">entiende tu ritmo.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-slate-400 mt-6 max-w-lg text-lg leading-relaxed"
            >
              La IA analiza tu forma de aprender, detecta tus brechas y te conecta
              con el tutor ideal. No es genérico: es tuyo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.5 }}
              className="flex items-center gap-4 mt-8"
            >
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.97] shadow-xl shadow-[#6366F1]/25 text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Empezar gratis
              </button>
              <button className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium transition-colors">
                Ver cómo funciona <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center gap-8 mt-14 pt-8 border-t border-white/[0.06]"
            >
              {[
                { value: "1,247", label: "estudiantes activos" },
                { value: "156",   label: "tutores verificados" },
                { value: "94%",   label: "satisfacción" },
                { value: "3,421", label: "sesiones completadas" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white tabular-nums tracking-tight">{s.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: login card */}
          <motion.div
            initial={{ opacity: 0, x: 32, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[420px] flex-shrink-0"
          >
            <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/40">
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-white tracking-tight">Accede a tu cuenta</h2>
                <p className="text-slate-400 text-sm mt-1">El rol se detecta automáticamente.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm font-medium">Correo electrónico</Label>
                  <Input
                    type="email" placeholder="tu@email.com" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white/[0.06] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm font-medium">Contraseña</Label>
                  <Input
                    type="password" placeholder="••••••••" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-white/[0.06] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1] transition-colors"
                  />
                </div>
                <Button
                  type="submit" disabled={isLoading}
                  className="w-full h-12 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-semibold mt-1 transition-all duration-150 active:scale-[0.98] shadow-lg shadow-[#6366F1]/20"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verificando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><LogIn className="w-4 h-4" />Acceder</span>
                  )}
                </Button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-slate-600 text-xs">o</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              <button
                onClick={() => navigate("/register")}
                className="w-full h-11 border border-white/[0.08] text-slate-300 hover:bg-white/[0.05] hover:text-white rounded-xl transition-all duration-150 text-sm font-medium flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Crear cuenta nueva
              </button>

              <p className="text-center text-slate-600 text-xs mt-5">
                Acceso seguro · Identificación automática de rol
              </p>
            </div>
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 z-10">
          <span className="text-xs tracking-widest uppercase">Explorar</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MARQUEE — infinite scroll strip
      ══════════════════════════════════════════════ */}
      <section className="relative py-6 border-y border-white/[0.05] overflow-hidden bg-white/[0.01]">
        <div
          className="flex gap-0 whitespace-nowrap"
          style={{ animation: "marquee-scroll 28s linear infinite", width: "max-content" }}
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-8">
              <item.icon className="w-4 h-4 text-[#6366F1] flex-shrink-0" />
              <span className="text-slate-400 text-sm font-medium tracking-wide">{item.text}</span>
              <span className="text-white/10 text-lg ml-4">·</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BENTO — feature grid
      ══════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 px-6 lg:px-16 max-w-7xl mx-auto">
        <FadeUp className="mb-16">
          <p className="text-[#818CF8] text-sm font-semibold tracking-widest uppercase mb-3">Lo que nos hace diferentes</p>
          <h2
            className="text-white font-bold leading-[1.08] tracking-tight max-w-2xl"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
          >
            Tecnología que entiende
            <br />
            cómo aprendes.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 md:grid-rows-2 gap-4 grid-flow-dense">
          {bentoCards.map((card, i) => (
            <FadeUp key={card.id} delay={i * 0.1} className={`${card.span}`}>
              <div className="group relative h-full min-h-[260px] rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-[#6366F1]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#6366F1]/10 cursor-default">
                {/* Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-700 ease-out"
                    style={{ filter: "grayscale(30%) contrast(1.1)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />
                </div>
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-end h-full p-6">
                  <span className="inline-flex self-start px-2.5 py-0.5 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/25 text-[#818CF8] text-xs font-semibold mb-3">{card.tag}</span>
                  <h3 className="text-white font-bold text-lg mb-2 leading-snug">{card.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{card.body}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS — stacked steps (card stack / scroll)
      ══════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 px-6 lg:px-16 bg-[#060A14]">
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6366F1]/6 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp className="text-center mb-20">
            <p className="text-[#818CF8] text-sm font-semibold tracking-widest uppercase mb-3">El proceso</p>
            <h2
              className="text-white font-bold leading-[1.08] tracking-tight max-w-3xl mx-auto"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
            >
              De cero a aprender
              <br />
              en cuatro pasos.
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <FadeUp key={step.n} delay={i * 0.12}>
                <div
                  className={`relative p-6 rounded-2xl border cursor-default transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group ${
                    activeStep === i
                      ? "bg-[#6366F1] border-[#6366F1] shadow-xl shadow-[#6366F1]/25"
                      : "bg-white/[0.02] border-white/[0.06] hover:border-[#6366F1]/30 hover:bg-white/[0.04] hover:shadow-[#6366F1]/8"
                  }`}
                  onMouseEnter={() => setActiveStep(i)}
                >
                  <span className={`block text-5xl font-bold tabular-nums mb-4 leading-none transition-colors ${activeStep === i ? "text-white/20" : "text-white/8 group-hover:text-[#6366F1]/20"}`}>
                    {step.n}
                  </span>
                  <h3 className={`font-bold text-base mb-2 transition-colors ${activeStep === i ? "text-white" : "text-slate-200"}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-colors ${activeStep === i ? "text-white/75" : "text-slate-500"}`}>
                    {step.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS — carousel
      ══════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-16">
            <p className="text-[#818CF8] text-sm font-semibold tracking-widest uppercase mb-3">Testimonios</p>
            <h2
              className="text-white font-bold leading-[1.08] tracking-tight max-w-2xl mx-auto"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
            >
              Lo que dicen
              <br />
              quienes ya aprenden.
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.12}>
                <div className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7 hover:border-[#6366F1]/25 hover:bg-white/[0.04] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#6366F1]/8 transition-all duration-400 cursor-default">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} className="w-3.5 h-3.5 fill-[#6366F1] text-[#6366F1]" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-slate-300 text-base leading-relaxed mb-7">"{t.quote}"</p>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img
                        src={`https://picsum.photos/seed/${t.seed}/80/80`}
                        alt={t.name}
                        className="w-full h-full object-cover"
                        style={{ filter: "grayscale(20%)" }}
                      />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA — high contrast action
      ══════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#6366F1]">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }} />
          <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4F46E5]/40 rounded-full blur-[100px]" />
          {/* Scanline */}
          <div
            className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
            style={{ animation: "scan-line 5s ease-in-out infinite" }}
          />
        </div>

        <FadeUp className="relative z-10 text-center max-w-3xl mx-auto">
          <h2
            className="text-white font-bold leading-[1.08] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 4.5vw, 5rem)" }}
          >
            Tu ruta empieza
            <br />
            hoy.
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Registro gratuito. Ruta generada en minutos. Primer sesión con tu tutor ideal dentro de 24 horas.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 bg-white text-[#6366F1] font-bold px-8 py-4 rounded-xl transition-all duration-150 active:scale-[0.97] hover:shadow-xl hover:shadow-black/20 text-base"
            >
              <UserPlus className="w-5 h-5" />
              Crear cuenta gratis
            </button>
            <button className="flex items-center gap-2 text-white/80 hover:text-white text-base font-medium transition-colors">
              Ver demo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="relative border-t border-white/[0.05] py-16 px-6 lg:px-16 bg-[#050810]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold">EduMatch AI</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Plataforma de tutorías inteligentes. Conectamos estudiantes con los tutores que realmente encajan.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-12 text-sm">
              {[
                { title: "Plataforma", links: ["Cómo funciona", "Tutores", "Para estudiantes", "Para tutores"] },
                { title: "Empresa",   links: ["Sobre nosotros", "Blog", "Prensa", "Careers"] },
                { title: "Legal",     links: ["Privacidad", "Términos", "Cookies"] },
              ].map((col) => (
                <div key={col.title}>
                  <p className="text-white font-semibold mb-4">{col.title}</p>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <button className="text-slate-500 hover:text-slate-300 transition-colors">{link}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-8 border-t border-white/[0.05]">
            <p className="text-slate-600 text-xs">© 2026 EduMatch AI. Todos los derechos reservados.</p>
            <p className="text-slate-600 text-xs">Hecho con IA · Para aprender mejor</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
