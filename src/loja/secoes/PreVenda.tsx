/**
 * Pré-venda — bloco de impacto do lançamento real (iPhone 18 Pro, post de
 * 10/09/2026): seletor de cor troca a arte com crossfade, preço, sinal,
 * data prevista e a FONTE do dado visível. Lê a store: qualquer produto com
 * `preVenda` aparece aqui; os não-demo têm prioridade.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { CORES_VISUAIS } from "@/dados/catalogo";
import { useLoja, selProdutosAtivos } from "@/estado/loja";
import { moeda } from "@/lib/formatar";
import { wa } from "@/lib/links";
import { gsap, animado, usarReveal } from "@/lib/movimento";
import ArteProduto from "@/componentes/marca/ArteProduto";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";
import Selo from "@/componentes/ui/Selo";

export default function PreVenda() {
  const config = useLoja((s) => s.config);
  const ativos = useLoja(useShallow(selProdutosAtivos));
  const grupo = useMemo(() => {
    const comPre = ativos.filter((p) => p.preVenda !== null);
    const reais = comPre.filter((p) => !p.demo);
    const base = (reais.length ? reais : comPre)[0];
    if (!base) return [];
    return comPre.filter((p) => p.nome === base.nome && p.armazenamento === base.armazenamento && p.demo === base.demo);
  }, [ativos]);
  const [indice, setIndice] = useState(0);
  const refArte = useRef<HTMLDivElement>(null);
  const refBloco = usarReveal<HTMLDivElement>({ y: 40 });
  const atual = grupo[Math.min(indice, Math.max(grupo.length - 1, 0))];

  useEffect(() => {
    const el = refArte.current;
    if (!el || !animado()) return;
    gsap.fromTo(el, { opacity: 0.2, scale: 0.96, rotate: -2 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.55, ease: "power3.out" });
  }, [atual?.id]);

  if (!atual || !atual.preVenda) return null;

  return (
    <section id="pre-venda" aria-labelledby="pre-venda-titulo" className="relative overflow-hidden border-y border-linha bg-carvao py-20 sm:py-24">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_50%,rgba(212,178,76,.14),transparent_70%)]" />
      <div className="filete-ouro absolute inset-x-0 top-0" aria-hidden="true" />
      <div ref={refBloco} data-reveal className="container-pagina relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="relative order-2 mx-auto aspect-[4/5] w-full max-w-md lg:order-1">
          <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(212,178,76,.22),transparent_65%)] blur-2xl" />
          <div ref={refArte} className="absolute inset-[4%]">
            <ArteProduto produto={atual} vista="arte:iphone:costas" />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="flex flex-wrap items-center gap-2">
            <Selo tom="ouro">Pré-venda aberta</Selo>
            {atual.demo ? <Selo tom="demo">exemplo</Selo> : <Selo tom="ok">publicado pela loja</Selo>}
          </div>
          <h2 id="pre-venda-titulo" className="texto-display mt-4 text-4xl text-marfim sm:text-5xl lg:text-6xl">
            {atual.nome} <span className="texto-ouro-animado">chegou</span> na pré-venda.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-cinza sm:text-lg">{atual.descricao}</p>

          <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cinza">{atual.armazenamento} GB · a partir de</p>
              <p className="texto-display mt-1 text-4xl text-marfim">{moeda(atual.preco)}</p>
            </div>
            <ul className="grid gap-1.5 text-sm text-cinza">
              <li className="flex items-center gap-2"><Icone nome="check" tamanho={16} className="text-ouro" />Sinal de {atual.preVenda.sinalPercentual}% para reservar</li>
              <li className="flex items-center gap-2"><Icone nome="calendario" tamanho={16} className="text-ouro" />Entrega prevista: {atual.preVenda.entregaPrevista}</li>
              <li className="flex items-center gap-2"><Icone nome="escudo" tamanho={16} className="text-ouro" />Novo, lacrado, NF + 1 ano de garantia</li>
            </ul>
          </div>

          {grupo.length > 1 && (
            <fieldset className="mt-6">
              <legend className="text-xs font-bold uppercase tracking-[0.2em] text-cinza">Cor: <span className="text-marfim">{atual.cor}</span></legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {grupo.map((p, i) => {
                  const cor = CORES_VISUAIS[p.corVisual];
                  const marcado = i === indice;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setIndice(i)}
                      aria-pressed={marcado}
                      aria-label={`Cor ${p.cor}`}
                      title={p.cor}
                      className={`grid size-11 place-items-center rounded-full border-2 transition-all ${marcado ? "scale-105 border-ouro" : "border-linha-forte hover:border-cinza"}`}
                    >
                      <span className="size-7 rounded-full border border-black/30" style={{ background: `linear-gradient(135deg, ${cor.brilho}, ${cor.corpo} 55%, ${cor.borda})` }} />
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <Botao variante="ouro" href={wa.produto(`${atual.nome} ${atual.armazenamento} GB ${atual.cor} (pré-venda)`, config.whatsappNumero, config.whatsappLink)} icone="whatsapp" magnetico>
              Reservar pelo WhatsApp
            </Botao>
            <Botao variante="contorno" para={`/produto/${atual.slug}`} iconeDepois="seta">
              Ver detalhes
            </Botao>
          </div>
          <p className="mt-5 text-xs text-cinza-escuro">Fonte: {atual.fonte}. <Link to="/pre-venda" className="text-ouro hover:underline">Ver toda a pré-venda</Link></p>
        </div>
      </div>
    </section>
  );
}
