/**
 * "Disponíveis" — grade dos produtos em destaque (máx. 8) com CartaoProduto,
 * reveal em cascata e link para o catálogo completo. Lê a store: o que o
 * painel marcar como destaque aparece aqui na hora.
 */
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useLoja, selProdutosAtivos } from "@/estado/loja";
import { usarReveal } from "@/lib/movimento";
import Secao from "@/componentes/ui/Secao";
import Botao from "@/componentes/ui/Botao";
import CartaoProduto from "@/componentes/ui/CartaoProduto";
import Icone from "@/componentes/ui/Icones";

const MAXIMO = 8;

export default function Destaques() {
  const ativos = useLoja(useShallow(selProdutosAtivos));
  const destaques = useMemo(() => ativos.filter((p) => p.emDestaque).slice(0, MAXIMO), [ativos]);
  const refGrade = usarReveal<HTMLDivElement>({ stagger: 0.08, y: 40 });

  return (
    <Secao
      id="disponiveis"
      rotulo="Disponíveis"
      titulo={
        <>
          Em destaque na <span className="texto-ouro">vitrine</span>.
        </>
      }
      descricao="Novos e seminovos com garantia e nota fiscal. Retire na loja em Caraguá ou receba no Litoral Norte."
      acao={
        <Botao variante="contorno" para="/produtos" iconeDepois="seta" tamanho="sm">
          Ver todos
        </Botao>
      }
      className="relative"
    >
      {destaques.length === 0 ? (
        <div className="cartao flex flex-col items-center gap-4 p-10 text-center">
          <span className="grid size-12 place-items-center rounded-full border border-ouro/30 bg-ouro/10 text-ouro">
            <Icone nome="vitrine" />
          </span>
          <p className="max-w-md text-cinza">Nenhum produto marcado como destaque agora. Veja o catálogo completo ou fale com a gente.</p>
          <Botao variante="ouro" para="/produtos" iconeDepois="seta">
            Ver catálogo
          </Botao>
        </div>
      ) : (
        <>
          <div ref={refGrade} data-reveal className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {destaques.map((p) => (
              <CartaoProduto key={p.id} produto={p} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-cinza">
            Mostrando {destaques.length} de {ativos.length} produtos ·{" "}
            <Botao variante="fantasma" para="/produtos" iconeDepois="seta" tamanho="sm" className="!inline-flex !px-2 text-ouro hover:!text-ouro-claro">
              ver todos
            </Botao>
          </p>
        </>
      )}
    </Secao>
  );
}
