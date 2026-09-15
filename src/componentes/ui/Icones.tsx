/** Ícones SVG inline (stroke currentColor). Uso: <Icone nome="whatsapp" tamanho={20} /> */
import type { SVGProps } from "react";

export type NomeIcone =
  | "whatsapp" | "instagram" | "carrinho" | "escudo" | "loja" | "entrega" | "vip" | "seta" | "setaEsq"
  | "busca" | "fechar" | "menu" | "check" | "estrela" | "pix" | "cartao" | "mapa" | "relogio" | "coracao"
  | "mais" | "menos" | "lixeira" | "editar" | "olho" | "olhoFechado" | "duplicar" | "sair" | "painel" | "caixa"
  | "pedidos" | "clientes" | "vitrine" | "equipe" | "config" | "ajuda" | "alerta" | "info" | "nota" | "bateria"
  | "chevron" | "filtro" | "copiar" | "externo" | "grafico" | "calendario" | "telefone" | "email" | "casa" | "apple" | "brilho";

const CAMINHOS: Record<NomeIcone, string> = {
  whatsapp: "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24m-2.4 4.1c-.19 0-.5.07-.76.35-.26.28-1 .98-1 2.39s1.03 2.77 1.17 2.96c.14.19 2 3.05 4.85 4.28.68.29 1.2.46 1.61.6.68.21 1.3.18 1.79.11.55-.08 1.68-.69 1.92-1.35s.24-1.23.17-1.35c-.07-.12-.26-.19-.54-.33-.28-.14-1.68-.83-1.94-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.11-.16.19-.33.21-.61.07-.28-.14-1.2-.44-2.28-1.41-.84-.75-1.41-1.68-1.58-1.96-.16-.28-.02-.43.13-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.55-.87-2.12-.22-.53-.45-.46-.62-.47z",
  instagram: "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm4.5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
  carrinho: "M4 6h2l2.4 10.2a1.6 1.6 0 0 0 1.6 1.3h7.2a1.6 1.6 0 0 0 1.6-1.2L20.5 9H7M10.5 20.5h.01M17 20.5h.01",
  escudo: "M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3zm-3 9l2 2 4-4",
  loja: "M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6",
  entrega: "M3 7h11v8H3zM14 10h4l3 3v2h-7zM6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  vip: "M4 18h16M4 18l-1-9 5 3 4-6 4 6 5-3-1 9",
  seta: "M5 12h14M13 6l6 6-6 6",
  setaEsq: "M19 12H5M11 6l-6 6 6 6",
  busca: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4",
  fechar: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  check: "M5 12l5 5L20 7",
  estrela: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9z",
  pix: "M7 12l5-5 5 5-5 5zM4 12l3-3M20 12l-3 3M12 4l3 3M12 20l-3-3",
  cartao: "M3 6h18v12H3zM3 10h18M7 15h4",
  mapa: "M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  relogio: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 4v5l3 2",
  coracao: "M12 20.3 4.9 13a4.7 4.7 0 0 1 0-6.6 4.5 4.5 0 0 1 6.5 0l.6.6.6-.6a4.5 4.5 0 0 1 6.5 0 4.7 4.7 0 0 1 0 6.6z",
  mais: "M12 5v14M5 12h14",
  menos: "M5 12h14",
  lixeira: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6",
  editar: "M4 20h4l10-10-4-4L4 16zM13 7l4 4",
  olho: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  olhoFechado: "M3 3l18 18M10 6.3A10 10 0 0 1 22 12s-1.3 2.3-3.7 4.2M6.5 8.4C4 10.2 2 12 2 12s4 7 10 7c1.4 0 2.7-.3 3.9-.8M9.9 9.9a3 3 0 0 0 4.2 4.2",
  duplicar: "M8 8h12v12H8zM4 16V4h12",
  sair: "M10 4H5v16h5M14 8l4 4-4 4M18 12H9",
  painel: "M3 4h8v8H3zM13 4h8v5h-8zM13 11h8v9h-8zM3 14h8v6H3z",
  caixa: "M3 8l9-4 9 4v9l-9 4-9-4zM3 8l9 4 9-4M12 12v9",
  pedidos: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6",
  clientes: "M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 19v-1a4 4 0 0 0-3-3.9M15.5 4.1a3.5 3.5 0 0 1 0 6.8",
  vitrine: "M3 5h18v4H3zM4 9v11h16V9M9 20v-6h6v6",
  equipe: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1",
  config: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7.6 7.6 0 0 0-1.7-1L14.8 3H9.2l-.4 2.5a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7.4 7.4 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.6 7.6 0 0 0 1.7 1l.4 2.5h5.6l.4-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1z",
  ajuda: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 14h.01M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8",
  alerta: "M12 3l10 18H2zM12 10v4M12 17h.01",
  info: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 11v5M12 8h.01",
  nota: "M6 3h9l4 4v14H6zM14 3v5h5M9 12h6M9 16h4",
  bateria: "M3 8h15v8H3zM18 10h2v4h-2M6 11h6v2H6",
  chevron: "M9 6l6 6-6 6",
  filtro: "M4 5h16l-6 8v5l-4 2v-7z",
  copiar: "M9 9h11v11H9zM5 15V4h11",
  externo: "M14 4h6v6M20 4l-9 9M19 14v6H5V6h6",
  grafico: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  calendario: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  telefone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  email: "M3 6h18v12H3zM3 7l9 6 9-6",
  casa: "M3 11l9-7 9 7v9h-6v-6H9v6H3z",
  apple: "M15.5 4.5c-1 1.2-2.6 1.8-3.8 1.7-.2-1.4.5-2.8 1.3-3.6C13.9 1.6 15.4 1 16.6 1c.1 1.4-.4 2.6-1.1 3.5zM17 9.4c-1.7 1-2.7 2.6-2.5 4.6.2 2.2 1.6 3.5 3.1 4.3-.5 1.5-1.4 3-2.4 4.1-.8.9-1.7 1.6-2.9 1.6-1.2 0-1.6-.7-3-.7s-1.8.7-3 .7c-1.2 0-2.1-.8-2.9-1.7C1.6 19.7.6 15 2.3 11.5c.9-1.8 2.6-3 4.5-3 1.3 0 2.5.9 3.2.9.7 0 2.2-1.1 3.8-.9.7 0 2.5.3 3.7 2z",
  brilho: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8zM5 15l.6 1.6L7.2 17l-1.6.6L5 19.2l-.6-1.6L2.8 17l1.6-.4z",
};

const PREENCHIDOS: NomeIcone[] = ["whatsapp", "instagram", "apple", "brilho"];

interface Props extends Omit<SVGProps<SVGSVGElement>, "name"> {
  nome: NomeIcone;
  tamanho?: number;
  espessura?: number;
}

export default function Icone({ nome, tamanho = 20, espessura = 1.7, className = "", ...resto }: Props) {
  const preenchido = PREENCHIDOS.includes(nome);
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      fill={preenchido ? "currentColor" : "none"}
      stroke={preenchido ? "none" : "currentColor"}
      strokeWidth={espessura}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...resto}
    >
      <path d={CAMINHOS[nome]} />
    </svg>
  );
}
