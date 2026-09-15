/**
 * Bloco do painel: superfície grafite com filete, título opcional (h2) e
 * ações no canto. Uso: <Cartao titulo="Últimos pedidos" acoes={<Link…/>}>…</Cartao>
 */
import type { ReactNode } from "react";

interface Props {
  titulo?: ReactNode;
  descricao?: ReactNode;
  acoes?: ReactNode;
  children: ReactNode;
  className?: string;
  /** remove o padding interno (tabelas que encostam na borda) */
  semPadding?: boolean;
}

export default function Cartao({ titulo, descricao, acoes, children, className = "", semPadding = false }: Props) {
  const temCabecalho = Boolean(titulo || acoes);
  return (
    <section className={`min-w-0 rounded-[1.25rem] border border-linha bg-grafite ${className}`}>
      {temCabecalho && (
        <header className="flex flex-col gap-2 border-b border-linha px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            {titulo && <h2 className="font-display text-sm font-bold tracking-tight text-tinta">{titulo}</h2>}
            {descricao && <p className="mt-0.5 text-xs text-cinza">{descricao}</p>}
          </div>
          {acoes && <div className="flex shrink-0 flex-wrap items-center gap-2">{acoes}</div>}
        </header>
      )}
      <div className={semPadding ? "" : "p-4 sm:p-5"}>{children}</div>
    </section>
  );
}
