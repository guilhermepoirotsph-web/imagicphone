/**
 * Tabela genérica do painel. Responsiva: em telas estreitas rola na
 * HORIZONTAL dentro do próprio bloco (nunca estoura a página).
 * Uso:
 *   <Tabela<Produto>
 *     colunas={[{ chave: "nome", titulo: "Produto", render: (p) => p.nome }, …]}
 *     linhas={produtos}
 *     chaveLinha={(p) => p.id}
 *     vazio="Nenhum produto." />
 * Um controle por célula é responsabilidade de quem renderiza (render recebe a linha inteira).
 */
import type { ReactNode } from "react";

export interface ColunaTabela<T> {
  chave: string;
  titulo: string;
  /** largura CSS da coluna (ex.: "8rem", "20%") */
  largura?: string;
  render: (linha: T) => ReactNode;
  alinhar?: "esquerda" | "direita" | "centro";
  /** esconde o título visualmente (coluna de ações) */
  tituloOculto?: boolean;
}

interface Props<T> {
  colunas: ColunaTabela<T>[];
  linhas: T[];
  chaveLinha: (linha: T) => string;
  vazio?: ReactNode;
  /** descrição para leitores de tela (<caption> invisível) */
  legenda?: string;
  /** destaque de linha (ex.: pedido novo) */
  classeLinha?: (linha: T) => string;
  className?: string;
}

const ALINHAMENTO = { esquerda: "text-left", direita: "text-right", centro: "text-center" } as const;

export default function Tabela<T>({ colunas, linhas, chaveLinha, vazio = "Nada por aqui ainda.", legenda, classeLinha, className = "" }: Props<T>) {
  return (
    <div className={`relative w-full max-w-full overflow-x-auto overscroll-x-contain ${className}`} role="region" aria-label={legenda} tabIndex={0}>
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        {legenda && <caption className="sr-only">{legenda}</caption>}
        <thead>
          <tr className="border-b border-linha">
            {colunas.map((c) => (
              <th
                key={c.chave}
                scope="col"
                style={c.largura ? { width: c.largura } : undefined}
                className={`whitespace-nowrap px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-cinza first:pl-4 sm:first:pl-5 last:pr-4 sm:last:pr-5 ${ALINHAMENTO[c.alinhar ?? "esquerda"]}`}
              >
                {c.tituloOculto ? <span className="sr-only">{c.titulo}</span> : c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.length === 0 ? (
            <tr>
              <td colSpan={colunas.length} className="px-4 py-10 text-center text-sm text-cinza">
                {vazio}
              </td>
            </tr>
          ) : (
            linhas.map((linha) => (
              <tr key={chaveLinha(linha)} className={`border-b border-linha last:border-b-0 transition-colors hover:bg-white/[0.03] ${classeLinha?.(linha) ?? ""}`}>
                {colunas.map((c) => (
                  <td key={c.chave} className={`px-4 py-3 align-middle first:pl-4 sm:first:pl-5 last:pr-4 sm:last:pr-5 ${ALINHAMENTO[c.alinhar ?? "esquerda"]}`}>
                    {c.render(linha)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
