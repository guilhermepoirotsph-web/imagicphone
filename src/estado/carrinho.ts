/**
 * Carrinho — só ids e quantidades. Preço, nome e estoque vêm SEMPRE do
 * catálogo vigente (store da loja): um carrinho velho nunca envia preço
 * desatualizado. Produto removido do catálogo some do carrinho sozinho.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ItemCarrinho, Produto } from "@/dados/tipos";
import { useLoja } from "./loja";

interface EstadoCarrinho {
  itens: ItemCarrinho[];
  aberto: boolean;
  adicionar: (produtoId: string, quantidade?: number) => void;
  remover: (produtoId: string) => void;
  definirQuantidade: (produtoId: string, quantidade: number) => void;
  limpar: () => void;
  abrir: () => void;
  fechar: () => void;
}

export const useCarrinho = create<EstadoCarrinho>()(
  persist(
    (set) => ({
      itens: [],
      aberto: false,
      adicionar: (produtoId, quantidade = 1) =>
        set((s) => {
          const existente = s.itens.find((i) => i.produtoId === produtoId);
          const itens = existente
            ? s.itens.map((i) => (i.produtoId === produtoId ? { ...i, quantidade: Math.min(99, i.quantidade + quantidade) } : i))
            : [...s.itens, { produtoId, quantidade: Math.max(1, quantidade) }];
          return { itens, aberto: true };
        }),
      remover: (produtoId) => set((s) => ({ itens: s.itens.filter((i) => i.produtoId !== produtoId) })),
      definirQuantidade: (produtoId, quantidade) =>
        set((s) => ({
          itens:
            quantidade <= 0
              ? s.itens.filter((i) => i.produtoId !== produtoId)
              : s.itens.map((i) => (i.produtoId === produtoId ? { ...i, quantidade: Math.min(99, quantidade) } : i)),
        })),
      limpar: () => set({ itens: [] }),
      abrir: () => set({ aberto: true }),
      fechar: () => set({ aberto: false }),
    }),
    { name: "imagic-carrinho-v1", version: 1, partialize: (s) => ({ itens: s.itens }) },
  ),
);

export interface LinhaCarrinho {
  produto: Produto;
  quantidade: number;
  subtotal: number;
}

/** Junta carrinho + catálogo vigente; descarta o que não existe/inativo; limita ao estoque. */
export function usarLinhasCarrinho(): { linhas: LinhaCarrinho[]; subtotal: number; quantidade: number } {
  const itens = useCarrinho((s) => s.itens);
  const produtos = useLoja((s) => s.produtos);
  const linhas: LinhaCarrinho[] = [];
  for (const item of itens) {
    const produto = produtos.find((p) => p.id === item.produtoId && p.ativo);
    if (!produto) continue;
    const quantidade = Math.max(1, Math.min(item.quantidade, Math.max(produto.estoque, 1)));
    linhas.push({ produto, quantidade, subtotal: produto.preco * quantidade });
  }
  return {
    linhas,
    subtotal: linhas.reduce((a, l) => a + l.subtotal, 0),
    quantidade: linhas.reduce((a, l) => a + l.quantidade, 0),
  };
}
