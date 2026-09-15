/**
 * Chamada final — bloco grande `cartao-ouro` com o mote da bio
 * ("iPhone é na iMagicPhone."), WhatsApp magnético, endereço com `linkMapa`
 * e um "mapa" desenhado em SVG que é um link (sem iframe de terceiro).
 */
import { CONFIGURE_ME, negocio } from "@/dados/negocio";
import { useLoja } from "@/estado/loja";
import { wa, linkMapa } from "@/lib/links";
import { usarReveal } from "@/lib/movimento";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";

function MapaDesenhado() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="mapa-luz" cx="0.55" cy="0.5" r="0.6">
          <stop offset="0" stopColor="rgba(212,178,76,.22)" />
          <stop offset="1" stopColor="rgba(212,178,76,0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="#0d0d0f" />
      <rect width="400" height="300" fill="url(#mapa-luz)" />
      {/* quarteirões */}
      <g stroke="rgba(255,255,255,.07)" strokeWidth="1">
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300" />
        ))}
        {[40, 80, 120, 160, 200, 240, 280].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} />
        ))}
      </g>
      {/* avenidas */}
      <g stroke="rgba(255,255,255,.16)" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M-10 190 C 90 170, 200 200, 410 150" />
        <path d="M230 -10 C 220 90, 250 190, 210 310" />
      </g>
      <path d="M-10 190 C 90 170, 200 200, 410 150" stroke="rgba(212,178,76,.35)" strokeWidth="2" fill="none" strokeDasharray="6 10" />
      {/* mar (litoral) */}
      <path d="M0 250 C 80 235, 160 265, 240 250 S 360 235, 400 250 L400 300 L0 300 Z" fill="rgba(212,178,76,.06)" />
      {/* pino */}
      <g transform="translate(222 150)">
        <circle r="26" fill="rgba(212,178,76,.12)" />
        <circle r="14" fill="rgba(212,178,76,.22)" />
        <path d="M0 10 C -10 -2, -10 -14, 0 -14 C 10 -14, 10 -2, 0 10 Z" fill="#d4b24c" />
        <circle cy="-6" r="3.5" fill="#050505" />
      </g>
    </svg>
  );
}

export default function ChamadaFinal() {
  const config = useLoja((s) => s.config);
  const refBloco = usarReveal<HTMLDivElement>({ y: 30 });
  const refConteudo = usarReveal<HTMLDivElement>({ stagger: 0.1, y: 24, delay: 0.15 });

  const enderecoCompleto = [config.endereco, config.enderecoComplemento].filter((t) => t && t !== CONFIGURE_ME).join(" · ");
  const mapa = linkMapa(enderecoCompleto || negocio.endereco);
  const temHorario = Boolean(config.horario) && config.horario !== CONFIGURE_ME;
  const linkZap = wa.padrao(config.whatsappNumero, config.whatsappLink);
  const [linhaEndereco, bairroCidade] = (config.endereco !== CONFIGURE_ME ? config.endereco : negocio.endereco).split(" — ");

  return (
    <section id="chamada-final" aria-labelledby="chamada-final-titulo" className="py-20 sm:py-28">
      <div className="container-pagina">
        <div ref={refBloco} data-reveal className="cartao-ouro grao relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-24">
          {/* luz (z 0) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(60%_60%_at_20%_0%,rgba(212,178,76,.22),transparent_70%)]" />
          <div aria-hidden="true" className="filete-ouro absolute inset-x-0 top-0 z-0" />

          <div ref={refConteudo} data-reveal className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-16">
            {/* copy + ações */}
            <div>
              <p className="rotulo">
                <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
                {negocio.heroi.rotulo}
              </p>
              <h2 id="chamada-final-titulo" className="texto-display mt-4 text-4xl sm:text-6xl lg:text-7xl">
                <span className="texto-ouro">iPhone</span> é na iMagicPhone.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-cinza sm:text-lg">
                Garantia e nota fiscal, loja física em Caraguá e entrega no Litoral Norte. Chame no WhatsApp e a loja resolve com você.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Botao variante="wa" href={linkZap} icone="whatsapp" tamanho="lg" magnetico>
                  {negocio.heroi.ctaPrimario}
                </Botao>
                <Botao variante="contorno" para="/iphones" tamanho="lg" iconeDepois="seta">
                  {negocio.heroi.ctaSecundario}
                </Botao>
              </div>

              <address className="mt-10 grid gap-4 not-italic sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-ouro/30 bg-ouro/10 text-ouro" aria-hidden="true">
                    <Icone nome="mapa" tamanho={16} />
                  </span>
                  <div className="text-sm leading-relaxed">
                    <p className="font-semibold text-marfim">{linhaEndereco}</p>
                    {bairroCidade && <p className="text-cinza">{bairroCidade}</p>}
                    {config.enderecoComplemento && config.enderecoComplemento !== CONFIGURE_ME && <p className="text-cinza">{config.enderecoComplemento}</p>}
                    <a href={mapa} target="_blank" rel="noopener" className="mt-1.5 inline-flex min-h-11 items-center gap-1 font-semibold text-ouro underline-offset-4 hover:underline">
                      Abrir no Google Maps <Icone nome="externo" tamanho={14} />
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-ouro/30 bg-ouro/10 text-ouro" aria-hidden="true">
                    <Icone nome={temHorario ? "relogio" : "entrega"} tamanho={16} />
                  </span>
                  <div className="text-sm leading-relaxed">
                    {temHorario ? (
                      <>
                        <p className="font-semibold text-marfim">Horário</p>
                        <p className="text-cinza">{config.horario}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-marfim">Visita e entrega</p>
                        <p className="text-cinza">Combine o horário da visita pelo WhatsApp.</p>
                      </>
                    )}
                    <p className="mt-1 text-cinza">{config.entregaTexto}</p>
                  </div>
                </div>
              </address>
            </div>

            {/* mapa como link (sem iframe) */}
            <a
              href={mapa}
              target="_blank"
              rel="noopener"
              aria-label={`Abrir o endereço da loja no Google Maps: ${enderecoCompleto || negocio.endereco}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-cartao)] border border-linha-ouro shadow-cartao transition-[border-color] duration-300 hover:border-ouro lg:aspect-square"
            >
              <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                <MapaDesenhado />
              </div>
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-preto/90 to-transparent p-5 pt-16 sm:p-6">
                <p className="rotulo !text-[0.62rem]">Loja física</p>
                <p className="texto-display mt-1 text-lg text-marfim sm:text-xl">{linhaEndereco}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-ouro">
                  Ver rota no Google Maps <Icone nome="externo" tamanho={14} />
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
