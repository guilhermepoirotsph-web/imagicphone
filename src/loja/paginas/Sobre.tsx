/**
 * Sobre — página institucional. Regra da casa: só o que está verificado no
 * perfil público (bio, destaques, endereço, seguidores). O que a loja ainda
 * não divulgou (horário, CNPJ) aparece como lacuna honesta — nunca inventado.
 */
import { useEffect } from "react";
import { negocio, CONFIGURE_ME } from "@/dados/negocio";
import { useLoja } from "@/estado/loja";
import { wa, linkMapa } from "@/lib/links";
import { usarReveal, usarTituloSplit } from "@/lib/movimento";
import { MarcaMaca } from "@/componentes/marca/Logo";
import Botao from "@/componentes/ui/Botao";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";
import Selo from "@/componentes/ui/Selo";
import Secao from "@/componentes/ui/Secao";

interface Pilar {
  icone: NomeIcone;
  titulo: string;
  texto: string;
  fonte: string;
}

const PROVAS: { icone: NomeIcone; texto: string }[] = [
  { icone: "instagram", texto: negocio.provaSocial.seguidoresTexto },
  { icone: "estrela", texto: `${negocio.provaSocial.destaquesClientes} destaques de clientes` },
  { icone: "escudo", texto: "Garantia e NF" },
  { icone: "loja", texto: "Loja física em Caraguá" },
];

/** "A, B, C e D" */
function listarCidades(cidades: readonly string[]): string {
  if (cidades.length <= 1) return cidades.join("");
  return `${cidades.slice(0, -1).join(", ")} e ${cidades[cidades.length - 1]}`;
}

