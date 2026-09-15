/**
 * Instagram — 6 "posts" TIPOGRÁFICOS (sem foto de terceiro) com os temas reais
 * dos posts/destaques do perfil: pré-venda iPhone 18 Pro, Nosso endereço,
 * iPhone 17 🇺🇸, iPhone 16 🇺🇸, Grupo VIP e Clientes. Todos linkam para o perfil.
 * Hover com tilt 3D (usarTilt) e holofote dourado seguindo o cursor.
 */
import { negocio } from "@/dados/negocio";
import { useLoja } from "@/estado/loja";
import { moeda } from "@/lib/formatar";
import { usarReveal, usarTilt } from "@/lib/movimento";
import Secao from "@/componentes/ui/Secao";
import Botao from "@/componentes/ui/Botao";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";

interface Post {
  id: string;
  rotulo: string;
  titulo: string;
  linha: string;
  icone: NomeIcone;
  destaque?: boolean;
}

function montarPosts(): Post[] {
  const pv = negocio.preVendaAtual;
  return [
    {
      id: "prevenda",
      rotulo: "Pré-venda",
      titulo: `${pv.modelo}`,
      linha: `${moeda(pv.preco)} no ${pv.armazenamento} GB · sinal de ${pv.sinalPercentual}% · entrega ${pv.entregaPrevista}`,
      icone: "brilho",
      destaque: true,
    },
    {
      id: "endereco",
      rotulo: "Nosso endereço",
      titulo: "Sumaré, Caraguatatuba",
      linha: `${negocio.endereco.split(" — ")[0]} · ${negocio.enderecoComplemento}`,
      icone: "mapa",
    },
    {
      id: "iphone17",
      rotulo: "Chegada",
      titulo: "iPhone 17 🇺🇸",
      linha: "Versão americana (eSIM), lacrado, com nota fiscal e 1 ano de garantia",
      icone: "apple",
    },
    {
      id: "iphone16",
      rotulo: "Chegada",
      titulo: "iPhone 16 🇺🇸",
      linha: "Versão americana (eSIM) — destaque do perfil, pergunte a disponibilidade",
      icone: "apple",
    },
    {
      id: "vip",
      rotulo: "Grupo VIP",
      titulo: "Ofertas antes de todo mundo",
      linha: "Chegadas, pré-vendas e ofertas primeiro no WhatsApp",
      icone: "vip",
      destaque: true,
    },
    {
      id: "clientes",
      rotulo: "Clientes",
      titulo: `${negocio.provaSocial.destaquesClientes} destaques de clientes`,
      linha: "Fotos e mensagens reais de quem já comprou, direto no perfil",
      icone: "coracao",
    },
  ];
}

function CartaoPost({ post, href }: { post: Post; href: string }) {
  const ref = usarTilt<HTMLAnchorElement>(7);
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={`${post.rotulo}: ${post.titulo} — abrir o perfil ${negocio.instagramHandle} no Instagram`}
      className={`group relative flex aspect-square flex-col justify-between overflow-hidden p-5 sm:p-6 lg:p-7 ${post.destaque ? "cartao-ouro" : "cartao"} transition-[border-color,box-shadow] duration-300 hover:border-ouro/50 hover:shadow-cartao`}
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
    >
      {/* holofote seguindo o cursor (z 1) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(260px circle at var(--mx) var(--my), rgba(212,178,76,.16), transparent 60%)" }}
      />
      {/* anel decorativo (z 0) */}
      <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 z-0 size-40 rounded-full border border-ouro/15" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-4 -top-4 z-0 size-24 rounded-full border border-ouro/10" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <span className="rotulo !text-[0.62rem]">{post.rotulo}</span>
        <span className="grid size-9 place-items-center rounded-full border border-ouro/30 bg-ouro/10 text-ouro" aria-hidden="true">
          <Icone nome={post.icone} tamanho={16} />
        </span>
      </div>

      <div className="relative z-10">
        <p className={`texto-display text-xl leading-tight sm:text-2xl lg:text-3xl ${post.destaque ? "texto-ouro" : "text-marfim"}`}>{post.titulo}</p>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-cinza sm:text-sm">{post.linha}</p>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-2 border-t border-linha pt-3 text-xs text-cinza">
        <span className="flex items-center gap-1.5">
          <Icone nome="instagram" tamanho={14} className="text-ouro" />
          {negocio.instagramHandle}
        </span>
        <span className="flex items-center gap-1 transition-colors group-hover:text-ouro">
          Abrir <Icone nome="externo" tamanho={12} />
        </span>
      </div>
    </a>
  );
}

export default function Instagram() {
  const instagram = useLoja((s) => s.config.instagram) || negocio.instagram;
  const posts = montarPosts();
  const refGrade = usarReveal<HTMLDivElement>({ stagger: 0.08, y: 28 });

  return (
    <Secao
      id="instagram"
      rotulo="Instagram"
      titulo={
        <>
          Siga <span className="texto-ouro">{negocio.instagramHandle}</span>
        </>
      }
      descricao="Chegadas, pré-vendas e clientes reais — tudo aparece primeiro no perfil. Os cartões abaixo resumem os temas dos posts recentes."
      acao={
        <Botao variante="contorno" href={instagram} icone="instagram">
          Abrir o perfil
        </Botao>
      }
    >
      <div ref={refGrade} data-reveal className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {posts.map((p) => (
          <CartaoPost key={p.id} post={p} href={instagram} />
        ))}
      </div>
    </Secao>
  );
}
