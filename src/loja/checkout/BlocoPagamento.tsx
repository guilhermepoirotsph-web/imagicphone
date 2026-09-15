/**
 * Bloco de pagamento do pedido confirmado.
 *  - Pix nativo (payloadPix + svgQr) quando a chave existe; senão lacuna honesta.
 *  - Cartão via link InfinitePay quando a tag existe; senão lacuna honesta.
 *  - "Combinar no WhatsApp": só orientação.
 * Nada é cobrado pelo site — o cliente finaliza com a loja.
 */
import { useMemo, useRef, useState } from "react";
import type { Configuracoes, Pedido } from "@/dados/tipos";
import { negocio } from "@/dados/negocio";
import { moeda } from "@/lib/formatar";
import { linkInfinitePay } from "@/lib/links";
import { payloadPix, svgQr } from "@/lib/pix";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";
import Aviso from "./Aviso";
import { configurado, copiarTexto } from "./util";

interface Props {
  pedido: Pedido;
  config: Configuracoes;
  /** algum item é pré-venda (a loja combina o sinal) */
  temPreVenda: boolean;
}

function BlocoPix({ pedido, config, temPreVenda }: Props) {
  const chaveOk = configurado(config.pixChave);
  const nomeRecebedor = configurado(config.pixNome) ? config.pixNome : config.nomeLoja;
  const cidadeRecebedor = configurado(config.pixCidade) ? config.pixCidade : negocio.cidade;
  const refCodigo = useRef<HTMLTextAreaElement>(null);
  const [copiado, setCopiado] = useState<"ok" | "erro" | null>(null);

  const qr = useMemo(() => {
    if (!chaveOk) return null;
    try {
      const payload = payloadPix({
        chave: config.pixChave,
        nome: nomeRecebedor,
        cidade: cidadeRecebedor,
        valorCentavos: pedido.total,
        txid: `PED${pedido.numero}`,
      });
      return { payload, svg: svgQr(payload, `QR Code Pix do pedido ${pedido.numero}, valor ${moeda(pedido.total)}`) };
    } catch {
      return null;
    }
  }, [chaveOk, config.pixChave, nomeRecebedor, cidadeRecebedor, pedido.total, pedido.numero]);

  async function copiar() {
    if (!qr) return;
    const ok = await copiarTexto(qr.payload, refCodigo.current);
    setCopiado(ok ? "ok" : "erro");
    window.setTimeout(() => setCopiado(null), 2600);
  }

  if (!chaveOk || !qr) {
    return (
      <Aviso tom="aviso" titulo="A chave Pix ainda não foi configurada no painel">
        Combine o pagamento pelo WhatsApp — a loja passa a chave Pix na conversa. Valor do pedido: <strong className="text-marfim">{moeda(pedido.total)}</strong>.
      </Aviso>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <div className="mx-auto w-full max-w-[240px]">
        {/* fundo branco arredondado: leitor de QR precisa de contraste */}
        <div className="rounded-2xl bg-white p-3 [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qr.svg }} />
        <p className="mt-2 text-center text-xs text-cinza">Aponte a câmera do app do banco</p>
      </div>

      <div className="min-w-0">
        <p className="font-display text-lg font-bold">
          Pix de <span className="text-marfim">{moeda(pedido.total)}</span>
        </p>
        <p className="mt-1 text-sm text-cinza">Escaneie o QR ou use o código abaixo (Pix copia e cola).</p>

        <label htmlFor="pix-copia-cola" className="mt-4 block text-xs font-bold uppercase tracking-[0.18em] text-ouro">
          Código Pix copia e cola
        </label>
        <textarea
          id="pix-copia-cola"
          ref={refCodigo}
          readOnly
          rows={3}
          value={qr.payload}
          onFocus={(e) => e.currentTarget.select()}
          className="campo mt-2 break-all py-3 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Botao variante="ouro" icone="copiar" onClick={copiar} aria-describedby="pix-copiado">
            Copiar código Pix
          </Botao>
          <span id="pix-copiado" role="status" aria-live="polite" className={`text-sm font-semibold ${copiado === "erro" ? "text-erro" : "text-ok"}`}>
            {copiado === "ok" && "Copiado!"}
            {copiado === "erro" && "Não deu para copiar — selecione o código e copie manualmente."}
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-ouro/30 bg-ouro/8 p-4 text-sm">
          <p className="flex items-start gap-2 text-cinza">
            <Icone nome="info" tamanho={18} className="mt-0.5 text-ouro" />
            <span>
              No app do banco vai aparecer o nome <strong className="text-marfim">{nomeRecebedor}</strong> em{" "}
              <strong className="text-marfim">{cidadeRecebedor}</strong> — é a conta da loja, pra não ficar estranho na hora de confirmar.
            </span>
          </p>
        </div>

        {temPreVenda && (
          <Aviso tom="info" className="mt-4">
            Este pedido tem <strong className="text-marfim">pré-venda</strong>: a reserva é feita com sinal. Se preferir pagar só o sinal agora, combine o valor com a loja no WhatsApp antes de usar o QR.
          </Aviso>
        )}

        <p className="mt-4 text-xs text-cinza">Depois de pagar, envie o comprovante no WhatsApp para a loja confirmar mais rápido.</p>
      </div>
    </div>
  );
}

function BlocoCartao({ pedido, config }: Props) {
  const link = linkInfinitePay(
    config.infiniteTag,
    pedido.itens.map((i) => ({
      name: [i.nome, i.variacao].filter(Boolean).join(" "),
      price: i.precoUnitario,
      quantity: i.quantidade,
    })),
  );

  if (!link) {
    return (
      <Aviso tom="aviso" titulo="O link de pagamento no cartão (InfinitePay) ainda não foi configurado no painel">
        Combine o pagamento pelo WhatsApp — a loja envia o link do cartão na conversa. Valor do pedido: <strong className="text-marfim">{moeda(pedido.total)}</strong>.
      </Aviso>
    );
  }

  return (
    <div>
      <p className="font-display text-lg font-bold">
        Cartão — <span className="text-marfim">{moeda(pedido.total)}</span>
      </p>
      <p className="mt-1 text-sm text-cinza">
        Abre em nova aba, no checkout seguro da InfinitePay. Até {config.parcelasMax}x — condições de parcelamento com a loja.
      </p>
      <div className="mt-4">
        <Botao variante="ouro" href={link} icone="cartao" iconeDepois="externo" tamanho="lg">
          Pagar no cartão (InfinitePay)
        </Botao>
      </div>
      <p className="mt-3 text-xs text-cinza">O pagamento é processado pela InfinitePay, não pelo site. Depois de pagar, avise a loja no WhatsApp.</p>
    </div>
  );
}

function BlocoWhatsapp() {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-wa/40 bg-wa/10 text-wa">
        <Icone nome="whatsapp" tamanho={20} />
      </span>
      <div>
        <p className="font-display text-lg font-bold">Combinar no WhatsApp</p>
        <p className="mt-1 text-sm text-cinza">Você fecha a forma de pagamento direto com a loja — Pix, cartão ou o que for melhor para você. Use o botão “Enviar pedido no WhatsApp”.</p>
      </div>
    </div>
  );
}

export default function BlocoPagamento(props: Props) {
  const { pedido } = props;
  return (
    <section aria-labelledby="pagamento-titulo" className="cartao p-5 sm:p-7">
      <p className="rotulo">
        <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
        Pagamento
      </p>
      <h2 id="pagamento-titulo" className="texto-display mt-2 text-2xl">
        {pedido.pagamento === "pix" && "Pague com Pix"}
        {pedido.pagamento === "cartao" && "Pague no cartão"}
        {pedido.pagamento === "whatsapp" && "Pagamento a combinar"}
      </h2>
      <div className="mt-6">
        {pedido.pagamento === "pix" && <BlocoPix {...props} />}
        {pedido.pagamento === "cartao" && <BlocoCartao {...props} />}
        {pedido.pagamento === "whatsapp" && <BlocoWhatsapp />}
      </div>
      <p className="mt-6 border-t border-linha pt-4 text-xs text-cinza">
        <Icone nome="escudo" tamanho={14} className="mr-1 inline-block align-[-2px] text-ouro" />
        Nada é cobrado pelo site — você finaliza com a loja.
      </p>
    </section>
  );
}
