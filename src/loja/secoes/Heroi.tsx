/**
 * HERÓI — trilho alto + cena sticky (sem pin) com o iPhone 3D girando pelo
 * scroll e parallax do mouse. A copy some quando a rolagem passa da metade,
 * o aparelho encolhe no fim e entrega a página para a próxima seção.
 * Sem WebGL ou com ?anim=0: arte SVG flutuando, tudo visível e estático.
 */
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { negocio } from "@/dados/negocio";
import { useLoja, selProdutosAtivos } from "@/estado/loja";
import { wa } from "@/lib/links";
import { gsap, animado, usarProgressoTrilho, ehToque } from "@/lib/movimento";
import ArteProduto from "@/componentes/marca/ArteProduto";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";

const CenaIphone = lazy(() => import("@/componentes/tres/CenaIphone"));

const PARTICULAS = Array.from({ length: 14 }, (_, i) => ({
  left: `${8 + ((i * 37) % 84)}%`,
  top: `${12 + ((i * 53) % 76)}%`,
  tamanho: 2 + (i % 3),
  atraso: `${(i * 0.7) % 6}s`,
  duracao: `${5 + (i % 4)}s`,
  opacidade: 0.25 + ((i * 13) % 50) / 100,
}));

export default function Heroi() {
  const config = useLoja((s) => s.config);
  const ativos = useLoja(useShallow(selProdutosAtivos));
  const poster = ativos.find((p) => p.emDestaque && p.familia !== "acessorio") ?? ativos[0];
  const ligado = animado();
  const [falhou, setFalhou] = useState(false);
  const [visivel, setVisivel] = useState(true);
  const progresso = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const refCopy = useRef<HTMLDivElement>(null);
  const refTitulo = useRef<HTMLHeadingElement>(null);

  // entrada do título linha a linha (máscara por overflow) — sem SplitText,
  // que quebra o degradê dourado (background-clip: text) ao dividir as palavras
  useLayoutEffect(() => {
    const h1 = refTitulo.current;
    if (!h1 || !ligado) return;
    const linhas = h1.querySelectorAll<HTMLElement>("[data-linha]");
    const ctx = gsap.context(() => {
      gsap.fromTo(linhas, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out", stagger: 0.14, delay: 0.15 });
      gsap.fromTo(refCopy.current!.querySelectorAll("[data-entrada]"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.55 });
    }, h1.parentElement ?? h1);
    return () => ctx.revert();
  }, [ligado]);

  const trilho = usarProgressoTrilho<HTMLDivElement>(
    (p) => {
      progresso.current = p;
      const copy = refCopy.current;
      if (!copy) return;
      const k = Math.min(1, Math.max(0, (p - 0.5) / 0.22));
      gsap.set(copy, { opacity: 1 - k, y: -48 * k, pointerEvents: k > 0.8 ? "none" : "auto" });
    },
    { inicio: "top top", fim: "bottom bottom", scrub: 0.5 },
  );

  useEffect(() => {
    const el = trilho.current;
    if (!el || !ligado) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [trilho, ligado]);

  const aoMover = useCallback((e: React.PointerEvent) => {
    if (ehToque()) return;
    const r = e.currentTarget.getBoundingClientRect();
    mouse.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 };
  }, []);
  const aoSair = useCallback(() => {
    mouse.current = { x: 0, y: 0 };
  }, []);
  const aoFalhar = useCallback(() => setFalhou(true), []);

  const usarTres = ligado && !falhou;
  const linkWa = wa.padrao(config.whatsappNumero, config.whatsappLink);

  const posterEl = poster ? (
    <div className={`absolute inset-[6%] ${ligado ? "animate-flutuar" : ""}`}>
      <ArteProduto produto={poster} vista="arte:iphone:costas" />
    </div>
  ) : null;

  return (
    <section aria-label="Apresentação da iMagicPhone" className="relative" onPointerMove={aoMover} onPointerLeave={aoSair}>
      <div ref={trilho} className={ligado ? "relative h-[280svh]" : "relative"}>
        <div className={`${ligado ? "sticky top-0 h-svh" : "min-h-svh"} overflow-hidden`}>
          {/* 0 · fundo */}
          <div aria-hidden="true" className="absolute inset-0 z-0 bg-[radial-gradient(60%_55%_at_72%_48%,rgba(212,178,76,.17),transparent_70%),radial-gradient(40%_40%_at_15%_20%,rgba(212,178,76,.07),transparent_70%)]" />
          {/* 1 · partículas */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
            {PARTICULAS.map((p, i) => (
              <span
                key={i}
                className={`absolute rounded-full bg-ouro-claro ${ligado ? "animate-flutuar" : ""}`}
                style={{ left: p.left, top: p.top, width: p.tamanho, height: p.tamanho, opacity: p.opacidade, animationDelay: p.atraso, animationDuration: p.duracao, boxShadow: "0 0 8px rgba(241,217,122,.8)" }}
              />
            ))}
          </div>
          {/* 2 · véu para o texto */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-full bg-[linear-gradient(90deg,rgba(7,7,8,.75),rgba(7,7,8,.2)_55%,transparent)] md:w-3/5" />
          {/* 3 · grão */}
          <div aria-hidden="true" className="grao pointer-events-none absolute inset-0 z-[3]" />

          {/* 4 · conteúdo */}
          <div className="container-pagina relative z-[4] grid h-full grid-rows-[auto_minmax(0,1fr)] pt-24 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:grid-rows-none md:items-center md:pt-24">
            <div ref={refCopy} className="pt-4 text-center md:pt-0 md:text-left">
              <p className="rotulo justify-center md:justify-start">
                <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
                {negocio.heroi.rotulo}
              </p>
              <h1 ref={refTitulo} className="texto-display mt-4 text-4xl text-marfim sm:text-5xl lg:text-6xl xl:text-7xl">
                <span className="block overflow-hidden pb-1"><span data-linha className="block">iPhone é na</span></span>
                <span className="block overflow-hidden pb-2"><span data-linha className="texto-ouro block">iMagicPhone.</span></span>
              </h1>
              <p data-entrada className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cinza sm:text-base md:mx-0 md:mt-5 md:text-lg">{negocio.heroi.subtitulo}</p>
              <div data-entrada className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                <Botao variante="wa" href={linkWa} icone="whatsapp" magnetico>
                  {negocio.heroi.ctaPrimario}
                </Botao>
                <Botao variante="contorno" para="/iphones" iconeDepois="seta">
                  {negocio.heroi.ctaSecundario}
                </Botao>
              </div>
              <ul data-entrada className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-cinza md:justify-start" aria-label="Por que comprar aqui">
                <li className="flex items-center gap-1.5"><Icone nome="instagram" tamanho={14} className="text-ouro" />{negocio.provaSocial.seguidoresTexto}</li>
                <li className="flex items-center gap-1.5"><Icone nome="escudo" tamanho={14} className="text-ouro" />Garantia e NF</li>
                <li className="flex items-center gap-1.5"><Icone nome="loja" tamanho={14} className="text-ouro" />Loja física em Caraguá</li>
              </ul>
            </div>

            <div className="relative min-h-0 overflow-hidden md:h-full md:self-stretch" aria-hidden="true">
              {usarTres ? (
                <Suspense fallback={posterEl}>
                  <CenaIphone progresso={progresso} mouse={mouse} ativo={visivel} aoFalhar={aoFalhar} />
                </Suspense>
              ) : (
                posterEl
              )}
            </div>
          </div>

          {ligado && (
            <p aria-hidden="true" className="absolute bottom-5 left-1/2 z-[4] flex -translate-x-1/2 items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-cinza">
              role para explorar
              <span className="animate-bounce"><Icone nome="chevron" tamanho={12} className="rotate-90" /></span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
