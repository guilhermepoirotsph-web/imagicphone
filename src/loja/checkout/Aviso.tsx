/** Aviso em caixa (lacuna honesta, erro de envio, próximo passo). */
import type { ReactNode } from "react";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";

type Tom = "aviso" | "erro" | "info" | "ok";

const TONS: Record<Tom, string> = {
  aviso: "border-aviso/40 bg-aviso/10 text-aviso",
  erro: "border-erro/40 bg-erro/10 text-erro",
  info: "border-linha-forte bg-white/4 text-ouro",
  ok: "border-ok/40 bg-ok/10 text-ok",
};
const ICONES: Record<Tom, NomeIcone> = { aviso: "alerta", erro: "alerta", info: "info", ok: "check" };

interface Props {
  tom?: Tom;
  titulo?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function Aviso({ tom = "info", titulo, children, className = "" }: Props) {
  return (
    <div role={tom === "erro" ? "alert" : "status"} className={`flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed ${TONS[tom]} ${className}`}>
      <Icone nome={ICONES[tom]} tamanho={20} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        {titulo && <p className="font-bold">{titulo}</p>}
        {children && <div className={`text-cinza ${titulo ? "mt-1" : ""}`}>{children}</div>}
      </div>
    </div>
  );
}
