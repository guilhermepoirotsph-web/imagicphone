/**
 * ============================================================
 * CATÁLOGO SEMENTE — iMagicPhone
 * ============================================================
 * Regra da casa: dado real ou lacuna honesta.
 *  - demo: false → dado publicado pelo próprio cliente (fonte no campo `fonte`)
 *  - demo: true  → EXEMPLO para o layout; o site mostra "(exemplo)" e o painel
 *                  mostra o selo. Trocar pelo catálogo real antes de publicar.
 * Preços em centavos. Imagens "arte:..." usam a arte gerada (ArteProduto).
 * ============================================================
 */
import type { Produto, CorVisual, Familia, Categoria, Condicao, Origem } from "./tipos";

const T0 = "2026-09-14T12:00:00.000Z";

interface Base {
  id: string;
  nome: string;
  modelo: string;
  categoria: Categoria;
  condicao?: Condicao;
  familia: Familia;
  origem?: Origem;
  gb: number | null;
  cor: string;
  corVisual: CorVisual;
  preco: number;
  precoDe?: number | null;
  parcelas?: number;
  imagens?: string[];
  descricao: string;
  destaques: string[];
  estoque?: number;
  emDestaque?: boolean;
  preVenda?: Produto["preVenda"];
  bateria?: number | null;
  demo?: boolean;
  fonte?: string;
}

function produto(b: Base): Produto {
  const slug = `${b.nome} ${b.gb ? b.gb + "gb" : ""} ${b.cor}`
    .normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return {
    id: b.id,
    slug,
    nome: b.nome,
    modelo: b.modelo,
    categoria: b.categoria,
    condicao: b.condicao ?? "novo",
    familia: b.familia,
    origem: b.origem ?? "BR",
    armazenamento: b.gb,
    cor: b.cor,
    corVisual: b.corVisual,
    preco: b.preco,
    precoDe: b.precoDe ?? null,
    parcelas: b.parcelas ?? 12,
    imagens: b.imagens ?? (b.familia === "acessorio" ? ["arte:acessorio"] : ["arte:iphone:costas", "arte:iphone:frente"]),
    descricao: b.descricao,
    destaques: b.destaques,
    estoque: b.estoque ?? 3,
    emDestaque: b.emDestaque ?? false,
    preVenda: b.preVenda ?? null,
    bateria: b.bateria ?? null,
    demo: b.demo ?? true,
    fonte: b.fonte ?? "exemplo para layout — substituir pelo catálogo real",
    ativo: true,
    criadoEm: T0,
    atualizadoEm: T0,
  };
}

const PRE_VENDA_18_PRO = {
  fonte: "instagram.com/imagicphone — post de 10/09/2026 (pré-venda iPhone 18 Pro, R$ 10.999 / 256 GB)",
  demo: false,
  preVenda: { sinalPercentual: 50, entregaPrevista: "23 de setembro" },
  descricao:
    "Pré-venda oficial. Novo, lacrado, com nota fiscal e 1 ano de garantia. Reserva com sinal de 50% do valor; consulte valores com mais armazenamento.",
  destaques: ["Pré-venda — entrega prevista 23/09", "Novo e lacrado", "Nota fiscal + 1 ano de garantia", "Sinal de 50% para reservar"],
  parcelas: 12,
};

