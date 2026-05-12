import { CreditCard, DollarSign, CheckCircle2, Clock, XCircle, TrendingUp, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getPagosAdmin } from "../../../api/admin";

const mockPayments = [
  { id: 1, sessionId: 3421, student: "Carlos Mendoza", tutor: "María González", amount: 25, date: "2026-04-01", time: "16:05", status: "completed", method: "Tarjeta" },
  { id: 2, sessionId: 3420, student: "Ana Pérez",       tutor: "Jorge López",    amount: 32, date: "2026-04-01", time: "14:30", status: "completed", method: "PayPal" },
  { id: 3, sessionId: 3419, student: "Luis García",     tutor: "Carlos Ramírez", amount: 30, date: "2026-03-31", time: "18:20", status: "completed", method: "Tarjeta" },
  { id: 4, sessionId: 3418, student: "María Torres",    tutor: "Ana Martínez",   amount: 28, date: "2026-03-31", time: "15:45", status: "pending",   method: "Transferencia" },
  { id: 5, sessionId: 3417, student: "Jorge Sánchez",   tutor: "María González", amount: 25, date: "2026-03-30", time: "17:10", status: "completed", method: "Tarjeta" },
  { id: 6, sessionId: 3416, student: "Laura Fernández", tutor: "Jorge López",    amount: 32, date: "2026-03-30", time: "10:30", status: "failed",    method: "Tarjeta" },
  { id: 7, sessionId: 3415, student: "Pedro Ramírez",   tutor: "Carlos Ramírez", amount: 30, date: "2026-03-29", time: "19:00", status: "completed", method: "PayPal" },
  { id: 8, sessionId: 3414, student: "Sofía López",     tutor: "Ana Martínez",   amount: 28, date: "2026-03-29", time: "16:25", status: "completed", method: "Tarjeta" },
];

const statusConfig = {
  completed: { icon: CheckCircle2, label: "Completado", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  pending:   { icon: Clock,        label: "Pendiente",  bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-400" },
  failed:    { icon: XCircle,      label: "Fallido",    bg: "bg-red-50",     text: "text-red-600",    border: "border-red-200",    dot: "bg-red-400" },
};

const methodIcon: Record<string, string> = { Tarjeta: "💳", PayPal: "🅿️", Transferencia: "🏦" };

export function PaymentsManagement() {
  const [pagosApi, setPagosApi] = useState<any[]>([]);

useEffect(() => {
  getPagosAdmin()
    .then(setPagosApi)
    .catch(() => {});
}, []);

const payments = pagosApi.length > 0
  ? pagosApi.map((p: any) => ({
      id:        p.id,
      sessionId: p.sesion ?? p.id,
      student:   p.estudiante?.usuario?.nombre ?? "—",
      tutor:     "—",
      amount:    p.monto ?? 0,
      date:      p.fecha_pago?.split("T")[0] ?? "",
      time:      p.fecha_pago?.split("T")[1]?.slice(0, 5) ?? "—",
      status:    p.estado === "COMPLETADO" ? "completed"
               : p.estado === "PENDIENTE"  ? "pending"
               : "failed",
      method: p.metodo_pago ?? "Tarjeta",
    }))
  : mockPayments;
  const totalRevenue = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const stats = {
    completed: payments.filter(p => p.status === "completed").length,
    pending:   payments.filter(p => p.status === "pending").length,
    failed:    payments.filter(p => p.status === "failed").length,
  };

  return (
    <div className="relative min-h-full p-8 space-y-8">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/3 w-[440px] h-[300px] bg-emerald-400/5 rounded-full blur-[100px]" style={{ animation: "float-a 10s ease-in-out infinite" }} />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-[#6366F1]/4 rounded-full blur-[80px]"  style={{ animation: "float-b 13s ease-in-out infinite" }} />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Administración</p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Pagos</h1>
        <p className="text-slate-400 text-sm mt-1">Gestión y seguimiento de transacciones</p>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        {/* Revenue hero card */}
        <div className="col-span-2 bg-[#0C0E16] rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#6366F1]/15 cursor-default">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-10 -right-10 w-52 h-52 bg-emerald-400/8 rounded-full blur-3xl" />
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.3) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-400/15 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <TrendingUp className="w-3 h-3" /> Esta semana
              </span>
            </div>
            <p className="text-5xl font-bold text-white tabular-nums tracking-tight">${totalRevenue}</p>
            <p className="text-slate-400 text-sm mt-1.5">Ingresos totales</p>
          </div>
        </div>

        {[
          { label: "Completados", value: stats.completed, icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
          { label: "Pendientes",  value: stats.pending,   icon: Clock,        iconBg: "bg-amber-50",   iconColor: "text-amber-500" },
          { label: "Fallidos",    value: stats.failed,    icon: XCircle,      iconBg: "bg-red-50",     iconColor: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200/70 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#6366F1]/8 cursor-default">
            <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <p className="text-4xl font-bold text-slate-800 tabular-nums tracking-tight">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="relative z-10 bg-white border border-slate-200/70 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700">Transacciones recientes</h2>
          </div>
          <button className="flex items-center gap-1 text-xs text-[#6366F1] hover:text-[#4F46E5] font-medium transition-colors">
            Ver todas <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {payments.map((payment) => {
            const cfg = statusConfig[payment.status as keyof typeof statusConfig];
            const StatusIcon = cfg.icon;
            return (
              <div key={payment.id} className="flex items-center gap-5 px-6 py-4 hover:bg-[#6366F1]/[0.02] transition-colors group">
                {/* Method icon */}
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                  {methodIcon[payment.method] ?? "💵"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-slate-800 text-sm">
                      {payment.student} → {payment.tutor}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Sesión #{payment.sessionId} · {payment.method} ·{" "}
                    {new Date(payment.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })} {payment.time}
                  </p>
                </div>

                {/* Amount */}
                <p className="text-xl font-bold text-slate-800 tabular-nums flex-shrink-0">
                  ${payment.amount}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
