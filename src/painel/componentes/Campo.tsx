/** Campos de formulário do painel: rótulo + ajuda + erro, entrada, seleção, área de texto e alternador. */
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

export function Campo({ rotulo, ajuda, erro, children, className = "" }: { rotulo: ReactNode; ajuda?: ReactNode; erro?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-cinza">{rotulo}</span>
      <div className="mt-1.5">{children}</div>
      {erro ? <span className="mt-1 block text-xs text-erro">{erro}</span> : ajuda ? <span className="mt-1 block text-xs text-cinza-escuro">{ajuda}</span> : null}
    </label>
  );
}

export function Entrada({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`campo !min-h-11 text-sm ${className}`} />;
}

export function Selecao({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`campo !min-h-11 text-sm ${className}`}>
      {children}
    </select>
  );
}

export function AreaTexto({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`campo py-2.5 text-sm ${className}`} />;
}

export function Alternador({ ligado, aoMudar, rotulo, descricao }: { ligado: boolean; aoMudar: (v: boolean) => void; rotulo: string; descricao?: string }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="min-w-0">
        <span id={id} className="block text-sm font-semibold">{rotulo}</span>
        {descricao && <span className="block text-xs text-cinza">{descricao}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={ligado}
        aria-labelledby={id}
        onClick={() => aoMudar(!ligado)}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors ${ligado ? "border-ouro bg-ouro" : "border-linha-forte bg-elevado"}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-preto shadow transition-transform ${ligado ? "translate-x-[1.45rem]" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
