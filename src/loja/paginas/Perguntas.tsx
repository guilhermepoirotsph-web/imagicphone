/**
 * Perguntas — FAQ completo de @/dados/perguntas em acordeão acessível
 * (botão com aria-expanded/aria-controls, painel role=region, setas/Home/End
 * entre perguntas), busca por texto sem acento e CTA final no WhatsApp.
 * Animação de altura em CSS (grid-template-rows) — GSAP não move nada aqui.
 */
import { useEffect, useId, useMemo, useState, type KeyboardEvent as TeclaReact, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { perguntas, type Pergunta } from "@/dados/perguntas";
import { useLoja } from "@/estado/loja";
import { wa } from "@/lib/links";
import { animado, usarReveal, usarTituloSplit } from "@/lib/movimento";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Realça a primeira ocorrência do termo (sem acento) preservando o texto original. */
function Realce({ texto, termo }: { texto: string; termo: string }): ReactNode {
  if (!termo) return texto;
  const alvo = normalizar(termo);
  // NFD só acrescenta marcas combinantes: o índice no texto normalizado sem
  // marcas bate com o texto original se contarmos as marcas removidas antes dele.
  const decomposto = texto.normalize("NFD");
  const semMarcas = decomposto.replace(/[̀-ͯ]/g, "").toLowerCase();
  const inicioSem = semMarcas.indexOf(alvo);
  if (inicioSem < 0) return texto;
  let inicio = 0;
  let contados = 0;
  while (contados < inicioSem && inicio < decomposto.length) {
    if (!/[̀-ͯ]/.test(decomposto[inicio])) contados++;
    inicio++;
  }
  let fim = inicio;
  contados = 0;
  while (contados < alvo.length && fim < decomposto.length) {
    if (!/[̀-ͯ]/.test(decomposto[fim])) contados++;
    fim++;
  }
  while (fim < decomposto.length && /[̀-ͯ]/.test(decomposto[fim])) fim++;
  return (
    <>
      {decomposto.slice(0, inicio).normalize("NFC")}
      <mark className="rounded bg-ouro/30 px-0.5 text-marfim">{decomposto.slice(inicio, fim).normalize("NFC")}</mark>
      {decomposto.slice(fim).normalize("NFC")}
    </>
  );
}

interface PropsItem {
  item: Pergunta;
  indice: number;
  aberto: boolean;
  termo: string;
  aoAlternar: () => void;
}

function ItemPergunta({ item, indice, aberto, termo, aoAlternar }: PropsItem) {
  const idBotao = `faq-${item.id}-botao`;
  const idPainel = `faq-${item.id}-painel`;
  const transicao = animado() ? "transition-[grid-template-rows] duration-300 ease-out" : "";
  return (
    <li className={`cartao overflow-hidden transition-[border-color] duration-300 ${aberto ? "border-ouro/40" : "hover:border-linha-forte"}`}>
      <h3 className="font-display">
        <button
          id={idBotao}
          type="button"
          data-faq-botao
          aria-expanded={aberto}
          aria-controls={idPainel}
          onClick={aoAlternar}
          className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold sm:px-6 sm:text-lg"
        >
          <span className="flex items-start gap-3">
            <span className="mt-1 shrink-0 text-[0.68rem] font-bold tabular-nums tracking-[0.2em] text-ouro">
              {String(indice + 1).padStart(2, "0")}
            </span>
            <span>
              <Realce texto={item.pergunta} termo={termo} />
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`grid size-9 shrink-0 place-items-center rounded-full border border-linha-forte text-ouro transition-transform duration-300 ${aberto ? "rotate-45" : ""}`}
          >
            <Icone nome="mais" tamanho={16} />
          </span>
        </button>
      </h3>
      <div
        id={idPainel}
        role="region"
        aria-labelledby={idBotao}
        className={`grid ${transicao}`}
        style={{ gridTemplateRows: aberto ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden" inert={!aberto}>
          <p className="px-5 pb-5 pl-[3.1rem] text-sm leading-relaxed text-cinza sm:px-6 sm:pl-[3.35rem] sm:text-base">
            <Realce texto={item.resposta} termo={termo} />
          </p>
        </div>
      </div>
    </li>
  );
}

export default function Perguntas() {
  const config = useLoja((s) => s.config);
  const refTitulo = usarTituloSplit<HTMLHeadingElement>();
  const refIntro = usarReveal<HTMLDivElement>({ y: 22, delay: 0.15 });
  const refLista = usarReveal<HTMLUListElement>({ stagger: 0.06, y: 20 });
  const refCta = usarReveal<HTMLDivElement>({ y: 30 });
  const idBusca = `${useId().replace(/:/g, "")}-busca`;

  const [busca, setBusca] = useState("");
  const [abertas, setAbertas] = useState<Set<string>>(() => new Set([perguntas[0]?.id].filter(Boolean) as string[]));

  useEffect(() => {
    document.title = "Perguntas frequentes — iMagicPhone";
  }, []);

  const termo = busca.trim();
  const filtradas = useMemo(() => {
    const alvo = normalizar(termo);
    if (!alvo) return perguntas;
    return perguntas.filter((p) => normalizar(p.pergunta).includes(alvo) || normalizar(p.resposta).includes(alvo));
  }, [termo]);

  const alternar = (id: string) =>
    setAbertas((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const navegarComTeclas = (e: TeclaReact<HTMLUListElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const botoes = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-faq-botao]"));
    const i = botoes.findIndex((b) => b === document.activeElement);
    if (i < 0 || botoes.length === 0) return;
    e.preventDefault();
    const alvo =
      e.key === "ArrowDown"
        ? botoes[(i + 1) % botoes.length]
        : e.key === "ArrowUp"
          ? botoes[(i - 1 + botoes.length) % botoes.length]
          : e.key === "Home"
            ? botoes[0]
            : botoes[botoes.length - 1];
    alvo?.focus();
  };

  const linkWa = wa.padrao(config.whatsappNumero, config.whatsappLink);
  const resumo = termo
    ? filtradas.length === 0
      ? `Nenhuma pergunta com “${termo}”.`
      : `${filtradas.length} ${filtradas.length === 1 ? "resultado" : "resultados"} para “${termo}”.`
    : `${perguntas.length} perguntas respondidas com o que a loja publica no perfil oficial.`;

  return (
    <div data-pagina="Perguntas">
      {/* ---------- hero interno ---------- */}
      <section className="relative overflow-hidden" aria-labelledby="faq-titulo">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,178,76,.12),transparent_70%)]"
        />
        <div aria-hidden="true" className="filete-ouro absolute inset-x-0 top-0 z-[1]" />
        <div className="container-pagina relative z-[4] pb-10 pt-14 sm:pb-14 sm:pt-20">
          <p className="rotulo">
            <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
            Perguntas frequentes
          </p>
          <h1 id="faq-titulo" ref={refTitulo} className="texto-display mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
            Tire suas dúvidas.
          </h1>
          <div ref={refIntro} data-reveal>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-cinza sm:text-lg">
              Respostas baseadas no que a iMagicPhone publica no perfil oficial. O que não estiver aqui, pergunte no WhatsApp —
              ninguém inventa política comercial por aqui.
            </p>
            <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-8 max-w-xl">
              <label htmlFor={idBusca} className="sr-only">
                Buscar nas perguntas
              </label>
              <div className="relative">
                <Icone nome="busca" tamanho={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinza" />
                <input
                  id={idBusca}
                  type="search"
                  className="campo !min-h-13 pl-12 pr-12"
                  placeholder="Ex.: garantia, entrega, pré-venda, eSIM…"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  autoComplete="off"
                  enterKeyHint="search"
                />
                {busca && (
                  <button
                    type="button"
                    onClick={() => setBusca("")}
                    aria-label="Limpar busca"
                    className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-cinza transition-colors hover:text-ouro"
                  >
                    <Icone nome="fechar" tamanho={16} />
                  </button>
                )}
              </div>
              <p aria-live="polite" className="mt-3 text-xs text-cinza-escuro">
                {resumo}
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ---------- acordeão ---------- */}
      <section className="pb-16 sm:pb-20" aria-label="Lista de perguntas">
        <div className="container-pagina">
          {filtradas.length > 0 ? (
            <ul ref={refLista} onKeyDown={navegarComTeclas} className="grid max-w-4xl gap-3">
              {filtradas.map((item, i) => (
                <ItemPergunta
                  key={item.id}
                  item={item}
                  indice={i}
                  termo={termo}
                  aberto={termo ? true : abertas.has(item.id)}
                  aoAlternar={() => alternar(item.id)}
                />
              ))}
            </ul>
          ) : (
            <div className="cartao max-w-4xl p-8 text-center sm:p-10">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-ouro/12 text-ouro">
                <Icone nome="busca" tamanho={22} />
              </div>
              <h2 className="font-display mt-5 text-xl font-bold">Não achamos essa pergunta.</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-cinza">
                Tente outra palavra ou mande direto para a loja — o WhatsApp responde o que o FAQ ainda não cobre.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Botao variante="wa" href={linkWa} icone="whatsapp">
                  Perguntar no WhatsApp
                </Botao>
                <Botao variante="contorno" onClick={() => setBusca("")} icone="fechar">
                  Limpar busca
                </Botao>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---------- CTA final ---------- */}
      <section className="border-t border-linha py-20 sm:py-24" aria-labelledby="faq-cta-titulo">
        <div className="container-pagina">
          <div ref={refCta} data-reveal className="cartao-ouro relative overflow-hidden p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(50%_60%_at_100%_0%,rgba(212,178,76,.18),transparent_70%)]"
            />
            <div className="relative z-[4] max-w-xl">
              <p className="rotulo">
                <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
                Ficou alguma dúvida?
              </p>
              <h2 id="faq-cta-titulo" className="texto-display mt-3 text-3xl sm:text-4xl">
                A loja responde no WhatsApp.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cinza sm:text-base">
                Disponibilidade, saúde de bateria dos seminovos, prazo de entrega na sua cidade, parcelamento: tudo é combinado
                direto com a iMagicPhone.
              </p>
            </div>
            <div className="relative z-[4] mt-6 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0 lg:flex-col">
              <Botao variante="wa" href={linkWa} icone="whatsapp" tamanho="lg" magnetico>
                Falar no WhatsApp
              </Botao>
              <Botao variante="contorno" para="/contato" icone="mapa" tamanho="lg">
                Ver contato e endereço
              </Botao>
            </div>
          </div>
          <p className="mt-6 text-xs text-cinza-escuro">
            Quer ver os produtos antes?{" "}
            <Link to="/produtos" className="font-semibold text-ouro underline-offset-4 hover:underline">
              Abrir o catálogo
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
