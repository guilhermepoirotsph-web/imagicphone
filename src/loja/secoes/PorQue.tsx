/**
 * Por que a iMagicPhone — 4 diferenciais verificados na bio + contador real
 * de seguidores (10.080 em 14/09/2026). Cartões com holofote no hover.
 */
import { negocio } from "@/dados/negocio";
import { numeroCompacto } from "@/lib/formatar";
import { usarContador, usarReveal } from "@/lib/movimento";
import Secao from "@/componentes/ui/Secao";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";

const ICONES: Record<string, NomeIcone> = { escudo: "escudo", loja: "loja", entrega: "entrega", vip: "vip" };

export default function PorQue() {
  const refGrade = usarReveal<HTMLUListElement>({ stagger: 0.1, y: 34 });
  const refNumero = usarContador<HTMLSpanElement>(negocio.provaSocial.seguidores, (n) => numeroCompacto(Math.round(n)));

  return (
    <Secao
      id="por-que"
      rotulo="Por que a iMagicPhone"
      titulo={<>Comprar iPhone com <span className="texto-ouro">segurança</span> no litoral.</>}
      descricao="O que a loja garante — nada aqui é promessa de site: está na bio e nos posts do perfil oficial."
      className="relative border-t border-linha"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul ref={refGrade} data-reveal className="grid gap-4 sm:grid-cols-2">
          {negocio.diferenciais.map((d) => (
            <li
              key={d.titulo}
              className="group cartao relative overflow-hidden p-6 transition-colors hover:border-ouro/40"
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
              }}
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(212,178,76,.14), transparent 60%)" }} />
              <span className="relative grid size-12 place-items-center rounded-2xl border border-ouro/30 bg-ouro/10 text-ouro">
                <Icone nome={ICONES[d.icone] ?? "brilho"} tamanho={22} />
              </span>
              <h3 className="relative mt-5 font-display text-lg font-bold">{d.titulo}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-cinza">{d.texto}</p>
            </li>
          ))}
        </ul>

        <a
          href={negocio.instagram}
          target="_blank"
          rel="noopener"
          className="cartao-ouro group flex flex-col justify-between p-7 transition-colors hover:border-ouro"
        >
          <span className="grid size-12 place-items-center rounded-2xl border border-ouro/40 bg-ouro/15 text-ouro">
            <Icone nome="instagram" tamanho={24} />
          </span>
          <div className="mt-8">
            <p className="texto-display text-5xl text-marfim">
              <span ref={refNumero}>0</span>
            </p>
            <p className="mt-2 text-sm font-semibold text-cinza">seguidores no Instagram</p>
            <p className="mt-1 text-xs text-cinza-escuro">{negocio.provaSocial.destaquesClientes} destaques de clientes atendidos no perfil {negocio.instagramHandle}</p>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ouro">
            Ver o perfil <Icone nome="externo" tamanho={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </a>
      </div>
    </Secao>
  );
}
