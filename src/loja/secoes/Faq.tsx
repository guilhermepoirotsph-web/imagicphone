/**
 * FAQ — acordeão acessível (button aria-expanded + região), só um aberto por
 * vez, animação de altura com GSAP (height → auto, com onComplete fixando
 * "auto" para o conteúdo continuar fluido em redimensionamentos).
 * A altura é gerida SÓ pelo GSAP — o React nunca escreve `height` no estilo.
 */
import { useLayoutEffect, useRef, useState } from "react";
import { perguntas } from "@/dados/perguntas";
import { gsap, animado, usarReveal } from "@/lib/movimento";
import Secao from "@/componentes/ui/Secao";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";

/** Na home entram as primeiras; a página /perguntas mostra todas. */
const QUANTAS_NA_HOME = 6;

export default function Faq() {
  const lista = perguntas.slice(0, QUANTAS_NA_HOME);
  const [aberto, setAberto] = useState<string | null>(lista[0]?.id ?? null);
  const paineis = useRef(new Map<string, HTMLDivElement>());
  const primeiraVez = useRef(true);
  const refLista = usarReveal<HTMLDivElement>({ stagger: 0.06, y: 20 });

  useLayoutEffect(() => {
    const anim = animado();
    const instantaneo = primeiraVez.current || !anim;
    primeiraVez.current = false;

    paineis.current.forEach((el, id) => {
      const abrir = id === aberto;
      el.toggleAttribute("inert", !abrir);
      if (instantaneo) {
        gsap.set(el, { height: abrir ? "auto" : 0 });
        return;
      }
      if (abrir) {
        gsap.to(el, {
          height: "auto",
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
          onComplete: () => gsap.set(el, { height: "auto" }),
        });
      } else if (el.offsetHeight > 0) {
        gsap.to(el, { height: 0, duration: 0.38, ease: "power2.inOut", overwrite: true });
      }
    });
  }, [aberto]);

  return (
    <Secao
      id="perguntas"
      rotulo="Dúvidas"
      titulo="Perguntas frequentes"
      descricao="Respostas com o que a loja divulga publicamente. O que não está aqui, a gente resolve no WhatsApp."
      acao={
        <Botao variante="contorno" para="/perguntas" iconeDepois="seta">
          Ver todas
        </Botao>
      }
    >
      <div ref={refLista} data-reveal className="mx-auto flex max-w-3xl flex-col gap-3">
        {lista.map((p) => {
          const estaAberto = aberto === p.id;
          const idBotao = `faq-${p.id}-botao`;
          const idPainel = `faq-${p.id}-painel`;
          return (
            <div key={p.id} className={`cartao overflow-hidden transition-[border-color] duration-300 ${estaAberto ? "border-ouro/40" : ""}`}>
              <h3 className="texto-display text-base sm:text-lg">
                <button
                  id={idBotao}
                  type="button"
                  aria-expanded={estaAberto}
                  aria-controls={idPainel}
                  onClick={() => setAberto(estaAberto ? null : p.id)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:text-ouro-claro sm:px-6"
                >
                  <span>{p.pergunta}</span>
                  <span
                    aria-hidden="true"
                    className={`grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,border-color,color] duration-300 ${
                      estaAberto ? "rotate-45 border-ouro text-ouro" : "border-linha-forte text-cinza"
                    }`}
                  >
                    <Icone nome="mais" tamanho={16} />
                  </span>
                </button>
              </h3>
              <div
                id={idPainel}
                role="region"
                aria-labelledby={idBotao}
                ref={(el) => {
                  if (el) paineis.current.set(p.id, el);
                  else paineis.current.delete(p.id);
                }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm leading-relaxed text-cinza sm:px-6 sm:pb-6 sm:text-base">{p.resposta}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Secao>
  );
}
