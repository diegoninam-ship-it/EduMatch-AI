import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Sparkles, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import api from "../../api/client";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password/", { correo });
      setSent(true);
      toast.success("Revisa tu correo para el enlace de recuperación");
    } catch (error: any) {
      toast.error("Error al enviar el correo. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex bg-[#080B14]">
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-14 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#6366F1]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#14B8A6]/6 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366F1]/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">EduMatch AI</span>
        </div>
        <div className="relative z-10 space-y-5">
          <h2 className="text-[3rem] font-bold text-white leading-[1.1] tracking-tight">
            Recupera tu<br />
            <span className="text-[#6366F1]">acceso.</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xs">
            Te enviaremos un enlace seguro con expiración de 30 minutos.
          </p>
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

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#6366F1]/20 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-[#6366F1]" />
              </div>
              <h1 className="text-2xl font-bold text-white">Correo enviado</h1>
              <p className="text-slate-400 text-sm">
                Si el correo existe en nuestro sistema, recibirás un enlace de recuperación válido por 30 minutos.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="w-full h-12 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-semibold"
              >
                Volver al inicio de sesión
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-[1.75rem] font-bold text-white tracking-tight mb-1.5">
                  Recuperar contraseña
                </h1>
                <p className="text-slate-400 text-sm">
                  Ingresa tu correo y te enviaremos un enlace de recuperación.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="correo" className="text-slate-300 text-sm font-medium">
                    Correo electrónico
                  </Label>
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    placeholder="tu@email.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
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
                      Enviando...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Enviar enlace
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
