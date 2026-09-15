/**
 * Gaveta lateral do carrinho (abre ao adicionar produto). Dialog acessível:
 * foco preso, Esc/overlay fecham, fundo inerte. Lê `usarLinhasCarrinho()`,
 * então preço e estoque vêm sempre do catálogo vigente.
 */
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCarrinho, usarLinhasCarrinho } from "@/estado/carrinho";
import { rotuloVariacao } from "@/estado/loja";
import { moeda } from "@/lib/formatar";
import ArteProduto from "@/componentes/marca/ArteProduto";
import Icone from "@/componentes/ui/Icones";
import Selo from "@/componentes/ui/Selo";

export default function GavetaCarrinho() {
  const aberto = useCarrinho((s) => s.aberto);
  const fechar = useCarrinho((s) => s.fechar);
  const definirQuantidade = useCarrinho((s) => s.definirQuantidade);
  const remover = useCarrinho((s) => s.remover);
  const { linhas, subtotal, quantidade } = usarLinhasCarrinho();
  const refCaixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    const caixa = refCaixa.current;
    caixa?.querySelector<HTMLElement>("button, a")?.focus();
    const fundo = document.querySelectorAll<HTMLElement>("#conteudo, footer, [data-fixed-top]");
    fundo.forEach((el) => el.setAttribute("inert", ""));
    document.body.style.overflow = "hidden";
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "Tab" && caixa) {
        const f = caixa.querySelectorAll<HTMLElement>("button:not([disabled]), a, input");
        const primeiro = f[0];
        const ultimo = f[f.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      fundo.forEach((el) => el.removeAttribute("inert"));
      document.body.style.overflow = "";
      anterior?.focus?.();
    };
  }, [aberto, fechar]);

  return (
    <div className={`fixed inset-0 z-[70] ${aberto ? "" : "pointer-events-none"}`} aria-hidden={!aberto}>
      <button
        type="button"
        aria-label="Fechar carrinho"
        onClick={fechar}
        tabIndex={-1}
        className={`absolute inset-0 bg-preto/70 backdrop-blur-sm transition-opacity duration-300 ${aberto ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={refCaixa}
        role="dialog"
        aria-modal="true"
        aria-label="Seu carrinho"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-linha bg-carvao shadow-cartao transition-transform duration-400 ease-out ${
          aberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-linha px-5 py-4">
          <p className="font-display text-lg font-bold">
            Carrinho <span className="text-sm font-semibold text-cinza">({quantidade})</span>
          </p>
          <button type="button" onClick={fechar} aria-label="Fechar carrinho" className="grid size-11 place-items-center rounded-full border border-linha-forte hover:border-ouro hover:text-ouro">
            <Icone nome="fechar" tamanho={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {linhas.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-full border border-ouro/30 bg-ouro/10 text-ouro">
                  <Icone nome="carrinho" tamanho={24} />
                </span>
                <p className="mt-4 font-display font-bold">Seu carrinho está vazio.</p>
                <p className="mt-1 text-sm text-cinza">Escolha um iPhone e ele aparece aqui.</p>
                <Link to="/iphones" onClick={fechar} className="botao-ouro mt-5">
                  Ver iPhones
                </Link>
              </div>
            </div>
          ) : (
            <ul className="grid gap-4">
              {linhas.map(({ produto, quantidade: q, subtotal: sub }) => (
                <li key={produto.id} className="flex gap-3">
                  <Link to={`/produto/${produto.slug}`} onClick={fechar} className="size-20 shrink-0 overflow-hidden rounded-xl border border-linha bg-grafite p-1">
                    <ArteProduto produto={produto} indice={0} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-bold">{produto.nome}</p>
                    <p className="truncate text-xs text-cinza">{rotuloVariacao(produto)}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {produto.preVenda && <Selo tom="ouro">Pré-venda</Selo>}
                      {produto.demo && <Selo tom="demo">exemplo</Selo>}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-full border border-linha-forte">
                        <button type="button" aria-label={`Diminuir quantidade de ${produto.nome}`} onClick={() => definirQuantidade(produto.id, q - 1)} className="grid size-9 place-items-center hover:text-ouro">
                          <Icone nome="menos" tamanho={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold" aria-live="polite">{q}</span>
                        <button
                          type="button"
                          aria-label={`Aumentar quantidade de ${produto.nome}`}
                          disabled={q >= Math.max(produto.estoque, 1)}
                          onClick={() => definirQuantidade(produto.id, q + 1)}
                          className="grid size-9 place-items-center hover:text-ouro disabled:opacity-30"
                        >
                          <Icone nome="mais" tamanho={14} />
                        </button>
                      </div>
                      <span className="font-display text-sm font-extrabold text-marfim">{moeda(sub)}</span>
                    </div>
                  </div>
                  <button type="button" aria-label={`Remover ${produto.nome}`} onClick={() => remover(produto.id)} className="grid size-9 shrink-0 place-items-center self-start rounded-full text-cinza hover:text-erro">
                    <Icone nome="lixeira" tamanho={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {linhas.length > 0 && (
          <div className="border-t border-linha px-5 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-cinza">Subtotal</span>
              <span className="font-display text-xl font-extrabold text-marfim">{moeda(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-cinza">Entrega e pagamento você combina com a loja no próximo passo.</p>
            <div className="mt-4 grid gap-2">
              <Link to="/checkout" onClick={fechar} className="botao-ouro">
                Finalizar pedido
                <Icone nome="seta" tamanho={18} />
              </Link>
              <Link to="/carrinho" onClick={fechar} className="botao-contorno">
                Ver carrinho
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
