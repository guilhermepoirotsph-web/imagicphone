/**
 * ============================================================
 * ESTADO DA LOJA — um banco só, compartilhado por site e painel
 * ============================================================
 * Nesta prévia o "banco" é o localStorage (zustand/persist). A API é
 * desenhada para virar Supabase depois (mesmos nomes de entidade e RPC
 * `criarPedido`, que RECALCULA preços — o carrinho nunca manda preço).
 * Mudou no painel → o site reflete na hora (mesma store).
 * ============================================================
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Produto, Pedido, Cliente, MembroVip, Banner, Configuracoes, Usuario, Sessao,
  ItemCarrinho, StatusPedido, FormaPagamento, ModoEntrega, Papel,
} from "@/dados/tipos";
import { catalogoSemente } from "@/dados/catalogo";
import {
  configSemente, bannersSemente, usuariosSemente, clientesSemente, vipSemente, pedidosSemente, SENHA_DEMO,
} from "@/dados/sementes";
import { idCurto, agora, slugificar } from "@/lib/formatar";

export const VERSAO_SEMENTE = 3;

export interface EntradaPedido {
  cliente: { nome: string; whatsapp: string; email?: string };
  entrega: { modo: ModoEntrega; endereco?: string; cidade?: string };
  pagamento: FormaPagamento;
  itens: ItemCarrinho[];
  observacao?: string;
}

export interface EstadoLoja {
  versaoSemente: number;
  produtos: Produto[];
  pedidos: Pedido[];
  clientes: Cliente[];
  vip: MembroVip[];
  banners: Banner[];
  config: Configuracoes;
  usuarios: Usuario[];
  sessao: Sessao | null;

  // produtos
  criarProduto: (dados: Omit<Produto, "id" | "slug" | "criadoEm" | "atualizadoEm">) => Produto;
  atualizarProduto: (id: string, patch: Partial<Produto>) => void;
  removerProduto: (id: string) => void;
  duplicarProduto: (id: string) => Produto | null;

  // pedidos
  criarPedido: (entrada: EntradaPedido) => Pedido;
  mudarStatusPedido: (id: string, status: StatusPedido, nota?: string) => void;

  // clientes / vip
  adicionarVip: (dados: { nome: string; whatsapp: string; interesse: string; origem: MembroVip["origem"] }) => MembroVip;
  removerVip: (id: string) => void;
  alternarClienteVip: (id: string) => void;

  // vitrine / configurações
  salvarBanner: (banner: Banner) => void;
  removerBanner: (id: string) => void;
  salvarConfig: (patch: Partial<Configuracoes>) => void;

  // equipe
  salvarUsuario: (usuario: Omit<Usuario, "id" | "criadoEm"> & { id?: string }) => void;
  removerUsuario: (id: string) => void;

  // sessão (demo)
  entrar: (email: string, senha: string) => { ok: boolean; erro?: string };
  sair: () => void;

  // demo
  resetarDemo: () => void;
}

const TRANSICOES: Record<StatusPedido, StatusPedido[]> = {
  novo: ["confirmado", "cancelado"],
  confirmado: ["pago", "cancelado"],
  pago: ["enviado", "entregue", "cancelado"],
  enviado: ["entregue", "cancelado"],
  entregue: [],
  cancelado: [],
};

export function proximosStatus(atual: StatusPedido): StatusPedido[] {
  return TRANSICOES[atual];
}

export const ROTULO_STATUS: Record<StatusPedido, string> = {
  novo: "Novo",
  confirmado: "Confirmado",
  pago: "Pago",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export const ROTULO_PAGAMENTO: Record<FormaPagamento, string> = {
  pix: "Pix",
  cartao: "Cartão",
  whatsapp: "Combinar no WhatsApp",
};

export const ROTULO_PAPEL: Record<Papel, string> = {
  dono: "Dono",
  vendedor: "Vendedor",
  suporte: "Suporte (GD Studio X)",
};

function estadoInicial() {
  return {
    versaoSemente: VERSAO_SEMENTE,
    produtos: catalogoSemente,
    pedidos: pedidosSemente,
    clientes: clientesSemente,
    vip: vipSemente,
    banners: bannersSemente,
    config: configSemente,
    usuarios: usuariosSemente,
    sessao: null as Sessao | null,
  };
}

export const useLoja = create<EstadoLoja>()(
  persist(
    (set, get) => ({
      ...estadoInicial(),

      criarProduto: (dados) => {
        const t = agora();
        const base = slugificar(`${dados.nome} ${dados.armazenamento ? dados.armazenamento + "gb" : ""} ${dados.cor}`);
        const existentes = new Set(get().produtos.map((p) => p.slug));
        let slug = base || idCurto("produto");
        let n = 2;
        while (existentes.has(slug)) slug = `${base}-${n++}`;
        const novo: Produto = { ...dados, id: idCurto("p"), slug, criadoEm: t, atualizadoEm: t };
        set((s) => ({ produtos: [novo, ...s.produtos] }));
        return novo;
      },
      atualizarProduto: (id, patch) =>
        set((s) => ({
          produtos: s.produtos.map((p) => (p.id === id ? { ...p, ...patch, id, atualizadoEm: agora() } : p)),
        })),
      removerProduto: (id) => set((s) => ({ produtos: s.produtos.filter((p) => p.id !== id) })),
      duplicarProduto: (id) => {
        const orig = get().produtos.find((p) => p.id === id);
        if (!orig) return null;
        const { id: _id, slug: _slug, criadoEm: _c, atualizadoEm: _a, ...resto } = orig;
        void _id; void _slug; void _c; void _a;
        return get().criarProduto({ ...resto, nome: orig.nome, cor: `${orig.cor} (cópia)`, demo: true });
      },

      criarPedido: (entrada) => {
        const s = get();
        // RECALCULA no "servidor": preço vem do catálogo vigente, nunca do carrinho
        const itens = entrada.itens
          .map((i) => {
            const p = s.produtos.find((x) => x.id === i.produtoId && x.ativo);
            if (!p) return null;
            const quantidade = Math.max(1, Math.min(i.quantidade, Math.max(p.estoque, 1), 99));
            const variacao = [p.armazenamento ? `${p.armazenamento} GB` : null, p.cor].filter(Boolean).join(" · ");
            return { produtoId: p.id, nome: p.nome, variacao, quantidade, precoUnitario: p.preco };
          })
          .filter((x): x is NonNullable<typeof x> => x !== null);
        if (itens.length === 0) throw new Error("Carrinho vazio ou produtos indisponíveis.");
        const subtotal = itens.reduce((acc, i) => acc + i.precoUnitario * i.quantidade, 0);
        const desconto = entrada.pagamento === "pix" ? Math.round((subtotal * s.config.descontoPixPercentual) / 100) : 0;
        const numero = Math.max(1000, ...s.pedidos.map((p) => p.numero)) + 1;
        const t = agora();
        const pedido: Pedido = {
          id: idCurto("ped"),
          numero,
          criadoEm: t,
          status: "novo",
          cliente: entrada.cliente,
          entrega: entrada.entrega,
          pagamento: entrada.pagamento,
          itens,
          subtotal,
          desconto,
          total: subtotal - desconto,
          observacao: entrada.observacao,
          historico: [{ status: "novo", em: t, por: "site" }],
          demo: false,
        };
        // baixa de estoque + cliente
        const produtos = s.produtos.map((p) => {
          const it = itens.find((i) => i.produtoId === p.id);
          return it ? { ...p, estoque: Math.max(0, p.estoque - it.quantidade), atualizadoEm: t } : p;
        });
        const existente = s.clientes.find((c) => c.whatsapp === entrada.cliente.whatsapp);
        const clientes = existente
          ? s.clientes.map((c) => (c.id === existente.id ? { ...c, pedidos: c.pedidos + 1, totalGasto: c.totalGasto + pedido.total } : c))
          : [
              { id: idCurto("c"), nome: entrada.cliente.nome, whatsapp: entrada.cliente.whatsapp, email: entrada.cliente.email, cidade: entrada.entrega.cidade, vip: false, criadoEm: t, pedidos: 1, totalGasto: pedido.total, demo: false },
              ...s.clientes,
            ];
        set({ pedidos: [pedido, ...s.pedidos], produtos, clientes });
        return pedido;
      },
      mudarStatusPedido: (id, status, nota) =>
        set((s) => {
          const por = s.usuarios.find((u) => u.id === s.sessao?.usuarioId)?.nome ?? "painel";
          return {
            pedidos: s.pedidos.map((p) =>
              p.id === id && TRANSICOES[p.status].includes(status)
                ? { ...p, status, historico: [...p.historico, { status, em: agora(), por, nota }] }
                : p,
            ),
          };
        }),

      adicionarVip: (dados) => {
        const novo: MembroVip = { id: idCurto("v"), ...dados, criadoEm: agora(), demo: false };
        set((s) => ({ vip: [novo, ...s.vip.filter((v) => v.whatsapp !== dados.whatsapp)] }));
        return novo;
      },
      removerVip: (id) => set((s) => ({ vip: s.vip.filter((v) => v.id !== id) })),
      alternarClienteVip: (id) => set((s) => ({ clientes: s.clientes.map((c) => (c.id === id ? { ...c, vip: !c.vip } : c)) })),

      salvarBanner: (banner) =>
        set((s) => ({
          banners: s.banners.some((b) => b.id === banner.id)
            ? s.banners.map((b) => (b.id === banner.id ? banner : b))
            : [...s.banners, { ...banner, id: banner.id || idCurto("b") }],
        })),
      removerBanner: (id) => set((s) => ({ banners: s.banners.filter((b) => b.id !== id) })),
      salvarConfig: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),

      salvarUsuario: (usuario) =>
        set((s) => {
          if (usuario.id && s.usuarios.some((u) => u.id === usuario.id)) {
            return { usuarios: s.usuarios.map((u) => (u.id === usuario.id ? { ...u, ...usuario, id: u.id } : u)) };
          }
          // perfil nasce inerte: sem papel elevado até o dono promover (aqui: entra como informado, mas ativo=false)
          return { usuarios: [...s.usuarios, { ...usuario, id: idCurto("u"), criadoEm: agora(), ativo: usuario.ativo ?? false }] };
        }),
      removerUsuario: (id) => set((s) => ({ usuarios: s.usuarios.filter((u) => u.id !== id) })),

      entrar: (email, senha) => {
        const u = get().usuarios.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
        if (!u) return { ok: false, erro: "E-mail não cadastrado." };
        if (!u.ativo) return { ok: false, erro: "Conta ainda não ativada pelo dono." };
        if (senha !== SENHA_DEMO) return { ok: false, erro: "Senha incorreta." };
        set({ sessao: { usuarioId: u.id, entrouEm: agora() } });
        return { ok: true };
      },
      sair: () => set({ sessao: null }),

      resetarDemo: () => set({ ...estadoInicial() }),
    }),
    {
      name: "imagic-loja-v1",
      version: VERSAO_SEMENTE,
      partialize: (s) => ({
        versaoSemente: s.versaoSemente,
        produtos: s.produtos,
        pedidos: s.pedidos,
        clientes: s.clientes,
        vip: s.vip,
        banners: s.banners,
        config: s.config,
        usuarios: s.usuarios,
        sessao: s.sessao,
      }),
      migrate: (persisted, versao) => {
        // semente nova → recomeça (é prévia; em produção isso vira migração de banco)
        if (versao !== VERSAO_SEMENTE) return { ...estadoInicial() } as unknown as EstadoLoja;
        return persisted as EstadoLoja;
      },
    },
  ),
);

/* ---------- seletores ---------- */
export const selProdutosAtivos = (s: EstadoLoja) => s.produtos.filter((p) => p.ativo);
export const selProdutoPorSlug = (slug: string) => (s: EstadoLoja) => s.produtos.find((p) => p.slug === slug && p.ativo) ?? null;
export const selProdutoPorId = (id: string) => (s: EstadoLoja) => s.produtos.find((p) => p.id === id) ?? null;
export const selUsuarioAtual = (s: EstadoLoja) => s.usuarios.find((u) => u.id === s.sessao?.usuarioId) ?? null;
export const selBannersAtivos = (s: EstadoLoja) => [...s.banners].filter((b) => b.ativo).sort((a, b) => a.ordem - b.ordem);

export function temOferta(p: Produto): boolean {
  return p.precoDe !== null && p.precoDe > p.preco;
}

export function rotuloVariacao(p: Produto): string {
  return [p.armazenamento ? `${p.armazenamento} GB` : null, p.cor].filter(Boolean).join(" · ");
}
