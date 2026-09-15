/** Produtos — tabela com busca/filtros, estoque inline, destaque/ativo, duplicar, excluir. */
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagina from "@/painel/componentes/Pagina";
import Cartao from "@/painel/componentes/Cartao";
import Tabela from "@/painel/componentes/Tabela";
import { Entrada, Selecao, Alternador } from "@/painel/componentes/Campo";
import Botao from "@/componentes/ui/Botao";
import Selo from "@/componentes/ui/Selo";
import Icone from "@/componentes/ui/Icones";
import ArteProduto from "@/componentes/marca/ArteProduto";
import { useLoja, rotuloVariacao, temOferta } from "@/estado/loja";
import { moeda } from "@/lib/formatar";
import type { Produto } from "@/dados/tipos";
import { CATEGORIAS } from "@/dados/catalogo";

export default function PainelProdutos() {
  const navigate = useNavigate();
  const produtos = useLoja((s) => s.produtos);
  const atualizar = useLoja((s) => s.atualizarProduto);
  const remover = useLoja((s) => s.removerProduto);
  const duplicar = useLoja((s) => s.duplicarProduto);
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("");
  const [status, setStatus] = useState("");

  const lista = useMemo(() => {
    const t = q.trim().toLowerCase();
    return produtos.filter((p) => {
      if (t && !`${p.nome} ${p.modelo} ${p.cor} ${p.armazenamento ?? ""}`.toLowerCase().includes(t)) return false;
      if (categoria && p.categoria !== categoria) return false;
      if (status === "ativos" && !p.ativo) return false;
      if (status === "inativos" && p.ativo) return false;
      if (status === "demo" && !p.demo) return false;
      return true;
    });
  }, [produtos, q, categoria, status]);

  const ativos = produtos.filter((p) => p.ativo).length;
  const demos = produtos.filter((p) => p.demo).length;

  return (
    <Pagina titulo="Produtos" descricao={`${produtos.length} cadastrados · ${ativos} ativos · ${produtos.length - ativos} inativos · ${demos} de exemplo`} acoes={<Botao variante="ouro" para="/painel/produtos/novo" icone="mais" tamanho="sm">Novo produto</Botao>}>
      <Cartao semPadding>
        <div className="grid gap-3 border-b border-linha p-4 sm:grid-cols-[minmax(0,1fr)_180px_160px] sm:p-5">
          <Entrada value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, cor, GB…" aria-label="Buscar produtos" />
          <Selecao value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Categoria">
            <option value="">Todas as categorias</option>
            {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.rotulo}</option>)}
          </Selecao>
          <Selecao value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            <option value="">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
            <option value="demo">De exemplo</option>
          </Selecao>
        </div>
        <Tabela<Produto>
          legenda="Produtos cadastrados"
          linhas={lista}
          chaveLinha={(p) => p.id}
          vazio="Nenhum produto com esses filtros."
          classeLinha={(p) => (p.ativo ? "" : "opacity-60")}
          colunas={[
            {
              chave: "produto", titulo: "Produto", render: (p) => (
                <div className="flex items-center gap-3">
                  <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-linha bg-carvao p-0.5"><ArteProduto produto={p} indice={0} /></div>
                  <div className="min-w-0">
                    <Link to={`/painel/produtos/${p.id}`} className="block truncate font-semibold hover:text-ouro">{p.nome}</Link>
                    <span className="block truncate text-xs text-cinza">{rotuloVariacao(p)}</span>
                    <span className="mt-1 flex flex-wrap gap-1">
                      {p.demo && <Selo tom="demo">exemplo</Selo>}
                      {p.preVenda && <Selo tom="ouro">pré-venda</Selo>}
                      {temOferta(p) && <Selo tom="ok">oferta</Selo>}
                      {p.origem === "EUA" && <Selo tom="neutro">🇺🇸</Selo>}
                    </span>
                  </div>
                </div>
              ),
            },
            { chave: "categoria", titulo: "Categoria", render: (p) => <span className="capitalize text-cinza">{p.categoria}</span> },
            { chave: "preco", titulo: "Preço", alinhar: "direita", render: (p) => <span><span className="font-semibold text-marfim">{moeda(p.preco)}</span>{p.precoDe ? <s className="block text-xs text-cinza">{moeda(p.precoDe)}</s> : null}</span> },
            {
              chave: "estoque", titulo: "Estoque", largura: "6rem", render: (p) => (
                <input type="number" min={0} max={999} value={p.estoque} aria-label={`Estoque de ${p.nome} ${p.cor}`} onChange={(e) => atualizar(p.id, { estoque: Math.max(0, Number(e.target.value) || 0) })} className={`campo !min-h-9 w-20 px-2 text-center text-sm ${p.estoque <= 1 ? "!border-aviso/60 text-aviso" : ""}`} />
              ),
            },
            { chave: "destaque", titulo: "Destaque", largura: "7rem", render: (p) => <Alternador ligado={p.emDestaque} aoMudar={(v) => atualizar(p.id, { emDestaque: v })} rotulo="" /> },
            { chave: "ativo", titulo: "Ativo", largura: "6rem", render: (p) => <Alternador ligado={p.ativo} aoMudar={(v) => atualizar(p.id, { ativo: v })} rotulo="" /> },
            {
              chave: "acoes", titulo: "Ações", tituloOculto: true, alinhar: "direita", render: (p) => (
                <div className="flex justify-end gap-1">
                  <button type="button" onClick={() => navigate(`/painel/produtos/${p.id}`)} aria-label={`Editar ${p.nome}`} className="grid size-9 place-items-center rounded-full text-cinza hover:bg-white/8 hover:text-tinta"><Icone nome="editar" tamanho={16} /></button>
                  <button type="button" onClick={() => { const n = duplicar(p.id); if (n) navigate(`/painel/produtos/${n.id}`); }} aria-label={`Duplicar ${p.nome}`} className="grid size-9 place-items-center rounded-full text-cinza hover:bg-white/8 hover:text-tinta"><Icone nome="duplicar" tamanho={16} /></button>
                  <button type="button" onClick={() => { if (window.confirm(`Excluir ${p.nome} ${p.cor}? Não dá para desfazer.`)) remover(p.id); }} aria-label={`Excluir ${p.nome}`} className="grid size-9 place-items-center rounded-full text-cinza hover:bg-erro/15 hover:text-erro"><Icone nome="lixeira" tamanho={16} /></button>
                </div>
              ),
            },
          ]}
        />
      </Cartao>
    </Pagina>
  );
}
