/** Aviso em caixa do painel. */
import type { ReactNode } from "react";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";

type Tom = "info" | "aviso" | "erro" | "ok";
const TONS: Record<Tom, string> = {
  info: "border-linha-forte bg-white/4 text-ouro",
  aviso: "border-aviso/40 bg-aviso/10 text-aviso",
  erro: "border-erro/40 bg-erro/10 text-erro",
  ok: "border-ok/40 bg-ok/10 text-ok",
};
const ICONES: Record<Tom, NomeIcone> = { info: "info", aviso: "alerta", erro: "alerta", ok: "check" };

export default function Aviso({ tom = "info", titulo, children, className = "" }: { tom?: Tom; titulo?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div role={tom === "erro" ? "alert" : "status"} className={`flex gap-3 rounded-xl border p-3.5 text-sm ${TONS[tom]} ${className}`}>
      <Icone nome={ICONES[tom]} tamanho={18} className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        {titulo && <p className="font-bold">{titulo}</p>}
        {children && <div className={`text-cinza ${titulo ? "mt-0.5" : ""}`}>{children}</div>}
      </div>
    </div>
  );
}
