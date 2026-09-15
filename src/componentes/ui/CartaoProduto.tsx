/**
 * Cartão de produto — tilt 3D no hover (desktop), holofote dourado seguindo o
 * cursor, selos (Novo/Seminovo/Oferta/Pré-venda/🇺🇸/exemplo) e ação rápida.
 * Mesmo componente na home, nas categorias e nos "relacionados".
 */
import { Link } from "react-router-dom";
import type { Produto } from "@/dados/tipos";
import { moeda, parcelas } from "@/lib/formatar";
import { temOferta, rotuloVariacao } from "@/estado/loja";
import { useCarrinho } from "@/estado/carrinho";
import { usarTilt } from "@/lib/movimento";
import ArteProduto from "@/componentes/marca/ArteProduto";
import Selo from "./Selo";
import Icone from "./Icones";

interface Props {
  produto: Produto;
  compacto?: boolean;
  prioridade?: boolean;
}

export default function CartaoProduto({ produto, compacto = false }: Props) {
  const ref = usarTilt<HTMLElement>(6);
  const adicionar = useCarrinho((s) => s.adicionar);
  const oferta = temOferta(produto);
  const esgotado = produto.estoque <= 0;
  const rota = `/produto/${produto.slug}`;

  return (
    <article
      ref={ref}
      data-gsap
      className="group cartao relative flex h-full flex-col overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-ouro/40 hover:shadow-cartao"
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
    >
      {/* holofote dourado seguindo o cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(340px circle at var(--mx) var(--my), rgba(212,178,76,.14), transparent 60%)" }}
      />

      <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
        <Selo tom={produto.condicao === "novo" ? "novo" : "seminovo"}>{produto.condicao === "novo" ? "Novo" : "Seminovo"}</Selo>
        {produto.preVenda && <Selo tom="ouro">Pré-venda</Selo>}
        {oferta && <Selo tom="ok">Oferta</Selo>}
        {produto.origem === "EUA" && <Selo tom="neutro" titulo="Versão americana (eSIM)">🇺🇸 EUA</Selo>}
        {produto.demo && <Selo tom="demo" titulo="Dado de exemplo — substituir pelo catálogo real">exemplo</Selo>}
      </div>

      <Link to={rota} className="relative block" aria-label={`${produto.nome} ${rotuloVariacao(produto)}`}>
        <div className={`relative overflow-hidden bg-[radial-gradient(70%_60%_at_50%_70%,rgba(212,178,76,.10),transparent_70%)] ${compacto ? "aspect-[4/4]" : "aspect-[4/5]"}`}>
          <div className="absolute inset-[10%] transition-transform duration-500 ease-out group-hover:scale-[1.05]">
            <ArteProduto produto={produto} indice={0} />
          </div>
          {esgotado && (
            <div className="absolute inset-x-0 bottom-0 bg-preto/70 py-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-marfim backdrop-blur-sm">
              Sob consulta
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-bold leading-snug">
          <Link to={rota} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {produto.nome}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-cinza">{rotuloVariacao(produto)}{produto.bateria ? ` · bateria ${produto.bateria}%` : ""}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-extrabold text-marfim">{moeda(produto.preco)}</span>
          {oferta && <s className="text-xs text-cinza">{moeda(produto.precoDe as number)}</s>}
        </div>
        <p className="mt-0.5 text-xs text-cinza">
          {produto.preVenda ? `sinal de ${produto.preVenda.sinalPercentual}% para reservar` : `ou ${parcelas(produto.preco, produto.parcelas)} · a combinar`}
        </p>
        <div className="relative z-10 mt-4 flex gap-2">
          <span className="botao-contorno !min-h-11 flex-1 text-sm transition-colors group-hover:border-ouro group-hover:bg-ouro group-hover:text-preto">
            Ver detalhes
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              adicionar(produto.id, 1);
            }}
            disabled={esgotado}
            aria-label={`Adicionar ${produto.nome} ao carrinho`}
            className="grid size-11 place-items-center rounded-full border border-linha-forte text-tinta transition-colors hover:border-ouro hover:text-ouro disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icone nome="carrinho" tamanho={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
