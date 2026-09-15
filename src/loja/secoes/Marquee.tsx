/**
 * Faixa dourada com os avisos da loja (config.anuncios, editáveis no painel)
 * + destaques do momento (pré-venda real e frase da bio). Trilho duplicado para
 * o loop contínuo (animate-marquee move -50%); o clone é aria-hidden.
 * Pausa no hover/foco. Com ?anim=0 fica parado, quebra em linhas e é legível.
 */
import { useMemo } from "react";
import { useLoja } from "@/estado/loja";
import { negocio } from "@/dados/negocio";
import { moeda } from "@/lib/formatar";
import { animado } from "@/lib/movimento";
import Icone from "@/componentes/ui/Icones";

export default function Marquee() {
  const anuncios = useLoja((s) => s.config.anuncios);
  const produtos = useLoja((s) => s.produtos);
  const ligado = animado();

  const itens = useMemo(() => {
    const preVenda = produtos.find((p) => p.ativo && p.preVenda !== null && !p.demo);
    const extras: string[] = [];
    if (preVenda && preVenda.preVenda) {
      const gb = preVenda.armazenamento ? ` no ${preVenda.armazenamento} GB` : "";
      extras.push(`Pré-venda ${preVenda.nome}: ${moeda(preVenda.preco)}${gb} · sinal de ${preVenda.preVenda.sinalPercentual}%`);
    }
    extras.push(negocio.bio[1]); // "iPhone é na iMagicPhone!"
    return [...anuncios.filter((a) => a.trim().length > 0), ...extras];
  }, [anuncios, produtos]);

  if (itens.length === 0) return null;

  const lista = itens.map((texto, i) => (
    <li key={`${i}-${texto}`} className="flex items-center gap-4 whitespace-nowrap px-5 py-3 text-[0.74rem] font-bold uppercase tracking-[0.18em] sm:text-[0.78rem]">
      <span>{texto}</span>
      <Icone nome="brilho" tamanho={11} className="text-preto/60" />
    </li>
  ));

  return (
    <section
      aria-label="Avisos da loja"
      className="group relative z-[4] overflow-hidden border-y border-ouro-escuro/70 bg-[linear-gradient(110deg,#b8922e,#f1d97a_40%,#d4b24c_65%,#9c7a1e)] text-preto"
    >
      <div
        className={
          ligado
            ? "flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            : "flex w-full flex-wrap justify-center"
        }
      >
        <ul className={`flex items-center ${ligado ? "shrink-0" : "flex-wrap justify-center"}`}>{lista}</ul>
        {ligado && (
          <ul className="flex shrink-0 items-center" aria-hidden="true">
            {lista}
          </ul>
        )}
      </div>
    </section>
  );
}
