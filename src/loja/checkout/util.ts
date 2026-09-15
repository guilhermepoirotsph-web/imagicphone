/**
 * Auxiliares do fluxo de compra (carrinho → checkout → pedido).
 * Sem estado próprio: tudo lê/escreve nas stores `useLoja` e `useCarrinho`.
 */
import type { Configuracoes, FormaPagamento, ModoEntrega, Pedido, StatusPedido } from "@/dados/tipos";
import { CONFIGURE_ME } from "@/dados/negocio";
import { ROTULO_PAGAMENTO } from "@/estado/loja";
import { moeda, mascararTelefone } from "@/lib/formatar";

/** true quando o valor existe e não é a lacuna CONFIGURE_ME. */
export function configurado(valor: string | null | undefined): valor is string {
  return Boolean(valor) && valor !== CONFIGURE_ME;
}

export function apenasDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}

/** Dígitos do WhatsApp sem o 55 (só remove o 55 quando sobra um número completo de 10–11 dígitos). */
export function digitosWhatsapp(entrada: string): string {
  return apenasDigitos(entrada).replace(/^55(?=\d{10,11}$)/, "").slice(0, 11);
}

/** Máscara progressiva enquanto digita: "(12) 99999-9999". */
export function mascaraWhatsapp(entrada: string): string {
  const d = digitosWhatsapp(entrada);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function whatsappValido(digitos: string): boolean {
  return /^\d{10,11}$/.test(digitos);
}

/* ---------- formulário do checkout ---------- */
export interface FormularioCheckout {
  nome: string;
  whatsapp: string;      // com máscara (a store recebe normalizado)
  modo: ModoEntrega;
  cidade: string;
  endereco: string;
  pagamento: FormaPagamento;
  observacao: string;
}

export type ErrosCheckout = Partial<Record<keyof FormularioCheckout, string>>;

export function validarCheckout(f: FormularioCheckout): ErrosCheckout {
  const erros: ErrosCheckout = {};
  if (f.nome.trim().length < 3) erros.nome = "Digite seu nome (pelo menos 3 letras).";
  if (!whatsappValido(digitosWhatsapp(f.whatsapp))) erros.whatsapp = "Digite o WhatsApp com DDD — 10 ou 11 dígitos.";
  if (f.modo === "entrega") {
    if (!f.cidade) erros.cidade = "Escolha a cidade de entrega.";
    if (f.endereco.trim().length < 5) erros.endereco = "Digite o endereço completo: rua, número e bairro.";
  }
  return erros;
}

/* ---------- status do pedido ---------- */
export type TomSelo = "ouro" | "neutro" | "ok" | "aviso" | "erro";

export const TOM_STATUS: Record<StatusPedido, TomSelo> = {
  novo: "ouro",
  confirmado: "neutro",
  pago: "ok",
  enviado: "ouro",
  entregue: "ok",
  cancelado: "erro",
};

export const PROXIMO_PASSO: Record<StatusPedido, string> = {
  novo: "Recebemos seu pedido. Envie o resumo no WhatsApp para a loja confirmar.",
  confirmado: "Pedido confirmado pela loja — agora é só acertar o pagamento.",
  pago: "Pagamento recebido. A loja está preparando a entrega ou a retirada.",
  enviado: "Seu pedido saiu para entrega.",
  entregue: "Pedido entregue. Obrigado pela preferência!",
  cancelado: "Este pedido foi cancelado. Qualquer dúvida, fale com a loja no WhatsApp.",
};

/** Pagamento ainda em aberto? (só aí faz sentido mostrar QR Pix / link do cartão) */
export function pagamentoEmAberto(status: StatusPedido): boolean {
  return status === "novo" || status === "confirmado";
}

/* ---------- resumo do pedido para o WhatsApp ---------- */
export function enderecoLoja(config: Configuracoes): string {
  return [configurado(config.endereco) ? config.endereco : null, configurado(config.enderecoComplemento) ? config.enderecoComplemento : null]
    .filter(Boolean)
    .join(", ");
}

export function resumoPedidoWhatsapp(pedido: Pedido, config: Configuracoes): string {
  const l: string[] = [];
  l.push(`🛒 *Pedido #${pedido.numero} — ${config.nomeLoja}*`);
  l.push(`👤 ${pedido.cliente.nome}`);
  l.push(`📱 ${mascararTelefone(pedido.cliente.whatsapp)}`);
  l.push("");
  l.push("*Itens*");
  for (const i of pedido.itens) {
    l.push(`• ${i.quantidade}x ${i.nome}${i.variacao ? ` (${i.variacao})` : ""} — ${moeda(i.precoUnitario * i.quantidade)}`);
  }
  l.push("");
  if (pedido.desconto > 0) {
    l.push(`Subtotal: ${moeda(pedido.subtotal)}`);
    l.push(`Desconto Pix: -${moeda(pedido.desconto)}`);
  }
  l.push(`💰 *Total: ${moeda(pedido.total)}*`);
  l.push("");
  if (pedido.entrega.modo === "retirada") {
    const end = enderecoLoja(config);
    l.push(`🏬 Retirada na loja${end ? ` — ${end}` : ""}`);
  } else {
    l.push(`🚚 Entrega em ${pedido.entrega.cidade || "Litoral Norte"}${pedido.entrega.endereco ? ` — ${pedido.entrega.endereco}` : ""}`);
  }
  l.push(`💳 Pagamento: ${ROTULO_PAGAMENTO[pedido.pagamento]}`);
  if (pedido.observacao) l.push(`📝 Obs.: ${pedido.observacao}`);
  l.push("");
  l.push("Pedido feito pelo site. Pode confirmar? 🙏");
  return l.join("\n");
}

/* ---------- área de transferência ---------- */
/** Copia texto: Clipboard API e, se bloqueada (http, webview), seleção + execCommand. */
export async function copiarTexto(texto: string, campo?: HTMLTextAreaElement | HTMLInputElement | null): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    /* cai no fallback abaixo */
  }
  try {
    if (campo) {
      campo.focus();
      campo.select();
      campo.setSelectionRange(0, texto.length);
      return document.execCommand("copy");
    }
    const ta = document.createElement("textarea");
    ta.value = texto;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
