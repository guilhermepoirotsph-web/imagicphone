/**
 * Barra superior com os avisos da loja (config.anuncios — editáveis no painel).
 * Rotação puramente visual (aria-hidden); leitores de tela recebem o texto
 * completo estático. Altura fixa de 32px para não deslocar o cabeçalho.
 */
import { useEffect, useState } from "react";
import { useLoja } from "@/estado/loja";
import { animado } from "@/lib/movimento";

export default function BarraAnuncios() {
  const mensagens = useLoja((s) => s.config.anuncios).filter((m) => m.trim());
  const [indice, setIndice] = useState(0);
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    if (!animado() || mensagens.length <= 1) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setVisivel(false);
      window.setTimeout(() => {
        setIndice((i) => (i + 1) % mensagens.length);
        setVisivel(true);
      }, 320);
    }, 4200);
    return () => window.clearInterval(id);
  }, [mensagens.length]);

  if (mensagens.length === 0) return <div className="h-8 border-b border-linha bg-preto" />;

  return (
    <div className="relative h-8 overflow-hidden border-b border-ouro/20 bg-[linear-gradient(90deg,rgba(156,122,30,.35),rgba(212,178,76,.18),rgba(156,122,30,.35))] text-center backdrop-blur-md">
      <p
        aria-hidden="true"
        className={`flex h-full items-center justify-center truncate px-4 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-marfim transition-opacity duration-300 ${
          visivel ? "opacity-100" : "opacity-0"
        }`}
      >
        {mensagens[indice % mensagens.length]}
      </p>
      <span className="sr-only">{mensagens.join(". ")}</span>
    </div>
  );
}
