/** Indicador das 3 etapas: Carrinho → Finalizar → Pedido. */
import { Link } from "react-router-dom";
import Icone from "@/componentes/ui/Icones";

const PASSOS: { rotulo: string; rota: string | null }[] = [
  { rotulo: "Carrinho", rota: "/carrinho" },
  { rotulo: "Finalizar", rota: "/checkout" },
  { rotulo: "Pedido", rota: null },
];

export default function Passos({ atual }: { atual: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Etapas da compra">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] font-bold uppercase tracking-[0.2em]">
        {PASSOS.map((p, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const feito = n < atual;
          const ehAtual = n === atual;
          const classe = ehAtual ? "text-ouro" : feito ? "text-tinta" : "text-cinza-escuro";
          return (
            <li key={p.rotulo} className="flex items-center gap-2">
              {i > 0 && <Icone nome="chevron" tamanho={12} className="text-cinza-escuro" />}
              {feito && p.rota ? (
                <Link to={p.rota} className={`${classe} inline-flex min-h-8 items-center hover:text-ouro`}>
                  {n}. {p.rotulo}
                </Link>
              ) : (
                <span className={`inline-flex min-h-8 items-center ${classe}`} aria-current={ehAtual ? "step" : undefined}>
                  {n}. {p.rotulo}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
