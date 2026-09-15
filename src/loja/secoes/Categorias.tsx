/**
 * Categorias em CARROSSEL 3D (CSS preserve-3d): 4 cartões distribuídos a 90°
 * num anel que gira devagar sozinho, pausa no hover/foco e tem setas.
 * Abaixo de 768px vira trilha horizontal com scroll-snap (sem 3D).
 * Cada cartão mostra a contagem real de produtos ativos da categoria.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { CATEGORIAS } from "@/dados/catalogo";
import { useLoja, selProdutosAtivos } from "@/estado/loja";
import { gsap, animado } from "@/lib/movimento";
import Secao from "@/componentes/ui/Secao";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";

const ICONES: Record<string, NomeIcone> = { iphones: "brilho", seminovos: "bateria", apple: "apple", acessorios: "caixa" };
const RAIO = 360;

function Cartao({ id, rotulo, descricao, rota, total, className = "", style }: { id: string; rotulo: string; descricao: string; rota: string; total: number; className?: string; style?: React.CSSProperties }) {
  return (
    <Link
      to={rota}
      style={style}
      className={`cartao group flex h-[300px] w-[260px] shrink-0 flex-col justify-between overflow-hidden p-6 transition-colors hover:border-ouro/50 ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-2xl border border-ouro/30 bg-ouro/10 text-ouro">
          <Icone nome={ICONES[id] ?? "brilho"} tamanho={22} />
        </span>
        <span className="rounded-full border border-linha px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-cinza">{total} {total === 1 ? "item" : "itens"}</span>
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-marfim">{rotulo}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-cinza">{descricao}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ouro">
          Explorar <Icone nome="seta" tamanho={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[radial-gradient(circle,rgba(212,178,76,.18),transparent_65%)]" />
    </Link>
  );
}

export default function Categorias() {
  const ativos = useLoja(useShallow(selProdutosAtivos));
  const totais = useMemo(() => Object.fromEntries(CATEGORIAS.map((c) => [c.id, ativos.filter((p) => p.categoria === c.id).length])), [ativos]);
  const [desktop, setDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches);
  const refAnel = useRef<HTMLDivElement>(null);
  const angulo = useRef({ v: 0 });
  const pausado = useRef(false);
  const [frente, setFrente] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const ao = () => setDesktop(mq.matches);
    mq.addEventListener("change", ao);
    return () => mq.removeEventListener("change", ao);
  }, []);

  // giro automático + cálculo do cartão da frente
  useEffect(() => {
    if (!desktop) return;
    const anel = refAnel.current;
    if (!anel) return;
    const ligado = animado();
    let raf = 0;
    let ultimo = performance.now();
    const passo = (agora: number) => {
      raf = requestAnimationFrame(passo);
      const dt = Math.min(64, agora - ultimo);
      ultimo = agora;
      if (ligado && !pausado.current && !document.hidden) angulo.current.v -= dt * 0.006;
      anel.style.transform = `translateZ(-${RAIO}px) rotateY(${angulo.current.v}deg)`;
      const i = ((Math.round(-angulo.current.v / 90) % 4) + 4) % 4;
      setFrente((f) => (f === i ? f : i));
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [desktop]);

  function girar(sentido: 1 | -1) {
    const alvo = Math.round(angulo.current.v / 90) * 90 - sentido * 90;
    gsap.to(angulo.current, { v: alvo, duration: 0.8, ease: "power3.out", overwrite: true });
  }

  return (
    <Secao
      id="categorias"
      rotulo="O que você procura"
      titulo={<>Escolha por <span className="texto-ouro">categoria</span>.</>}
      descricao="iPhones novos e seminovos, produtos Apple e acessórios — tudo com garantia e nota fiscal."
      className="relative overflow-hidden bg-[radial-gradient(60%_50%_at_50%_100%,rgba(212,178,76,.1),transparent_70%)]"
    >
      {desktop ? (
        <div
          className="relative"
          onPointerEnter={() => (pausado.current = true)}
          onPointerLeave={() => (pausado.current = false)}
          onFocus={() => (pausado.current = true)}
          onBlur={() => (pausado.current = false)}
        >
          <div className="perspectiva mx-auto h-[340px] w-full max-w-[720px]" style={{ perspective: "1400px" }}>
            <div ref={refAnel} className="preservar-3d relative mx-auto h-full w-[260px]" style={{ transformStyle: "preserve-3d" }}>
              {CATEGORIAS.map((c, i) => (
                <Cartao
                  key={c.id}
                  id={c.id}
                  rotulo={c.rotulo}
                  descricao={c.descricao}
                  rota={c.rota}
                  total={totais[c.id] ?? 0}
                  className={`absolute left-0 top-5 transition-opacity duration-500 ${frente === i ? "opacity-100" : "opacity-60"}`}
                  style={{ transform: `rotateY(${i * 90}deg) translateZ(${RAIO}px)`, backfaceVisibility: "hidden" }}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button type="button" onClick={() => girar(-1)} aria-label="Categoria anterior" className="grid size-11 place-items-center rounded-full border border-linha-forte text-tinta transition-colors hover:border-ouro hover:text-ouro">
              <Icone nome="setaEsq" tamanho={18} />
            </button>
            <ul className="flex gap-2" aria-label="Posição do carrossel">
              {CATEGORIAS.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    aria-label={c.rotulo}
                    aria-current={frente === i ? "true" : undefined}
                    onClick={() => gsap.to(angulo.current, { v: -i * 90, duration: 0.8, ease: "power3.out", overwrite: true })}
                    className={`h-2.5 rounded-full transition-all ${frente === i ? "w-7 bg-ouro" : "w-2.5 bg-linha-forte hover:bg-cinza"}`}
                  />
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => girar(1)} aria-label="Próxima categoria" className="grid size-11 place-items-center rounded-full border border-linha-forte text-tinta transition-colors hover:border-ouro hover:text-ouro">
              <Icone nome="seta" tamanho={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="-mx-[4vw] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[4vw] pb-4 [scrollbar-width:none]">
          {CATEGORIAS.map((c) => (
            <Cartao key={c.id} id={c.id} rotulo={c.rotulo} descricao={c.descricao} rota={c.rota} total={totais[c.id] ?? 0} className="relative snap-center" />
          ))}
        </div>
      )}
    </Secao>
  );
}
