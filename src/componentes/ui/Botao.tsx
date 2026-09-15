/**
 * Botão do sistema. Renderiza <Link> (prop `para`), <a> (prop `href`) ou <button>.
 * Variantes: ouro (ação principal), contorno, wa (WhatsApp), fantasma, perigo.
 * `magnetico` liga o efeito magnético (desktop, animações ligadas).
 */
import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { usarMagnetico } from "@/lib/movimento";
import Icone, { type NomeIcone } from "./Icones";

type Variante = "ouro" | "contorno" | "wa" | "fantasma" | "perigo";
type Tamanho = "sm" | "md" | "lg";

interface Base {
  variante?: Variante;
  tamanho?: Tamanho;
  icone?: NomeIcone;
  iconeDepois?: NomeIcone;
  magnetico?: boolean;
  cheio?: boolean;
  className?: string;
  children?: ReactNode;
}

type PropsLink = Base & { para: string; href?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;
type PropsA = Base & { href: string; para?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;
type PropsBotao = Base & { para?: never; href?: never } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
export type PropsBotaoSistema = PropsLink | PropsA | PropsBotao;

const VARIANTES: Record<Variante, string> = {
  ouro: "botao-ouro",
  contorno: "botao-contorno",
  wa: "botao-wa",
  fantasma: "inline-flex items-center justify-center gap-2 rounded-full font-semibold text-cinza hover:text-tinta transition-colors min-h-12 px-4",
  perigo: "inline-flex items-center justify-center gap-2 rounded-full font-bold min-h-12 px-5 border border-erro/40 text-erro hover:bg-erro/10 transition-colors",
};
const TAMANHOS: Record<Tamanho, string> = {
  sm: "!min-h-10 !px-4 text-sm",
  md: "text-sm sm:text-base",
  lg: "!min-h-14 !px-8 text-base sm:text-lg",
};

function Conteudo({ icone, iconeDepois, children }: Pick<Base, "icone" | "iconeDepois" | "children">) {
  return (
    <>
      {icone && <Icone nome={icone} tamanho={18} />}
      {children}
      {iconeDepois && <Icone nome={iconeDepois} tamanho={18} />}
    </>
  );
}

const Botao = forwardRef<HTMLElement, PropsBotaoSistema>(function Botao(props, refExterno) {
  const { variante = "ouro", tamanho = "md", icone, iconeDepois, magnetico = false, cheio = false, className = "", children, ...resto } = props;
  const refMag = usarMagnetico<HTMLElement>(magnetico ? 0.3 : 0);
  const ref = (el: HTMLElement | null) => {
    if (magnetico) (refMag as React.MutableRefObject<HTMLElement | null>).current = el;
    if (typeof refExterno === "function") refExterno(el);
    else if (refExterno) (refExterno as React.MutableRefObject<HTMLElement | null>).current = el;
  };
  const classes = `${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${cheio ? "w-full" : ""} ${className}`.trim();
  const conteudo = <Conteudo icone={icone} iconeDepois={iconeDepois}>{children}</Conteudo>;

  if ("para" in resto && typeof resto.para === "string") {
    const { para, ...r } = resto as PropsLink;
    return (
      <Link ref={ref as never} to={para} className={classes} {...r}>
        {conteudo}
      </Link>
    );
  }
  if ("href" in resto && typeof resto.href === "string") {
    const { href, ...r } = resto as PropsA;
    const externo = /^https?:/.test(href);
    return (
      <a ref={ref as never} href={href} className={classes} target={externo ? "_blank" : undefined} rel={externo ? "noopener" : undefined} {...r}>
        {conteudo}
      </a>
    );
  }
  const r = resto as PropsBotao;
  return (
    <button ref={ref as never} type={r.type ?? "button"} className={classes} {...r}>
      {conteudo}
    </button>
  );
});

export default Botao;
