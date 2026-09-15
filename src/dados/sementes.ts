/**
 * Sementes DEMONSTRATIVAS do painel — pedidos, clientes, VIP, equipe, banners
 * e configurações. Tudo `demo: true` (dado fictício, rótulo visível no painel).
 * Nomes e números são inventados para demonstração — nunca de cliente real.
 */
import type { Pedido, Cliente, MembroVip, Usuario, Banner, Configuracoes } from "./tipos";
import { negocio, CONFIGURE_ME } from "./negocio";

const dia = (n: number, h = 10) => {
  const d = new Date("2026-09-14T12:00:00.000Z");
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(h, 0, 0, 0);
  return d.toISOString();
};

export const configSemente: Configuracoes = {
  nomeLoja: negocio.nome,
  slogan: negocio.slogan,
  whatsappLink: negocio.whatsappLink,
  whatsappNumero: negocio.whatsappNumero,
  instagram: negocio.instagram,
  endereco: negocio.endereco,
  enderecoComplemento: negocio.enderecoComplemento,
  horario: negocio.horario,
  entregaTexto: "Entrega no Litoral Norte — Caraguatatuba, São Sebastião, Ubatuba e Ilhabela.",
  cidadesEntrega: [...negocio.cidadesEntrega],
  descontoPixPercentual: 0,
  parcelasMax: 12,
  parcelasSemJurosAcimaDe: 0,
  pixChave: CONFIGURE_ME,
  pixNome: CONFIGURE_ME,
  pixCidade: "Caraguatatuba",
  infiniteTag: CONFIGURE_ME,
  anuncios: [...negocio.anuncios],
  mostrarPrecoSeminovo: true,
};

export const bannersSemente: Banner[] = [
  { id: "b-prevenda", rotulo: "Pré-venda aberta", titulo: "iPhone 18 Pro chegou na pré-venda.", subtitulo: "R$ 10.999 no 256 GB. Reserva com sinal de 50% e entrega prevista para 23 de setembro.", cta: "Reservar o meu", link: "/produto/iphone-18-pro-256gb-cereja", ativo: true, ordem: 1 },
  { id: "b-vip", rotulo: "Grupo VIP", titulo: "Chegadas e ofertas antes de todo mundo.", subtitulo: "Entre no Grupo VIP do WhatsApp e receba primeiro.", cta: "Entrar no VIP", link: "/grupo-vip", ativo: true, ordem: 2 },
  { id: "b-seminovos", rotulo: "Seminovos", titulo: "Seminovos revisados, com garantia e NF.", subtitulo: "Bateria conferida e nota fiscal em todo aparelho.", cta: "Ver seminovos", link: "/seminovos", ativo: true, ordem: 3 },
];

export const usuariosSemente: Usuario[] = [
  { id: "u-dono", nome: "Dono da loja (demo)", email: "dono@imagicphone.demo", papel: "dono", ativo: true, criadoEm: dia(40) },
  { id: "u-vendedor", nome: "Vendedor (demo)", email: "vendedor@imagicphone.demo", papel: "vendedor", ativo: true, criadoEm: dia(30) },
  { id: "u-suporte", nome: "GD Studio X (suporte)", email: "suporte@gdstudiox.demo", papel: "suporte", ativo: true, criadoEm: dia(40) },
];

/** Login de demonstração — descartável, mostrado na própria tela de login. */
export const SENHA_DEMO = "imagic2026";

export const clientesSemente: Cliente[] = [
  { id: "c-1", nome: "Ana Ribeiro (exemplo)", whatsapp: "5512900000001", cidade: "Caraguatatuba", vip: true, criadoEm: dia(20), pedidos: 2, totalGasto: 1349800, demo: true },
  { id: "c-2", nome: "Bruno Costa (exemplo)", whatsapp: "5512900000002", cidade: "São Sebastião", vip: false, criadoEm: dia(12), pedidos: 1, totalGasto: 649900, demo: true },
  { id: "c-3", nome: "Carla Mendes (exemplo)", whatsapp: "5512900000003", cidade: "Ubatuba", vip: true, criadoEm: dia(9), pedidos: 1, totalGasto: 1099900, demo: true },
  { id: "c-4", nome: "Diego Santos (exemplo)", whatsapp: "5512900000004", cidade: "Ilhabela", vip: false, criadoEm: dia(5), pedidos: 1, totalGasto: 249900, demo: true },
  { id: "c-5", nome: "Elisa Moraes (exemplo)", whatsapp: "5512900000005", cidade: "Caraguatatuba", vip: true, criadoEm: dia(2), pedidos: 1, totalGasto: 429900, demo: true },
];

export const vipSemente: MembroVip[] = [
  { id: "v-1", nome: "Ana Ribeiro (exemplo)", whatsapp: "5512900000001", interesse: "iPhone 18 Pro", origem: "instagram", criadoEm: dia(20), demo: true },
  { id: "v-2", nome: "Carla Mendes (exemplo)", whatsapp: "5512900000003", interesse: "iPhone 18 Pro Max", origem: "site", criadoEm: dia(9), demo: true },
  { id: "v-3", nome: "Elisa Moraes (exemplo)", whatsapp: "5512900000005", interesse: "Seminovos", origem: "loja", criadoEm: dia(2), demo: true },
  { id: "v-4", nome: "Felipe Nunes (exemplo)", whatsapp: "5512900000006", interesse: "iPhone 17", origem: "site", criadoEm: dia(1), demo: true },
];

