/**
 * Catálogo — uma página para todas as listagens (chave: todos | iphones |
 * seminovos | apple | acessorios | ofertas | pre-venda). Filtros na URL
 * (useSearchParams), painel lateral no desktop e gaveta no mobile,
 * chips removíveis, ordenação, busca por texto e estado vazio com WhatsApp.
 */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { CATEGORIAS } from "@/dados/catalogo";
import type { Produto } from "@/dados/tipos";
import { useLoja, selProdutosAtivos, temOferta } from "@/estado/loja";
import { moeda } from "@/lib/formatar";
import { wa } from "@/lib/links";
import { usarReveal } from "@/lib/movimento";
import CartaoProduto from "@/componentes/ui/CartaoProduto";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";

interface Props {
  chave: string;
}

const CABECALHOS: Record<string, { rotulo: string; titulo: string; descricao: string }> = {
  todos: { rotulo: "Catálogo", titulo: "Todos os produtos", descricao: "iPhones novos e seminovos, produtos Apple e acessórios — com garantia e nota fiscal." },
  iphones: { rotulo: "iPhones novos", titulo: "iPhones lacrados, com NF e 1 ano de garantia", descricao: "Modelos nacionais e versões americanas 🇺🇸 (eSIM). Retire na loja em Caraguá ou receba no Litoral Norte." },
  seminovos: { rotulo: "Seminovos", titulo: "Seminovos revisados pela loja", descricao: "Bateria conferida, garantia e nota fiscal. Peça fotos reais do aparelho pelo WhatsApp." },
  apple: { rotulo: "Apple", titulo: "AirPods, Apple Watch e iPad", descricao: "Produtos Apple novos, lacrados, com nota fiscal." },
  acessorios: { rotulo: "Acessórios", titulo: "Capas, carregadores, películas e cabos", descricao: "Tudo para proteger e carregar o seu iPhone. Película aplicada na hora, na loja." },
  ofertas: { rotulo: "Ofertas", titulo: "Preço de agora, não de sempre", descricao: "Produtos com preço reduzido em relação ao anterior. Enquanto durar o estoque." },
  "pre-venda": { rotulo: "Pré-venda", titulo: "Reserve antes de chegar", descricao: "Reserva com sinal e entrega na data prevista. O lançamento mais esperado sai daqui." },
};

const ORDENS = [
  { id: "relevancia", rotulo: "Relevância" },
  { id: "menor", rotulo: "Menor preço" },
  { id: "maior", rotulo: "Maior preço" },
  { id: "novidades", rotulo: "Novidades" },
];

function filtroBase(chave: string, p: Produto): boolean {
  switch (chave) {
    case "iphones":
    case "seminovos":
    case "apple":
    case "acessorios":
      return p.categoria === chave;
    case "ofertas":
      return temOferta(p);
    case "pre-venda":
      return p.preVenda !== null;
    default:
      return true;
  }
}

