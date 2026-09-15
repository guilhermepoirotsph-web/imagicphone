/** Pedidos — kanban por status ou lista, com avanço de status direto no cartão. */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Pagina from "@/painel/componentes/Pagina";
import Cartao from "@/painel/componentes/Cartao";
import Kpi from "@/painel/componentes/Kpi";
import Tabela from "@/painel/componentes/Tabela";
import { Entrada, Selecao } from "@/painel/componentes/Campo";
import Selo from "@/componentes/ui/Selo";
import Icone from "@/componentes/ui/Icones";
import { useLoja, ROTULO_STATUS, ROTULO_PAGAMENTO, proximosStatus } from "@/estado/loja";
import { moeda, dataHora } from "@/lib/formatar";
import type { Pedido, StatusPedido } from "@/dados/tipos";
import { TOM_STATUS } from "@/loja/checkout/util";

const COLUNAS: StatusPedido[] = ["novo", "confirmado", "pago", "enviado", "entregue"];

export default function PainelPedidos() {
  const pedidos = useLoja((s) => s.pedidos);
  const mudar = useLoja((s) => s.mudarStatusPedido);
  const [modo, setModo] = useState<"kanban" | "lista">("kanban");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const ordenados = useMemo(() => [...pedidos].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)), [pedidos]);
  const lista = ordenados.filter((p) => (!q || `${p.numero} ${p.cliente.nome}`.toLowerCase().includes(q.toLowerCase())) && (!status || p.status === status));
  const mes = new Date().toISOString().slice(0, 7);
  const kpis = {
    novos: pedidos.filter((p) => p.status === "novo").length,
    andamento: pedidos.filter((p) => ["confirmado", "pago", "enviado"].includes(p.status)).length,
    entregues: pedidos.filter((p) => p.status === "entregue" && p.criadoEm.startsWith(mes)).length,
  };

  const CartaoPedido = ({ p }: { p: Pedido }) => {
    const prox = proximosStatus(p.status).filter((s) => s !== "cancelado")[0];
    return (
      <li className="rounded-xl border border-linha bg-carvao p-3">
        <Link to={`/painel/pedidos/${p.id}`} className="block hover:text-ouro">
          <span className="flex items-center justify-between text-xs text-cinza"><span>#{p.numero}</span><span>{dataHora(p.criadoEm)}</span></span>
          <span className="mt-1 block truncate text-sm font-semibold">{p.cliente.nome}</span>
          <span className="mt-0.5 block text-xs text-cinza">{p.itens.map((i) => `${i.quantidade}x ${i.nome}`).join(", ")}</span>
          <span className="mt-2 flex items-center justify-between"><span className="font-display font-bold text-marfim">{moeda(p.total)}</span><span className="text-[0.62rem] uppercase tracking-wider text-cinza">{ROTULO_PAGAMENTO[p.pagamento]}</span></span>
        </Link>
        {prox && (
          <button type="button" onClick={() => mudar(p.id, prox)} className="mt-3 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full border border-ouro/40 bg-ouro/10 text-xs font-bold text-ouro hover:bg-ouro/20">
            Marcar como {ROTULO_STATUS[prox].toLowerCase()} <Icone nome="seta" tamanho={14} />
          </button>
        )}
      </li>
    );
  };

  return (
    <Pagina
      titulo="Pedidos"
      descricao="Pedidos feitos pelo site. Avance o status conforme confirmar, receber o pagamento e entregar."
      acoes={
        <div className="flex rounded-full border border-linha-forte p-0.5 text-xs font-bold">
          {(["kanban", "lista"] as const).map((m) => <button key={m} type="button" onClick={() => setModo(m)} aria-pressed={modo === m} className={`min-h-9 rounded-full px-4 capitalize ${modo === m ? "bg-ouro text-preto" : "text-cinza"}`}>{m}</button>)}
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi rotulo="Novos" valor={String(kpis.novos)} tom={kpis.novos ? "aviso" : "ok"} icone="pedidos" variacao="esperando confirmação" />
        <Kpi rotulo="Em andamento" valor={String(kpis.andamento)} tom="ouro" icone="entrega" variacao="confirmados, pagos ou enviados" />
        <Kpi rotulo="Entregues no mês" valor={String(kpis.entregues)} tom="ok" icone="check" />
      </div>

      {modo === "kanban" ? (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {COLUNAS.map((c) => {
            const itens = ordenados.filter((p) => p.status === c);
            return (
              <section key={c} aria-label={ROTULO_STATUS[c]} className="w-[270px] shrink-0 rounded-[1.25rem] border border-linha bg-grafite">
                <header className="flex items-center justify-between px-4 py-3"><Selo tom={TOM_STATUS[c]}>{ROTULO_STATUS[c]}</Selo><span className="text-xs font-bold text-cinza">{itens.length}</span></header>
                <ul className="grid gap-2 px-3 pb-3">{itens.length === 0 ? <li className="rounded-xl border border-dashed border-linha p-4 text-center text-xs text-cinza-escuro">vazio</li> : itens.map((p) => <CartaoPedido key={p.id} p={p} />)}</ul>
              </section>
            );
          })}
          <section aria-label="Cancelados" className="w-[200px] shrink-0 rounded-[1.25rem] border border-dashed border-linha p-4 text-xs text-cinza">
            Cancelados: {pedidos.filter((p) => p.status === "cancelado").length}
          </section>
        </div>
      ) : (
        <Cartao semPadding>
          <div className="grid gap-3 border-b border-linha p-4 sm:grid-cols-[minmax(0,1fr)_200px] sm:p-5">
            <Entrada value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por número ou cliente" aria-label="Buscar pedidos" />
            <Selecao value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="">Todos os status</option>{(Object.keys(ROTULO_STATUS) as StatusPedido[]).map((s) => <option key={s} value={s}>{ROTULO_STATUS[s]}</option>)}</Selecao>
          </div>
          <Tabela<Pedido>
            legenda="Pedidos"
            linhas={lista}
            chaveLinha={(p) => p.id}
            colunas={[
              { chave: "n", titulo: "Pedido", render: (p) => <Link to={`/painel/pedidos/${p.id}`} className="font-semibold hover:text-ouro">#{p.numero}</Link> },
              { chave: "cliente", titulo: "Cliente", render: (p) => <span>{p.cliente.nome}{p.demo && <Selo tom="demo" className="ml-2">exemplo</Selo>}</span> },
              { chave: "data", titulo: "Data", render: (p) => <span className="text-cinza">{dataHora(p.criadoEm)}</span> },
              { chave: "pag", titulo: "Pagamento", render: (p) => <span className="text-cinza">{ROTULO_PAGAMENTO[p.pagamento]}</span> },
              { chave: "total", titulo: "Total", alinhar: "direita", render: (p) => <span className="font-semibold text-marfim">{moeda(p.total)}</span> },
              { chave: "status", titulo: "Status", render: (p) => <Selo tom={TOM_STATUS[p.status]}>{ROTULO_STATUS[p.status]}</Selo> },
            ]}
          />
        </Cartao>
      )}
    </Pagina>
  );
}
