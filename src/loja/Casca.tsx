/**
 * Casca da loja: pilha fixa no topo (barra de avisos + cabeçalho), conteúdo,
 * rodapé, WhatsApp flutuante, gaveta do carrinho e tarja de prévia.
 * Lenis (scroll suave) vive aqui; toda troca de rota volta ao topo e
 * recalcula os ScrollTriggers.
 */
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { usarLenis, aoTrocarRota } from "@/lib/movimento";
import BarraAnuncios from "./BarraAnuncios";
import Cabecalho from "./Cabecalho";
import Rodape from "./Rodape";
import WhatsAppFlutuante from "./WhatsAppFlutuante";
import GavetaCarrinho from "./GavetaCarrinho";
import TarjaPrevia from "./TarjaPrevia";

/** altura da pilha fixa (barra 32px + cabeçalho 64px) — o herói mede por aqui */
export const ALTURA_TOPO = 96;

export default function Casca() {
  const location = useLocation();
  usarLenis(true);

  useEffect(() => {
    aoTrocarRota();
  }, [location.pathname]);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ouro focus:px-4 focus:py-2 focus:font-bold focus:text-preto"
      >
        Pular para o conteúdo
      </a>
      <div data-fixed-top className="fixed inset-x-0 top-0 z-50">
        <BarraAnuncios />
        <Cabecalho />
      </div>
      <main id="conteudo" className="min-h-svh pt-24">
        <Outlet />
      </main>
      <Rodape />
      <WhatsAppFlutuante />
      <GavetaCarrinho />
      <TarjaPrevia />
    </>
  );
}
