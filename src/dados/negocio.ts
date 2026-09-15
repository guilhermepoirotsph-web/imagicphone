/**
 * ============================================================
 * FONTE ÚNICA DE DADOS COMERCIAIS — iMAGICPHONE
 * ============================================================
 * Tudo aqui foi VERIFICADO publicamente em 14/09/2026 em
 * instagram.com/imagicphone (bio, destaques e posts recentes).
 * Campos CONFIGURE_ME não estavam públicos — preencher com o cliente
 * antes de publicar. NÃO inventar dado comercial: onde não há dado,
 * o site esconde o elemento ou manda para o WhatsApp.
 * ============================================================
 */
export const CONFIGURE_ME = "CONFIGURE_ME";

export const negocio = {
  nome: "iMagicPhone",
  nomeCompleto: "iMagicPhone┃Produtos Apple | iPhone", // nome exibido no perfil
  slogan: "Sua Referência Apple no litoral.", // verificado: 1ª linha da bio
  instagram: "https://www.instagram.com/imagicphone/",
  instagramHandle: "@imagicphone",
  /** link oficial da bio (WhatsApp Business com mensagem pré-definida) */
  whatsappLink: "https://wa.me/message/TBJTRJ3RJG33N1",
  /** número em dígitos não é público na bio — o link acima é o canal oficial */
  whatsappNumero: CONFIGURE_ME,
  cidade: "Caraguatatuba",
  uf: "SP",
  regiao: "Litoral Norte de SP",
  /** verificado: post de 28/04/2026 "Nosso endereço" */
  endereco: "Av. Dr. Arthur da Costa Filho, 1659 — Sumaré, Caraguatatuba - SP",
  enderecoComplemento: "Sala 604 (edifício Green Office)",
  horario: CONFIGURE_ME, // não divulgado publicamente
  email: CONFIGURE_ME,
  cnpj: CONFIGURE_ME,
  razaoSocial: CONFIGURE_ME,

  /** Bio verificada, linha a linha */
  bio: [
    "Sua Referência Apple no litoral.",
    "iPhone é na iMagicPhone!",
    "Garantia e NF",
    "Loja Física em Caraguá",
    "Entrega no Litoral Norte",
  ],

  /** Destaques do perfil (verificados): base das seções e do Grupo VIP */
  destaques: ["Disponíveis", "Clientes", "iPhone 17 🇺🇸", "iPhone 16 🇺🇸", "Grupo Vip 📱🔥"],

  /** Prova social verificável (contagem pública em 14/09/2026) */
  provaSocial: {
    seguidores: 10080,
    seguidoresTexto: "10 mil seguidores",
    destaquesClientes: 6, // "Clientes", "Clientes 2 🤩" … "Clientes 5"
  },

  /** Diferenciais — SOMENTE o que está na bio/posts */
  diferenciais: [
    { titulo: "Garantia e nota fiscal", texto: "Todo iPhone sai com garantia e NF. Novo, lacrado, com 1 ano de garantia.", icone: "escudo" },
    { titulo: "Loja física em Caraguá", texto: "Atendimento presencial no Sumaré, em Caraguatatuba — Sala 604 do Green Office.", icone: "loja" },
    { titulo: "Entrega no Litoral Norte", texto: "Receba em Caraguatatuba, São Sebastião, Ubatuba e Ilhabela.", icone: "entrega" },
    { titulo: "Grupo VIP no WhatsApp", texto: "Chegadas, pré-vendas e ofertas antes de todo mundo.", icone: "vip" },
  ],

  /** Mensagens da barra superior — só informação verificada */
  anuncios: [
    "🛡️ Garantia e nota fiscal em todo iPhone",
    "📍 Loja física em Caraguatatuba — Sumaré",
    "🚚 Entrega no Litoral Norte",
    "📱🔥 Grupo VIP: ofertas antes de todo mundo",
  ],

  /** Copy do herói — tom do perfil ("Sua referência Apple no litoral") */
  heroi: {
    rotulo: "Sua referência Apple no litoral",
    titulo: "iPhone é na iMagicPhone.",
    subtitulo: "iPhones novos e seminovos com garantia e nota fiscal, loja física em Caraguá e entrega no Litoral Norte.",
    ctaPrimario: "Falar no WhatsApp",
    ctaSecundario: "Ver iPhones",
  },

  /** Pré-venda real publicada em 10/09/2026 (post do perfil) */
  preVendaAtual: {
    modelo: "iPhone 18 Pro",
    preco: 1099900, // R$ 10.999 (256 GB) — centavos
    armazenamento: 256,
    sinalPercentual: 50,
    entregaPrevista: "23 de setembro",
    condicoes: "Novo, lacrado, 1 ano de garantia. Consultar valores com mais armazenamento. Reservas com sinal de 50% do valor.",
    fonte: "instagram.com/imagicphone — post de 10/09/2026",
  },

  cidadesEntrega: ["Caraguatatuba", "São Sebastião", "Ubatuba", "Ilhabela"],
} as const;

export type Negocio = typeof negocio;
