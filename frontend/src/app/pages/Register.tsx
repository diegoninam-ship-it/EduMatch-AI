import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Sparkles, ArrowLeft, UserPlus, GraduationCap, BookOpen, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function Register() {
  const navigate = useNavigate();
  const [rol, setRol] = useState<'STUDENT' | 'TUTOR'>('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    password_confirm: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const { register } = await import("../../api/auth");
      await register(formData.nombre, formData.correo, formData.password, formData.password_confirm, rol);
      toast.success("Cuenta creada. Configurando tu perfil...");
      navigate("/onboarding");
    } catch (error: any) {
      const errorData = error?.response?.data;
      let msg = "Error al crear la cuenta. Intenta de nuevo.";
      
      if (errorData) {
        if (typeof errorData === 'object') {
          // Obtener el primer error disponible
          const firstError = Object.values(errorData)[0];
          if (typeof firstError === 'string') {
            msg = firstError;
          } else if (Array.isArray(firstError)) {
            msg = firstError[0];
          }
        } else if (typeof errorData === 'string') {
          msg = errorData;
        }
      }
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex bg-[#080B14]">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-14 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#6366F1]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#14B8A6]/6 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(99,102,241,0.25) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366F1]/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">EduMatch AI</span>
        </div>

        <div className="relative z-10 space-y-5">
          <h2 className="text-[3rem] font-bold text-white leading-[1.1] tracking-tight">
            Tu ruta de<br />aprendizaje,<br />
            <span className="text-[#6366F1]">generada por IA.</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xs">
            En menos de 2 minutos tendrás un plan de estudio personalizado
            listo para comenzar.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-xs">
            Al registrarte aceptas nuestros{" "}
            <span className="text-slate-400 underline underline-offset-2 cursor-pointer">
              términos de servicio
            </span>{" "}
            y{" "}
            <span className="text-slate-400 underline underline-offset-2 cursor-pointer">
              política de privacidad
            </span>
            .
          </p>
        </div>
      </div>

      {/* Right panel: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0D1020]">
        <div className="w-full max-w-[400px]">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </button>

          <div className="mb-8">
            <h1 className="text-[1.75rem] font-bold text-white tracking-tight mb-1.5">
              Crear cuenta
            </h1>
            <p className="text-slate-400 text-sm">
              Selecciona tu rol para comenzar.
            </p>
          </div>

          {/* Selector de rol */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRol('STUDENT')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 ${
                rol === 'STUDENT'
                  ? 'border-[#6366F1] bg-[#6366F1]/10 text-white'
                  : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20'
              }`}
            >
              <BookOpen className={`w-6 h-6 ${rol === 'STUDENT' ? 'text-[#818CF8]' : ''}`} />
              <span className="text-sm font-semibold">Estudiante</span>
              <span className="text-xs opacity-60">Quiero aprender</span>
            </button>
            <button
              type="button"
              onClick={() => setRol('TUTOR')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 ${
                rol === 'TUTOR'
                  ? 'border-[#6366F1] bg-[#6366F1]/10 text-white'
                  : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20'
              }`}
            >
              <GraduationCap className={`w-6 h-6 ${rol === 'TUTOR' ? 'text-[#818CF8]' : ''}`} />
              <span className="text-sm font-semibold">Docente</span>
              <span className="text-xs opacity-60">Quiero enseñar</span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nombre" className="text-slate-300 text-sm font-medium">
                Nombre completo
              </Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Carlos Mendoza"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="h-12 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="correo" className="text-slate-300 text-sm font-medium">
                Correo electrónico
              </Label>
              <Input
                id="correo"
                name="correo"
                type="email"
                placeholder="tu@email.com"
                value={formData.correo}
                onChange={handleChange}
                required
                className="h-12 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-12 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1] transition-colors pr-12"
                />
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
              <p className="text-slate-600 text-xs">Mínimo 6 caracteres</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password_confirm" className="text-slate-300 text-sm font-medium">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password_confirm"
                  name="password_confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                  className="h-12 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1] transition-colors pr-12"
                />
                {formData.password_confirm && (
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#6366F1]/20 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Crear cuenta
                </span>
              )}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-[#6366F1] hover:text-[#818CF8] font-medium transition-colors"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
