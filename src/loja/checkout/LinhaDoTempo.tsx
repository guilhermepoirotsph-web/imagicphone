/**
 * Linha do tempo do pedido — lê `pedido.historico` (o painel acrescenta eventos;
 * como a página assina a store, ela muda sozinha).
 */
import type { EventoPedido, StatusPedido } from "@/dados/tipos";
import { ROTULO_STATUS } from "@/estado/loja";
import { dataHora } from "@/lib/formatar";

const ESPERADO: StatusPedido[] = ["novo", "confirmado", "pago", "entregue"];

interface Props {
  historico: EventoPedido[];
  statusAtual: StatusPedido;
}

export default function LinhaDoTempo({ historico, statusAtual }: Props) {
  const feitos = new Set(historico.map((e) => e.status));
  const encerrado = statusAtual === "entregue" || statusAtual === "cancelado";
  const proximos = encerrado ? [] : ESPERADO.filter((s) => !feitos.has(s));

  return (
    <ol className="relative ml-2 border-l border-linha-forte pl-6" aria-label="Andamento do pedido">
      {historico.map((evento, i) => {
        const atual = i === historico.length - 1;
        const cancelado = evento.status === "cancelado";
        return (
          <li key={`${evento.status}-${evento.em}-${i}`} className="relative pb-6 last:pb-0">
            <span aria-hidden="true" className="absolute -left-[31px] top-0.5 grid size-5 place-items-center">
              {atual && !encerrado && <span className="absolute inset-0 rounded-full bg-ouro/40 animate-anel" />}
              <span className={`relative size-2.5 rounded-full ${cancelado ? "bg-erro" : atual ? "bg-ouro" : "bg-ok"}`} />
            </span>
            <p className={`font-display text-sm font-bold ${cancelado ? "text-erro" : atual ? "text-ouro" : "text-tinta"}`}>
              {ROTULO_STATUS[evento.status]}
              {atual && <span className="sr-only"> (status atual)</span>}
            </p>
            <p className="mt-0.5 text-xs text-cinza">
              <time dateTime={evento.em}>{dataHora(evento.em)}</time> · por {evento.por}
            </p>
            {evento.nota && <p className="mt-1 text-xs text-marfim/80">“{evento.nota}”</p>}
          </li>
        );
      })}
      {proximos.map((s) => (
        <li key={s} className="relative pb-6 last:pb-0 opacity-50">
          <span aria-hidden="true" className="absolute -left-[31px] top-0.5 grid size-5 place-items-center">
            <span className="size-2.5 rounded-full border border-linha-forte" />
          </span>
          <p className="font-display text-sm font-bold text-cinza">{ROTULO_STATUS[s]}</p>
          <p className="mt-0.5 text-xs text-cinza-escuro">próximo passo</p>
        </li>
      ))}
    </ol>
  );
}
