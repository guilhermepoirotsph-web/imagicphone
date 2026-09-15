/** Home — as 12 seções na ordem do contrato. O único <h1> é o do herói. */
import { useEffect } from "react";
import Heroi from "@/loja/secoes/Heroi";
import Marquee from "@/loja/secoes/Marquee";
import PreVenda from "@/loja/secoes/PreVenda";
import Categorias from "@/loja/secoes/Categorias";
import Destaques from "@/loja/secoes/Destaques";
import PorQue from "@/loja/secoes/PorQue";
import ComoComprar from "@/loja/secoes/ComoComprar";
import Clientes from "@/loja/secoes/Clientes";
import Vip from "@/loja/secoes/Vip";
import Faq from "@/loja/secoes/Faq";
import Instagram from "@/loja/secoes/Instagram";
import ChamadaFinal from "@/loja/secoes/ChamadaFinal";

export default function Inicio() {
  useEffect(() => {
    document.title = "iMagicPhone — Sua referência Apple no litoral";
  }, []);

  return (
    <div className="-mt-24">
      <Heroi />
      <Marquee />
      <PreVenda />
      <Categorias />
      <Destaques />
      <PorQue />
      <ComoComprar />
      <Clientes />
      <Vip />
      <Faq />
      <Instagram />
      <ChamadaFinal />
    </div>
  );
}