export default function Catalogo({ chave }: Props) {
  const cab = CABECALHOS[chave] ?? CABECALHOS.todos;
  const config = useLoja((s) => s.config);
  const ativos = useLoja(useShallow(selProdutosAtivos));
  const [params, setParams] = useSearchParams();
  const [gaveta, setGaveta] = useState(false);
  const refGrade = usarReveal<HTMLDivElement>({ stagger: 0.06, y: 30 });

  const q = params.get("q") ?? "";
  const modelo = params.get("modelo") ?? "";
  const gb = params.get("gb") ?? "";
  const cor = params.get("cor") ?? "";
  const condicao = params.get("condicao") ?? "";
  const origem = params.get("origem") ?? "";
  const precoMax = Number(params.get("precoMax") ?? 0);
  const ordem = params.get("ordem") ?? "relevancia";

  useEffect(() => {
    document.title = `${cab.titulo} · iMagicPhone`;
  }, [cab.titulo]);

  const base = useMemo(() => ativos.filter((p) => filtroBase(chave, p)), [ativos, chave]);

  const opcoes = useMemo(() => {
    const u = (arr: (string | number | null)[]) => [...new Set(arr.filter((x): x is string | number => x !== null && x !== ""))];
    return {
      modelos: u(base.map((p) => p.nome)).sort() as string[],
      gbs: (u(base.map((p) => p.armazenamento)) as number[]).sort((a, b) => a - b),
      cores: u(base.map((p) => p.cor)).sort() as string[],
      maximo: Math.max(0, ...base.map((p) => p.preco)),
    };
  }, [base]);

  const filtrados = useMemo(() => {
    const termo = q.trim().toLowerCase();
    let lista = base.filter((p) => {
      if (termo) {
        const alvo = `${p.nome} ${p.modelo} ${p.cor} ${p.armazenamento ?? ""}gb ${p.categoria}`.toLowerCase();
        if (!termo.split(/\s+/).every((t) => alvo.includes(t))) return false;
      }
      if (modelo && p.nome !== modelo) return false;
      if (gb && String(p.armazenamento) !== gb) return false;
      if (cor && p.cor !== cor) return false;
      if (condicao && p.condicao !== condicao) return false;
      if (origem && p.origem !== origem) return false;
      if (precoMax > 0 && p.preco > precoMax) return false;
      return true;
    });
    if (ordem === "menor") lista = [...lista].sort((a, b) => a.preco - b.preco);
    else if (ordem === "maior") lista = [...lista].sort((a, b) => b.preco - a.preco);
    else if (ordem === "novidades") lista = [...lista].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
    else lista = [...lista].sort((a, b) => Number(b.emDestaque) - Number(a.emDestaque) || Number(!b.demo) - Number(!a.demo));
    return lista;
  }, [base, q, modelo, gb, cor, condicao, origem, precoMax, ordem]);

  function definir(nome: string, valor: string) {
    const novo = new URLSearchParams(params);
    if (valor) novo.set(nome, valor);
    else novo.delete(nome);
    setParams(novo, { replace: true });
  }
  function limpar() {
    setParams(new URLSearchParams(), { replace: true });
  }

  const chips = [
    q && { nome: "q", rotulo: `“${q}”` },
    modelo && { nome: "modelo", rotulo: modelo },
    gb && { nome: "gb", rotulo: `${gb} GB` },
    cor && { nome: "cor", rotulo: cor },
    condicao && { nome: "condicao", rotulo: condicao === "novo" ? "Novo" : "Seminovo" },
    origem && { nome: "origem", rotulo: origem === "EUA" ? "Versão 🇺🇸" : "Nacional" },
    precoMax > 0 && { nome: "precoMax", rotulo: `até ${moeda(precoMax)}` },
  ].filter((c): c is { nome: string; rotulo: string } => Boolean(c));

  const Filtros = (
    <div className="grid gap-5">
      <div>
        <label htmlFor="f-q" className="text-xs font-bold uppercase tracking-[0.18em] text-cinza">Buscar</label>
        <div className="relative mt-2">
          <input id="f-q" value={q} onChange={(e) => definir("q", e.target.value)} placeholder="iPhone 17, azul, 256…" className="campo pl-10" />
          <Icone nome="busca" tamanho={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cinza" />
        </div>
      </div>
      {opcoes.modelos.length > 1 && (
        <div>
          <label htmlFor="f-modelo" className="text-xs font-bold uppercase tracking-[0.18em] text-cinza">Modelo</label>
          <select id="f-modelo" value={modelo} onChange={(e) => definir("modelo", e.target.value)} className="campo mt-2">
            <option value="">Todos</option>
            {opcoes.modelos.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      )}
      {opcoes.gbs.length > 1 && (
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-[0.18em] text-cinza">Armazenamento</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {opcoes.gbs.map((g) => (
              <button key={g} type="button" onClick={() => definir("gb", gb === String(g) ? "" : String(g))} aria-pressed={gb === String(g)} className={`min-h-10 rounded-full border px-3.5 text-sm font-semibold transition-colors ${gb === String(g) ? "border-ouro bg-ouro text-preto" : "border-linha-forte text-cinza hover:border-ouro hover:text-tinta"}`}>
                {g} GB
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {opcoes.cores.length > 1 && (
        <div>
          <label htmlFor="f-cor" className="text-xs font-bold uppercase tracking-[0.18em] text-cinza">Cor</label>
          <select id="f-cor" value={cor} onChange={(e) => definir("cor", e.target.value)} className="campo mt-2">
            <option value="">Todas</option>
            {opcoes.cores.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}
      {chave !== "seminovos" && chave !== "acessorios" && chave !== "apple" && (
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-[0.18em] text-cinza">Condição</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {[["", "Todas"], ["novo", "Novo"], ["seminovo", "Seminovo"]].map(([v, r]) => (
              <button key={v} type="button" onClick={() => definir("condicao", v)} aria-pressed={condicao === v} className={`min-h-10 rounded-full border px-3.5 text-sm font-semibold transition-colors ${condicao === v ? "border-ouro bg-ouro text-preto" : "border-linha-forte text-cinza hover:border-ouro hover:text-tinta"}`}>
                {r}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-[0.18em] text-cinza">Origem</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[["", "Todas"], ["BR", "Nacional"], ["EUA", "Versão 🇺🇸"]].map(([v, r]) => (
            <button key={v} type="button" onClick={() => definir("origem", v)} aria-pressed={origem === v} className={`min-h-10 rounded-full border px-3.5 text-sm font-semibold transition-colors ${origem === v ? "border-ouro bg-ouro text-preto" : "border-linha-forte text-cinza hover:border-ouro hover:text-tinta"}`}>
              {r}
            </button>
          ))}
        </div>
      </fieldset>
      {opcoes.maximo > 0 && (
        <div>
          <label htmlFor="f-preco" className="flex justify-between text-xs font-bold uppercase tracking-[0.18em] text-cinza">
            <span>Preço até</span>
            <span className="text-marfim">{moeda(precoMax > 0 ? precoMax : opcoes.maximo)}</span>
          </label>
          <input id="f-preco" type="range" min={0} max={opcoes.maximo} step={10000} value={precoMax > 0 ? precoMax : opcoes.maximo} onChange={(e) => definir("precoMax", Number(e.target.value) >= opcoes.maximo ? "" : e.target.value)} className="mt-3 w-full accent-[#d4b24c]" />
        </div>
      )}
      {chips.length > 0 && (
        <button type="button" onClick={limpar} className="text-left text-sm font-semibold text-ouro hover:underline">Limpar filtros</button>
      )}
    </div>
  );

  return (
    <div className="container-pagina py-12 sm:py-16">
      <nav aria-label="Você está em" className="text-xs text-cinza">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><a href="/" className="hover:text-ouro">Início</a></li>
          <li aria-hidden="true">/</li>
          <li className="text-marfim">{cab.rotulo}</li>
        </ol>
      </nav>
      <header className="mt-4 max-w-2xl">
        <p className="rotulo"><span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />{cab.rotulo}</p>
        <h1 className="texto-display mt-3 text-3xl sm:text-5xl">{cab.titulo}</h1>
        <p className="mt-4 text-cinza sm:text-lg">{cab.descricao}</p>
      </header>

      {chave === "todos" && (
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Categorias">
          {CATEGORIAS.map((c) => (
            <li key={c.id}><a href={c.rota} className="inline-flex min-h-10 items-center rounded-full border border-linha-forte px-4 text-sm font-semibold text-cinza transition-colors hover:border-ouro hover:text-tinta">{c.rotulo}</a></li>
          ))}
        </ul>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="cartao sticky top-28 p-5">{Filtros}</div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-cinza" aria-live="polite">
              <strong className="text-marfim">{filtrados.length}</strong> {filtrados.length === 1 ? "produto" : "produtos"}
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setGaveta(true)} className="botao-contorno !min-h-11 text-sm lg:hidden">
                <Icone nome="filtro" tamanho={16} />
                Filtrar{chips.length ? ` (${chips.length})` : ""}
              </button>
              <label className="flex items-center gap-2 text-sm text-cinza">
                <span className="sr-only sm:not-sr-only">Ordenar</span>
                <select value={ordem} onChange={(e) => definir("ordem", e.target.value === "relevancia" ? "" : e.target.value)} className="campo !min-h-11 !w-auto text-sm" aria-label="Ordenar por">
                  {ORDENS.map((o) => <option key={o.id} value={o.id}>{o.rotulo}</option>)}
                </select>
              </label>
            </div>
          </div>

          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Filtros ativos">
              {chips.map((c) => (
                <li key={c.nome}>
                  <button type="button" onClick={() => definir(c.nome, "")} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-ouro/40 bg-ouro/10 px-3 text-xs font-bold text-ouro hover:bg-ouro/20">
                    {c.rotulo} <Icone nome="fechar" tamanho={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {filtrados.length === 0 ? (
            <div className="cartao mt-6 flex flex-col items-center gap-4 p-10 text-center">
              <span className="grid size-14 place-items-center rounded-full border border-ouro/30 bg-ouro/10 text-ouro"><Icone nome="busca" tamanho={24} /></span>
              <p className="font-display text-xl font-bold">Nada com esses filtros.</p>
              <p className="max-w-md text-sm text-cinza">O estoque muda todo dia. Manda mensagem que a loja te mostra o que tem disponível agora.</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Botao variante="wa" href={wa.padrao(config.whatsappNumero, config.whatsappLink)} icone="whatsapp">Perguntar no WhatsApp</Botao>
                {chips.length > 0 && <Botao variante="contorno" onClick={limpar}>Limpar filtros</Botao>}
              </div>
            </div>
          ) : (
            <div key={`${chave}-${filtrados.map((p) => p.id).join(",").length}`} ref={refGrade} data-reveal className="mt-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {filtrados.map((p) => <CartaoProduto key={p.id} produto={p} />)}
            </div>
          )}

          <div className="cartao mt-12 flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h2 className="font-display text-xl font-bold">Não achou o modelo que procura?</h2>
              <p className="mt-1 text-sm text-cinza">A loja recebe aparelhos toda semana. Chame no WhatsApp ou entre no Grupo VIP para saber primeiro.</p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-center gap-2">
              <Botao variante="wa" href={wa.padrao(config.whatsappNumero, config.whatsappLink)} icone="whatsapp">WhatsApp</Botao>
              <Botao variante="contorno" para="/grupo-vip">Grupo VIP</Botao>
            </div>
          </div>
        </div>
      </div>

      {/* gaveta de filtros (mobile) */}
      <div className={`fixed inset-0 z-[65] lg:hidden ${gaveta ? "" : "pointer-events-none"}`} aria-hidden={!gaveta}>
        <button type="button" aria-label="Fechar filtros" onClick={() => setGaveta(false)} tabIndex={-1} className={`absolute inset-0 bg-preto/70 transition-opacity ${gaveta ? "opacity-100" : "opacity-0"}`} />
        <div role="dialog" aria-modal="true" aria-label="Filtros" className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-carvao transition-transform duration-300 ${gaveta ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between border-b border-linha px-5 py-4">
            <p className="font-display font-bold">Filtros</p>
            <button type="button" onClick={() => setGaveta(false)} aria-label="Fechar filtros" className="grid size-11 place-items-center rounded-full border border-linha-forte"><Icone nome="fechar" tamanho={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{Filtros}</div>
          <div className="border-t border-linha p-4">
            <Botao variante="ouro" cheio onClick={() => setGaveta(false)}>Ver {filtrados.length} {filtrados.length === 1 ? "produto" : "produtos"}</Botao>
          </div>
        </div>
      </div>
    </div>
  );
}
