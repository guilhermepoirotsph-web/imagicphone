/**
 * Casca do painel: guarda de sessão, menu lateral (desktop) / barra inferior
 * (mobile), topo com usuário e papel, faixa de demonstração com "Resetar demo".
 * Vendedor não vê Equipe nem Configurações (o menu esconde E a rota bloqueia).
 */
import { useEffect } from "react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "@/componentes/marca/Logo";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";
import { useLoja, selUsuarioAtual, ROTULO_PAPEL } from "@/estado/loja";
import type { Papel } from "@/dados/tipos";

export const MENU: { para: string; rotulo: string; icone: NomeIcone; papeis?: Papel[] }[] = [
  { para: "/painel", rotulo: "Início", icone: "painel" },
  { para: "/painel/produtos", rotulo: "Produtos", icone: "caixa" },
  { para: "/painel/pedidos", rotulo: "Pedidos", icone: "pedidos" },
  { para: "/painel/clientes", rotulo: "Clientes", icone: "clientes" },
  { para: "/painel/vitrine", rotulo: "Vitrine", icone: "vitrine" },
  { para: "/painel/vip", rotulo: "Grupo VIP", icone: "vip" },
  { para: "/painel/equipe", rotulo: "Equipe", icone: "equipe", papeis: ["dono", "suporte"] },
  { para: "/painel/configuracoes", rotulo: "Configurações", icone: "config", papeis: ["dono", "suporte"] },
  { para: "/painel/tutorial", rotulo: "Tutorial", icone: "ajuda" },
];

export function podeVer(item: { papeis?: Papel[] }, papel?: Papel | null): boolean {
  return !item.papeis || (Boolean(papel) && item.papeis.includes(papel as Papel));
}

export default function CascaPainel() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const sessao = useLoja((s) => s.sessao);
  const usuario = useLoja(selUsuarioAtual);
  const sair = useLoja((s) => s.sair);
  const resetarDemo = useLoja((s) => s.resetarDemo);
  const naEntrada = pathname.replace(/\/$/, "") === "/painel/entrar";

  useEffect(() => {
    document.documentElement.classList.add("painel");
    return () => document.documentElement.classList.remove("painel");
  }, []);

  if (naEntrada) {
    if (sessao) return <Navigate to="/painel" replace />;
    return <Outlet />;
  }
  if (!sessao || !usuario) return <Navigate to="/painel/entrar" replace />;

  const itens = MENU.filter((m) => podeVer(m, usuario.papel));

  return (
    <div className="min-h-svh bg-carvao text-tinta">
      <div className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center gap-3 border-b border-aviso/30 bg-aviso/10 px-3 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-aviso">
        <span className="truncate">Demonstração — dados fictícios</span>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Resetar a demonstração? Isso apaga o que foi editado e volta aos dados de exemplo.")) {
              resetarDemo();
              navigate("/painel/entrar");
            }
          }}
          className="rounded-full border border-aviso/40 px-2.5 py-0.5 hover:bg-aviso/15"
        >
          Resetar demo
        </button>
      </div>

      <aside className="fixed inset-y-0 left-0 top-8 z-40 hidden w-60 flex-col border-r border-linha bg-preto/60 lg:flex">
        <div className="flex h-16 items-center border-b border-linha px-5">
          <Logo altura={28} />
        </div>
        <nav aria-label="Menu do painel" className="flex-1 overflow-y-auto p-3">
          {itens.map((m) => (
            <NavLink
              key={m.para}
              to={m.para}
              end={m.para === "/painel"}
              className={({ isActive }) => `mb-0.5 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${isActive ? "bg-ouro/12 text-ouro" : "text-cinza hover:bg-white/5 hover:text-tinta"}`}
            >
              <Icone nome={m.icone} tamanho={18} />
              {m.rotulo}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-linha p-3 text-xs text-cinza">
          <a href="/" className="flex min-h-10 items-center gap-2 rounded-xl px-3 hover:bg-white/5 hover:text-tinta"><Icone nome="externo" tamanho={16} />Ver loja</a>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-8 z-40 flex h-16 items-center justify-between gap-3 border-b border-linha bg-carvao/90 px-4 backdrop-blur-md lg:left-60 lg:px-6">
        <div className="flex items-center gap-3 lg:hidden"><Logo altura={26} /></div>
        <div className="hidden text-sm text-cinza lg:block">Painel da loja</div>
        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight">{usuario.nome}</p>
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-ouro">{ROTULO_PAPEL[usuario.papel]}</p>
          </div>
          <a href="/" className="botao-contorno !min-h-10 !px-3 text-xs lg:hidden" aria-label="Ver loja"><Icone nome="externo" tamanho={16} /></a>
          <button type="button" onClick={() => { sair(); navigate("/painel/entrar"); }} className="botao-contorno !min-h-10 !px-3 text-xs">
            <Icone nome="sair" tamanho={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main id="conteudo" className="px-4 pb-28 pt-28 sm:px-6 lg:ml-60 lg:pb-12 lg:pl-8 lg:pr-8">
        <Outlet />
      </main>

      <nav aria-label="Menu do painel" className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-linha bg-preto/95 px-1 py-1.5 backdrop-blur-md lg:hidden">
        {itens.slice(0, 5).map((m) => (
          <NavLink
            key={m.para}
            to={m.para}
            end={m.para === "/painel"}
            className={({ isActive }) => `flex min-h-12 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[0.6rem] font-bold uppercase tracking-wider ${isActive ? "text-ouro" : "text-cinza"}`}
          >
            <Icone nome={m.icone} tamanho={18} />
            {m.rotulo}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
