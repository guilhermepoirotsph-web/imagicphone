/** Linhas de valores (subtotal, desconto, entrega, total) — mesmo bloco no carrinho, checkout e pedido. */
import { moeda } from "@/lib/formatar";

interface Props {
  subtotal: number;
  desconto?: number;
  rotuloDesconto?: string;
  total: number;
  /** "a combinar" (padrão) ou texto próprio; null esconde a linha */
  entrega?: string | null;
  className?: string;
}

export default function ResumoValores({ subtotal, desconto = 0, rotuloDesconto = "Desconto Pix", total, entrega = "a combinar", className = "" }: Props) {
  return (
    <dl className={`space-y-2.5 text-sm ${className}`}>
      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-cinza">Subtotal</dt>
        <dd className="font-semibold text-tinta">{moeda(subtotal)}</dd>
      </div>
      {desconto > 0 && (
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-cinza">{rotuloDesconto}</dt>
          <dd className="font-semibold text-ok">-{moeda(desconto)}</dd>
        </div>
      )}
      {entrega !== null && (
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-cinza">Frete / entrega</dt>
          <dd className="text-right text-cinza">{entrega}</dd>
        </div>
      )}
      <div className="filete-ouro my-1 opacity-60" aria-hidden="true" />
      <div className="flex items-baseline justify-between gap-4">
        <dt className="font-display text-base font-bold">Total</dt>
        <dd className="font-display text-2xl font-extrabold text-marfim">{moeda(total)}</dd>
      </div>
    </dl>
  );
}
