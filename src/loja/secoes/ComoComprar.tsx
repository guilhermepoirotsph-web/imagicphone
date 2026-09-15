/**
 * Como comprar — scroll-stack de 4 passos.
 * Trilho alto + cena `sticky` (sem pin): `usarProgressoTrilho` distribui o
 * progresso em 4 janelas; o cartão ativo fica em escala 1 / opacity 1 e os
 * anteriores encolhem para trás (scale .92, y -24, opacity .5).
 * Com `?anim=0` a seção vira uma grade estática, legível e sem opacity 0.
 */
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useLoja } from "@/estado/loja";
import { gsap, usarProgressoTrilho, usarReveal, animado } from "@/lib/movimento";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";
import Botao from "@/componentes/ui/Botao";

interface Passo {
  numero: string;
  icone: NomeIcone;
  titulo: string;
  texto: string;
}

const TOTAL = 4;
/** trecho final do trilho em que o último cartão fica parado, inteiro na tela */
const FOLGA = 0.35;

function montarPassos(cidades: string[]): Passo[] {
  const lista = cidades.length > 0 ? cidades.join(", ") : "Litoral Norte";
  return [
    {
      numero: "01",
      icone: "busca",
      titulo: "Escolha o seu iPhone",
      texto: "Novos, seminovos e acessórios. Cada anúncio mostra armazenamento, cor, condição e se é versão americana.",
    },
    {
      numero: "02",
      icone: "whatsapp",
      titulo: "Fale no WhatsApp",
      texto: "Monte o pedido no site ou chame direto: a loja confirma disponibilidade, cor e prazo com você.",
    },
    {
      numero: "03",
      icone: "pix",
      titulo: "Pague como preferir",
      texto: "Pix ou cartão, sempre com nota fiscal. As condições de parcelamento são combinadas no atendimento.",
    },
    {
      numero: "04",
      icone: "entrega",
      titulo: "Receba ou retire",
      texto: `Entrega em ${lista} — ou retirada na loja física, no Sumaré, em Caraguatatuba.`,
    },
  ];
}

const suave = (v: number) => v * v * (3 - 2 * v);

/** Aplica escala/posição a cada cartão para um progresso 0→1. Devolve o passo ativo. */
function aplicarProgresso(cartoes: (HTMLElement | null)[], progresso: number): number {
  const t = Math.min(TOTAL - 1, Math.max(0, progresso * (TOTAL - 1 + FOLGA)));
  cartoes.forEach((el, i) => {
    if (!el) return;
    let y = 0;
    let escala = 1;
    let opacidade = 1;
    if (t < i - 1) {
      // ainda não chegou: espera embaixo, invisível
      y = 120;
      escala = 0.96;
      opacidade = 0;
    } else if (t < i) {
      // entrando por baixo
      const e = suave(t - (i - 1));
      y = 120 * (1 - e);
      escala = 0.96 + 0.04 * e;
      opacidade = e;
    } else if (t < i + 1) {
      // ativo → recuando para trás
      const b = suave(t - i);
      y = -24 * b;
      escala = 1 - 0.08 * b;
      opacidade = 1 - 0.5 * b;
    } else {
      // já ficou para trás: cada camada mais fundo
      const d = t - i - 1;
      y = -24 - 14 * d;
      escala = 0.92 - 0.04 * d;
      opacidade = Math.max(0.12, 0.5 - 0.22 * d);
    }
    gsap.set(el, { y, scale: escala, opacity: opacidade, force3D: true });
  });
  return Math.round(t);
}

function CartaoPasso({ passo, className = "", style }: { passo: Passo; className?: string; style?: CSSProperties }) {
  return (
    <div className={`cartao flex flex-col gap-5 overflow-hidden p-6 sm:flex-row sm:items-center sm:gap-10 sm:p-10 lg:p-12 ${className}`} style={style}>
      <span aria-hidden="true" className="texto-display texto-ouro select-none text-[clamp(3.5rem,14vw,8.5rem)] leading-none">
        {passo.numero}
      </span>
      <div className="min-w-0 flex-1">
        <span className="grid size-12 place-items-center rounded-full border border-ouro/30 bg-ouro/10 text-ouro" aria-hidden="true">
          <Icone nome={passo.icone} tamanho={22} />
        </span>
        <h3 className="texto-display mt-4 text-2xl sm:text-3xl lg:text-4xl">
          <span className="sr-only">Passo {passo.numero}: </span>
          {passo.titulo}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-cinza sm:text-base lg:text-lg">{passo.texto}</p>
      </div>
    </div>
  );
}

