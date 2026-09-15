/**
 * Indicador do dashboard: rótulo + valor grande + linha de variação/contexto.
 * Uso: <Kpi rotulo="Pedidos hoje" valor="3" variacao="1 novo para confirmar" tom="aviso" icone="pedidos" />
 */
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";

export type TomKpi = "ouro" | "ok" | "aviso" | "erro" | "neutro";

interface Props {
  rotulo: string;
  valor: string;
  variacao?: string;
  tom?: TomKpi;
  icone?: NomeIcone;
  className?: string;
}

const TONS: Record<TomKpi, { icone: string; texto: string }> = {
  ouro: { icone: "bg-ouro/15 text-ouro", texto: "text-ouro" },
  ok: { icone: "bg-ok/15 text-ok", texto: "text-ok" },
  aviso: { icone: "bg-aviso/15 text-aviso", texto: "text-aviso" },
  erro: { icone: "bg-erro/15 text-erro", texto: "text-erro" },
  neutro: { icone: "bg-white/8 text-cinza", texto: "text-cinza" },
};

export default function Kpi({ rotulo, valor, variacao, tom = "neutro", icone, className = "" }: Props) {
  const t = TONS[tom];
  return (
    <div className={`flex min-w-0 items-start gap-3 rounded-[1.25rem] border border-linha bg-grafite p-4 sm:p-5 ${className}`}>
      {icone && (
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${t.icone}`} aria-hidden="true">
          <Icone nome={icone} tamanho={18} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.68rem] font-bold uppercase tracking-[0.16em] text-cinza">{rotulo}</p>
        <p className="texto-display mt-1 truncate text-2xl text-marfim" title={valor}>
          {valor}
        </p>
        {variacao && <p className={`mt-1 text-xs font-semibold ${t.texto}`}>{variacao}</p>}
      </div>
    </div>
  );
}
