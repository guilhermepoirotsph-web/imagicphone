/**
 * Cabeçalho padrão de seção: rótulo dourado + título + descrição, com reveal.
 * Uso: <Secao id="destaques" rotulo="Disponíveis" titulo="…" descricao="…">…</Secao>
 */
import type { ReactNode } from "react";
import { usarReveal } from "@/lib/movimento";

interface Props {
  id?: string;
  rotulo?: string;
  titulo: ReactNode;
  descricao?: ReactNode;
  acao?: ReactNode;
  alinhamento?: "esquerda" | "centro";
  className?: string;
  classeCabecalho?: string;
  children?: ReactNode;
  nivel?: 1 | 2;
  semContainer?: boolean;
}

export default function Secao({ id, rotulo, titulo, descricao, acao, alinhamento = "esquerda", className = "", classeCabecalho = "", children, nivel = 2, semContainer = false }: Props) {
  const ref = usarReveal<HTMLDivElement>({ y: 28 });
  const centro = alinhamento === "centro";
  const Titulo = nivel === 1 ? "h1" : "h2";
  const idTitulo = id ? `${id}-titulo` : undefined;
  return (
    <section id={id} aria-labelledby={idTitulo} className={`py-20 sm:py-24 ${className}`}>
      <div className={semContainer ? "" : "container-pagina"}>
        <div
          ref={ref}
          data-reveal
          className={`flex flex-col gap-4 ${centro ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"} ${classeCabecalho}`}
        >
          <div className={centro ? "max-w-2xl" : "max-w-2xl"}>
            {rotulo && (
              <p className={`rotulo ${centro ? "justify-center" : ""}`}>
                <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
                {rotulo}
              </p>
            )}
            <Titulo id={idTitulo} className="texto-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
              {titulo}
            </Titulo>
            {descricao && <p className="mt-4 text-base leading-relaxed text-cinza sm:text-lg">{descricao}</p>}
          </div>
          {acao && <div className="shrink-0">{acao}</div>}
        </div>
        {children && <div className="mt-10 sm:mt-12">{children}</div>}
      </div>
    </section>
  );
}
