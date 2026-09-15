/**
 * Arte de produto gerada em SVG — usada enquanto o cliente não manda as
 * fotos reais (lacuna honesta: sem foto de banco de imagem, sem slop de IA).
 * Convenção de `produto.imagens[i]`:
 *   "arte:iphone:costas" | "arte:iphone:frente" | "arte:airpods" | "arte:watch"
 *   | "arte:ipad" | "arte:capa" | "arte:magsafe" | "arte:cabo" | "arte:pelicula" | "arte:fonte"
 *   qualquer outro valor = caminho de foto real (<img>).
 */
import { useId } from "react";
import type { Produto } from "@/dados/tipos";
import { CORES_VISUAIS } from "@/dados/catalogo";

interface Props {
  produto: Produto;
  indice?: number;
  className?: string;
  /** força uma vista, ignorando produto.imagens */
  vista?: string;
}

function Iphone({ produto, vista, id }: { produto: Produto; vista: "costas" | "frente"; id: string }) {
  const cor = CORES_VISUAIS[produto.corVisual];
  const pro = produto.familia === "pro";
  const gCorpo = `corpo-${id}`;
  const gTela = `tela-${id}`;
  const gBrilho = `brilho-${id}`;
  return (
    <svg viewBox="0 0 300 380" className="h-full w-full" role="img" aria-label={`${produto.nome} ${produto.cor} — arte ilustrativa`}>
      <defs>
        <linearGradient id={gCorpo} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={cor.brilho} />
          <stop offset="0.35" stopColor={cor.corpo} />
          <stop offset="1" stopColor={cor.borda} />
        </linearGradient>
        <linearGradient id={gTela} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a1408" />
          <stop offset="0.5" stopColor="#3a2c0c" />
          <stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id={gBrilho} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* sombra de contato */}
      <ellipse cx="150" cy="364" rx="92" ry="9" fill="rgba(212,178,76,.18)" />
      {/* corpo */}
      <rect x="70" y="18" width="160" height="330" rx="34" fill={`url(#${gCorpo})`} stroke={cor.borda} strokeWidth="2" />
      <rect x="74" y="22" width="152" height="322" rx="31" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1" />
      {vista === "frente" ? (
        <>
          <rect x="79" y="27" width="142" height="312" rx="27" fill={`url(#${gTela})`} />
          {/* dynamic island */}
          <rect x="128" y="38" width="44" height="12" rx="6" fill="#050505" />
          {/* wallpaper: marca dourada */}
          <circle cx="150" cy="170" r="46" fill="none" stroke="rgba(212,178,76,.35)" strokeWidth="1.2" />
          <circle cx="150" cy="170" r="28" fill="none" stroke="rgba(212,178,76,.5)" strokeWidth="1.2" />
          <path d="M150 154l4.2 9.2 10 1.2-7.4 6.8 1.9 10-8.7-5-8.7 5 1.9-10-7.4-6.8 10-1.2z" fill="#d4b24c" />
          <text x="150" y="238" textAnchor="middle" fill="#d4b24c" fontFamily="Sora, system-ui" fontWeight="700" fontSize="13" letterSpacing="1">
            iMagicPhone
          </text>
          <text x="150" y="256" textAnchor="middle" fill="rgba(245,239,224,.55)" fontFamily="Manrope, system-ui" fontSize="8" letterSpacing="2">
            REFERÊNCIA APPLE NO LITORAL
          </text>
          <rect x="120" y="326" width="60" height="4" rx="2" fill="rgba(255,255,255,.5)" />
        </>
      ) : (
        <>
          {/* módulo de câmeras */}
          <rect x="84" y="34" width={pro ? 78 : 44} height={pro ? 78 : 78} rx="20" fill={cor.borda} opacity="0.9" />
          {pro ? (
            <>
              <circle cx="106" cy="56" r="13" fill="#0c0c0e" stroke="#2a2a2e" strokeWidth="3" />
              <circle cx="106" cy="90" r="13" fill="#0c0c0e" stroke="#2a2a2e" strokeWidth="3" />
              <circle cx="140" cy="73" r="13" fill="#0c0c0e" stroke="#2a2a2e" strokeWidth="3" />
              <circle cx="106" cy="56" r="5" fill="#1d2a5a" />
              <circle cx="106" cy="90" r="5" fill="#1d2a5a" />
              <circle cx="140" cy="73" r="5" fill="#1d2a5a" />
              <circle cx="141" cy="50" r="4" fill="#e9dcae" />
              <circle cx="141" cy="97" r="2.5" fill="#151517" />
            </>
          ) : (
            <>
              <circle cx="106" cy="56" r="13" fill="#0c0c0e" stroke="#2a2a2e" strokeWidth="3" />
              <circle cx="106" cy="90" r="13" fill="#0c0c0e" stroke="#2a2a2e" strokeWidth="3" />
              <circle cx="106" cy="56" r="5" fill="#1d2a5a" />
              <circle cx="106" cy="90" r="5" fill="#1d2a5a" />
              <circle cx="134" cy="48" r="3.5" fill="#e9dcae" />
            </>
          )}
          {/* maçã dourada nas costas */}
          <g transform="translate(131 178) scale(0.6)" fill="rgba(212,178,76,.9)">
            <path d="M31.8 20.2c-3.6-3.6-9.4-4.6-14.2-2.1-6 3.1-9.1 10.4-8 18.6 1.1 8.7 6.6 17.3 12.5 19.9 3 1.3 5-.7 8-.7s5 2 8.1.7c5.9-2.6 11.3-11.2 12.4-19.9 1.1-8.2-2-15.5-8-18.6-4.8-2.5-10.6-1.5-14.2 2.1z" />
            <path d="M33 17.3c.6-4.9 4.2-8.6 8.8-9.3.2 4.9-3.4 9.1-8.8 9.3z" />
          </g>
        </>
      )}
      {/* reflexo */}
      <rect x="70" y="18" width="160" height="330" rx="34" fill={`url(#${gBrilho})`} opacity="0.35" />
      {produto.origem === "EUA" && (
        <text x="150" y="374" textAnchor="middle" fill="rgba(163,163,168,.9)" fontFamily="Manrope, system-ui" fontSize="9" letterSpacing="2">
          VERSÃO 🇺🇸
        </text>
      )}
    </svg>
  );
}

