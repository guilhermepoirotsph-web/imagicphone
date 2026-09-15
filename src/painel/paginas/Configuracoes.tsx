/** Configurações — só dono/suporte. Avisa o que ainda está CONFIGURE_ME e mostra a prévia do QR Pix. */
import { useMemo, useState, type FormEvent } from "react";
import Pagina from "@/painel/componentes/Pagina";
import Cartao from "@/painel/componentes/Cartao";
import Aviso from "@/painel/componentes/Aviso";
import { Campo, Entrada, AreaTexto, Alternador } from "@/painel/componentes/Campo";
import Botao from "@/componentes/ui/Botao";
import { useLoja, selUsuarioAtual } from "@/estado/loja";
import { CONFIGURE_ME } from "@/dados/negocio";
import { payloadPix, svgQr } from "@/lib/pix";
import type { Configuracoes } from "@/dados/tipos";

const limpo = (v: string) => (v === CONFIGURE_ME ? "" : v);

export default function PainelConfiguracoes() {
  const eu = useLoja(selUsuarioAtual);
  const config = useLoja((s) => s.config);
  const salvarConfig = useLoja((s) => s.salvarConfig);
  const [f, setF] = useState<Configuracoes>({ ...config, whatsappNumero: limpo(config.whatsappNumero), horario: limpo(config.horario), pixChave: limpo(config.pixChave), pixNome: limpo(config.pixNome), infiniteTag: limpo(config.infiniteTag), enderecoComplemento: limpo(config.enderecoComplemento) });
  const [salvo, setSalvo] = useState(false);
  const [cidade, setCidade] = useState("");

  const qr = useMemo(() => {
    if (!f.pixChave.trim()) return null;
    try {
      return svgQr(payloadPix({ chave: f.pixChave.trim(), nome: f.pixNome || f.nomeLoja, cidade: f.pixCidade || "CARAGUATATUBA", valorCentavos: 100, txid: "TESTE" }), "Prévia do QR Pix de R$ 1,00");
    } catch {
      return null;
    }
  }, [f.pixChave, f.pixNome, f.pixCidade, f.nomeLoja]);

  if (!eu || eu.papel === "vendedor") {
    return (
      <Pagina titulo="Configurações">
        <Aviso tom="aviso" titulo="Sem permissão">Só o dono (ou o suporte) altera as configurações. <a href="/painel" className="text-ouro hover:underline">Voltar ao início</a></Aviso>
      </Pagina>
    );
  }

  function set<K extends keyof Configuracoes>(k: K, v: Configuracoes[K]) {
    setF((a) => ({ ...a, [k]: v }));
    setSalvo(false);
  }

  function salvar(e: FormEvent) {
    e.preventDefault();
    const ouVazio = (v: string) => (v.trim() ? v.trim() : CONFIGURE_ME);
    salvarConfig({ ...f, whatsappNumero: ouVazio(f.whatsappNumero.replace(/\D/g, "")), horario: ouVazio(f.horario), pixChave: ouVazio(f.pixChave), pixNome: ouVazio(f.pixNome).slice(0, 25), pixCidade: (f.pixCidade || "Caraguatatuba").slice(0, 15), infiniteTag: ouVazio(f.infiniteTag), enderecoComplemento: ouVazio(f.enderecoComplemento) });
    setSalvo(true);
    window.setTimeout(() => setSalvo(false), 3000);
  }

  const faltando = [!f.whatsappNumero && "número do WhatsApp", !f.pixChave && "chave Pix", !f.infiniteTag && "InfiniteTag", !f.horario && "horário"].filter(Boolean) as string[];

  return (
    <Pagina titulo="Configurações" descricao="Dados da loja, atendimento, entrega e pagamento. O site esconde ou ajusta sozinho o que não estiver preenchido." acoes={<Botao variante="ouro" tamanho="sm" icone="check" onClick={(e) => salvar(e as unknown as FormEvent)}>{salvo ? "Salvo!" : "Salvar tudo"}</Botao>}>
      {faltando.length > 0 && <Aviso tom="info" titulo="Ainda não configurado">{faltando.join(", ")} — o site funciona mesmo assim, mandando o cliente para o WhatsApp.</Aviso>}
      <form onSubmit={salvar} className="grid gap-4 lg:grid-cols-2">
        <Cartao titulo="Loja">
          <div className="grid gap-4">
            <Campo rotulo="Nome"><Entrada value={f.nomeLoja} onChange={(e) => set("nomeLoja", e.target.value)} /></Campo>
            <Campo rotulo="Slogan"><Entrada value={f.slogan} onChange={(e) => set("slogan", e.target.value)} /></Campo>
            <Campo rotulo="Instagram (link)"><Entrada value={f.instagram} onChange={(e) => set("instagram", e.target.value)} /></Campo>
            <Alternador ligado={f.mostrarPrecoSeminovo} aoMudar={(v) => set("mostrarPrecoSeminovo", v)} rotulo="Mostrar preço dos seminovos" descricao="desligado = 'sob consulta'" />
          </div>
        </Cartao>
        <Cartao titulo="Atendimento">
          <div className="grid gap-4">
            <Campo rotulo="Número do WhatsApp (só dígitos, com DDI)" ajuda="ex.: 5512999999999 — liga as mensagens contextuais do site"><Entrada inputMode="tel" value={f.whatsappNumero} onChange={(e) => set("whatsappNumero", e.target.value)} placeholder="5512999999999" /></Campo>
            <Campo rotulo="Link oficial do WhatsApp (bio)"><Entrada value={f.whatsappLink} onChange={(e) => set("whatsappLink", e.target.value)} /></Campo>
            <Campo rotulo="Horário de funcionamento" ajuda="vazio = 'combine pelo WhatsApp'"><Entrada value={f.horario} onChange={(e) => set("horario", e.target.value)} placeholder="Seg a sex, 9h às 18h · sáb 9h às 13h" /></Campo>
          </div>
        </Cartao>
        <Cartao titulo="Endereço e entrega">
          <div className="grid gap-4">
            <Campo rotulo="Endereço"><Entrada value={f.endereco} onChange={(e) => set("endereco", e.target.value)} /></Campo>
            <Campo rotulo="Complemento"><Entrada value={f.enderecoComplemento} onChange={(e) => set("enderecoComplemento", e.target.value)} /></Campo>
            <Campo rotulo="Texto da entrega"><AreaTexto rows={2} value={f.entregaTexto} onChange={(e) => set("entregaTexto", e.target.value)} /></Campo>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-cinza">Cidades atendidas</p>
              <ul className="mt-2 flex flex-wrap gap-2">{f.cidadesEntrega.map((c) => <li key={c} className="inline-flex items-center gap-1.5 rounded-full border border-linha-forte px-3 py-1.5 text-xs">{c}<button type="button" aria-label={`Remover ${c}`} onClick={() => set("cidadesEntrega", f.cidadesEntrega.filter((x) => x !== c))} className="text-cinza hover:text-erro">×</button></li>)}</ul>
              <div className="mt-2 flex gap-2"><Entrada value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Nova cidade" /><Botao variante="contorno" tamanho="sm" onClick={() => { if (cidade.trim()) { set("cidadesEntrega", [...f.cidadesEntrega, cidade.trim()]); setCidade(""); } }}>Adicionar</Botao></div>
            </div>
          </div>
        </Cartao>
        <Cartao titulo="Pagamento">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Campo rotulo="Desconto Pix (%)"><Entrada type="number" min={0} max={30} value={f.descontoPixPercentual} onChange={(e) => set("descontoPixPercentual", Number(e.target.value) || 0)} /></Campo>
              <Campo rotulo="Parcelas (máx.)"><Entrada type="number" min={1} max={24} value={f.parcelasMax} onChange={(e) => set("parcelasMax", Number(e.target.value) || 1)} /></Campo>
              <Campo rotulo="Sem juros acima de (R$)"><Entrada type="number" min={0} value={f.parcelasSemJurosAcimaDe / 100} onChange={(e) => set("parcelasSemJurosAcimaDe", Math.round((Number(e.target.value) || 0) * 100))} /></Campo>
            </div>
            <Campo rotulo="Chave Pix" ajuda="CPF/CNPJ, e-mail, celular ou chave aleatória — o QR aponta direto para a sua conta, sem taxa"><Entrada value={f.pixChave} onChange={(e) => set("pixChave", e.target.value)} /></Campo>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo rotulo="Nome do recebedor (≤ 25)" ajuda="o app do banco mostra o nome cadastrado no DICT"><Entrada maxLength={25} value={f.pixNome} onChange={(e) => set("pixNome", e.target.value)} /></Campo>
              <Campo rotulo="Cidade (≤ 15)"><Entrada maxLength={15} value={f.pixCidade} onChange={(e) => set("pixCidade", e.target.value)} /></Campo>
            </div>
            <Campo rotulo="InfiniteTag (cartão)" ajuda="tag da conta InfinitePay — checkout.infinitepay.io/<tag>"><Entrada value={f.infiniteTag} onChange={(e) => set("infiniteTag", e.target.value)} placeholder="imagicphone" /></Campo>
            {qr ? (
              <div className="flex items-center gap-4 rounded-xl border border-linha p-3">
                <div className="w-28 shrink-0 rounded-lg bg-white p-1.5 [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} />
                <p className="text-xs text-cinza">Prévia do QR Pix de <strong className="text-marfim">R$ 1,00</strong> com a chave acima. Teste no app do banco antes de publicar.</p>
              </div>
            ) : (
              <Aviso tom="info">Preencha a chave Pix para ver a prévia do QR.</Aviso>
            )}
          </div>
        </Cartao>
        <div className="lg:col-span-2"><Botao type="submit" variante="ouro" icone="check">{salvo ? "Salvo!" : "Salvar tudo"}</Botao></div>
      </form>
    </Pagina>
  );
}
