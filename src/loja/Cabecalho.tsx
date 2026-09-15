/**
 * Cabeçalho fixo: transparente no topo, sólido depois de rolar. Nav desktop,
 * busca, carrinho (abre a gaveta), CTA WhatsApp e menu mobile em tela cheia
 * (dialog com foco preso, Esc fecha, fundo inerte).
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "@/componentes/marca/Logo";
import Icone from "@/componentes/ui/Icones";
import { useLoja } from "@/estado/loja";
import { useCarrinho, usarLinhasCarrinho } from "@/estado/carrinho";
import { wa } from "@/lib/links";

const NAV = [
  { para: "/", rotulo: "Início" },
  { para: "/iphones", rotulo: "iPhones" },
  { para: "/seminovos", rotulo: "Seminovos" },
  { para: "/apple", rotulo: "Apple" },
  { para: "/acessorios", rotulo: "Acessórios" },
  { para: "/ofertas", rotulo: "Ofertas" },
  { para: "/grupo-vip", rotulo: "Grupo VIP" },
  { para: "/contato", rotulo: "Contato" },
];

export default function Cabecalho() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const config = useLoja((s) => s.config);
  const abrirCarrinho = useCarrinho((s) => s.abrir);
  const { quantidade } = usarLinhasCarrinho();
  const [solido, setSolido] = useState(false);
  const [menu, setMenu] = useState(false);
  const [busca, setBusca] = useState(false);
  const [termo, setTermo] = useState("");
  const refMenu = useRef<HTMLDivElement>(null);
  const refBurger = useRef<HTMLButtonElement>(null);
  const refBusca = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const aoRolar = () => setSolido(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    setMenu(false);
    setBusca(false);
  }, [pathname]);

  useEffect(() => {
    if (busca) refBusca.current?.focus();
  }, [busca]);

  // menu mobile: trava scroll, fundo inerte, foco preso, Esc fecha
  useEffect(() => {
    const fundo = document.querySelectorAll<HTMLElement>("#conteudo, footer, [data-fixed-top] > :not(#menu-mobile)");
    document.body.style.overflow = menu ? "hidden" : "";
    fundo.forEach((el) => (menu ? el.setAttribute("inert", "") : el.removeAttribute("inert")));
    if (!menu) return;
    const caixa = refMenu.current;
    caixa?.querySelector<HTMLElement>("a, button")?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        refBurger.current?.focus();
      }
      if (e.key === "Tab" && caixa) {
        const f = caixa.querySelectorAll<HTMLElement>("a, button");
        const primeiro = f[0];
        const ultimo = f[f.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
      fundo.forEach((el) => el.removeAttribute("inert"));
    };
  }, [menu]);

  function buscar(e: FormEvent) {
    e.preventDefault();
    const q = termo.trim();
    navigate(q ? `/produtos?q=${encodeURIComponent(q)}` : "/produtos");
    setBusca(false);
  }

  const linkWa = wa.padrao(config.whatsappNumero, config.whatsappLink);

  return (
    <>
      <header
        className={`h-16 border-b transition-colors duration-300 ${
          solido || menu || busca ? "border-linha bg-preto/90 backdrop-blur-md" : "border-transparent bg-transparent"
        }`}
      >
        <div className="container-pagina flex h-full items-center justify-between gap-3">
          <Link to="/" aria-label="iMagicPhone — início" className="shrink-0">
            <Logo altura={30} />
          </Link>

          <nav aria-label="Navegação principal" className="hidden items-center gap-5 xl:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.para}
                to={item.para}
                end={item.para === "/"}
                className={({ isActive }) =>
                  `text-[0.83rem] font-semibold tracking-wide transition-colors hover:text-ouro ${isActive ? "text-ouro" : "text-cinza"}`
                }
              >
                {item.rotulo}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {busca ? (
              <form onSubmit={buscar} role="search" className="flex items-center gap-1">
                <label htmlFor="busca-topo" className="sr-only">
                  Buscar produtos
                </label>
                <input
                  id="busca-topo"
                  ref={refBusca}
                  value={termo}
                  onChange={(e) => setTermo(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setBusca(false)}
                  placeholder="Buscar iPhone, cor, GB…"
                  className="campo !min-h-11 w-40 sm:w-56"
                />
                <button type="submit" aria-label="Buscar" className="grid size-11 place-items-center rounded-full border border-linha-forte text-tinta hover:border-ouro hover:text-ouro">
                  <Icone nome="busca" tamanho={18} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setBusca(true)}
                aria-label="Abrir busca"
                className="grid size-11 place-items-center rounded-full border border-linha-forte text-tinta transition-colors hover:border-ouro hover:text-ouro"
              >
                <Icone nome="busca" tamanho={18} />
              </button>
            )}

            <button
              type="button"
              onClick={abrirCarrinho}
              aria-label={`Carrinho${quantidade ? `, ${quantidade} ${quantidade === 1 ? "item" : "itens"}` : ", vazio"}`}
              className="relative grid size-11 place-items-center rounded-full border border-linha-forte text-tinta transition-colors hover:border-ouro hover:text-ouro"
            >
              <Icone nome="carrinho" tamanho={19} />
              {quantidade > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-ouro px-1 text-[0.62rem] font-extrabold text-preto">
                  {quantidade}
                </span>
              )}
            </button>

            <a href={linkWa} target="_blank" rel="noopener" className="botao-wa !min-h-11 hidden !px-4 text-sm md:inline-flex">
              <Icone nome="whatsapp" tamanho={18} />
              WhatsApp
            </a>

            <button
              ref={refBurger}
              type="button"
              onClick={() => setMenu((v) => !v)}
              aria-expanded={menu}
              aria-controls="menu-mobile"
              aria-label={menu ? "Fechar menu" : "Abrir menu"}
              className="grid size-11 place-items-center rounded-full border border-linha-forte text-tinta xl:hidden"
            >
              <Icone nome={menu ? "fechar" : "menu"} tamanho={20} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-mobile"
        ref={refMenu}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!menu}
        className={`fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-preto/[.97] px-6 pb-10 pt-6 transition-opacity duration-300 xl:hidden ${
          menu ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo altura={30} />
          <button
            type="button"
            onClick={() => setMenu(false)}
            aria-label="Fechar menu"
            className="grid size-11 place-items-center rounded-full border border-linha-forte text-tinta"
          >
            <Icone nome="fechar" tamanho={20} />
          </button>
        </div>
        <nav aria-label="Menu" className="mt-10 grid gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.para}
              to={item.para}
              end={item.para === "/"}
              className={({ isActive }) => `texto-display py-2 text-3xl transition-colors hover:text-ouro ${isActive ? "text-ouro" : "text-tinta"}`}
            >
              {item.rotulo}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto grid gap-3 pt-10">
          <a href={linkWa} target="_blank" rel="noopener" className="botao-wa">
            <Icone nome="whatsapp" tamanho={18} />
            Falar no WhatsApp
          </a>
          <a href={config.instagram} target="_blank" rel="noopener" className="botao-contorno">
            <Icone nome="instagram" tamanho={18} />
            @imagicphone
          </a>
          <Link to="/painel" className="py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-cinza-escuro hover:text-ouro">
            Painel da loja
          </Link>
        </div>
      </div>
    </>
  );
}
