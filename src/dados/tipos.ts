/** Tipos do domínio — loja + painel compartilham os mesmos. Preços SEMPRE em centavos. */

export type Categoria = "iphones" | "seminovos" | "acessorios" | "apple";
export type Condicao = "novo" | "seminovo";
export type Origem = "BR" | "EUA";
/** cor visual usada pela arte SVG/3D quando não há foto real */
export type CorVisual =
  | "preto" | "branco" | "prata" | "titanio" | "azul" | "cereja" | "dourado"
  | "roxo" | "verde" | "laranja" | "rosa" | "amarelo" | "grafite";
export type Familia = "pro" | "base" | "acessorio";

export interface PreVenda {
  sinalPercentual: number;
  entregaPrevista: string;
}

export interface Produto {
  id: string;
  slug: string;
  nome: string;         // "iPhone 18 Pro"
  modelo: string;       // "18 Pro"
  categoria: Categoria;
  condicao: Condicao;
  familia: Familia;
  origem: Origem;
  armazenamento: number | null;   // GB
  cor: string;                    // "Cereja Escuro"
  corVisual: CorVisual;
  preco: number;                  // centavos
  precoDe: number | null;         // "de" riscado
  parcelas: number;               // nº máximo exibido
  /** "arte" = usa a arte gerada (ArteProduto); ou caminho de foto real em /fotos/... */
  imagens: string[];
  descricao: string;
  destaques: string[];
  estoque: number;
  emDestaque: boolean;
  preVenda: PreVenda | null;
  bateria: number | null;         // % saúde (seminovo)
  /** true = exemplo para layout; o painel mostra selo e o site mostra "(exemplo)" */
  demo: boolean;
  /** de onde veio o dado (post do IG, cliente…) — lacuna honesta quando demo */
  fonte: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export type StatusPedido = "novo" | "confirmado" | "pago" | "enviado" | "entregue" | "cancelado";
export type FormaPagamento = "pix" | "cartao" | "whatsapp";
export type ModoEntrega = "retirada" | "entrega";

export interface ItemPedido {
  produtoId: string;
  nome: string;
  variacao: string;       // "256 GB · Cereja Escuro"
  quantidade: number;
  precoUnitario: number;  // centavos, recalculado pela store (nunca do carrinho)
}

export interface EventoPedido {
  status: StatusPedido;
  em: string;
  por: string;
  nota?: string;
}

export interface Pedido {
  id: string;
  numero: number;
  criadoEm: string;
  status: StatusPedido;
  cliente: { nome: string; whatsapp: string; email?: string };
  entrega: { modo: ModoEntrega; endereco?: string; cidade?: string };
  pagamento: FormaPagamento;
  itens: ItemPedido[];
  subtotal: number;
  desconto: number;
  total: number;
  observacao?: string;
  historico: EventoPedido[];
  demo: boolean;
}

export interface Cliente {
  id: string;
  nome: string;
  whatsapp: string;
  email?: string;
  cidade?: string;
  vip: boolean;
  criadoEm: string;
  pedidos: number;
  totalGasto: number;
  demo: boolean;
}

export interface MembroVip {
  id: string;
  nome: string;
  whatsapp: string;
  interesse: string;    // "iPhone 18 Pro"
  origem: "site" | "instagram" | "loja";
  criadoEm: string;
  demo: boolean;
}

export interface Banner {
  id: string;
  rotulo: string;
  titulo: string;
  subtitulo: string;
  cta: string;
  link: string;
  ativo: boolean;
  ordem: number;
}

export interface Configuracoes {
  nomeLoja: string;
  slogan: string;
  whatsappLink: string;
  whatsappNumero: string;
  instagram: string;
  endereco: string;
  enderecoComplemento: string;
  horario: string;
  entregaTexto: string;
  cidadesEntrega: string[];
  descontoPixPercentual: number;
  parcelasMax: number;
  parcelasSemJurosAcimaDe: number; // centavos
  pixChave: string;
  pixNome: string;
  pixCidade: string;
  infiniteTag: string;
  anuncios: string[];
  mostrarPrecoSeminovo: boolean;
}

export type Papel = "dono" | "vendedor" | "suporte";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  ativo: boolean;
  criadoEm: string;
}

export interface Sessao {
  usuarioId: string;
  entrouEm: string;
}

export interface ItemCarrinho {
  produtoId: string;
  quantidade: number;
}
