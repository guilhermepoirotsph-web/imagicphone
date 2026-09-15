/**
 * ============================================================
 * MOVIMENTO — GSAP + Lenis, regras da casa
 * ============================================================
 * - Decisão do Guilherme para e-commerces: os efeitos NÃO degradam com
 *   prefers-reduced-motion (o Windows dele reporta reduce). Só `?anim=0`
 *   desliga tudo — e aí o site fica 100% estático e legível.
 * - NUNCA `pin: true` dentro do React (o .pin-spacer derruba o desmonte):
 *   cena fixa = trilho alto + position: sticky + ScrollTrigger só lendo progresso.
 * - Tudo que o GSAP move não tem `transition: transform` em CSS.
 * ============================================================
 */
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText };

let animacoesLigadas: boolean | null = null;
/** true = animações ligadas (padrão). `?anim=0` desliga. */
export function animado(): boolean {
  if (typeof window === "undefined") return false;
  if (animacoesLigadas === null) {
    const q = new URLSearchParams(window.location.search).get("anim");
    animacoesLigadas = q !== "0";
    document.documentElement.classList.toggle("anim", animacoesLigadas);
  }
  return animacoesLigadas;
}

export function ehToque(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

/* ---------- Lenis global (uma instância só, criada na Casca da loja) ---------- */
let lenis: Lenis | null = null;
export function obterLenis(): Lenis | null {
  return lenis;
}

export function usarLenis(ativo = true) {
  useEffect(() => {
    if (!ativo || !animado() || lenis) return;
    const l = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    lenis = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis = null;
    };
  }, [ativo]);
}

export function rolarPara(alvo: number | string | HTMLElement, offset = -90) {
  if (lenis) lenis.scrollTo(alvo as never, { offset, duration: 1.1 });
  else if (typeof alvo === "number") window.scrollTo({ top: alvo, behavior: "smooth" });
  else {
    const el = typeof alvo === "string" ? document.querySelector<HTMLElement>(alvo) : alvo;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ---------- Reveal on-scroll ---------- */
interface OpcoesReveal {
  y?: number;
  delay?: number;
  stagger?: number;      // >0 anima os filhos diretos
  inicio?: string;       // ScrollTrigger start
  duracao?: number;
  escala?: number;
}

/** Entrada suave ao entrar na viewport. Sem animações, o conteúdo fica visível. */
export function usarReveal<T extends HTMLElement>(opcoes: OpcoesReveal = {}): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { y = 34, delay = 0, stagger = 0, inicio = "top 86%", duracao = 0.9, escala = 1 } = opcoes;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!animado()) {
      el.removeAttribute("data-reveal");
      return;
    }
    const alvos = stagger > 0 ? Array.from(el.children) : el;
    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 1 });
      el.removeAttribute("data-reveal");
      gsap.fromTo(
        alvos,
        { y, opacity: 0, scale: escala },
        { y: 0, opacity: 1, scale: 1, duration: duracao, delay, ease: "power3.out", stagger, overwrite: "auto", scrollTrigger: { trigger: el, start: inicio, once: true } },
      );
    }, el);
    return () => ctx.revert();
  }, [y, delay, stagger, inicio, duracao, escala]);
  return ref;
}

/* ---------- Progresso de rolagem sobre um trilho (cena sticky) ---------- */
/**
 * Lê o progresso 0→1 enquanto o TRILHO atravessa o viewport. O elemento
 * fixo é `position: sticky` no CSS; aqui só chega o número.
 */
export function usarProgressoTrilho<T extends HTMLElement>(
  aoAtualizar: (progresso: number, st: ScrollTrigger) => void,
  opcoes: { inicio?: string; fim?: string; scrub?: number | boolean } = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const cb = useRef(aoAtualizar);
  cb.current = aoAtualizar;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !animado()) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: opcoes.inicio ?? "top top",
      end: opcoes.fim ?? "bottom bottom",
      scrub: opcoes.scrub ?? 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => cb.current(self.progress, self),
    });
    return () => st.kill();
  }, [opcoes.inicio, opcoes.fim, opcoes.scrub]);
  return ref;
}

/* ---------- Título com SplitText (linhas mascaradas) ---------- */
export function usarTituloSplit<T extends HTMLElement>(opcoes: { delay?: number; scroll?: boolean } = {}): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !animado()) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(el, { type: "lines,words", linesClass: "linha-split", mask: "lines" });
      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.04,
        delay: opcoes.delay ?? 0,
        scrollTrigger: opcoes.scroll === false ? undefined : { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [opcoes.delay, opcoes.scroll]);
  return ref;
}

/* ---------- Tilt 3D no hover (cards de produto) ---------- */
export function usarTilt<T extends HTMLElement>(intensidade = 8): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !animado() || ehToque()) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
    gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * intensidade * 2);
      rx(-py * intensidade * 2);
      el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
    };
    const sair = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", sair);
    return () => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", sair);
    };
  }, [intensidade]);
  return ref;
}

/* ---------- Botão magnético ---------- */
export function usarMagnetico<T extends HTMLElement>(forca = 0.35): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !animado() || ehToque()) return;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * forca);
      y((e.clientY - (r.top + r.height / 2)) * forca);
    };
    const sair = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", sair);
    return () => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", sair);
    };
  }, [forca]);
  return ref;
}

/* ---------- Contador ---------- */
export function usarContador<T extends HTMLElement>(ate: number, formatar: (n: number) => string = (n) => Math.round(n).toLocaleString("pt-BR")): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!animado()) {
      el.textContent = formatar(ate);
      return;
    }
    const obj = { v: 0 };
    const tw = gsap.to(obj, {
      v: ate,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatar(obj.v);
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
    return () => {
      tw.kill();
    };
  }, [ate, formatar]);
  return ref;
}

/** Depois de trocar de rota: topo + refresh dos triggers (layout novo). */
export function aoTrocarRota() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
  requestAnimationFrame(() => ScrollTrigger.refresh());
}