export const pedidosSemente: Pedido[] = [
  {
    id: "ped-1001", numero: 1001, criadoEm: dia(20, 14), status: "entregue",
    cliente: { nome: "Ana Ribeiro (exemplo)", whatsapp: "5512900000001" },
    entrega: { modo: "entrega", endereco: "Rua exemplo, 100 — Centro", cidade: "Caraguatatuba" },
    pagamento: "pix",
    itens: [{ produtoId: "p-17-preto", nome: "iPhone 17", variacao: "256 GB · Preto", quantidade: 1, precoUnitario: 649900 }],
    subtotal: 649900, desconto: 0, total: 649900, demo: true,
    historico: [
      { status: "novo", em: dia(20, 14), por: "site" },
      { status: "confirmado", em: dia(20, 15), por: "Dono da loja (demo)" },
      { status: "pago", em: dia(20, 16), por: "Dono da loja (demo)", nota: "Pix confirmado" },
      { status: "enviado", em: dia(19, 10), por: "Vendedor (demo)" },
      { status: "entregue", em: dia(19, 17), por: "Vendedor (demo)" },
    ],
  },
  {
    id: "ped-1002", numero: 1002, criadoEm: dia(12, 11), status: "entregue",
    cliente: { nome: "Bruno Costa (exemplo)", whatsapp: "5512900000002" },
    entrega: { modo: "retirada" },
    pagamento: "cartao",
    itens: [{ produtoId: "p-17-lavanda", nome: "iPhone 17", variacao: "256 GB · Lavanda", quantidade: 1, precoUnitario: 649900 }],
    subtotal: 649900, desconto: 0, total: 649900, demo: true,
    historico: [
      { status: "novo", em: dia(12, 11), por: "site" },
      { status: "confirmado", em: dia(12, 12), por: "Dono da loja (demo)" },
      { status: "pago", em: dia(12, 12), por: "Dono da loja (demo)" },
      { status: "entregue", em: dia(11, 15), por: "Vendedor (demo)", nota: "Retirado na loja" },
    ],
  },
  {
    id: "ped-1003", numero: 1003, criadoEm: dia(9, 9), status: "pago",
    cliente: { nome: "Carla Mendes (exemplo)", whatsapp: "5512900000003" },
    entrega: { modo: "entrega", endereco: "Av. exemplo, 55", cidade: "Ubatuba" },
    pagamento: "pix",
    itens: [{ produtoId: "p-18pro-cereja", nome: "iPhone 18 Pro", variacao: "256 GB · Cereja", quantidade: 1, precoUnitario: 1099900 }],
    subtotal: 1099900, desconto: 0, total: 1099900, observacao: "Pré-venda — sinal de 50% pago", demo: true,
    historico: [
      { status: "novo", em: dia(9, 9), por: "site" },
      { status: "confirmado", em: dia(9, 10), por: "Dono da loja (demo)" },
      { status: "pago", em: dia(9, 11), por: "Dono da loja (demo)", nota: "Sinal de 50% recebido" },
    ],
  },
  {
    id: "ped-1004", numero: 1004, criadoEm: dia(5, 16), status: "enviado",
    cliente: { nome: "Diego Santos (exemplo)", whatsapp: "5512900000004" },
    entrega: { modo: "entrega", endereco: "Rua exemplo, 8", cidade: "Ilhabela" },
    pagamento: "whatsapp",
    itens: [{ produtoId: "s-13-meianoite", nome: "iPhone 13", variacao: "128 GB · Meia-noite", quantidade: 1, precoUnitario: 249900 }],
    subtotal: 249900, desconto: 0, total: 249900, demo: true,
    historico: [
      { status: "novo", em: dia(5, 16), por: "site" },
      { status: "confirmado", em: dia(5, 17), por: "Vendedor (demo)" },
      { status: "pago", em: dia(4, 9), por: "Vendedor (demo)" },
      { status: "enviado", em: dia(3, 10), por: "Vendedor (demo)", nota: "Saiu para Ilhabela" },
    ],
  },
  {
    id: "ped-1005", numero: 1005, criadoEm: dia(2, 18), status: "confirmado",
    cliente: { nome: "Elisa Moraes (exemplo)", whatsapp: "5512900000005" },
    entrega: { modo: "retirada" },
    pagamento: "cartao",
    itens: [
      { produtoId: "s-15pro-natural", nome: "iPhone 15 Pro", variacao: "256 GB · Titânio Natural", quantidade: 1, precoUnitario: 429900 },
      { produtoId: "c-capa-magsafe", nome: "Capa MagSafe transparente", variacao: "Transparente", quantidade: 1, precoUnitario: 24900 },
    ],
    subtotal: 454800, desconto: 0, total: 454800, demo: true,
    historico: [
      { status: "novo", em: dia(2, 18), por: "site" },
      { status: "confirmado", em: dia(2, 19), por: "Dono da loja (demo)" },
    ],
  },
  {
    id: "ped-1006", numero: 1006, criadoEm: dia(0, 9), status: "novo",
    cliente: { nome: "Gabriel Lima (exemplo)", whatsapp: "5512900000007" },
    entrega: { modo: "entrega", endereco: "Rua exemplo, 300", cidade: "São Sebastião" },
    pagamento: "pix",
    itens: [{ produtoId: "p-16promax-deserto", nome: "iPhone 16 Pro Max", variacao: "256 GB · Titânio Deserto", quantidade: 1, precoUnitario: 829900 }],
    subtotal: 829900, desconto: 0, total: 829900, demo: true,
    historico: [{ status: "novo", em: dia(0, 9), por: "site" }],
  },
];