export default function ComoComprar() {
  const cidades = useLoja((s) => s.config.cidadesEntrega);
  const passos = montarPassos(cidades);
  const anim = animado();

  const cartoes = useRef<(HTMLElement | null)[]>([]);
  const ativoRef = useRef(0);
  const [ativo, setAtivo] = useState(0);

  const refTrilho = usarProgressoTrilho<HTMLElement>((p) => {
    const atual = aplicarProgresso(cartoes.current, p);
    if (atual !== ativoRef.current) {
      ativoRef.current = atual;
      setAtivo(atual);
    }
  });
  const refCabecalho = usarReveal<HTMLDivElement>({ y: 24 });

  // estado inicial antes do primeiro scroll: cartão 1 ativo, os outros esperando
  useLayoutEffect(() => {
    if (!anim) return;
    aplicarProgresso(cartoes.current, 0);
  }, [anim]);

  const cabecalho = (
    <div ref={refCabecalho} data-reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="rotulo">
          <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
          Como comprar
        </p>
        <h2 id="como-comprar-titulo" className="texto-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
          Do site ao seu bolso em quatro passos.
        </h2>
        <p className="mt-3 hidden text-base text-cinza sm:block sm:text-lg">
          Sem burocracia: você escolhe, a loja confirma no WhatsApp e entrega no Litoral Norte.
        </p>
      </div>
      <div className="hidden shrink-0 sm:block">
        <Botao variante="contorno" para="/iphones" iconeDepois="seta">
          Ver iPhones
        </Botao>
      </div>
    </div>
  );

  // ---------- sem animações: grade estática ----------
  if (!anim) {
    return (
      <section id="como-comprar" aria-labelledby="como-comprar-titulo" className="py-20 sm:py-24">
        <div className="container-pagina">
          {cabecalho}
          <ol className="mt-10 grid gap-4 md:grid-cols-2">
            {passos.map((p) => (
              <li key={p.numero} className="list-none">
                <CartaoPasso passo={p} className="h-full" />
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  // ---------- com animações: trilho + cena sticky ----------
  return (
    <section ref={refTrilho} id="como-comprar" aria-labelledby="como-comprar-titulo" className="relative h-[240svh] md:h-[300svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-6 overflow-hidden pt-16 pb-6 sm:gap-10">
        {/* luz dourada de fundo (z 0) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,178,76,.12),transparent_70%)]" />
        <div aria-hidden="true" className="filete-ouro absolute inset-x-0 top-0 z-0" />

        <div className="container-pagina relative z-10">{cabecalho}</div>

        {/* palco dos cartões (z 10) */}
        <div className="container-pagina relative z-10">
          <ol className="relative h-[min(56svh,30rem)] w-full" aria-label="Passos para comprar">
            {passos.map((p, i) => (
              <li
                key={p.numero}
                ref={(el) => {
                  cartoes.current[i] = el;
                }}
                className="absolute inset-0 list-none will-change-transform"
                style={{ zIndex: i + 1 }}
                aria-current={ativo === i ? "step" : undefined}
              >
                <CartaoPasso passo={p} className="h-full" />
              </li>
            ))}
          </ol>
        </div>

        {/* indicador do passo (z 10) */}
        <div className="container-pagina relative z-10 flex items-center justify-between gap-4">
          <ol className="flex items-center gap-2" aria-label="Progresso">
            {passos.map((p, i) => (
              <li key={p.numero} className="list-none">
                <span
                  className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${ativo === i ? "w-10 bg-ouro" : "w-4 bg-linha-forte"}`}
                  aria-hidden="true"
                />
                <span className="sr-only">
                  Passo {p.numero}
                  {ativo === i ? " (atual)" : ""}
                </span>
              </li>
            ))}
          </ol>
          <p className="text-xs uppercase tracking-[0.2em] text-cinza-escuro" aria-live="polite">
            {passos[ativo]?.numero} / 0{TOTAL}
          </p>
        </div>
      </div>
    </section>
  );
}
