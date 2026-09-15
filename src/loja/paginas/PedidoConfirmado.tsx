/**
 * Pedido confirmado (/pedido/:id): número, status reativo (o painel muda →
 * aqui muda), itens, totais, bloco de pagamento (Pix nativo / cartão /
 * WhatsApp) e o botão que envia o resumo no WhatsApp (só no clique).
 */
import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useLoja, ROTULO_STATUS, ROTULO_PAGAMENTO } from "@/estado/loja";
import { moeda, dataHora } from "@/lib/formatar";
import { wa } from "@/lib/links";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";
import Selo from "@/componentes/ui/Selo";
import Passos from "@/loja/checkout/Passos";
import ResumoValores from "@/loja/checkout/ResumoValores";
import LinhaDoTempo from "@/loja/checkout/LinhaDoTempo";
import BlocoPagamento from "@/loja/checkout/BlocoPagamento";
import Aviso from "@/loja/checkout/Aviso";
import { TOM_STATUS, PROXIMO_PASSO, pagamentoEmAberto, resumoPedidoWhatsapp, enderecoLoja } from "@/loja/checkout/util";

export default function PedidoConfirmado() {
  const { id = "" } = useParams();
  const pedido = useLoja((s) => s.pedidos.find((p) => p.id === id) ?? null);
  const produtos = useLoja((s) => s.produtos);
  const config = useLoja((s) => s.config);
  const refH1 = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = pedido ? `Pedido #${pedido.numero} · iMagicPhone` : "Pedido · iMagicPhone";
    refH1.current?.focus();
  }, [pedido?.numero]);

  if (!pedido) {
    return (
      <div className="container-pagina py-12 sm:py-16">
        <h1 ref={refH1} tabIndex={-1} className="texto-display text-3xl sm:text-5xl [&:focus-visible]:outline-none">Pedido não encontrado</h1>
        <Aviso tom="aviso" className="mt-6">Esse pedido não está neste navegador. Se você fez o pedido em outro aparelho, fale com a loja no WhatsApp com o número dele.</Aviso>
        <div className="mt-6 flex flex-wrap gap-2">
          <Botao variante="wa" href={wa.padrao(config.whatsappNumero, config.whatsappLink)} icone="whatsapp">WhatsApp da loja</Botao>
          <Botao variante="contorno" para="/">Voltar ao início</Botao>
        </div>
      </div>
    );
  }

  const temPreVenda = pedido.itens.some((i) => produtos.find((p) => p.id === i.produtoId)?.preVenda);
  const linkWa = wa.pedido(resumoPedidoWhatsapp(pedido, config), config.whatsappNumero, config.whatsappLink);

  return (
    <div className="container-pagina py-12 sm:py-16">
      <Passos atual={3} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 ref={refH1} tabIndex={-1} className="texto-display text-3xl sm:text-5xl [&:focus-visible]:outline-none">Pedido #{pedido.numero}</h1>
        <Selo tom={TOM_STATUS[pedido.status]}>{ROTULO_STATUS[pedido.status]}</Selo>
      </div>
      <p className="mt-3 max-w-2xl text-cinza">{PROXIMO_PASSO[pedido.status]}</p>

      <div className="cartao-ouro mt-6 flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-wa/15 text-wa"><Icone nome="whatsapp" tamanho={22} /></span>
          <div>
            <p className="font-display font-bold">Falta um toque: envie o pedido para a loja</p>
            <p className="text-sm text-cinza">O resumo já está pronto — abre a conversa no WhatsApp com tudo preenchido.</p>
          </div>
        </div>
        <Botao variante="wa" href={linkWa} icone="whatsapp" tamanho="lg" className="shrink-0">Enviar pedido no WhatsApp</Botao>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="grid gap-6">
          {pagamentoEmAberto(pedido.status) && <BlocoPagamento pedido={pedido} config={config} temPreVenda={temPreVenda} />}

          <section aria-labelledby="itens-titulo" className="cartao p-5 sm:p-6">
            <h2 id="itens-titulo" className="font-display text-lg font-bold">Itens</h2>
            <ul className="mt-4 divide-y divide-linha">
              {pedido.itens.map((i) => {
                const p = produtos.find((x) => x.id === i.produtoId);
                return (
                  <li key={i.produtoId} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span>
                      <span className="font-semibold text-tinta">{i.quantidade}x {i.nome}</span>
                      <span className="block text-xs text-cinza">{i.variacao}{p?.slug ? <> · <Link to={`/produto/${p.slug}`} className="text-ouro hover:underline">ver produto</Link></> : null}</span>
                    </span>
                    <span className="shrink-0 font-semibold">{moeda(i.precoUnitario * i.quantidade)}</span>
                  </li>
                );
              })}
            </ul>
            <ResumoValores className="mt-4" subtotal={pedido.subtotal} desconto={pedido.desconto} total={pedido.total} entrega={pedido.entrega.modo === "retirada" ? "retirada na loja" : "a combinar"} />
          </section>

          <section aria-labelledby="dados-titulo" className="cartao p-5 sm:p-6">
            <h2 id="dados-titulo" className="font-display text-lg font-bold">Dados do pedido</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-xs font-bold uppercase tracking-[0.16em] text-cinza">Cliente</dt><dd className="mt-1">{pedido.cliente.nome}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-[0.16em] text-cinza">Feito em</dt><dd className="mt-1">{dataHora(pedido.criadoEm)}</dd></div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-cinza">Entrega</dt>
                <dd className="mt-1">{pedido.entrega.modo === "retirada" ? `Retirada na loja${enderecoLoja(config) ? ` — ${enderecoLoja(config)}` : ""}` : `${pedido.entrega.cidade} — ${pedido.entrega.endereco}`}</dd>
              </div>
              <div><dt className="text-xs font-bold uppercase tracking-[0.16em] text-cinza">Pagamento</dt><dd className="mt-1">{ROTULO_PAGAMENTO[pedido.pagamento]}</dd></div>
              {pedido.observacao && <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-[0.16em] text-cinza">Observação</dt><dd className="mt-1 text-cinza">{pedido.observacao}</dd></div>}
            </dl>
          </section>
        </div>

        <aside className="cartao p-5 sm:p-6 lg:sticky lg:top-28" aria-label="Andamento">
          <h2 className="font-display text-lg font-bold">Andamento</h2>
          <p className="mt-1 text-xs text-cinza">Esta página atualiza sozinha quando a loja muda o status.</p>
          <div className="mt-5">
            <LinhaDoTempo historico={pedido.historico} statusAtual={pedido.status} />
          </div>
          <div className="mt-6 grid gap-2">
            <Botao variante="contorno" para="/produtos">Continuar comprando</Botao>
          </div>
        </aside>
      </div>
    </div>
  );
}
