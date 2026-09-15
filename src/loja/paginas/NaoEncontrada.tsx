/**
 * 404 — página não encontrada. Busca que leva ao catálogo (`/produtos?q=`),
 * atalhos para as rotas principais e WhatsApp. Também é renderizada pelo
 * construtor CATÁLOGO quando o slug de produto não existe.
 */
import { useEffect, useId, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoja } from "@/estado/loja";
import { wa } from "@/lib/links";
import { usarReveal } from "@/lib/movimento";
import { MarcaMaca } from "@/componentes/marca/Logo";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";

const ATALHOS: { rotulo: string; para: string }[] = [
  { rotulo: "iPhones", para: "/iphones" },
  { rotulo: "Seminovos", para: "/seminovos" },
  { rotulo: "Ofertas", para: "/ofertas" },
];

export default function NaoEncontrada() {
  const config = useLoja((s) => s.config);
  const navigate = useNavigate();
  const refConteudo = usarReveal<HTMLDivElement>({ y: 24 });
  const idBusca = `${useId().replace(/:/g, "")}-busca`;
  const [busca, setBusca] = useState("");

  useEffect(() => {
    document.title = "Página não encontrada — iMagicPhone";
  }, []);

  const buscar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = busca.trim();
    navigate(q ? `/produtos?q=${encodeURIComponent(q)}` : "/produtos");
  };

  const linkWa = wa.padrao(config.whatsappNumero, config.whatsappLink);

  return (
    <div data-pagina="NaoEncontrada" className="grao relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,178,76,.14),transparent_70%)]"
      />
      <div aria-hidden="true" className="filete-ouro absolute inset-x-0 top-0 z-[1]" />
      <div className="container-pagina relative z-[4] flex min-h-[70svh] flex-col items-center justify-center py-20 text-center sm:py-28">
        <div ref={refConteudo} data-reveal className="flex w-full max-w-2xl flex-col items-center">
          <div className="relative">
            <p aria-hidden="true" className="texto-display texto-ouro select-none text-[clamp(5.5rem,22vw,11rem)] leading-none">
              404
            </p>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25" aria-hidden="true">
              <MarcaMaca tamanho={96} />
            </span>
          </div>
          <p className="rotulo mt-2 justify-center">
            <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
            Erro 404
          </p>
          <h1 className="texto-display mt-4 text-3xl sm:text-4xl lg:text-5xl">Página não encontrada</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-cinza sm:text-lg">
            O endereço pode ter mudado ou o produto saiu do catálogo. Procure o que você queria ou use um dos atalhos.
          </p>

          <form role="search" onSubmit={buscar} className="mt-8 w-full max-w-md">
            <label htmlFor={idBusca} className="sr-only">
              Buscar produto
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Icone nome="busca" tamanho={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinza" />
                <input
                  id={idBusca}
                  type="search"
                  className="campo !min-h-13 pl-12"
                  placeholder="Ex.: iPhone 17 256 GB"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  autoComplete="off"
                  enterKeyHint="search"
                />
              </div>
              <Botao type="submit" variante="ouro" icone="seta" aria-label="Buscar no catálogo" className="!min-h-13 !px-5">
                <span className="sr-only sm:not-sr-only">Buscar</span>
              </Botao>
            </div>
          </form>

          <nav aria-label="Atalhos" className="mt-8 flex flex-wrap justify-center gap-2.5">
            {ATALHOS.map((a) => (
              <Link
                key={a.para}
                to={a.para}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-linha-forte bg-white/[.04] px-5 text-sm font-semibold transition-colors hover:border-ouro hover:bg-ouro/10"
              >
                {a.rotulo}
                <Icone nome="chevron" tamanho={14} className="text-ouro" />
              </Link>
            ))}
            <a
              href={linkWa}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-wa/40 bg-wa/10 px-5 text-sm font-semibold text-tinta transition-colors hover:bg-wa/20"
            >
              <Icone nome="whatsapp" tamanho={16} className="text-wa" />
              WhatsApp
            </a>
          </nav>

          <Link to="/" className="mt-10 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cinza transition-colors hover:text-ouro">
            <Icone nome="setaEsq" tamanho={16} />
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
