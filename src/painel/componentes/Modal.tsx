/** Diálogo acessível do painel (foco preso, Esc fecha, fundo inerte). */
import { useEffect, useRef, type ReactNode } from "react";
import Icone from "@/componentes/ui/Icones";

interface Props {
  aberto: boolean;
  titulo: string;
  aoFechar: () => void;
  children: ReactNode;
  rodape?: ReactNode;
  largura?: string;
}

export default function Modal({ aberto, titulo, aoFechar, children, rodape, largura = "max-w-lg" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    const caixa = ref.current;
    caixa?.querySelector<HTMLElement>("input, select, textarea, button")?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") aoFechar();
      if (e.key === "Tab" && caixa) {
        const f = caixa.querySelectorAll<HTMLElement>("input, select, textarea, button, a");
        const p = f[0];
        const u = f[f.length - 1];
        if (e.shiftKey && document.activeElement === p) { e.preventDefault(); u.focus(); }
        else if (!e.shiftKey && document.activeElement === u) { e.preventDefault(); p.focus(); }
      }
    };
    document.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
      anterior?.focus?.();
    };
  }, [aberto, aoFechar]);

  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <button type="button" aria-label="Fechar" onClick={aoFechar} tabIndex={-1} className="absolute inset-0 bg-preto/75 backdrop-blur-sm" />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={titulo} className={`relative w-full ${largura} max-h-[90svh] overflow-y-auto rounded-[1.25rem] border border-linha bg-grafite shadow-cartao`}>
        <div className="flex items-center justify-between border-b border-linha px-5 py-4">
          <h2 className="font-display text-base font-bold">{titulo}</h2>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="grid size-10 place-items-center rounded-full border border-linha-forte hover:border-ouro hover:text-ouro"><Icone nome="fechar" tamanho={16} /></button>
        </div>
        <div className="p-5">{children}</div>
        {rodape && <div className="flex flex-wrap justify-end gap-2 border-t border-linha px-5 py-4">{rodape}</div>}
      </div>
    </div>
  );
}
