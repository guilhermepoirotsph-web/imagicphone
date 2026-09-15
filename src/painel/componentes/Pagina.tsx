/**
 * Cabeçalho padrão de página do painel: o ÚNICO <h1> da tela + descrição +
 * ações à direita, e o conteúdo abaixo. Também atualiza o <title> da aba.
 * Uso: <Pagina titulo="Produtos" descricao="…" acoes={<Botao …/>}>…</Pagina>
 */
import { useEffect, type ReactNode } from "react";

interface Props {
  titulo: ReactNode;
  descricao?: ReactNode;
  acoes?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Pagina({ titulo, descricao, acoes, children, className = "" }: Props) {
  useEffect(() => {
    if (typeof titulo === "string") document.title = `${titulo} · Painel iMagicPhone`;
  }, [titulo]);

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="texto-display text-2xl text-tinta">{titulo}</h1>
          {descricao && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cinza">{descricao}</p>}
        </div>
        {acoes && <div className="flex shrink-0 flex-wrap gap-2">{acoes}</div>}
      </header>
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
    </div>
  );
}
