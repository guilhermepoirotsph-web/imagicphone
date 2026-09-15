/**
 * Grupo VIP — página inteira do grupo do WhatsApp. Benefícios só com o
 * verificável (chegadas, pré-vendas, ofertas antes do Instagram), formulário
 * compacto (nome, WhatsApp, interesse) gravando na store (`adicionarVip`) e
 * botão que abre `wa.vip`. Não importa a seção Vip da home (outro construtor).
 */
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { negocio } from "@/dados/negocio";
import { useLoja } from "@/estado/loja";
import { wa } from "@/lib/links";
import { moeda, normalizarWhatsapp, mascararTelefone } from "@/lib/formatar";
import { usarReveal, usarTituloSplit, usarContador } from "@/lib/movimento";
import Botao from "@/componentes/ui/Botao";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";
import Selo from "@/componentes/ui/Selo";
import Secao from "@/componentes/ui/Secao";

const OUTROS_INTERESSES = ["Seminovos", "AirPods, Watch ou iPad", "Acessórios", "Ainda não sei — quero ver as chegadas"];

/** estável fora do componente: `usarContador` recria o tween se a função mudar */
const formatarInteiro = (n: number) => Math.round(n).toLocaleString("pt-BR");

interface Beneficio {
  icone: NomeIcone;
  titulo: string;
  texto: string;
  fonte: string;
}

const BENEFICIOS: Beneficio[] = [
  {
    icone: "caixa",
    titulo: "Chegadas em primeira mão",
    texto: "Aviso quando entram iPhones novos, seminovos e as versões americanas 🇺🇸 — como as chegadas do iPhone 16 e 17 que estão nos destaques.",
    fonte: "destaques do perfil",
  },
  {
    icone: "calendario",
    titulo: "Pré-vendas antes de todo mundo",
    texto: `Como a do ${negocio.preVendaAtual.modelo}: ${moeda(negocio.preVendaAtual.preco)} no ${negocio.preVendaAtual.armazenamento} GB, sinal de ${negocio.preVendaAtual.sinalPercentual}% e entrega prevista para ${negocio.preVendaAtual.entregaPrevista}.`,
    fonte: "post de 10/09/2026",
  },
  {
    icone: "brilho",
    titulo: "Ofertas antes do Instagram",
    texto: "O grupo recebe as ofertas antes de a loja publicar no perfil. Entrada gratuita, no WhatsApp que você já usa.",
    fonte: "bio e FAQ da loja",
  },
];

interface Dados {
  nome: string;
  whatsapp: string;
  interesse: string;
}
type Erros = Partial<Record<keyof Dados, string>>;

function validar(d: Dados): Erros {
  const erros: Erros = {};
  if (d.nome.trim().length < 2) erros.nome = "Diga seu nome (pelo menos 2 letras).";
  const digitos = normalizarWhatsapp(d.whatsapp);
  if (digitos.length < 12 || digitos.length > 13) erros.whatsapp = "Use DDD + número, ex.: (12) 99999-9999.";
  if (!d.interesse) erros.interesse = "Escolha o que mais te interessa.";
  return erros;
}

function ProvaSocial() {
  const refContador = usarContador<HTMLSpanElement>(negocio.provaSocial.seguidores, formatarInteiro);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="cartao p-6">
        <p className="font-display text-3xl font-extrabold text-marfim">
          <span ref={refContador}>{formatarInteiro(negocio.provaSocial.seguidores)}</span>
        </p>
        <p className="mt-1 text-sm text-cinza">seguidores no Instagram — contagem pública em 14/09/2026</p>
      </div>
      <div className="cartao p-6">
        <p className="font-display text-3xl font-extrabold text-marfim">{negocio.provaSocial.destaquesClientes}</p>
        <p className="mt-1 text-sm text-cinza">destaques “Clientes” no perfil, com entregas reais</p>
      </div>
    </div>
  );
}

