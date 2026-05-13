import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Sparkles, ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";
import api from "../../api/client";

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    password_confirm: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password/", {
        token,
        password: formData.password,
        password_confirm: formData.password_confirm,
      });
      setSuccess(true);
      toast.success("Contraseña actualizada correctamente");
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Enlace inválido o expirado";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#080B14]">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">Enlace inválido.</p>
          <Button onClick={() => navigate("/")} className="bg-[#6366F1] text-white rounded-xl">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex bg-[#080B14]">
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-14 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#6366F1]/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366F1]/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">EduMatch AI</span>
        </div>
        <div className="relative z-10 space-y-5">
          <h2 className="text-[3rem] font-bold text-white leading-[1.1] tracking-tight">
            Nueva<br />
            <span className="text-[#6366F1]">contraseña.</span>
          </h2>
        </div>
        <div />
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-[#0D1020]">
        <div className="w-full max-w-[400px]">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </button>

          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <KeyRound className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">¡Contraseña actualizada!</h1>
              <p className="text-slate-400 text-sm">Redirigiendo al inicio de sesión...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-[1.75rem] font-bold text-white tracking-tight mb-1.5">
                  Nueva contraseña
                </h1>
                <p className="text-slate-400 text-sm">Mínimo 8 caracteres.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                    Nueva contraseña
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-12 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password_confirm" className="text-slate-300 text-sm font-medium">
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="password_confirm"
                    name="password_confirm"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    required
                    className="h-12 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1] transition-colors"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-semibold mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      Cambiar contraseña
                    </span>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
