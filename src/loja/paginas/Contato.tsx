/**
 * Contato — canais reais (WhatsApp oficial, Instagram, endereço com mapa) e
 * um recado que vira mensagem de WhatsApp. Sem backend, sem e-mail inventado:
 * horário e e-mail só aparecem quando o cliente informar no painel.
 * Mapa é cartão-link (sem iframe de terceiro).
 */
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent as TeclaReact } from "react";
import { negocio, CONFIGURE_ME } from "@/dados/negocio";
import { useLoja } from "@/estado/loja";
import { wa, linkMapa, linkWhatsapp } from "@/lib/links";
import { mascararTelefone, normalizarWhatsapp } from "@/lib/formatar";
import { usarReveal, usarTituloSplit } from "@/lib/movimento";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";
import Selo from "@/componentes/ui/Selo";
import Secao from "@/componentes/ui/Secao";

const ASSUNTOS = [
  "Quero um iPhone novo",
  "Seminovos",
  `Pré-venda do ${negocio.preVendaAtual.modelo}`,
  "Entrega no Litoral Norte",
  "AirPods, Watch, iPad ou acessórios",
  "Outro assunto",
] as const;

interface Recado {
  nome: string;
  whatsapp: string;
  assunto: string;
  mensagem: string;
}

type Erros = Partial<Record<keyof Recado, string>>;

const RECADO_VAZIO: Recado = { nome: "", whatsapp: "", assunto: ASSUNTOS[0], mensagem: "" };

function numeroValido(numero: string): boolean {
  return numero !== CONFIGURE_ME && /^\d{10,15}$/.test(numero);
}

function validar(r: Recado): Erros {
  const erros: Erros = {};
  if (r.nome.trim().length < 2) erros.nome = "Diga seu nome para a loja saber com quem fala.";
  if (r.whatsapp.trim()) {
    const d = normalizarWhatsapp(r.whatsapp);
    if (d.length < 12 || d.length > 13) erros.whatsapp = "Use DDD + número, ex.: (12) 99999-9999.";
  }
  if (r.mensagem.trim().length < 5) erros.mensagem = "Escreva seu recado (pelo menos algumas palavras).";
  return erros;
}

function montarRecado(r: Recado): string {
  const linhas = [
    "Olá! Vim pelo site da iMagicPhone. 📱",
    `Nome: ${r.nome.trim()}`,
    r.whatsapp.trim() ? `WhatsApp: ${mascararTelefone(normalizarWhatsapp(r.whatsapp))}` : null,
    `Assunto: ${r.assunto}`,
    "",
    r.mensagem.trim(),
  ];
  return linhas.filter((l): l is string => l !== null).join("\n");
}

