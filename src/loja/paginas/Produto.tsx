/**
 * Página do produto: galeria com tilt e miniaturas, variação, preço,
 * pré-venda, outras opções (mesmo modelo), compra/WhatsApp, garantias,
 * destaques, fonte do dado (quando exemplo) e relacionados.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { CORES_VISUAIS } from "@/dados/catalogo";
import { useLoja, selProdutosAtivos, temOferta, rotuloVariacao } from "@/estado/loja";
import { useCarrinho } from "@/estado/carrinho";
import { moeda, parcelas } from "@/lib/formatar";
import { wa } from "@/lib/links";
import { gsap, animado, usarTilt, usarReveal } from "@/lib/movimento";
import ArteProduto from "@/componentes/marca/ArteProduto";
import CartaoProduto from "@/componentes/ui/CartaoProduto";
import Botao from "@/componentes/ui/Botao";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";
import Selo from "@/componentes/ui/Selo";
import NaoEncontrada from "./NaoEncontrada";

const CATEGORIA_ROTULO: Record<string, { rotulo: string; rota: string }> = {
  iphones: { rotulo: "iPhones", rota: "/iphones" },
  seminovos: { rotulo: "Seminovos", rota: "/seminovos" },
  apple: { rotulo: "Apple", rota: "/apple" },
  acessorios: { rotulo: "Acessórios", rota: "/acessorios" },
};

const GARANTIAS: { icone: NomeIcone; titulo: string; texto: string }[] = [
  { icone: "escudo", titulo: "Garantia e nota fiscal", texto: "Todo produto sai com NF e garantia da loja." },
  { icone: "loja", titulo: "Loja física em Caraguá", texto: "Retire no Sumaré ou peça entrega." },
  { icone: "entrega", titulo: "Entrega no Litoral Norte", texto: "Caraguatatuba, São Sebastião, Ubatuba e Ilhabela." },
];

export default function Produto() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const config = useLoja((s) => s.config);
  const ativos = useLoja(useShallow(selProdutosAtivos));
  const produto = ativos.find((p) => p.slug === slug) ?? null;
  const adicionar = useCarrinho((s) => s.adicionar);
  const [vista, setVista] = useState(0);
  const refArte = useRef<HTMLDivElement>(null);
  const refTilt = usarTilt<HTMLDivElement>(5);
  const refInfo = usarReveal<HTMLDivElement>({ y: 24 });

  useEffect(() => {
    setVista(0);
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (produto) document.title = `${produto.nome} ${rotuloVariacao(produto)} · iMagicPhone`;
  }, [produto]);

  useEffect(() => {
    const el = refArte.current;
    if (!el || !animado()) return;
    gsap.fromTo(el, { opacity: 0.3, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" });
  }, [vista, slug]);

  const outras = useMemo(() => (produto ? ativos.filter((p) => p.nome === produto.nome && p.id !== produto.id) : []), [ativos, produto]);
  const relacionados = useMemo(() => (produto ? ativos.filter((p) => p.categoria === produto.categoria && p.nome !== produto.nome).slice(0, 4) : []), [ativos, produto]);

  if (!produto) return <NaoEncontrada />;

  const oferta = temOferta(produto);
  const esgotado = produto.estoque <= 0;
  const cat = CATEGORIA_ROTULO[produto.categoria] ?? CATEGORIA_ROTULO.iphones;
  const linkWa = wa.produto(`${produto.nome} ${rotuloVariacao(produto)}`, config.whatsappNumero, config.whatsappLink);

  function comprarAgora() {
    adicionar(produto!.id, 1);
    useCarrinho.getState().fechar();
    navigate("/checkout");
  }

  return (
    <div className="container-pagina py-10 sm:py-14">
      <nav aria-label="Você está em" className="text-xs text-cinza">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link to="/" className="hover:text-ouro">Início</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to={cat.rota} className="hover:text-ouro">{cat.rotulo}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-marfim">{produto.nome}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
        {/* galeria */}
        <div>
          <div ref={refTilt} data-gsap className="cartao relative aspect-[4/5] overflow-hidden bg-[radial-gradient(60%_55%_at_50%_65%,rgba(212,178,76,.14),transparent_70%)]">
            <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-1.5">
              <Selo tom={produto.condicao === "novo" ? "novo" : "seminovo"}>{produto.condicao === "novo" ? "Novo" : "Seminovo"}</Selo>
              {produto.preVenda && <Selo tom="ouro">Pré-venda</Selo>}
              {oferta && <Selo tom="ok">Oferta</Selo>}
              {produto.origem === "EUA" && <Selo tom="neutro">🇺🇸 Versão americana</Selo>}
              {produto.demo && <Selo tom="demo" titulo="Dado de exemplo — substituir pelo catálogo real">exemplo</Selo>}
            </div>
            <div ref={refArte} className="absolute inset-[8%]">
              <ArteProduto produto={produto} indice={vista} />
            </div>
          </div>
          {produto.imagens.length > 1 && (
            <ul className="mt-3 flex gap-2" aria-label="Vistas do produto">
              {produto.imagens.map((img, i) => (
                <li key={img + i}>
                  <button type="button" onClick={() => setVista(i)} aria-pressed={vista === i} aria-label={`Vista ${i + 1}`} className={`size-20 overflow-hidden rounded-xl border bg-grafite p-1.5 transition-colors ${vista === i ? "border-ouro" : "border-linha hover:border-linha-forte"}`}>
                    <ArteProduto produto={produto} indice={i} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {produto.demo && <p className="mt-3 text-xs text-cinza-escuro">Arte ilustrativa. Fonte do dado: {produto.fonte}.</p>}
        </div>

        {/* informações */}
        <div ref={refInfo} data-reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="rotulo"><span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />{produto.modelo}</p>
          <h1 className="texto-display mt-3 text-3xl sm:text-4xl">{produto.nome}</h1>
          <p className="mt-2 text-cinza">{rotuloVariacao(produto)}{produto.bateria ? ` · bateria ${produto.bateria}%` : ""}</p>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="texto-display text-4xl text-marfim">{moeda(produto.preco)}</span>
            {oferta && <s className="text-base text-cinza">{moeda(produto.precoDe as number)}</s>}
          </div>
          <p className="mt-1 text-sm text-cinza">
            {produto.preVenda ? `Reserva com sinal de ${produto.preVenda.sinalPercentual}% · entrega prevista ${produto.preVenda.entregaPrevista}` : `ou ${parcelas(produto.preco, produto.parcelas)} · condições no atendimento`}
          </p>

          {produto.preVenda && (
            <div className="cartao-ouro mt-5 p-4 text-sm">
              <p className="flex items-center gap-2 font-bold text-ouro"><Icone nome="calendario" tamanho={16} />Pré-venda</p>
              <p className="mt-1 text-cinza">Reserve com sinal de {produto.preVenda.sinalPercentual}% do valor. Entrega prevista: {produto.preVenda.entregaPrevista}. Valores com mais armazenamento sob consulta.</p>
            </div>
          )}

          {outras.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cinza">Outras opções de {produto.nome}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {outras.map((o) => {
                  const c = CORES_VISUAIS[o.corVisual];
                  return (
                    <li key={o.id}>
                      <Link to={`/produto/${o.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-linha-forte px-3.5 text-sm font-semibold text-cinza transition-colors hover:border-ouro hover:text-tinta">
                        <span className="size-4 rounded-full border border-black/30" style={{ background: `linear-gradient(135deg, ${c.brilho}, ${c.corpo} 55%, ${c.borda})` }} aria-hidden="true" />
                        {rotuloVariacao(o)} · {moeda(o.preco)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-7 grid gap-2 sm:grid-cols-2">
            <Botao variante="ouro" onClick={() => adicionar(produto.id, 1)} disabled={esgotado} icone="carrinho" tamanho="lg">
              {esgotado ? "Sob consulta" : "Adicionar ao carrinho"}
            </Botao>
            <Botao variante="contorno" onClick={comprarAgora} disabled={esgotado} tamanho="lg" iconeDepois="seta">
              Comprar agora
            </Botao>
            <Botao variante="wa" href={linkWa} icone="whatsapp" className="sm:col-span-2">
              Perguntar no WhatsApp
            </Botao>
          </div>
          <p className="mt-3 text-xs text-cinza">
            {esgotado ? "Sem unidade no momento — a loja avisa quando chegar." : `${produto.estoque} ${produto.estoque === 1 ? "unidade disponível" : "unidades disponíveis"} · você finaliza o pagamento com a loja.`}
          </p>

          <ul className="mt-7 grid gap-3">
            {GARANTIAS.map((g) => (
              <li key={g.titulo} className="flex items-start gap-3 text-sm">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-ouro/30 bg-ouro/10 text-ouro"><Icone nome={g.icone} tamanho={16} /></span>
                <span><strong className="text-tinta">{g.titulo}.</strong> <span className="text-cinza">{g.texto}</span></span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-linha pt-6">
            <h2 className="font-display text-lg font-bold">Sobre este produto</h2>
            <p className="mt-2 text-sm leading-relaxed text-cinza">{produto.descricao}</p>
            {produto.destaques.length > 0 && (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {produto.destaques.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-marfim"><Icone nome="check" tamanho={16} className="shrink-0 text-ouro" />{d}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section aria-labelledby="relacionados-titulo" className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="rotulo"><span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />Você também pode gostar</p>
              <h2 id="relacionados-titulo" className="texto-display mt-2 text-2xl sm:text-3xl">Mais em {cat.rotulo}</h2>
            </div>
            <Botao variante="contorno" para={cat.rota} tamanho="sm" iconeDepois="seta">Ver todos</Botao>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {relacionados.map((p) => <CartaoProduto key={p.id} produto={p} compacto />)}
          </div>
        </section>
      )}
    </div>
  );
}
