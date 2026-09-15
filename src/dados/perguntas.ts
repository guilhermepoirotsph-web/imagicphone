/**
 * FAQ — respostas baseadas SOMENTE em informação pública verificada
 * (bio e posts do Instagram). Onde não há dado público, a resposta manda
 * para o WhatsApp em vez de inventar política comercial.
 */
export interface Pergunta {
  id: string;
  pergunta: string;
  resposta: string;
}

export const perguntas: Pergunta[] = [
  {
    id: "garantia",
    pergunta: "Os iPhones têm garantia e nota fiscal?",
    resposta: "Sim. Todo iPhone sai com garantia e nota fiscal — os novos são lacrados, com 1 ano de garantia, como a loja divulga no perfil oficial.",
  },
  {
    id: "entrega",
    pergunta: "Vocês entregam?",
    resposta: "Sim, a iMagicPhone entrega no Litoral Norte (Caraguatatuba, São Sebastião, Ubatuba e Ilhabela). Prazo e taxa são combinados no atendimento pelo WhatsApp.",
  },
  {
    id: "loja",
    pergunta: "Onde fica a loja física?",
    resposta: "No Sumaré, em Caraguatatuba: Av. Dr. Arthur da Costa Filho, 1659 — Sala 604 (edifício Green Office). Combine o horário da visita pelo WhatsApp.",
  },
  {
    id: "pre-venda",
    pergunta: "Como funciona a pré-venda?",
    resposta: "Você reserva o aparelho com sinal de 50% do valor e recebe na data prevista da chegada. A pré-venda atual é do iPhone 18 Pro, com entrega prevista para 23 de setembro.",
  },
  {
    id: "pagamento",
    pergunta: "Quais formas de pagamento?",
    resposta: "Pix, cartão e as condições de parcelamento são combinados no atendimento. Pelo site você monta o pedido e finaliza com a loja no WhatsApp.",
  },
  {
    id: "eua",
    pergunta: "O que é a versão americana (🇺🇸)?",
    resposta: "São iPhones importados dos Estados Unidos, que funcionam com eSIM. A loja destaca as chegadas de iPhone 16 🇺🇸 e 17 🇺🇸 no perfil — pergunte a disponibilidade no WhatsApp.",
  },
  {
    id: "seminovos",
    pergunta: "Os seminovos são confiáveis?",
    resposta: "Os seminovos são revisados pela loja e saem com garantia e nota fiscal. Peça fotos, saúde da bateria e detalhes do aparelho pelo WhatsApp.",
  },
  {
    id: "vip",
    pergunta: "O que é o Grupo VIP?",
    resposta: "Um grupo no WhatsApp onde a loja avisa chegadas, pré-vendas e ofertas antes de publicar no Instagram. A entrada é gratuita.",
  },
];
