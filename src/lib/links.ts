/**
 * Toda conversão do site passa por aqui. O canal oficial é o link da bio
 * (wa.me/message/...), que abre o WhatsApp Business da loja com mensagem
 * pré-definida. Quando o cliente informar o NÚMERO (Configurações do painel),
 * as mensagens contextuais ("vi o iPhone X no site") passam a funcionar —
 * sem número, tudo cai no link oficial (nunca inventar número).
 */
import { negocio, CONFIGURE_ME } from "@/dados/negocio";

function temNumero(numero: string): boolean {
  return Boolean(numero) && numero !== CONFIGURE_ME && /^\d{10,15}$/.test(numero);
}

export function linkWhatsapp(
  mensagem: string,
  numero: string = negocio.whatsappNumero,
  linkPadrao: string = negocio.whatsappLink,
): string {
  if (temNumero(numero)) return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  return linkPadrao;
}

export const wa = {
  padrao: (numero?: string, link?: string) =>
    linkWhatsapp("Olá! Vim pelo site da iMagicPhone e quero um atendimento. 📱", numero, link),
  produto: (nome: string, numero?: string, link?: string) =>
    linkWhatsapp(`Olá! Vi o ${nome} no site da iMagicPhone e quero saber mais. 📱`, numero, link),
  ofertas: (numero?: string, link?: string) =>
    linkWhatsapp("Olá! Quero saber das ofertas e chegadas da iMagicPhone. 🔥", numero, link),
  vip: (numero?: string, link?: string) =>
    linkWhatsapp("Olá! Quero entrar no Grupo VIP da iMagicPhone. 📱🔥", numero, link),
  pedido: (resumo: string, numero?: string, link?: string) => linkWhatsapp(resumo, numero, link),
};

export function linkMapa(endereco: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
}

/** Checkout InfinitePay por URL — padrão da casa (só quando a tag existe). Preços em centavos. */
export function linkInfinitePay(
  tag: string,
  itens: { name: string; price: number; quantity: number }[],
): string | null {
  if (!tag || tag === CONFIGURE_ME) return null;
  return `https://checkout.infinitepay.io/${encodeURIComponent(tag)}?items=${encodeURIComponent(JSON.stringify(itens))}`;
}