function Acessorio({ tipo, produto, id }: { tipo: string; produto: Produto; id: string }) {
  const cor = CORES_VISUAIS[produto.corVisual];
  const g = `ac-${id}`;
  const comum = (
    <defs>
      <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={cor.brilho} />
        <stop offset="0.5" stopColor={cor.corpo} />
        <stop offset="1" stopColor={cor.borda} />
      </linearGradient>
    </defs>
  );
  const rotulo = `${produto.nome} — arte ilustrativa`;
  switch (tipo) {
    case "airpods":
      return (
        <svg viewBox="0 0 300 380" className="h-full w-full" role="img" aria-label={rotulo}>
          {comum}
          <ellipse cx="150" cy="330" rx="90" ry="9" fill="rgba(212,178,76,.18)" />
          <rect x="70" y="150" width="160" height="150" rx="34" fill={`url(#${g})`} stroke="#c9c4b9" strokeWidth="2" />
          <rect x="82" y="162" width="136" height="20" rx="10" fill="rgba(0,0,0,.08)" />
          <path d="M110 120c0-22 14-40 30-40s30 18 30 40v18c0 8-4 12-10 14l-6 40c-1 6-6 8-14 8s-13-2-14-8l-6-40c-6-2-10-6-10-14z" fill={`url(#${g})`} stroke="#c9c4b9" strokeWidth="2" transform="translate(-42 -30)" />
          <path d="M110 120c0-22 14-40 30-40s30 18 30 40v18c0 8-4 12-10 14l-6 40c-1 6-6 8-14 8s-13-2-14-8l-6-40c-6-2-10-6-10-14z" fill={`url(#${g})`} stroke="#c9c4b9" strokeWidth="2" transform="translate(42 -30)" />
          <circle cx="150" cy="228" r="5" fill="#d4b24c" />
        </svg>
      );
    case "watch":
      return (
        <svg viewBox="0 0 300 380" className="h-full w-full" role="img" aria-label={rotulo}>
          {comum}
          <ellipse cx="150" cy="350" rx="70" ry="8" fill="rgba(212,178,76,.18)" />
          <rect x="112" y="20" width="76" height="340" rx="22" fill={cor.borda} opacity="0.9" />
          <rect x="88" y="110" width="124" height="150" rx="34" fill={`url(#${g})`} stroke="#2a2a2e" strokeWidth="2" />
          <rect x="98" y="120" width="104" height="130" rx="28" fill="#050505" />
          <circle cx="150" cy="185" r="28" fill="none" stroke="#d4b24c" strokeWidth="6" strokeDasharray="120 60" strokeLinecap="round" />
          <circle cx="150" cy="185" r="18" fill="none" stroke="#3ddc84" strokeWidth="5" strokeDasharray="70 40" strokeLinecap="round" />
          <rect x="210" y="150" width="8" height="26" rx="3" fill={cor.brilho} />
        </svg>
      );
    case "ipad":
      return (
        <svg viewBox="0 0 300 380" className="h-full w-full" role="img" aria-label={rotulo}>
          {comum}
          <ellipse cx="150" cy="360" rx="110" ry="8" fill="rgba(212,178,76,.18)" />
          <rect x="34" y="30" width="232" height="320" rx="22" fill={`url(#${g})`} stroke={cor.borda} strokeWidth="2" />
          <rect x="46" y="42" width="208" height="296" rx="12" fill="#0a0a0c" />
          <circle cx="150" cy="190" r="40" fill="none" stroke="rgba(212,178,76,.4)" />
          <path d="M150 170l5 11 12 1.5-9 8 2.3 12-10.3-6-10.3 6 2.3-12-9-8 12-1.5z" fill="#d4b24c" />
        </svg>
      );
    case "capa":
      return (
        <svg viewBox="0 0 300 380" className="h-full w-full" role="img" aria-label={rotulo}>
          <ellipse cx="150" cy="364" rx="92" ry="9" fill="rgba(212,178,76,.18)" />
          <rect x="70" y="18" width="160" height="330" rx="34" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.45)" strokeWidth="3" />
          <rect x="84" y="34" width="78" height="78" rx="20" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2.5" />
          <circle cx="150" cy="212" r="42" fill="none" stroke="rgba(212,178,76,.6)" strokeWidth="3" strokeDasharray="10 8" />
          <circle cx="150" cy="212" r="6" fill="#d4b24c" />
        </svg>
      );
    case "magsafe":
      return (
        <svg viewBox="0 0 300 380" className="h-full w-full" role="img" aria-label={rotulo}>
          {comum}
          <ellipse cx="150" cy="330" rx="80" ry="8" fill="rgba(212,178,76,.18)" />
          <circle cx="150" cy="170" r="78" fill={`url(#${g})`} stroke="#c9c4b9" strokeWidth="2" />
          <circle cx="150" cy="170" r="60" fill="none" stroke="rgba(0,0,0,.12)" strokeWidth="6" />
          <path d="M150 248c0 40 20 60 20 90" stroke="#e9e5dc" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M150 140l-12 34h12l-4 26 20-38h-12z" fill="#d4b24c" />
        </svg>
      );
    case "cabo":
      return (
        <svg viewBox="0 0 300 380" className="h-full w-full" role="img" aria-label={rotulo}>
          <ellipse cx="150" cy="340" rx="90" ry="8" fill="rgba(212,178,76,.18)" />
          <path d="M70 90c60-40 140 40 200-10" stroke="#e9e5dc" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M60 300c50-60 130-80 190-20" stroke="#e9e5dc" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M70 90c-20 60 30 120 60 160" stroke="#e9e5dc" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M250 280c30-60-20-140-60-180" stroke="#e9e5dc" strokeWidth="10" fill="none" strokeLinecap="round" />
          <rect x="40" y="60" width="44" height="22" rx="8" fill="#d9d5cc" stroke="#b8b3a8" strokeWidth="2" />
          <rect x="236" y="264" width="44" height="22" rx="8" fill="#d9d5cc" stroke="#b8b3a8" strokeWidth="2" />
        </svg>
      );
    case "pelicula":
      return (
        <svg viewBox="0 0 300 380" className="h-full w-full" role="img" aria-label={rotulo}>
          <ellipse cx="150" cy="364" rx="92" ry="9" fill="rgba(212,178,76,.18)" />
          <rect x="80" y="26" width="140" height="310" rx="28" fill="rgba(140,180,220,.12)" stroke="rgba(255,255,255,.6)" strokeWidth="2.5" />
          <path d="M100 60l40-30" stroke="rgba(255,255,255,.6)" strokeWidth="3" strokeLinecap="round" />
          <path d="M96 90l70-56" stroke="rgba(255,255,255,.35)" strokeWidth="3" strokeLinecap="round" />
          <path d="M150 150l5 11 12 1.5-9 8 2.3 12-10.3-6-10.3 6 2.3-12-9-8 12-1.5z" fill="#d4b24c" />
        </svg>
      );
    case "fonte":
    default:
      return (
        <svg viewBox="0 0 300 380" className="h-full w-full" role="img" aria-label={rotulo}>
          {comum}
          <ellipse cx="150" cy="330" rx="70" ry="8" fill="rgba(212,178,76,.18)" />
          <rect x="90" y="110" width="120" height="120" rx="30" fill={`url(#${g})`} stroke="#c9c4b9" strokeWidth="2" />
          <rect x="120" y="232" width="14" height="40" rx="4" fill="#c9c4b9" />
          <rect x="166" y="232" width="14" height="40" rx="4" fill="#c9c4b9" />
          <rect x="136" y="160" width="28" height="12" rx="6" fill="#050505" />
          <text x="150" y="205" textAnchor="middle" fill="#8c6a14" fontFamily="Manrope, system-ui" fontWeight="700" fontSize="14">
            20W
          </text>
        </svg>
      );
  }
}

export default function ArteProduto({ produto, indice = 0, className = "", vista }: Props) {
  const id = useId().replace(/:/g, "");
  const chave = vista ?? produto.imagens[indice] ?? produto.imagens[0] ?? "arte:iphone:costas";
  if (!chave.startsWith("arte:")) {
    return (
      <img
        src={chave}
        alt={`${produto.nome} ${produto.cor}`}
        loading="lazy"
        className={`h-full w-full object-contain ${className}`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  const partes = chave.split(":");
  const wrapper = `relative h-full w-full ${className}`;
  if (partes[1] === "iphone") {
    return (
      <div className={wrapper}>
        <Iphone produto={produto} vista={partes[2] === "frente" ? "frente" : "costas"} id={id} />
      </div>
    );
  }
  return (
    <div className={wrapper}>
      <Acessorio tipo={partes[1] === "acessorio" ? "fonte" : partes[1]} produto={produto} id={id} />
    </div>
  );
}
