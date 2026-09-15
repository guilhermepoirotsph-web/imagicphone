/** Etiqueta em pílula. Tom "demo" é o selo de dado de exemplo (regra da casa: lacuna honesta visível). */
import type { ReactNode } from "react";

type Tom = "ouro" | "neutro" | "ok" | "aviso" | "erro" | "demo" | "escuro" | "novo" | "seminovo";

const TONS: Record<Tom, string> = {
  ouro: "bg-ouro/15 text-ouro border border-ouro/30",
  neutro: "bg-white/8 text-cinza border border-linha",
  ok: "bg-ok/15 text-ok border border-ok/30",
  aviso: "bg-aviso/15 text-aviso border border-aviso/30",
  erro: "bg-erro/15 text-erro border border-erro/30",
  demo: "bg-aviso/15 text-aviso border border-dashed border-aviso/50",
  escuro: "bg-preto/70 text-marfim border border-linha-forte backdrop-blur-sm",
  novo: "bg-marfim/12 text-marfim border border-marfim/20",
  seminovo: "bg-ouro/12 text-ouro-claro border border-ouro/25",
};

export default function Selo({ tom = "neutro", children, className = "", titulo }: { tom?: Tom; children: ReactNode; className?: string; titulo?: string }) {
  return (
    <span
      title={titulo}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] leading-none ${TONS[tom]} ${className}`}
    >
      {children}
    </span>
  );
}
