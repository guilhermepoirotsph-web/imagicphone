/** Detalhe do pedido — itens, cliente (WhatsApp), entrega, pagamento, histórico e transições de status. */
import { useState } from "react";
import { useParams } from "react-router-dom";
import Pagina from "@/painel/componentes/Pagina";
import Cartao from "@/painel/componentes/Cartao";
import Aviso from "@/painel/componentes/Aviso";
import Modal from "@/painel/componentes/Modal";
import { Campo, AreaTexto } from "@/painel/componentes/Campo";
import Botao from "@/componentes/ui/Botao";
import Selo from "@/componentes/ui/Selo";
import ArteProduto from "@/componentes/marca/ArteProduto";
import { useLoja, ROTULO_STATUS, ROTULO_PAGAMENTO, proximosStatus } from "@/estado/loja";
import { moeda, dataHora, mascararTelefone } from "@/lib/formatar";
import { linkWhatsapp } from "@/lib/links";
import type { StatusPedido } from "@/dados/tipos";
import { TOM_STATUS } from "@/loja/checkout/util";
import LinhaDoTempo from "@/loja/checkout/LinhaDoTempo";

export default function PainelPedidoDetalhe() {
  const { id = "" } = useParams();
  const pedido = useLoja((s) => s.pedidos.find((p) => p.id === id) ?? null);
  const produtos = useLoja((s) => s.produtos);
  const mudar = useLoja((s) => s.mudarStatusPedido);
  const [alvo, setAlvo] = useState<StatusPedido | null>(null);
  const [nota, setNota] = useState("");

  if (!pedido) {
    return (
      <Pagina titulo="Pedido não encontrado">
        <Aviso tom="aviso">Esse pedido não existe (ou a demonstração foi resetada).</Aviso>
        <div><Botao variante="contorno" para="/painel/pedidos" icone="setaEsq">Voltar</Botao></div>
      </Pagina>
    );
  }

  const proximos = proximosStatus(pedido.status);
  const msgCliente = `Olá, ${pedido.cliente.nome.split(" ")[0]}! Aqui é da iMagicPhone. Seu pedido #${pedido.numero} está ${ROTULO_STATUS[pedido.status].toLowerCase()}. Qualquer dúvida, é só responder. 📱`;

  return (
    <Pagina
      titulo={<span className="flex flex-wrap items-center gap-3">Pedido #{pedido.numero} <Selo tom={TOM_STATUS[pedido.status]}>{ROTULO_STATUS[pedido.status]}</Selo>{pedido.demo && <Selo tom="demo">exemplo</Selo>}</span>}
      descricao={`Feito em ${dataHora(pedido.criadoEm)} pelo site.`}
      acoes={
        <>
          <Botao variante="contorno" para="/painel/pedidos" tamanho="sm" icone="setaEsq">Pedidos</Botao>
          {proximos.map((s) => (
            <Botao key={s} variante={s === "cancelado" ? "perigo" : "ouro"} tamanho="sm" onClick={() => { setAlvo(s); setNota(""); }}>
              {s === "cancelado" ? "Cancelar" : `Marcar como ${ROTULO_STATUS[s].toLowerCase()}`}
            </Botao>
          ))}
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid gap-4">
          <Cartao titulo="Itens" semPadding>
            <ul className="divide-y divide-linha">
              {pedido.itens.map((i) => {
                const p = produtos.find((x) => x.id === i.produtoId);
                return (
                  <li key={i.produtoId} className="flex items-center gap-3 px-4 py-3 text-sm sm:px-5">
                    <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-linha bg-carvao p-0.5">{p && <ArteProduto produto={p} indice={0} />}</div>
                    <div className="min-w-0 flex-1"><p className="font-semibold">{i.quantidade}x {i.nome}</p><p className="text-xs text-cinza">{i.variacao}</p></div>
                    <span className="font-semibold text-marfim">{moeda(i.precoUnitario * i.quantidade)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="grid gap-1 border-t border-linha px-4 py-3 text-sm sm:px-5">
              <div className="flex justify-between text-cinza"><span>Subtotal</span><span>{moeda(pedido.subtotal)}</span></div>
              {pedido.desconto > 0 && <div className="flex justify-between text-ok"><span>Desconto</span><span>-{moeda(pedido.desconto)}</span></div>}
              <div className="flex justify-between font-display text-lg font-bold"><span>Total</span><span className="text-marfim">{moeda(pedido.total)}</span></div>
            </div>
          </Cartao>

          <div className="grid gap-4 sm:grid-cols-2">
            <Cartao titulo="Cliente">
              <p className="font-semibold">{pedido.cliente.nome}</p>
              <p className="text-sm text-cinza">{mascararTelefone(pedido.cliente.whatsapp)}</p>
              <div className="mt-3"><Botao variante="wa" href={linkWhatsapp(msgCliente, pedido.cliente.whatsapp, `https://wa.me/${pedido.cliente.whatsapp}`)} icone="whatsapp" tamanho="sm">Avisar no WhatsApp</Botao></div>
            </Cartao>
            <Cartao titulo="Entrega e pagamento">
              <p className="text-sm">{pedido.entrega.modo === "retirada" ? "Retirada na loja" : `Entrega — ${pedido.entrega.cidade}, ${pedido.entrega.endereco}`}</p>
              <p className="mt-2 text-sm text-cinza">Pagamento: <span className="text-tinta">{ROTULO_PAGAMENTO[pedido.pagamento]}</span></p>
              {pedido.observacao && <p className="mt-2 text-sm text-cinza">Obs.: {pedido.observacao}</p>}
            </Cartao>
          </div>
        </div>

        <Cartao titulo="Histórico">
          <LinhaDoTempo historico={pedido.historico} statusAtual={pedido.status} />
        </Cartao>
      </div>

      <Modal aberto={alvo !== null} titulo={alvo === "cancelado" ? "Cancelar pedido" : `Marcar como ${alvo ? ROTULO_STATUS[alvo].toLowerCase() : ""}`} aoFechar={() => setAlvo(null)} rodape={<><Botao variante="contorno" tamanho="sm" onClick={() => setAlvo(null)}>Voltar</Botao><Botao variante={alvo === "cancelado" ? "perigo" : "ouro"} tamanho="sm" onClick={() => { if (alvo) mudar(pedido.id, alvo, nota.trim() || undefined); setAlvo(null); }}>Confirmar</Botao></>}>
        <Campo rotulo="Nota (opcional)" ajuda="fica no histórico do pedido"><AreaTexto rows={3} value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ex.: Pix confirmado às 14h" /></Campo>
      </Modal>
    </Pagina>
  );
}
