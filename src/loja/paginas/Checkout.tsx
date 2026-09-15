/**
 * Checkout em uma tela: dados → entrega → pagamento + resumo. Validação
 * inline; o pedido é criado pela store (`criarPedido` recalcula preços) e a
 * página do pedido mostra Pix/cartão/WhatsApp.
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoja } from "@/estado/loja";
import { useCarrinho, usarLinhasCarrinho } from "@/estado/carrinho";
import { negocio, CONFIGURE_ME } from "@/dados/negocio";
import { normalizarWhatsapp } from "@/lib/formatar";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";
import Passos from "@/loja/checkout/Passos";
import CartaoRadio from "@/loja/checkout/CartaoRadio";
import ResumoValores from "@/loja/checkout/ResumoValores";
import Aviso from "@/loja/checkout/Aviso";
import { configurado, digitosWhatsapp, mascaraWhatsapp, validarCheckout, enderecoLoja, type FormularioCheckout, type ErrosCheckout } from "@/loja/checkout/util";

export default function Checkout() {
  const navigate = useNavigate();
  const config = useLoja((s) => s.config);
  const criarPedido = useLoja((s) => s.criarPedido);
  const limpar = useCarrinho((s) => s.limpar);
  const { linhas, subtotal, quantidade } = usarLinhasCarrinho();
  const refH1 = useRef<HTMLHeadingElement>(null);
  const [form, setForm] = useState<FormularioCheckout>({ nome: "", whatsapp: "", modo: "retirada", cidade: "", endereco: "", pagamento: "pix", observacao: "" });
  const [erros, setErros] = useState<ErrosCheckout>({});
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    document.title = "Finalizar pedido · iMagicPhone";
    refH1.current?.focus();
  }, []);

  const cidades = config.cidadesEntrega.length ? config.cidadesEntrega : [...negocio.cidadesEntrega];
  const descontoPix = form.pagamento === "pix" ? Math.round((subtotal * config.descontoPixPercentual) / 100) : 0;
  const total = subtotal - descontoPix;
  const temPreVenda = linhas.some((l) => l.produto.preVenda);

  function campo<K extends keyof FormularioCheckout>(k: K, v: FormularioCheckout[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const v = validarCheckout(form);
    setErros(v);
    if (Object.keys(v).length) {
      const primeiro = Object.keys(v)[0];
      document.getElementById(`c-${primeiro}`)?.focus();
      return;
    }
    setEnviando(true);
    try {
      const pedido = criarPedido({
        cliente: { nome: form.nome.trim(), whatsapp: normalizarWhatsapp(digitosWhatsapp(form.whatsapp)) },
        entrega: form.modo === "retirada" ? { modo: "retirada" } : { modo: "entrega", cidade: form.cidade, endereco: form.endereco.trim() },
        pagamento: form.pagamento,
        itens: linhas.map((l) => ({ produtoId: l.produto.id, quantidade: l.quantidade })),
        observacao: form.observacao.trim() || undefined,
      });
      limpar();
      navigate(`/pedido/${pedido.id}`);
    } catch (err) {
      setErroEnvio(err instanceof Error ? err.message : "Não foi possível criar o pedido. Tente de novo ou chame no WhatsApp.");
      setEnviando(false);
    }
  }

  if (linhas.length === 0) {
    return (
      <div className="container-pagina py-12 sm:py-16">
        <Passos atual={2} />
        <h1 ref={refH1} tabIndex={-1} className="texto-display mt-4 text-3xl sm:text-5xl [&:focus-visible]:outline-none">Finalizar pedido</h1>
        <div className="cartao mt-10 flex flex-col items-center gap-4 p-12 text-center">
          <p className="font-display text-xl font-bold">Seu carrinho está vazio.</p>
          <p className="text-sm text-cinza">Adicione um produto para finalizar o pedido.</p>
          <Botao variante="ouro" para="/iphones" iconeDepois="seta">Ver iPhones</Botao>
        </div>
      </div>
    );
  }

  const classeErro = (k: keyof ErrosCheckout) => (erros[k] ? "!border-erro" : "");

  return (
    <div className="container-pagina py-12 sm:py-16">
      <Passos atual={2} />
      <h1 ref={refH1} tabIndex={-1} className="texto-display mt-4 text-3xl sm:text-5xl [&:focus-visible]:outline-none">Finalizar pedido</h1>
      <p className="mt-3 text-cinza">Preencha seus dados — o pagamento você finaliza com a loja.</p>

      <form onSubmit={enviar} noValidate className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="grid gap-6">
          <fieldset className="cartao p-5 sm:p-6">
            <legend className="sr-only">Seus dados</legend>
            <h2 className="font-display text-lg font-bold"><span className="mr-2 text-ouro">1.</span>Seus dados</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="c-nome" className="text-sm font-semibold">Nome completo</label>
                <input id="c-nome" value={form.nome} onChange={(e) => campo("nome", e.target.value)} autoComplete="name" aria-invalid={Boolean(erros.nome)} aria-describedby={erros.nome ? "e-nome" : undefined} className={`campo mt-1.5 ${classeErro("nome")}`} placeholder="Como podemos te chamar?" />
                {erros.nome && <p id="e-nome" className="mt-1 text-xs text-erro">{erros.nome}</p>}
              </div>
              <div>
                <label htmlFor="c-whatsapp" className="text-sm font-semibold">WhatsApp (com DDD)</label>
                <input id="c-whatsapp" value={form.whatsapp} onChange={(e) => campo("whatsapp", mascaraWhatsapp(e.target.value))} inputMode="tel" autoComplete="tel-national" aria-invalid={Boolean(erros.whatsapp)} aria-describedby={erros.whatsapp ? "e-whatsapp" : undefined} className={`campo mt-1.5 ${classeErro("whatsapp")}`} placeholder="(12) 99999-9999" />
                {erros.whatsapp && <p id="e-whatsapp" className="mt-1 text-xs text-erro">{erros.whatsapp}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset className="cartao p-5 sm:p-6">
            <legend className="sr-only">Entrega</legend>
            <h2 className="font-display text-lg font-bold"><span className="mr-2 text-ouro">2.</span>Como você quer receber</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <CartaoRadio nome="modo" valor="retirada" marcado={form.modo === "retirada"} aoMarcar={(v) => campo("modo", v)} titulo="Retirar na loja" icone="loja" descricao={enderecoLoja(config) || "Combine o endereço pelo WhatsApp"} />
              <CartaoRadio nome="modo" valor="entrega" marcado={form.modo === "entrega"} aoMarcar={(v) => campo("modo", v)} titulo="Entrega no Litoral Norte" icone="entrega" descricao={configurado(config.entregaTexto) ? config.entregaTexto : "Prazo e taxa combinados no atendimento"}>
                <div className="grid gap-3">
                  <div>
                    <label htmlFor="c-cidade" className="text-sm font-semibold">Cidade</label>
                    <select id="c-cidade" value={form.cidade} onChange={(e) => campo("cidade", e.target.value)} aria-invalid={Boolean(erros.cidade)} className={`campo mt-1.5 ${classeErro("cidade")}`}>
                      <option value="">Escolha…</option>
                      {cidades.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {erros.cidade && <p className="mt-1 text-xs text-erro">{erros.cidade}</p>}
                  </div>
                  <div>
                    <label htmlFor="c-endereco" className="text-sm font-semibold">Endereço</label>
                    <input id="c-endereco" value={form.endereco} onChange={(e) => campo("endereco", e.target.value)} autoComplete="street-address" aria-invalid={Boolean(erros.endereco)} className={`campo mt-1.5 ${classeErro("endereco")}`} placeholder="Rua, número, bairro" />
                    {erros.endereco && <p className="mt-1 text-xs text-erro">{erros.endereco}</p>}
                  </div>
                </div>
              </CartaoRadio>
            </div>
          </fieldset>

          <fieldset className="cartao p-5 sm:p-6">
            <legend className="sr-only">Pagamento</legend>
            <h2 className="font-display text-lg font-bold"><span className="mr-2 text-ouro">3.</span>Como você prefere pagar</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <CartaoRadio nome="pagamento" valor="pix" marcado={form.pagamento === "pix"} aoMarcar={(v) => campo("pagamento", v)} titulo="Pix" icone="pix" descricao={config.descontoPixPercentual > 0 ? `${config.descontoPixPercentual}% de desconto` : "QR Code na próxima tela"} />
              <CartaoRadio nome="pagamento" valor="cartao" marcado={form.pagamento === "cartao"} aoMarcar={(v) => campo("pagamento", v)} titulo="Cartão" icone="cartao" descricao={`Até ${config.parcelasMax}x · link seguro`} />
              <CartaoRadio nome="pagamento" valor="whatsapp" marcado={form.pagamento === "whatsapp"} aoMarcar={(v) => campo("pagamento", v)} titulo="Combinar no WhatsApp" icone="whatsapp" descricao="Fechar com a loja" />
            </div>
            {form.pagamento === "pix" && config.pixChave === CONFIGURE_ME && (
              <Aviso tom="info" className="mt-4">A chave Pix da loja ainda não foi configurada nesta prévia — o pedido é criado e você combina o Pix pelo WhatsApp.</Aviso>
            )}
            <div className="mt-4">
              <label htmlFor="c-observacao" className="text-sm font-semibold">Observação (opcional)</label>
              <textarea id="c-observacao" value={form.observacao} onChange={(e) => campo("observacao", e.target.value)} rows={2} className="campo mt-1.5 py-3" placeholder="Ex.: prefiro receber à tarde" />
            </div>
          </fieldset>

          {erroEnvio && <Aviso tom="erro" titulo="Não deu para criar o pedido">{erroEnvio}</Aviso>}
        </div>

        <aside className="cartao p-6 lg:sticky lg:top-28" aria-label="Resumo do pedido">
          <h2 className="font-display text-lg font-bold">Seu pedido</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {linhas.map(({ produto, quantidade: q, subtotal: sub }) => (
              <li key={produto.id} className="flex justify-between gap-3">
                <span className="text-cinza">{q}x {produto.nome} <span className="text-cinza-escuro">({produto.armazenamento ? `${produto.armazenamento} GB · ` : ""}{produto.cor})</span></span>
                <span className="shrink-0 font-semibold text-tinta">{(sub / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </li>
            ))}
          </ul>
          <ResumoValores className="mt-5" subtotal={subtotal} desconto={descontoPix} total={total} entrega={form.modo === "retirada" ? "retirada na loja" : "a combinar"} />
          {temPreVenda && <p className="mt-3 text-xs text-aviso">Itens em pré-venda: a reserva é com sinal — a loja confirma o valor com você.</p>}
          <Botao type="submit" variante="ouro" cheio tamanho="lg" className="mt-5" disabled={enviando} iconeDepois="seta">
            {enviando ? "Criando pedido…" : `Confirmar pedido (${quantidade})`}
          </Botao>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-cinza">
            <Icone nome="escudo" tamanho={14} className="mt-0.5 shrink-0 text-ouro" />
            Nada é cobrado pelo site. Na próxima tela você vê o Pix, o link do cartão ou envia o pedido no WhatsApp.
          </p>
        </aside>
      </form>
    </div>
  );
}
