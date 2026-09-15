/**
 * Cartão-rádio: um <input type="radio"> real (teclado e leitor de tela nativos)
 * dentro de um cartão clicável. Conteúdo extra aparece quando marcado.
 */
import type { ReactNode } from "react";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";

interface Props<V extends string> {
  nome: string;
  valor: V;
  marcado: boolean;
  aoMarcar: (valor: V) => void;
  titulo: string;
  descricao?: ReactNode;
  icone: NomeIcone;
  /** conteúdo mostrado só quando este cartão está marcado */
  children?: ReactNode;
}

export default function CartaoRadio<V extends string>({ nome, valor, marcado, aoMarcar, titulo, descricao, icone, children }: Props<V>) {
  return (
    <label
      className={`cartao relative block cursor-pointer p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ouro ${
        marcado ? "border-ouro/70 bg-ouro/8" : "hover:border-linha-forte"
      }`}
    >
      <span className="flex items-start gap-3">
        <input type="radio" name={nome} value={valor} checked={marcado} onChange={() => aoMarcar(valor)} className="sr-only" />
        <span
          aria-hidden="true"
          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${marcado ? "border-ouro" : "border-linha-forte"}`}
        >
          <span className={`size-2.5 rounded-full bg-ouro transition-opacity ${marcado ? "opacity-100" : "opacity-0"}`} />
        </span>
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl border ${marcado ? "border-ouro/40 bg-ouro/10 text-ouro" : "border-linha bg-white/4 text-cinza"}`}>
          <Icone nome={icone} tamanho={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-sm font-bold sm:text-base">{titulo}</span>
          {descricao && <span className="mt-0.5 block text-xs leading-relaxed text-cinza sm:text-sm">{descricao}</span>}
        </span>
      </span>
      {marcado && children && <div className="mt-4 border-t border-linha pt-4">{children}</div>}
    </label>
  );
}
