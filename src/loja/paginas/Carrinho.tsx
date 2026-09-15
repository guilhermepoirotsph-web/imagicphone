/** Carrinho — linhas do catálogo vigente, quantidade ±, remover, resumo e CTAs. */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCarrinho, usarLinhasCarrinho } from "@/estado/carrinho";
import { rotuloVariacao } from "@/estado/loja";
import { moeda } from "@/lib/formatar";
import ArteProduto from "@/componentes/marca/ArteProduto";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";
import Selo from "@/componentes/ui/Selo";
import Passos from "@/loja/checkout/Passos";
import ResumoValores from "@/loja/checkout/ResumoValores";

export default function Carrinho() {
  const { linhas, subtotal, quantidade } = usarLinhasCarrinho();
  const definirQuantidade = useCarrinho((s) => s.definirQuantidade);
  const remover = useCarrinho((s) => s.remover);

  useEffect(() => {
    document.title = "Seu carrinho · iMagicPhone";
  }, []);

  return (
    <div className="container-pagina py-12 sm:py-16">
      <Passos atual={1} />
      <h1 className="texto-display mt-4 text-3xl sm:text-5xl">Seu carrinho</h1>
      <p className="mt-3 text-cinza">{quantidade === 0 ? "Nada por aqui ainda." : `${quantidade} ${quantidade === 1 ? "item" : "itens"} · preço conferido no catálogo de hoje.`}</p>

      {linhas.length === 0 ? (
        <div className="cartao mt-10 flex flex-col items-center gap-4 p-12 text-center">
          <span className="grid size-16 place-items-center rounded-full border border-ouro/30 bg-ouro/10 text-ouro"><Icone nome="carrinho" tamanho={28} /></span>
          <p className="font-display text-xl font-bold">Seu carrinho está vazio.</p>
          <p className="max-w-md text-sm text-cinza">Escolha um iPhone, um produto Apple ou um acessório e ele aparece aqui.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Botao variante="ouro" para="/iphones" iconeDepois="seta">Ver iPhones</Botao>
            <Botao variante="contorno" para="/produtos">Todo o catálogo</Botao>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <ul className="grid gap-4">
            {linhas.map(({ produto, quantidade: q, subtotal: sub }) => {
              const maximo = Math.max(produto.estoque, 1);
              return (
                <li key={produto.id} className="cartao flex gap-4 p-4 sm:p-5">
                  <Link to={`/produto/${produto.slug}`} className="size-24 shrink-0 overflow-hidden rounded-xl border border-linha bg-grafite p-1 sm:size-28">
                    <ArteProduto produto={produto} indice={0} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link to={`/produto/${produto.slug}`} className="font-display text-base font-bold hover:text-ouro sm:text-lg">{produto.nome}</Link>
                        <p className="text-sm text-cinza">{rotuloVariacao(produto)}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {produto.preVenda && <Selo tom="ouro">Pré-venda · sinal {produto.preVenda.sinalPercentual}%</Selo>}
                          {produto.origem === "EUA" && <Selo tom="neutro">🇺🇸</Selo>}
                          {produto.demo && <Selo tom="demo">exemplo</Selo>}
                        </div>
                      </div>
                      <button type="button" onClick={() => remover(produto.id)} aria-label={`Remover ${produto.nome}`} className="grid size-10 shrink-0 place-items-center rounded-full text-cinza hover:text-erro">
                        <Icone nome="lixeira" tamanho={18} />
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-linha-forte">
                          <button type="button" aria-label="Diminuir quantidade" onClick={() => definirQuantidade(produto.id, q - 1)} className="grid size-10 place-items-center hover:text-ouro"><Icone nome="menos" tamanho={14} /></button>
                          <span className="w-7 text-center text-sm font-bold" aria-live="polite">{q}</span>
                          <button type="button" aria-label="Aumentar quantidade" disabled={q >= maximo} onClick={() => definirQuantidade(produto.id, q + 1)} className="grid size-10 place-items-center hover:text-ouro disabled:opacity-30"><Icone nome="mais" tamanho={14} /></button>
                        </div>
                        {q >= maximo && <span className="text-xs text-aviso">máx. {maximo} em estoque</span>}
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-extrabold text-marfim">{moeda(sub)}</p>
                        {q > 1 && <p className="text-xs text-cinza">{moeda(produto.preco)} cada</p>}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="cartao p-6 lg:sticky lg:top-28" aria-label="Resumo">
            <h2 className="font-display text-lg font-bold">Resumo</h2>
            <ResumoValores className="mt-4" subtotal={subtotal} total={subtotal} entrega="a combinar" />
            <div className="mt-5 grid gap-2">
              <Botao variante="ouro" para="/checkout" iconeDepois="seta" tamanho="lg">Finalizar pedido</Botao>
              <Botao variante="contorno" para="/produtos">Continuar comprando</Botao>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-cinza">Nada é cobrado pelo site: você monta o pedido aqui e finaliza com a loja (Pix, cartão ou como combinar).</p>
          </aside>
        </div>
      )}
    </div>
  );
}