export default function Contato() {
  const config = useLoja((s) => s.config);
  const refTitulo = usarTituloSplit<HTMLHeadingElement>();
  const refIntro = usarReveal<HTMLParagraphElement>({ y: 20, delay: 0.15 });
  const refCanais = usarReveal<HTMLDivElement>({ stagger: 0.08 });
  const refForm = usarReveal<HTMLDivElement>({ y: 30 });
  const refMapa = usarReveal<HTMLDivElement>({ y: 30, escala: 0.98 });
  const idBase = useId();
  const idPadrao = `padrao-${idBase.replace(/:/g, "")}`;

  const [recado, setRecado] = useState<Recado>(RECADO_VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [pronto, setPronto] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const refNome = useRef<HTMLInputElement>(null);
  const refWhats = useRef<HTMLInputElement>(null);
  const refMensagem = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.title = "Contato — iMagicPhone";
  }, []);

  useEffect(() => {
    if (!copiado) return;
    const t = window.setTimeout(() => setCopiado(false), 2400);
    return () => window.clearTimeout(t);
  }, [copiado]);

  const temNumero = numeroValido(config.whatsappNumero);
  const linkWa = wa.padrao(config.whatsappNumero, config.whatsappLink);
  const horarioDefinido = Boolean(config.horario) && config.horario !== CONFIGURE_ME;
  const enderecoCompleto = `${config.endereco} — ${config.enderecoComplemento}`;
  const mapa = linkMapa(enderecoCompleto);

  const atualizar = (campo: keyof Recado) => (valor: string) => {
    setRecado((r) => ({ ...r, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  };

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const novosErros = validar(recado);
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      if (novosErros.nome) refNome.current?.focus();
      else if (novosErros.whatsapp) refWhats.current?.focus();
      else refMensagem.current?.focus();
      return;
    }
    const texto = montarRecado(recado);
    setPronto(texto);
    // abre no gesto do usuário (submit) — popup não é bloqueado
    window.open(linkWhatsapp(texto, config.whatsappNumero, config.whatsappLink), "_blank", "noopener");
    if (!temNumero) void copiar(texto);
  };

  const copiar = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
    } catch {
      /* sem permissão de clipboard: o texto continua visível para seleção manual */
    }
  };

  const enviarComCtrlEnter = (e: TeclaReact<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") e.currentTarget.form?.requestSubmit();
  };

  const linkRecado = pronto ? linkWhatsapp(pronto, config.whatsappNumero, config.whatsappLink) : linkWa;

  return (
    <div data-pagina="Contato">
      {/* ---------- hero interno ---------- */}
      <section className="relative overflow-hidden" aria-labelledby="contato-titulo">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,178,76,.12),transparent_70%)]"
        />
        <div aria-hidden="true" className="filete-ouro absolute inset-x-0 top-0 z-[1]" />
        <div className="container-pagina relative z-[4] pb-12 pt-14 sm:pb-16 sm:pt-20">
          <p className="rotulo">
            <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
            Contato
          </p>
          <h1 id="contato-titulo" ref={refTitulo} className="texto-display mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
            Fale com a iMagicPhone.
          </h1>
          <p ref={refIntro} data-reveal className="mt-6 max-w-2xl text-base leading-relaxed text-cinza sm:text-lg">
            O WhatsApp é o canal mais rápido: disponibilidade, fotos, pré-venda e entrega. Também estamos no Instagram e na
            loja física, no Sumaré, em Caraguatatuba.
          </p>
        </div>
      </section>

      {/* ---------- canais ---------- */}
      <section className="pb-6" aria-label="Canais de atendimento">
        <div className="container-pagina">
          <div ref={refCanais} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <article className="cartao flex flex-col p-6 transition-[border-color] duration-300 hover:border-ouro/40">
              <div className="grid size-12 place-items-center rounded-full bg-wa/15 text-wa">
                <Icone nome="whatsapp" tamanho={22} />
              </div>
              <h2 className="font-display mt-5 text-lg font-bold">WhatsApp</h2>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-cinza">
                Atendimento direto com a loja.
                {temNumero ? (
                  <>
                    {" "}
                    <span className="text-marfim">{mascararTelefone(config.whatsappNumero)}</span>
                  </>
                ) : (
                  " Abre o WhatsApp Business oficial do perfil."
                )}
              </p>
              <Botao variante="wa" href={linkWa} icone="whatsapp" className="mt-5" cheio>
                Chamar no WhatsApp
              </Botao>
            </article>

            <article className="cartao flex flex-col p-6 transition-[border-color] duration-300 hover:border-ouro/40">
              <div className="grid size-12 place-items-center rounded-full bg-ouro/12 text-ouro">
                <Icone nome="instagram" tamanho={22} />
              </div>
              <h2 className="font-display mt-5 text-lg font-bold">Instagram</h2>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-cinza">
                <span className="text-marfim">{negocio.instagramHandle}</span> · {negocio.provaSocial.seguidoresTexto}. Chegadas,
                clientes e o dia a dia da loja.
              </p>
              <Botao variante="contorno" href={config.instagram} icone="instagram" className="mt-5" cheio>
                Seguir o perfil
              </Botao>
            </article>

            <article className="cartao flex flex-col p-6 transition-[border-color] duration-300 hover:border-ouro/40">
              <div className="grid size-12 place-items-center rounded-full bg-ouro/12 text-ouro">
                <Icone nome="mapa" tamanho={22} />
              </div>
              <h2 className="font-display mt-5 text-lg font-bold">Loja física</h2>
              <p className="mt-1 flex-1 break-words text-sm leading-relaxed text-cinza">
                <span className="text-marfim">{config.endereco}</span>
                <br />
                {config.enderecoComplemento}
              </p>
              <Botao variante="contorno" href={mapa} icone="mapa" iconeDepois="externo" className="mt-5" cheio>
                Como chegar
              </Botao>
            </article>

            <article className="cartao flex flex-col p-6 transition-[border-color] duration-300 hover:border-ouro/40">
              <div className="grid size-12 place-items-center rounded-full bg-ouro/12 text-ouro">
                <Icone nome="relogio" tamanho={22} />
              </div>
              <h2 className="font-display mt-5 text-lg font-bold">Horário</h2>
              {horarioDefinido ? (
                <p className="mt-1 flex-1 text-sm leading-relaxed text-marfim">{config.horario}</p>
              ) : (
                <div className="mt-1 flex flex-1 flex-col gap-3">
                  <p className="text-sm leading-relaxed text-cinza">Combine o melhor horário pelo WhatsApp.</p>
                  <Selo tom="aviso" className="self-start" titulo="O horário ainda não foi divulgado — preencher no painel">
                    a confirmar
                  </Selo>
                </div>
              )}
              <Botao variante="contorno" href={linkWa} icone="whatsapp" className="mt-5" cheio>
                Combinar visita
              </Botao>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- recado ---------- */}
      <Secao
        id="recado"
        rotulo="Deixe seu recado"
        titulo="Escreva aqui, a conversa continua no WhatsApp."
        descricao="O formulário só monta a mensagem — nada fica guardado no site. Ao enviar, o WhatsApp abre com o recado pronto."
        className="border-t border-linha"
      >
        <div ref={refForm} data-reveal className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
          <form onSubmit={enviar} noValidate className="cartao p-6 sm:p-8" aria-describedby={`${idPadrao}-nota`}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor={`${idPadrao}-nome`} className="mb-2 block text-sm font-semibold">
                  Seu nome <span className="text-ouro" aria-hidden="true">*</span>
                </label>
                <input
                  ref={refNome}
                  id={`${idPadrao}-nome`}
                  name="nome"
                  className="campo"
                  autoComplete="name"
                  required
                  value={recado.nome}
                  onChange={(e) => atualizar("nome")(e.target.value)}
                  aria-invalid={Boolean(erros.nome)}
                  aria-describedby={erros.nome ? `${idPadrao}-nome-erro` : undefined}
                />
                {erros.nome && (
                  <p id={`${idPadrao}-nome-erro`} role="alert" className="mt-2 text-xs text-erro">
                    {erros.nome}
                  </p>
                )}
              </div>
              <div className="sm:col-span-1">
                <label htmlFor={`${idPadrao}-whats`} className="mb-2 block text-sm font-semibold">
                  Seu WhatsApp <span className="font-normal text-cinza">(opcional)</span>
                </label>
                <input
                  ref={refWhats}
                  id={`${idPadrao}-whats`}
                  name="whatsapp"
                  className="campo"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(12) 99999-9999"
                  value={recado.whatsapp}
                  onChange={(e) => atualizar("whatsapp")(e.target.value)}
                  aria-invalid={Boolean(erros.whatsapp)}
                  aria-describedby={erros.whatsapp ? `${idPadrao}-whats-erro` : undefined}
                />
                {erros.whatsapp && (
                  <p id={`${idPadrao}-whats-erro`} role="alert" className="mt-2 text-xs text-erro">
                    {erros.whatsapp}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`${idPadrao}-assunto`} className="mb-2 block text-sm font-semibold">
                  Assunto
                </label>
                <select
                  id={`${idPadrao}-assunto`}
                  name="assunto"
                  className="campo"
                  value={recado.assunto}
                  onChange={(e) => atualizar("assunto")(e.target.value)}
                >
                  {ASSUNTOS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`${idPadrao}-msg`} className="mb-2 block text-sm font-semibold">
                  Recado <span className="text-ouro" aria-hidden="true">*</span>
                </label>
                <textarea
                  ref={refMensagem}
                  id={`${idPadrao}-msg`}
                  name="mensagem"
                  className="campo min-h-32 resize-y py-3"
                  required
                  rows={5}
                  placeholder="Ex.: Quero saber se tem iPhone 17 256 GB disponível e o valor à vista."
                  value={recado.mensagem}
                  onChange={(e) => atualizar("mensagem")(e.target.value)}
                  onKeyDown={enviarComCtrlEnter}
                  aria-invalid={Boolean(erros.mensagem)}
                  aria-describedby={erros.mensagem ? `${idPadrao}-msg-erro` : `${idPadrao}-msg-dica`}
                />
                {erros.mensagem ? (
                  <p id={`${idPadrao}-msg-erro`} role="alert" className="mt-2 text-xs text-erro">
                    {erros.mensagem}
                  </p>
                ) : (
                  <p id={`${idPadrao}-msg-dica`} className="mt-2 text-xs text-cinza-escuro">
                    Ctrl + Enter também envia.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Botao type="submit" variante="wa" icone="whatsapp" magnetico>
                Enviar pelo WhatsApp
              </Botao>
              <p id={`${idPadrao}-nota`} className="text-xs text-cinza-escuro">
                {temNumero
                  ? "O recado já vai preenchido na conversa."
                  : "O canal oficial abre com a mensagem padrão da loja; seu recado fica copiado para colar."}
              </p>
            </div>
          </form>

          <div className="flex flex-col gap-4">
            <div className="cartao-ouro p-6 sm:p-8" aria-live="polite">
              {pronto ? (
                <>
                  <p className="rotulo">
                    <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
                    Recado pronto
                  </p>
                  <h3 className="font-display mt-3 text-xl font-bold">
                    {temNumero ? "Já está na conversa." : "Cole na conversa que abriu."}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cinza">
                    {temNumero
                      ? "Se o WhatsApp não abriu, use o botão abaixo — o texto vai junto."
                      : "O link oficial da loja não carrega texto automaticamente. Copie o recado e cole na conversa."}
                  </p>
                  <textarea
                    readOnly
                    aria-label="Recado montado"
                    className="campo mt-4 min-h-36 resize-y py-3 text-sm"
                    value={pronto}
                    onFocus={(e) => e.currentTarget.select()}
                  />
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Botao variante="wa" href={linkRecado} icone="whatsapp">
                      Abrir no WhatsApp
                    </Botao>
                    <Botao variante="contorno" icone={copiado ? "check" : "copiar"} onClick={() => void copiar(pronto)}>
                      {copiado ? "Copiado" : "Copiar recado"}
                    </Botao>
                  </div>
                </>
              ) : (
                <>
                  <p className="rotulo">
                    <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
                    Como funciona
                  </p>
                  <ol className="mt-4 space-y-4">
                    {[
                      "Você escreve o recado aqui, com nome e assunto.",
                      "O site monta a mensagem e abre o WhatsApp da loja.",
                      "A iMagicPhone responde na própria conversa.",
                    ].map((passo, i) => (
                      <li key={passo} className="flex gap-3 text-sm leading-relaxed">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ouro/15 text-xs font-bold text-ouro">
                          {i + 1}
                        </span>
                        <span className="text-cinza">{passo}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-6 text-xs leading-relaxed text-cinza-escuro">
                    Sem cadastro, sem e-mail, sem espera: o atendimento acontece no WhatsApp que a loja já usa.
                  </p>
                </>
              )}
            </div>
            <p className="text-xs text-cinza-escuro">
              Prefere falar direto?{" "}
              <a href={linkWa} target="_blank" rel="noopener" className="font-semibold text-ouro underline-offset-4 hover:underline">
                Abra o WhatsApp sem preencher nada
              </a>
              .
            </p>
          </div>
        </div>
      </Secao>

      {/* ---------- mapa (cartão-link, sem iframe) ---------- */}
      <section className="pb-20 sm:pb-24" aria-labelledby="mapa-titulo">
        <div className="container-pagina">
          <div ref={refMapa} data-reveal>
            <a
              href={mapa}
              target="_blank"
              rel="noopener"
              className="cartao group relative block min-h-[18rem] overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-ouro/40 hover:shadow-cartao sm:min-h-[22rem]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 z-0 bg-[radial-gradient(55%_70%_at_70%_50%,rgba(212,178,76,.16),transparent_70%)]"
              />
              <svg
                aria-hidden="true"
                className="absolute inset-0 z-[1] h-full w-full"
                viewBox="0 0 800 400"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
              >
                <defs>
                  <pattern id={`${idPadrao}-grade`} width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M40 0H0V40" fill="none" stroke="rgba(212,178,76,.10)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="800" height="400" fill={`url(#${idPadrao}-grade)`} />
                <path d="M0 250C200 230 350 300 800 210" stroke="rgba(212,178,76,.35)" strokeWidth="7" fill="none" strokeLinecap="round" />
                <path d="M520 0C560 150 480 260 540 400" stroke="rgba(245,239,224,.14)" strokeWidth="4" fill="none" />
                <path d="M0 120L800 90" stroke="rgba(245,239,224,.10)" strokeWidth="3" />
                <path d="M300 0L340 400" stroke="rgba(245,239,224,.08)" strokeWidth="2" />
                <circle cx="560" cy="230" r="46" fill="none" stroke="rgba(212,178,76,.25)" />
                <circle cx="560" cy="230" r="22" fill="none" stroke="rgba(212,178,76,.4)" />
                <circle cx="560" cy="230" r="7" fill="#d4b24c" />
              </svg>
              <div className="relative z-[4] flex min-h-[18rem] flex-col justify-between p-6 sm:min-h-[22rem] sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Selo tom="ouro">Google Maps</Selo>
                  <span className="text-[0.66rem] uppercase tracking-[0.16em] text-cinza-escuro">mapa ilustrativo · o link abre a localização real</span>
                </div>
                <div className="max-w-md">
                  <span className="relative mb-4 grid size-12 place-items-center rounded-full bg-ouro text-preto">
                    <span aria-hidden="true" className="absolute inset-0 rounded-full bg-ouro/50 animate-anel" />
                    <Icone nome="mapa" tamanho={22} className="relative" />
                  </span>
                  <p id="mapa-titulo" className="font-display text-xl font-bold sm:text-2xl">
                    iMagicPhone — Sumaré, Caraguatatuba
                  </p>
                  <p className="mt-2 break-words text-sm text-cinza">
                    {config.endereco}
                    <br />
                    {config.enderecoComplemento}
                  </p>
                  <span className="botao-contorno mt-5 text-sm transition-colors group-hover:border-ouro group-hover:bg-ouro group-hover:text-preto">
                    Abrir no Google Maps
                    <Icone nome="externo" tamanho={16} />
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
