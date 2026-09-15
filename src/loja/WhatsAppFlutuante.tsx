/** Botão fixo do WhatsApp com anel pulsante; aparece depois de 400px de rolagem. */
import { useEffect, useState } from "react";
import { useLoja } from "@/estado/loja";
import { wa } from "@/lib/links";
import Icone from "@/componentes/ui/Icones";
import { ehPrevia } from "./TarjaPrevia";

export default function WhatsAppFlutuante() {
  const config = useLoja((s) => s.config);
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const aoRolar = () => setMostrar(window.scrollY > 400);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <a
      href={wa.padrao(config.whatsappNumero, config.whatsappLink)}
      target="_blank"
      rel="noopener"
      aria-label="Falar no WhatsApp"
      aria-hidden={!mostrar}
      tabIndex={mostrar ? 0 : -1}
      className={`fixed right-5 z-40 grid size-14 place-items-center rounded-full bg-wa text-preto shadow-[0_14px_40px_-8px_rgba(37,211,102,.55)] transition-all duration-300 ${
        ehPrevia() ? "bottom-12" : "bottom-5"
      } ${mostrar ? "visible scale-100 opacity-100" : "invisible scale-50 opacity-0"}`}
    >
      <span aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-wa/60 animate-anel" />
      <Icone nome="whatsapp" tamanho={26} />
    </a>
  );
}