export default function Sobre() {
  const config = useLoja((s) => s.config);
  const refTitulo = usarTituloSplit<HTMLHeadingElement>();
  const refIntro = usarReveal<HTMLDivElement>({ y: 24, delay: 0.15 });
  const refBio = usarReveal<HTMLElement>({ y: 30, delay: 0.3 });
  const refPilares = usarReveal<HTMLDivElement>({ stagger: 0.1 });
  const refChips = usarReveal<HTMLUListElement>({ stagger: 0.06, y: 18 });
  const refCta = usarReveal<HTMLDivElement>({ y: 30 });

  useEffect(() => {
    document.title = "Sobre — iMagicPhone";
  }, []);

  const linkWa = wa.padrao(config.whatsappNumero, config.whatsappLink);
  const mapa = linkMapa(`${config.endereco} — ${config.enderecoComplemento}`);

  const pilares: Pilar[] = [
    {
      icone: "escudo",
      titulo: "Garantia e nota fiscal",
      texto: "Todo iPhone sai com garantia e nota fiscal. Os novos vão lacrados, com 1 ano de garantia.",
      fonte: "bio e posts do perfil",
    },
    {
      icone: "loja",
      titulo: "Loja física em Caraguá",
      texto: `Atendimento presencial no Sumaré, em Caraguatatuba: ${config.enderecoComplemento}.`,
      fonte: "post “Nosso endereço” (28/04/2026)",
    },
    {
      icone: "entrega",
      titulo: "Entrega no Litoral Norte",
      texto: `Receba em ${listarCidades(config.cidadesEntrega)}.`,
      fonte: "bio do perfil",
    },
  ];

  const pendentes: string[] = [];
  if (!config.horario || config.horario === CONFIGURE_ME) pendentes.push("horário de atendimento");
  if (negocio.cnpj === CONFIGURE_ME) pendentes.push("CNPJ e razão social");

  return (
    <div data-pagina="Sobre">
      {/* ---------- hero interno ---------- */}
      <section className="grao relative overflow-hidden" aria-labelledby="sobre-titulo">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,178,76,.14),transparent_70%)]"
        />
        <div aria-hidden="true" className="filete-ouro absolute inset-x-0 top-0 z-[1]" />
        <div className="container-pagina relative z-[4] pb-16 pt-14 sm:pb-20 sm:pt-20 lg:grid lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-16">
          <div>
            <p className="rotulo">
              <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
              Sobre a iMagicPhone
            </p>
            <h1 id="sobre-titulo" ref={refTitulo} className="texto-display mt-4 text-4xl sm:text-5xl lg:text-6xl">
              Sua referência Apple no litoral.
            </h1>
            <div ref={refIntro} data-reveal>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-cinza sm:text-lg">
                A iMagicPhone vende iPhones novos e seminovos com garantia e nota fiscal. A loja física fica no Sumaré, em
                Caraguatatuba, e a entrega cobre o Litoral Norte. No Instagram são {negocio.provaSocial.seguidoresTexto},{" "}
                {negocio.provaSocial.destaquesClientes} destaques só de clientes e as chegadas das versões americanas 🇺🇸 do
                iPhone 16 e do iPhone 17.
              </p>
              <a
                href={mapa}
                target="_blank"
                rel="noopener"
                className="mt-5 inline-flex min-h-11 max-w-full items-start gap-2 text-sm text-marfim transition-colors hover:text-ouro"
              >
                <Icone nome="mapa" tamanho={18} className="mt-0.5 text-ouro" />
                <span className="break-words">
                  {config.endereco}
                  <span className="text-cinza"> · {config.enderecoComplemento}</span>
                </span>
              </a>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="O que é verificável no perfil">
                {PROVAS.map((p) => (
                  <li
                    key={p.texto}
                    className="inline-flex min-h-9 items-center gap-2 rounded-full border border-linha bg-white/[.03] px-3.5 text-xs font-semibold text-marfim"
                  >
                    <Icone nome={p.icone} tamanho={14} className="text-ouro" />
                    {p.texto}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Botao variante="wa" href={linkWa} icone="whatsapp" magnetico>
                  Falar no WhatsApp
                </Botao>
                <Botao variante="contorno" href={config.instagram} icone="instagram">
                  {negocio.instagramHandle}
                </Botao>
              </div>
            </div>
          </div>

          <aside ref={refBio} data-reveal className="cartao-ouro relative mt-12 p-6 sm:p-8 lg:mt-0" aria-labelledby="bio-titulo">
            <div className="flex items-center gap-4">
              <MarcaMaca tamanho={56} />
              <div className="min-w-0">
                <p id="bio-titulo" className="font-display text-lg font-bold">
                  {negocio.instagramHandle}
                </p>
                <p className="truncate text-xs text-cinza">{negocio.nomeCompleto}</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {negocio.bio.map((linha) => (
                <li key={linha} className="flex items-start gap-3 text-sm sm:text-base">
                  <Icone nome="check" tamanho={18} className="mt-0.5 text-ouro" />
                  <span>{linha}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cinza-escuro">
              Bio do perfil verificada em 14/09/2026
            </p>
          </aside>
        </div>
      </section>

      {/* ---------- pilares ---------- */}
      <Secao
        id="pilares"
        rotulo="O que a loja garante"
        titulo="Três compromissos publicados pela própria loja."
        descricao="Nada aqui é promessa nossa: é o que a iMagicPhone divulga na bio e nos posts do perfil oficial."
        className="border-t border-linha"
      >
        <div ref={refPilares} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {pilares.map((p) => (
            <article
              key={p.titulo}
              className="cartao relative overflow-hidden p-6 transition-[border-color,box-shadow] duration-300 hover:border-ouro/40 hover:shadow-cartao sm:p-7"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[radial-gradient(circle,rgba(212,178,76,.16),transparent_65%)]"
              />
              <div className="grid size-12 place-items-center rounded-full bg-ouro/12 text-ouro">
                <Icone nome={p.icone} tamanho={22} />
              </div>
              <h3 className="font-display mt-5 text-lg font-bold">{p.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cinza">{p.texto}</p>
              <p className="mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-cinza-escuro">Fonte: {p.fonte}</p>
            </article>
          ))}
        </div>
      </Secao>

      {/* ---------- como a loja se comunica ---------- */}
      <Secao
        id="comunicacao"
        rotulo="No Instagram"
        titulo="Como a loja se comunica"
        descricao={`Os cinco destaques fixos do perfil ${negocio.instagramHandle} mostram o que a iMagicPhone publica no dia a dia: o estoque do momento, os clientes atendidos, as chegadas das versões americanas e o Grupo VIP.`}
        className="border-t border-linha bg-[radial-gradient(50%_40%_at_50%_100%,rgba(212,178,76,.08),transparent_70%)]"
      >
        <ul ref={refChips} className="flex flex-wrap gap-2.5" aria-label="Destaques do perfil">
          {negocio.destaques.map((d) => (
            <li key={d}>
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-linha-ouro bg-ouro/8 px-4 text-sm font-semibold text-marfim transition-colors hover:bg-ouro/15"
              >
                <Icone nome="instagram" tamanho={16} className="text-ouro" />
                {d}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
          <div className="cartao p-6">
            <p className="font-display text-3xl font-extrabold text-marfim">{negocio.provaSocial.seguidores.toLocaleString("pt-BR")}</p>
            <p className="mt-1 text-sm text-cinza">seguidores no Instagram (contagem pública em 14/09/2026)</p>
          </div>
          <div className="cartao p-6">
            <p className="font-display text-3xl font-extrabold text-marfim">{negocio.provaSocial.destaquesClientes}</p>
            <p className="mt-1 text-sm text-cinza">destaques “Clientes” no perfil — entregas e feedbacks reais ficam lá</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Botao variante="contorno" href={config.instagram} icone="instagram" iconeDepois="externo">
            Ver os destaques no Instagram
          </Botao>
        </div>
      </Secao>

      {/* ---------- chamada + lacunas honestas ---------- */}
      <section className="border-t border-linha py-20 sm:py-24" aria-labelledby="sobre-cta-titulo">
        <div className="container-pagina">
          <div ref={refCta} data-reveal className="cartao-ouro relative overflow-hidden p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(50%_60%_at_100%_0%,rgba(212,178,76,.18),transparent_70%)]"
            />
            <div className="relative z-[4] max-w-xl">
              <p className="rotulo">
                <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
                Fale com a loja
              </p>
              <h2 id="sobre-cta-titulo" className="texto-display mt-3 text-3xl sm:text-4xl">
                iPhone é na iMagicPhone.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cinza sm:text-base">
                Atendimento pelo WhatsApp, loja física no Sumaré e entrega no Litoral Norte. Pergunte disponibilidade, peça
                fotos ou combine a visita.
              </p>
            </div>
            <div className="relative z-[4] mt-6 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0 lg:flex-col">
              <Botao variante="wa" href={linkWa} icone="whatsapp" tamanho="lg" magnetico>
                Falar no WhatsApp
              </Botao>
              <Botao variante="contorno" href={mapa} icone="mapa" tamanho="lg">
                Como chegar
              </Botao>
            </div>
          </div>

          {pendentes.length > 0 && (
            <div className="mt-6 flex flex-wrap items-start gap-x-3 gap-y-2 text-xs leading-relaxed text-cinza">
              <Selo tom="aviso">a confirmar com a loja</Selo>
              <p className="max-w-2xl">
                Ainda não divulgados publicamente: {pendentes.join(" e ")}. Serão preenchidos com a iMagicPhone antes da
                publicação — nada nesta página foi inventado.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
