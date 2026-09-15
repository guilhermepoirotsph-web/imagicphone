/**
 * Marca iMagicPhone — recriada em SVG a partir da foto de perfil do IG:
 * maçã dourada com estrela + wordmark "iMagicPhone" em ouro gradiente.
 * Quando o cliente mandar o logo em PNG/SVG, este componente troca por <img>.
 */
import { useId } from "react";

interface Props {
  variante?: "completa" | "marca" | "wordmark";
  altura?: number;
  className?: string;
  monocromo?: boolean;
}

export function MarcaMaca({ tamanho = 40, className = "", monocromo = false }: { tamanho?: number; className?: string; monocromo?: boolean }) {
  const id = useId().replace(/:/g, "");
  const g = `ouro-${id}`;
  const m = `mask-${id}`;
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e6a2" />
          <stop offset="0.45" stopColor="#d4b24c" />
          <stop offset="1" stopColor="#8c6a14" />
        </linearGradient>
        <mask id={m}>
          <rect width="64" height="64" fill="#fff" />
          <circle cx="53" cy="27" r="7.5" fill="#000" />
          <path d="M32 31.5l2.1 4.6 5 .6-3.7 3.4.95 5-4.35-2.5-4.35 2.5.95-5-3.7-3.4 5-.6z" fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${m})`} fill={monocromo ? "currentColor" : `url(#${g})`}>
        <path d="M31.8 20.2c-3.6-3.6-9.4-4.6-14.2-2.1-6 3.1-9.1 10.4-8 18.6 1.1 8.7 6.6 17.3 12.5 19.9 3 1.3 5-.7 8-.7s5 2 8.1.7c5.9-2.6 11.3-11.2 12.4-19.9 1.1-8.2-2-15.5-8-18.6-4.8-2.5-10.6-1.5-14.2 2.1z" />
        <path d="M33 17.3c.6-4.9 4.2-8.6 8.8-9.3.2 4.9-3.4 9.1-8.8 9.3z" />
      </g>
    </svg>
  );
}

export function Wordmark({ altura = 22, className = "", monocromo = false }: { altura?: number; className?: string; monocromo?: boolean }) {
  const id = useId().replace(/:/g, "");
  const g = `wm-${id}`;
  return (
    <svg height={altura} viewBox="0 0 170 30" className={className} role="img" aria-label="iMagicPhone" focusable="false">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9c7a1e" />
          <stop offset="0.35" stopColor="#f1d97a" />
          <stop offset="0.55" stopColor="#d4b24c" />
          <stop offset="1" stopColor="#8c6a14" />
        </linearGradient>
      </defs>
      <text x="0" y="24" fill={monocromo ? "currentColor" : `url(#${g})`} fontFamily="Sora, Manrope, system-ui, sans-serif" fontWeight="700" fontSize="24" letterSpacing="-0.6">
        iMagicPhone
      </text>
    </svg>
  );
}

export default function Logo({ variante = "completa", altura = 34, className = "", monocromo = false }: Props) {
  const marca = variante !== "wordmark";
  const texto = variante !== "marca";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} style={{ height: altura }} aria-label="iMagicPhone">
      {marca && <MarcaMaca tamanho={altura} monocromo={monocromo} />}
      {texto && <Wordmark altura={altura * 0.62} monocromo={monocromo} />}
    </span>
  );
}
