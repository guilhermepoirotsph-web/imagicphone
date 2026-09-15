/**
 * Clientes — prova social HONESTA.
 * Números reais de `negocio.provaSocial` (contagem pública do perfil) e três
 * cartões de depoimento claramente marcados como EXEMPLO: nenhum depoimento é
 * inventado como se fosse real — os reais vêm dos destaques "Clientes" do IG.
 */
import { negocio } from "@/dados/negocio";
import { useLoja } from "@/estado/loja";
import { usarReveal, usarContador } from "@/lib/movimento";
import Secao from "@/componentes/ui/Secao";
import Selo from "@/componentes/ui/Selo";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";

const formatarInteiro = (n: number) => Math.round(n).toLocaleString("pt-BR");

/** Assuntos reais (do perfil) em que os depoimentos de exemplo se apoiam — só o tema, nunca a fala. */
const TEMAS_EXEMPLO = [
  { id: "prevenda", tema: "Pré-venda iPhone 18 Pro", icone: "brilho" as const },
  { id: "eua", tema: "iPhone 17 🇺🇸 (eSIM)", icone: "apple" as const },
  { id: "seminovo", tema: "Seminovo revisado", icone: "escudo" as const },
];

export default function Clientes() {
  const instagram = useLoja((s) => s.config.instagram) || negocio.instagram;
  const cidades = useLoja((s) => s.config.cidadesEntrega);

  const refNumeros = usarReveal<HTMLDivElement>({ stagger: 0.1, y: 24 });
  const refCartoes = usarReveal<HTMLDivElement>({ stagger: 0.1, y: 30 });
  const refDestaques = usarContador<HTMLSpanElement>(negocio.provaSocial.destaquesClientes, formatarInteiro);
  const refSeguidores = usarContador<HTMLSpanElement>(negocio.provaSocial.seguidores, formatarInteiro);
  const refCidades = usarContador<HTMLSpanElement>(Math.max(cidades.length, 1), formatarInteiro);

  return (
    <Secao
      id="clientes"
      rotulo="Clientes"
      titulo="Quem compra, aparece no perfil."
      descricao={`A iMagicPhone mostra os clientes reais nos destaques do Instagram — ${negocio.provaSocial.destaquesClientes} coleções de fotos e mensagens de quem já comprou.`}
      acao={
        <Botao variante="contorno" href={instagram} icone="instagram">
          Ver depoimentos reais no Instagram
        </Botao>
      }
      className="relative"
    >
      {/* números verificados publicamente */}
      <div ref={refNumeros} data-reveal className="grid gap-4 sm:grid-cols-3">
        <div className="cartao-ouro p-6 sm:p-8">
          <p className="texto-display text-5xl text-marfim sm:text-6xl">
            <span ref={refDestaques}>{formatarInteiro(negocio.provaSocial.destaquesClientes)}</span>
          </p>
          <p className="mt-2 text-sm text-cinza sm:text-base">destaques “Clientes” no perfil, com fotos e mensagens reais</p>
        </div>
        <div className="cartao p-6 sm:p-8">
          <p className="texto-display text-5xl text-marfim sm:text-6xl">
            <span ref={refSeguidores}>{formatarInteiro(negocio.provaSocial.seguidores)}</span>
          </p>
          <p className="mt-2 text-sm text-cinza sm:text-base">seguidores no Instagram {negocio.instagramHandle}</p>
        </div>
        <div className="cartao p-6 sm:p-8">
          <p className="texto-display text-5xl text-marfim sm:text-6xl">
            <span ref={refCidades}>{formatarInteiro(Math.max(cidades.length, 1))}</span>
          </p>
          <p className="mt-2 text-sm text-cinza sm:text-base">cidades do Litoral Norte com entrega</p>
        </div>
      </div>

      {/* depoimentos — EXEMPLO, marcados e sem fala inventada */}
      <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="texto-display text-xl sm:text-2xl">Depoimentos</h3>
        <p className="flex items-center gap-2 text-xs text-cinza sm:text-sm">
          <Icone nome="info" tamanho={16} className="text-aviso" />
          Espaço reservado: os depoimentos reais entram a partir dos destaques do perfil.
        </p>
      </div>
      <div ref={refCartoes} data-reveal className="mt-5 grid gap-4 md:grid-cols-3">
        {TEMAS_EXEMPLO.map((t) => (
          <article key={t.id} className="cartao relative flex h-full flex-col p-6 sm:p-7" aria-label={`Depoimento de exemplo sobre ${t.tema}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-full border border-ouro/30 bg-ouro/10 text-ouro" aria-hidden="true">
                <Icone nome={t.icone} tamanho={18} />
              </span>
              <Selo tom="demo" titulo="Cartão de exemplo — substituir pelos depoimentos reais dos destaques ‘Clientes’">
                exemplo
              </Selo>
            </div>
            <p className="mt-5 flex-1 text-base leading-relaxed text-marfim/90">
              <span aria-hidden="true" className="texto-display mr-1 text-3xl leading-none text-ouro">“</span>
              Depoimento de exemplo — os reais vêm dos destaques ‘Clientes’ do perfil.
              <span aria-hidden="true" className="texto-display ml-1 text-3xl leading-none text-ouro">”</span>
            </p>
            <footer className="mt-6 border-t border-linha pt-4">
              <p className="text-sm font-semibold text-cinza">Nome do cliente · cidade</p>
              <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-ouro">Sobre: {t.tema}</p>
            </footer>
          </article>
        ))}
      </div>

      <div className="mt-8 flex justify-center sm:hidden">
        <Botao variante="contorno" href={instagram} icone="instagram" cheio>
          Ver depoimentos reais no Instagram
        </Botao>
      </div>
    </Secao>
  );
}
