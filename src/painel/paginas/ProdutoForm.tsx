/** Cadastro/edição de produto com pré-visualização ao vivo do cartão da loja. */
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Pagina from "@/painel/componentes/Pagina";
import Cartao from "@/painel/componentes/Cartao";
import Aviso from "@/painel/componentes/Aviso";
import { Campo, Entrada, Selecao, AreaTexto, Alternador } from "@/painel/componentes/Campo";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";
import CartaoProduto from "@/componentes/ui/CartaoProduto";
import { useLoja } from "@/estado/loja";
import { CATEGORIAS, CORES_VISUAIS } from "@/dados/catalogo";
import type { Produto, CorVisual, Categoria, Condicao, Familia, Origem } from "@/dados/tipos";

const VISTAS = ["arte:iphone:costas", "arte:iphone:frente", "arte:airpods", "arte:watch", "arte:ipad", "arte:capa", "arte:magsafe", "arte:cabo", "arte:pelicula", "arte:fonte"];

function reaisParaCentavos(t: string): number {
  const n = Number(t.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}
function centavosParaReais(c: number): string {
  return (c / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const VAZIO: Omit<Produto, "id" | "slug" | "criadoEm" | "atualizadoEm"> = {
  nome: "iPhone 17", modelo: "17", categoria: "iphones", condicao: "novo", familia: "base", origem: "BR", armazenamento: 256, cor: "Preto", corVisual: "preto",
  preco: 0, precoDe: null, parcelas: 12, imagens: ["arte:iphone:costas", "arte:iphone:frente"], descricao: "Novo, lacrado, com nota fiscal e 1 ano de garantia.",
  destaques: ["Novo e lacrado", "Nota fiscal + 1 ano de garantia"], estoque: 1, emDestaque: false, preVenda: null, bateria: null, demo: false, fonte: "cadastrado pela loja", ativo: true,
};

export default function PainelProdutoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existente = useLoja((s) => (id ? s.produtos.find((p) => p.id === id) ?? null : null));
  const criar = useLoja((s) => s.criarProduto);
  const atualizar = useLoja((s) => s.atualizarProduto);
  const remover = useLoja((s) => s.removerProduto);
  const [f, setF] = useState(() => (existente ? { ...existente } : { ...VAZIO }));
  const [preco, setPreco] = useState(existente ? centavosParaReais(existente.preco) : "");
  const [precoDe, setPrecoDe] = useState(existente?.precoDe ? centavosParaReais(existente.precoDe) : "");
  const [novoDestaque, setNovoDestaque] = useState("");
  const [foto, setFoto] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (id && !existente) navigate("/painel/produtos", { replace: true });
  }, [id, existente, navigate]);

  const previa = useMemo<Produto>(() => ({ ...f, id: existente?.id ?? "novo", slug: existente?.slug ?? "novo", criadoEm: existente?.criadoEm ?? "", atualizadoEm: "", preco: reaisParaCentavos(preco), precoDe: precoDe ? reaisParaCentavos(precoDe) : null }), [f, preco, precoDe, existente]);

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((a) => ({ ...a, [k]: v }));
  }

  function salvar(e: FormEvent) {
    e.preventDefault();
    const p = reaisParaCentavos(preco);
    const pd = precoDe ? reaisParaCentavos(precoDe) : null;
    if (!f.nome.trim()) return setErro("Digite o nome do produto.");
    if (p <= 0) return setErro("Informe um preço maior que zero.");
    if (pd !== null && pd <= p) return setErro("O preço 'de' precisa ser maior que o preço atual.");
    if (f.estoque < 0) return setErro("Estoque não pode ser negativo.");
    const dados = { ...f, preco: p, precoDe: pd, imagens: f.imagens.length ? f.imagens : ["arte:iphone:costas"] };
    if (existente) atualizar(existente.id, dados);
    else criar(dados);
    navigate("/painel/produtos");
  }

  return (
    <Pagina titulo={existente ? `Editar: ${existente.nome} ${existente.cor}` : "Novo produto"} descricao="O que você salvar aqui aparece na loja na hora." acoes={<Botao variante="contorno" para="/painel/produtos" tamanho="sm" icone="setaEsq">Voltar</Botao>}>
      <form onSubmit={salvar} className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="grid gap-4">
          <Cartao titulo="Identificação">
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo rotulo="Nome"><Entrada value={f.nome} onChange={(e) => set("nome", e.target.value)} placeholder="iPhone 17 Pro" required /></Campo>
              <Campo rotulo="Modelo"><Entrada value={f.modelo} onChange={(e) => set("modelo", e.target.value)} placeholder="17 Pro" /></Campo>
              <Campo rotulo="Categoria"><Selecao value={f.categoria} onChange={(e) => set("categoria", e.target.value as Categoria)}>{CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.rotulo}</option>)}</Selecao></Campo>
              <Campo rotulo="Condição"><Selecao value={f.condicao} onChange={(e) => set("condicao", e.target.value as Condicao)}><option value="novo">Novo</option><option value="seminovo">Seminovo</option></Selecao></Campo>
              <Campo rotulo="Família (arte)"><Selecao value={f.familia} onChange={(e) => set("familia", e.target.value as Familia)}><option value="pro">Pro (3 câmeras)</option><option value="base">Base (2 câmeras)</option><option value="acessorio">Acessório / outro</option></Selecao></Campo>
              <Campo rotulo="Origem"><Selecao value={f.origem} onChange={(e) => set("origem", e.target.value as Origem)}><option value="BR">Nacional</option><option value="EUA">Versão americana 🇺🇸 (eSIM)</option></Selecao></Campo>
              <Campo rotulo="Armazenamento (GB)" ajuda="vazio para acessórios"><Entrada type="number" min={0} value={f.armazenamento ?? ""} onChange={(e) => set("armazenamento", e.target.value ? Number(e.target.value) : null)} /></Campo>
              <Campo rotulo="Cor (nome)"><Entrada value={f.cor} onChange={(e) => set("cor", e.target.value)} placeholder="Titânio Deserto" required /></Campo>
            </div>
            <fieldset className="mt-4">
              <legend className="text-xs font-bold uppercase tracking-[0.14em] text-cinza">Cor da arte</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(CORES_VISUAIS) as CorVisual[]).map((c) => (
                  <button key={c} type="button" onClick={() => set("corVisual", c)} aria-pressed={f.corVisual === c} title={CORES_VISUAIS[c].rotulo} aria-label={CORES_VISUAIS[c].rotulo} className={`grid size-10 place-items-center rounded-full border-2 ${f.corVisual === c ? "border-ouro" : "border-linha-forte"}`}>
                    <span className="size-6 rounded-full border border-black/30" style={{ background: `linear-gradient(135deg, ${CORES_VISUAIS[c].brilho}, ${CORES_VISUAIS[c].corpo} 55%, ${CORES_VISUAIS[c].borda})` }} />
                  </button>
                ))}
              </div>
            </fieldset>
          </Cartao>

          <Cartao titulo="Preço e estoque">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Campo rotulo="Preço (R$)"><Entrada inputMode="decimal" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="10.999,00" required /></Campo>
              <Campo rotulo="Preço 'de' (R$)" ajuda="mostra oferta"><Entrada inputMode="decimal" value={precoDe} onChange={(e) => setPrecoDe(e.target.value)} placeholder="opcional" /></Campo>
              <Campo rotulo="Parcelas (máx.)"><Entrada type="number" min={1} max={24} value={f.parcelas} onChange={(e) => set("parcelas", Number(e.target.value) || 1)} /></Campo>
              <Campo rotulo="Estoque"><Entrada type="number" min={0} value={f.estoque} onChange={(e) => set("estoque", Number(e.target.value) || 0)} /></Campo>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Alternador ligado={f.ativo} aoMudar={(v) => set("ativo", v)} rotulo="Ativo na loja" descricao="desligado = some do site" />
              <Alternador ligado={f.emDestaque} aoMudar={(v) => set("emDestaque", v)} rotulo="Em destaque" descricao="aparece na home" />
              <Alternador ligado={f.preVenda !== null} aoMudar={(v) => set("preVenda", v ? { sinalPercentual: 50, entregaPrevista: "a confirmar" } : null)} rotulo="Pré-venda" descricao="reserva com sinal" />
              <Alternador ligado={f.demo} aoMudar={(v) => set("demo", v)} rotulo="Dado de exemplo" descricao="mostra o selo 'exemplo'" />
            </div>
            {f.preVenda && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Campo rotulo="Sinal (%)"><Entrada type="number" min={0} max={100} value={f.preVenda.sinalPercentual} onChange={(e) => set("preVenda", { ...f.preVenda!, sinalPercentual: Number(e.target.value) || 0 })} /></Campo>
                <Campo rotulo="Entrega prevista"><Entrada value={f.preVenda.entregaPrevista} onChange={(e) => set("preVenda", { ...f.preVenda!, entregaPrevista: e.target.value })} placeholder="23 de setembro" /></Campo>
              </div>
            )}
            {f.condicao === "seminovo" && (
              <div className="mt-4 sm:w-48"><Campo rotulo="Saúde da bateria (%)"><Entrada type="number" min={0} max={100} value={f.bateria ?? ""} onChange={(e) => set("bateria", e.target.value ? Number(e.target.value) : null)} /></Campo></div>
            )}
          </Cartao>

          <Cartao titulo="Descrição e destaques">
            <Campo rotulo="Descrição"><AreaTexto rows={3} value={f.descricao} onChange={(e) => set("descricao", e.target.value)} /></Campo>
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-cinza">Destaques (lista)</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {f.destaques.map((d, i) => (
                  <li key={`${d}-${i}`} className="inline-flex items-center gap-1.5 rounded-full border border-linha-forte px-3 py-1.5 text-xs">
                    {d}
                    <button type="button" aria-label={`Remover ${d}`} onClick={() => set("destaques", f.destaques.filter((_, j) => j !== i))} className="text-cinza hover:text-erro"><Icone nome="fechar" tamanho={12} /></button>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2">
                <Entrada value={novoDestaque} onChange={(e) => setNovoDestaque(e.target.value)} placeholder="Ex.: Bateria 92%" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (novoDestaque.trim()) { set("destaques", [...f.destaques, novoDestaque.trim()]); setNovoDestaque(""); } } }} />
                <Botao variante="contorno" tamanho="sm" onClick={() => { if (novoDestaque.trim()) { set("destaques", [...f.destaques, novoDestaque.trim()]); setNovoDestaque(""); } }}>Adicionar</Botao>
              </div>
            </div>
            <Campo rotulo="Fonte do dado" ajuda="de onde veio o preço/condição (ex.: post do IG de 10/09)" className="mt-4"><Entrada value={f.fonte} onChange={(e) => set("fonte", e.target.value)} /></Campo>
          </Cartao>

          <Cartao titulo="Imagens" descricao="Arte automática enquanto não há foto; cole a URL da foto real quando tiver.">
            <ul className="flex flex-wrap gap-2">
              {f.imagens.map((img, i) => (
                <li key={`${img}-${i}`} className="inline-flex items-center gap-1.5 rounded-full border border-linha-forte px-3 py-1.5 text-xs">
                  {img.startsWith("arte:") ? img.replace("arte:", "arte · ") : "foto"}
                  <button type="button" aria-label="Remover imagem" onClick={() => set("imagens", f.imagens.filter((_, j) => j !== i))} className="text-cinza hover:text-erro"><Icone nome="fechar" tamanho={12} /></button>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
              <Selecao value="" onChange={(e) => { if (e.target.value) set("imagens", [...f.imagens, e.target.value]); }} aria-label="Adicionar arte">
                <option value="">+ adicionar arte…</option>
                {VISTAS.map((v) => <option key={v} value={v}>{v.replace("arte:", "")}</option>)}
              </Selecao>
              <div className="flex gap-2">
                <Entrada value={foto} onChange={(e) => setFoto(e.target.value)} placeholder="https://…/foto.jpg" />
                <Botao variante="contorno" tamanho="sm" onClick={() => { if (foto.trim()) { set("imagens", [...f.imagens, foto.trim()]); setFoto(""); } }}>Usar foto</Botao>
              </div>
            </div>
          </Cartao>

          {erro && <Aviso tom="erro">{erro}</Aviso>}
          <div className="flex flex-wrap items-center gap-2">
            <Botao type="submit" variante="ouro" icone="check">{existente ? "Salvar alterações" : "Cadastrar produto"}</Botao>
            <Botao variante="contorno" para="/painel/produtos">Cancelar</Botao>
            {existente && <Botao variante="perigo" onClick={() => { if (window.confirm("Excluir este produto?")) { remover(existente.id); navigate("/painel/produtos"); } }} icone="lixeira" className="ml-auto">Excluir</Botao>}
          </div>
        </div>

        <div className="xl:sticky xl:top-28">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-cinza">Como aparece na loja</p>
          <div className="pointer-events-none max-w-[320px]"><CartaoProduto produto={previa} /></div>
        </div>
      </form>
    </Pagina>
  );
}