export default function GrupoVip() {
  const config = useLoja((s) => s.config);
  const produtos = useLoja((s) => s.produtos);
  const adicionarVip = useLoja((s) => s.adicionarVip);
  const refTitulo = usarTituloSplit<HTMLHeadingElement>();
  const refIntro = usarReveal<HTMLDivElement>({ y: 22, delay: 0.15 });
  const refForm = usarReveal<HTMLDivElement>({ y: 30, delay: 0.3 });
  const refBeneficios = usarReveal<HTMLDivElement>({ stagger: 0.1 });
  const refPassos = usarReveal<HTMLOListElement>({ stagger: 0.1, y: 20 });
  const idBase = useId().replace(/:/g, "");

  const [dados, setDados] = useState<Dados>({ nome: "", whatsapp: "", interesse: "" });
  const [erros, setErros] = useState<Erros>({});
  const [cadastrado, setCadastrado] = useState<{ nome: string; whatsapp: string } | null>(null);
  const refNome = useRef<HTMLInputElement>(null);
  const refWhats = useRef<HTMLInputElement>(null);
  const refInteresse = useRef<HTMLSelectElement>(null);
  const refSucesso = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Grupo VIP — iMagicPhone";
  }, []);

  useEffect(() => {
    if (cadastrado) refSucesso.current?.focus();
  }, [cadastrado]);

  const modelos = useMemo(() => {
    const nomes = produtos.filter((p) => p.ativo && p.categoria === "iphones").map((p) => p.nome);
    return Array.from(new Set(nomes));
  }, [produtos]);

  const linkVip = wa.vip(config.whatsappNumero, config.whatsappLink);

  const atualizar = (campo: keyof Dados) => (valor: string) => {
    setDados((d) => ({ ...d, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  };

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const novosErros = validar(dados);
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      if (novosErros.nome) refNome.current?.focus();
      else if (novosErros.whatsapp) refWhats.current?.focus();
      else refInteresse.current?.focus();
      return;
    }
    const whatsapp = normalizarWhatsapp(dados.whatsapp);
    adicionarVip({ nome: dados.nome.trim(), whatsapp, interesse: dados.interesse, origem: "site" });
    setCadastrado({ nome: dados.nome.trim(), whatsapp });
  };

  const novoCadastro = () => {
    setDados({ nome: "", whatsapp: "", interesse: "" });
    setErros({});
    setCadastrado(null);
  };

  return (
    <div data-pagina="GrupoVip">
      {/* ---------- hero + formulário ---------- */}
      <section className="grao relative overflow-hidden" aria-labelledby="vip-titulo">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,178,76,.16),transparent_70%)]"
        />
        <div aria-hidden="true" className="filete-ouro absolute inset-x-0 top-0 z-[1]" />
        <div className="container-pagina relative z-[4] pb-16 pt-14 sm:pb-20 sm:pt-20 lg:grid lg:grid-cols-[1.05fr_.95fr] lg:items-start lg:gap-14">
          <div>
            <p className="rotulo">
              <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
              Grupo VIP no WhatsApp
            </p>
            <h1 id="vip-titulo" ref={refTitulo} className="texto-display mt-4 text-4xl sm:text-5xl lg:text-6xl">
              Chegadas e ofertas antes de todo mundo.
            </h1>
            <div ref={refIntro} data-reveal>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-cinza sm:text-lg">
                Um grupo gratuito no WhatsApp onde a iMagicPhone avisa chegadas, pré-vendas e ofertas antes de publicar no
                Instagram. Deixe seu contato e o que você procura — a loja fala com você por lá.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Resumo do grupo">
                {["Gratuito", "Chegadas", "Pré-vendas", "Ofertas antes do Instagram"].map((t) => (
                  <li
                    key={t}
                    className="inline-flex min-h-9 items-center gap-2 rounded-full border border-linha bg-white/[.03] px-3.5 text-xs font-semibold text-marfim"
                  >
                    <Icone nome="check" tamanho={14} className="text-ouro" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <ProvaSocial />
              </div>
            </div>
          </div>

          <div ref={refForm} data-reveal className="mt-12 lg:mt-0">
            {cadastrado ? (
              <div
                ref={refSucesso}
                tabIndex={-1}
                role="status"
                className="cartao-ouro relative overflow-hidden p-6 sm:p-8 focus:outline-none"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(50%_60%_at_100%_0%,rgba(212,178,76,.2),transparent_70%)]"
                />
                <div className="relative z-[4]">
                  <div className="grid size-12 place-items-center rounded-full bg-ouro text-preto">
                    <Icone nome="check" tamanho={24} espessura={2.2} />
                  </div>
                  <h2 className="font-display mt-5 text-2xl font-bold">Contato recebido, {cadastrado.nome.split(" ")[0]}.</h2>
                  <p className="mt-2 text-sm leading-relaxed text-cinza">
                    Guardamos <span className="text-marfim">{mascararTelefone(cadastrado.whatsapp)}</span> para a loja. Agora
                    abra o WhatsApp e diga que quer entrar no Grupo VIP — é a loja quem coloca você no grupo.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Botao variante="wa" href={linkVip} icone="whatsapp" tamanho="lg" magnetico>
                      Entrar no grupo pelo WhatsApp
                    </Botao>
                    <Botao variante="fantasma" onClick={novoCadastro}>
                      Cadastrar outra pessoa
                    </Botao>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={enviar} noValidate className="cartao-ouro p-6 sm:p-8" aria-labelledby={`${idBase}-form-titulo`}>
                <p className="rotulo">
                  <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
                  Entrar no grupo
                </p>
                <h2 id={`${idBase}-form-titulo`} className="font-display mt-3 text-2xl font-bold">
                  Deixe seu contato
                </h2>
                <div className="mt-6 grid gap-5">
                  <div>
                    <label htmlFor={`${idBase}-nome`} className="mb-2 block text-sm font-semibold">
                      Nome <span className="text-ouro" aria-hidden="true">*</span>
                    </label>
                    <input
                      ref={refNome}
                      id={`${idBase}-nome`}
                      name="nome"
                      className="campo"
                      autoComplete="name"
                      required
                      value={dados.nome}
                      onChange={(e) => atualizar("nome")(e.target.value)}
                      aria-invalid={Boolean(erros.nome)}
                      aria-describedby={erros.nome ? `${idBase}-nome-erro` : undefined}
                    />
                    {erros.nome && (
                      <p id={`${idBase}-nome-erro`} role="alert" className="mt-2 text-xs text-erro">
                        {erros.nome}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`${idBase}-whats`} className="mb-2 block text-sm font-semibold">
                      WhatsApp <span className="text-ouro" aria-hidden="true">*</span>
                    </label>
                    <input
                      ref={refWhats}
                      id={`${idBase}-whats`}
                      name="whatsapp"
                      className="campo"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="(12) 99999-9999"
                      required
                      value={dados.whatsapp}
                      onChange={(e) => atualizar("whatsapp")(e.target.value)}
                      aria-invalid={Boolean(erros.whatsapp)}
                      aria-describedby={erros.whatsapp ? `${idBase}-whats-erro` : undefined}
                    />
                    {erros.whatsapp && (
                      <p id={`${idBase}-whats-erro`} role="alert" className="mt-2 text-xs text-erro">
                        {erros.whatsapp}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`${idBase}-interesse`} className="mb-2 block text-sm font-semibold">
                      O que você procura <span className="text-ouro" aria-hidden="true">*</span>
                    </label>
                    <select
                      ref={refInteresse}
                      id={`${idBase}-interesse`}
                      name="interesse"
                      className="campo"
                      required
                      value={dados.interesse}
                      onChange={(e) => atualizar("interesse")(e.target.value)}
                      aria-invalid={Boolean(erros.interesse)}
                      aria-describedby={erros.interesse ? `${idBase}-interesse-erro` : undefined}
                    >
                      <option value="" disabled>
                        Escolha um modelo ou categoria
                      </option>
                      {modelos.length > 0 && (
                        <optgroup label="iPhones">
                          {modelos.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      <optgroup label="Outros">
                        {OUTROS_INTERESSES.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    {erros.interesse && (
                      <p id={`${idBase}-interesse-erro`} role="alert" className="mt-2 text-xs text-erro">
                        {erros.interesse}
                      </p>
                    )}
                  </div>
                </div>
                <Botao type="submit" variante="ouro" icone="vip" tamanho="lg" className="mt-6" cheio magnetico>
                  Quero entrar no VIP
                </Botao>
                <p className="mt-4 text-xs leading-relaxed text-cinza-escuro">
                  Só a loja vê seu contato. Depois do cadastro, o botão do WhatsApp abre a conversa para você pedir a entrada no
                  grupo.
                </p>
                <p className="mt-3 text-xs text-cinza-escuro">
                  Prefere pular o formulário?{" "}
                  <a href={linkVip} target="_blank" rel="noopener" className="font-semibold text-ouro underline-offset-4 hover:underline">
                    Chame a loja direto no WhatsApp
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ---------- benefícios ---------- */}
      <Secao
        id="beneficios"
        rotulo="O que chega no grupo"
        titulo="Só o que a loja já divulga — antes de todo mundo."
        descricao="Três coisas que a iMagicPhone publica no perfil e que, no grupo, você fica sabendo primeiro."
        className="border-t border-linha"
      >
        <div ref={refBeneficios} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {BENEFICIOS.map((b) => (
            <article
              key={b.titulo}
              className="cartao relative overflow-hidden p-6 transition-[border-color,box-shadow] duration-300 hover:border-ouro/40 hover:shadow-cartao sm:p-7"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[radial-gradient(circle,rgba(212,178,76,.16),transparent_65%)]"
              />
              <div className="grid size-12 place-items-center rounded-full bg-ouro/12 text-ouro">
                <Icone nome={b.icone} tamanho={22} />
              </div>
              <h3 className="font-display mt-5 text-lg font-bold">{b.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cinza">{b.texto}</p>
              <p className="mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-cinza-escuro">Fonte: {b.fonte}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-cinza">
          <Selo tom="ouro">pré-venda real</Selo>
          <p>
            {negocio.preVendaAtual.modelo} — {moeda(negocio.preVendaAtual.preco)} ({negocio.preVendaAtual.armazenamento} GB), publicada
            em {negocio.preVendaAtual.fonte}.
          </p>
        </div>
      </Secao>

      {/* ---------- como funciona ---------- */}
      <Secao
        id="como-funciona"
        rotulo="Como funciona"
        titulo="Três passos, nenhum cadastro complicado."
        className="border-t border-linha bg-[radial-gradient(50%_40%_at_50%_100%,rgba(212,178,76,.08),transparent_70%)]"
        acao={
          <Botao variante="wa" href={linkVip} icone="whatsapp">
            Chamar no WhatsApp
          </Botao>
        }
      >
        <ol ref={refPassos} className="grid gap-4 sm:grid-cols-3 lg:gap-6">
          {[
            { titulo: "Deixe seu contato", texto: "Nome, WhatsApp e o que você procura — leva menos de um minuto." },
            { titulo: "Abra o WhatsApp", texto: "O botão abre a conversa com a loja. Diga que quer entrar no Grupo VIP." },
            { titulo: "Receba primeiro", texto: "Chegadas, pré-vendas e ofertas chegam no grupo antes do Instagram." },
          ].map((p, i) => (
            <li key={p.titulo} className="cartao flex gap-4 p-6">
              <span className="font-display shrink-0 text-3xl font-extrabold text-ouro">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-base font-bold">{p.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-cinza">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </Secao>
    </div>
  );
}