export const catalogoSemente: Produto[] = [
  // ---------- PRÉ-VENDA REAL (post de 10/09/2026) ----------
  produto({ id: "p-18pro-preto", nome: "iPhone 18 Pro", modelo: "18 Pro", categoria: "iphones", familia: "pro", gb: 256, cor: "Preto", corVisual: "preto", preco: 1099900, emDestaque: true, estoque: 5, ...PRE_VENDA_18_PRO }),
  produto({ id: "p-18pro-prata", nome: "iPhone 18 Pro", modelo: "18 Pro", categoria: "iphones", familia: "pro", gb: 256, cor: "Prata", corVisual: "prata", preco: 1099900, emDestaque: true, estoque: 4, ...PRE_VENDA_18_PRO }),
  produto({ id: "p-18pro-azul", nome: "iPhone 18 Pro", modelo: "18 Pro", categoria: "iphones", familia: "pro", gb: 256, cor: "Azul", corVisual: "azul", preco: 1099900, emDestaque: true, estoque: 4, ...PRE_VENDA_18_PRO }),
  produto({ id: "p-18pro-cereja", nome: "iPhone 18 Pro", modelo: "18 Pro", categoria: "iphones", familia: "pro", gb: 256, cor: "Cereja", corVisual: "cereja", preco: 1099900, emDestaque: true, estoque: 3, ...PRE_VENDA_18_PRO }),

  // ---------- EXEMPLOS (demo) ----------
  produto({ id: "p-18promax-cereja", nome: "iPhone 18 Pro Max", modelo: "18 Pro Max", categoria: "iphones", familia: "pro", gb: 256, cor: "Cereja", corVisual: "cereja", preco: 1249900, emDestaque: true, estoque: 2, preVenda: { sinalPercentual: 50, entregaPrevista: "a confirmar" }, descricao: "Pré-venda (exemplo). Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Tela 6,9” ProMotion", "Novo e lacrado", "Nota fiscal + 1 ano de garantia"] }),
  produto({ id: "p-18-azul", nome: "iPhone 18", modelo: "18", categoria: "iphones", familia: "base", gb: 256, cor: "Azul", corVisual: "azul", preco: 849900, estoque: 3, descricao: "Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Novo e lacrado", "Nota fiscal + 1 ano de garantia", "Câmera Fusion 48 MP"] }),
  produto({ id: "p-17promax-laranja", nome: "iPhone 17 Pro Max", modelo: "17 Pro Max", categoria: "iphones", familia: "pro", origem: "EUA", gb: 256, cor: "Laranja Cósmico", corVisual: "laranja", preco: 999900, emDestaque: true, estoque: 2, descricao: "Versão americana 🇺🇸 (eSIM). Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Versão 🇺🇸 (eSIM)", "Novo e lacrado", "Nota fiscal + 1 ano de garantia", "Tela 6,9” ProMotion"] }),
  produto({ id: "p-17pro-azul", nome: "iPhone 17 Pro", modelo: "17 Pro", categoria: "iphones", familia: "pro", origem: "EUA", gb: 256, cor: "Azul Profundo", corVisual: "azul", preco: 879900, emDestaque: true, estoque: 3, descricao: "Versão americana 🇺🇸 (eSIM). Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Versão 🇺🇸 (eSIM)", "Novo e lacrado", "Nota fiscal + 1 ano de garantia"] }),
  produto({ id: "p-17-lavanda", nome: "iPhone 17", modelo: "17", categoria: "iphones", familia: "base", origem: "EUA", gb: 256, cor: "Lavanda", corVisual: "roxo", preco: 649900, estoque: 4, descricao: "Versão americana 🇺🇸 (eSIM). Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Versão 🇺🇸 (eSIM)", "Novo e lacrado", "Nota fiscal + 1 ano de garantia"] }),
  produto({ id: "p-17-preto", nome: "iPhone 17", modelo: "17", categoria: "iphones", familia: "base", gb: 256, cor: "Preto", corVisual: "preto", preco: 649900, estoque: 5, emDestaque: true, descricao: "Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Novo e lacrado", "Nota fiscal + 1 ano de garantia", "Tela 6,3” 120 Hz"] }),
  produto({ id: "p-16promax-deserto", nome: "iPhone 16 Pro Max", modelo: "16 Pro Max", categoria: "iphones", familia: "pro", gb: 256, cor: "Titânio Deserto", corVisual: "dourado", preco: 829900, precoDe: 899900, estoque: 2, emDestaque: true, descricao: "Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Oferta", "Novo e lacrado", "Nota fiscal + 1 ano de garantia", "Chip A18 Pro"] }),
  produto({ id: "p-16pro-preto", nome: "iPhone 16 Pro", modelo: "16 Pro", categoria: "iphones", familia: "pro", gb: 128, cor: "Titânio Preto", corVisual: "titanio", preco: 699900, estoque: 3, descricao: "Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Novo e lacrado", "Nota fiscal + 1 ano de garantia", "Câmera 48 MP"] }),
  produto({ id: "p-16-ultramarino", nome: "iPhone 16", modelo: "16", categoria: "iphones", familia: "base", origem: "EUA", gb: 128, cor: "Ultramarino", corVisual: "azul", preco: 529900, estoque: 4, descricao: "Versão americana 🇺🇸 (eSIM). Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Versão 🇺🇸 (eSIM)", "Novo e lacrado", "Nota fiscal + 1 ano de garantia"] }),
  produto({ id: "p-16-verde", nome: "iPhone 16", modelo: "16", categoria: "iphones", familia: "base", gb: 128, cor: "Verde-acinzentado", corVisual: "verde", preco: 519900, estoque: 3, descricao: "Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Novo e lacrado", "Nota fiscal + 1 ano de garantia", "Botão de Ação"] }),
  produto({ id: "p-15-preto", nome: "iPhone 15", modelo: "15", categoria: "iphones", familia: "base", gb: 128, cor: "Preto", corVisual: "preto", preco: 449900, precoDe: 489900, estoque: 4, descricao: "Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Oferta", "Novo e lacrado", "Nota fiscal + 1 ano de garantia", "USB-C"] }),
  produto({ id: "p-15-rosa", nome: "iPhone 15", modelo: "15", categoria: "iphones", familia: "base", gb: 128, cor: "Rosa", corVisual: "rosa", preco: 449900, estoque: 2, descricao: "Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Novo e lacrado", "Nota fiscal + 1 ano de garantia", "Dynamic Island"] }),

  // seminovos (exemplos)
  produto({ id: "s-15pro-natural", nome: "iPhone 15 Pro", modelo: "15 Pro", categoria: "seminovos", condicao: "seminovo", familia: "pro", gb: 256, cor: "Titânio Natural", corVisual: "titanio", preco: 429900, estoque: 1, bateria: 92, emDestaque: true, descricao: "Seminovo revisado pela loja, com garantia e nota fiscal. Bateria 92%.", destaques: ["Bateria 92%", "Revisado pela loja", "Garantia e NF", "Acompanha cabo"] }),
  produto({ id: "s-14pro-roxo", nome: "iPhone 14 Pro", modelo: "14 Pro", categoria: "seminovos", condicao: "seminovo", familia: "pro", gb: 128, cor: "Roxo-profundo", corVisual: "roxo", preco: 359900, estoque: 1, bateria: 89, descricao: "Seminovo revisado pela loja, com garantia e nota fiscal. Bateria 89%.", destaques: ["Bateria 89%", "Revisado pela loja", "Garantia e NF"] }),
  produto({ id: "s-13-meianoite", nome: "iPhone 13", modelo: "13", categoria: "seminovos", condicao: "seminovo", familia: "base", gb: 128, cor: "Meia-noite", corVisual: "grafite", preco: 249900, precoDe: 279900, estoque: 2, bateria: 86, descricao: "Seminovo revisado pela loja, com garantia e nota fiscal. Bateria 86%.", destaques: ["Bateria 86%", "Revisado pela loja", "Garantia e NF"] }),
  produto({ id: "s-12-branco", nome: "iPhone 12", modelo: "12", categoria: "seminovos", condicao: "seminovo", familia: "base", gb: 64, cor: "Branco", corVisual: "branco", preco: 179900, estoque: 1, bateria: 84, descricao: "Seminovo revisado pela loja, com garantia e nota fiscal. Bateria 84%.", destaques: ["Bateria 84%", "Revisado pela loja", "Garantia e NF"] }),

  // outros Apple (exemplos)
  produto({ id: "a-airpods-pro-3", nome: "AirPods Pro 3", modelo: "AirPods Pro 3", categoria: "apple", familia: "acessorio", gb: null, cor: "Branco", corVisual: "branco", preco: 189900, estoque: 4, imagens: ["arte:airpods"], descricao: "Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Cancelamento de ruído", "Novo e lacrado", "Nota fiscal + garantia"] }),
  produto({ id: "a-watch-s11", nome: "Apple Watch Series 11", modelo: "Series 11 · 45 mm", categoria: "apple", familia: "acessorio", gb: null, cor: "Meia-noite", corVisual: "grafite", preco: 389900, estoque: 2, imagens: ["arte:watch"], descricao: "Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["GPS", "Novo e lacrado", "Nota fiscal + garantia"] }),
  produto({ id: "a-ipad-a16", nome: "iPad (A16)", modelo: "iPad 11ª geração", categoria: "apple", familia: "acessorio", gb: 128, cor: "Azul", corVisual: "azul", preco: 329900, estoque: 2, imagens: ["arte:ipad"], descricao: "Novo, lacrado, com nota fiscal e 1 ano de garantia.", destaques: ["Tela 11”", "Novo e lacrado", "Nota fiscal + garantia"] }),

  // acessórios (exemplos)
  produto({ id: "c-capa-magsafe", nome: "Capa MagSafe transparente", modelo: "Capa", categoria: "acessorios", familia: "acessorio", gb: null, cor: "Transparente", corVisual: "branco", preco: 24900, estoque: 12, parcelas: 3, imagens: ["arte:capa"], descricao: "Capa transparente com MagSafe para iPhone 15, 16, 17 e 18.", destaques: ["Compatível com MagSafe", "Proteção contra amarelamento"] }),
  produto({ id: "c-magsafe", nome: "Carregador MagSafe", modelo: "MagSafe", categoria: "acessorios", familia: "acessorio", gb: null, cor: "Branco", corVisual: "branco", preco: 34900, estoque: 6, parcelas: 3, imagens: ["arte:magsafe"], descricao: "Carregador sem fio magnético, até 25 W.", destaques: ["Até 25 W", "Cabo USB-C 1 m"] }),
  produto({ id: "c-cabo-usbc", nome: "Cabo USB-C 1 m", modelo: "Cabo", categoria: "acessorios", familia: "acessorio", gb: null, cor: "Branco", corVisual: "branco", preco: 14900, estoque: 20, parcelas: 1, imagens: ["arte:cabo"], descricao: "Cabo USB-C para USB-C trançado, 1 m.", destaques: ["Trançado", "Carregamento rápido"] }),
  produto({ id: "c-pelicula", nome: "Película de vidro + aplicação", modelo: "Película", categoria: "acessorios", familia: "acessorio", gb: null, cor: "Transparente", corVisual: "branco", preco: 7900, estoque: 30, parcelas: 1, imagens: ["arte:pelicula"], descricao: "Película de vidro 3D aplicada na loja.", destaques: ["Aplicação na hora", "Vidro temperado"] }),
  produto({ id: "c-fonte-20w", nome: "Fonte USB-C 20 W", modelo: "Fonte", categoria: "acessorios", familia: "acessorio", gb: null, cor: "Branco", corVisual: "branco", preco: 19900, estoque: 10, parcelas: 2, imagens: ["arte:fonte"], descricao: "Fonte USB-C 20 W para carregamento rápido.", destaques: ["20 W", "Carregamento rápido"] }),
];

export const CATEGORIAS: { id: Categoria; rotulo: string; descricao: string; rota: string }[] = [
  { id: "iphones", rotulo: "iPhones novos", descricao: "Lacrados, com nota fiscal e 1 ano de garantia.", rota: "/iphones" },
  { id: "seminovos", rotulo: "Seminovos", descricao: "Revisados pela loja, com garantia e NF.", rota: "/seminovos" },
  { id: "apple", rotulo: "Apple", descricao: "AirPods, Apple Watch e iPad.", rota: "/apple" },
  { id: "acessorios", rotulo: "Acessórios", descricao: "Capas, carregadores, películas e cabos.", rota: "/acessorios" },
];

export const CORES_VISUAIS: Record<CorVisual, { corpo: string; borda: string; brilho: string; rotulo: string }> = {
  preto: { corpo: "#1b1b1e", borda: "#2c2c30", brilho: "#4a4a50", rotulo: "Preto" },
  branco: { corpo: "#efece6", borda: "#d9d5cc", brilho: "#ffffff", rotulo: "Branco" },
  prata: { corpo: "#cfd0d3", borda: "#b3b4b8", brilho: "#f2f2f4", rotulo: "Prata" },
  titanio: { corpo: "#8b8680", borda: "#6f6a64", brilho: "#b9b3ab", rotulo: "Titânio" },
  azul: { corpo: "#8fb2e8", borda: "#6f93c9", brilho: "#c6dbf7", rotulo: "Azul" },
  cereja: { corpo: "#7a1f3d", borda: "#5c1530", brilho: "#a94466", rotulo: "Cereja" },
  dourado: { corpo: "#d9c39a", borda: "#b9a47c", brilho: "#f1e4c7", rotulo: "Dourado" },
  roxo: { corpo: "#b9a7d8", borda: "#9986bb", brilho: "#dccff0", rotulo: "Roxo" },
  verde: { corpo: "#9fb8a8", borda: "#7f9a89", brilho: "#c9dbd0", rotulo: "Verde" },
  laranja: { corpo: "#e8823a", borda: "#c3672a", brilho: "#ffb27a", rotulo: "Laranja" },
  rosa: { corpo: "#f0b8c6", borda: "#d497a8", brilho: "#fbdbe3", rotulo: "Rosa" },
  amarelo: { corpo: "#f3e37a", borda: "#d6c65c", brilho: "#fff6b0", rotulo: "Amarelo" },
  grafite: { corpo: "#4a4a4f", borda: "#36363a", brilho: "#6d6d73", rotulo: "Grafite" },
};
