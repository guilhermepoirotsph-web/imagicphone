/** Grupo VIP — lista, adicionar manual, exportar CSV (texto copiável) e modelo de mensagem. */
import { useState } from "react";
import Pagina from "@/painel/componentes/Pagina";
import Cartao from "@/painel/componentes/Cartao";
import Kpi from "@/painel/componentes/Kpi";
import Tabela from "@/painel/componentes/Tabela";
import Modal from "@/painel/componentes/Modal";
import { Campo, Entrada, Selecao, AreaTexto } from "@/painel/componentes/Campo";
import Botao from "@/componentes/ui/Botao";
import Selo from "@/componentes/ui/Selo";
import Icone from "@/componentes/ui/Icones";
import { useLoja } from "@/estado/loja";
import { dataCurta, mascararTelefone, normalizarWhatsapp } from "@/lib/formatar";
import type { MembroVip } from "@/dados/tipos";

export default function PainelVip() {
  const vip = useLoja((s) => s.vip);
  const adicionar = useLoja((s) => s.adicionarVip);
  const remover = useLoja((s) => s.removerVip);
  const [modal, setModal] = useState<"novo" | "csv" | "msg" | null>(null);
  const [novo, setNovo] = useState({ nome: "", whatsapp: "", interesse: "", origem: "loja" as MembroVip["origem"] });
  const semana = new Date(Date.now() - 7 * 864e5);
  const csv = ["nome;whatsapp;interesse;origem;data", ...vip.map((v) => `${v.nome};${v.whatsapp};${v.interesse};${v.origem};${dataCurta(v.criadoEm)}`)].join("\n");
  const mensagem = "📱🔥 *Chegou na iMagicPhone!*\n\nAcabou de chegar: [modelo] — [preço].\nGarantia e NF, retirada na loja em Caraguá ou entrega no Litoral Norte.\n\nQuer garantir o seu? Responde aqui que eu separo. 🙌";

  return (
    <Pagina titulo="Grupo VIP" descricao="Quem pediu para entrar no grupo pelo site, pelo Instagram ou na loja." acoes={<><Botao variante="ouro" tamanho="sm" icone="mais" onClick={() => setModal("novo")}>Adicionar</Botao><Botao variante="contorno" tamanho="sm" icone="copiar" onClick={() => setModal("csv")}>Exportar CSV</Botao><Botao variante="contorno" tamanho="sm" icone="whatsapp" onClick={() => setModal("msg")}>Mensagem para o grupo</Botao></>}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Kpi rotulo="No grupo" valor={String(vip.length)} icone="vip" tom="ouro" />
        <Kpi rotulo="Entraram esta semana" valor={String(vip.filter((v) => new Date(v.criadoEm) >= semana).length)} icone="clientes" tom="ok" />
      </div>
      <Cartao semPadding>
        <Tabela<MembroVip>
          legenda="Membros do Grupo VIP"
          linhas={vip}
          chaveLinha={(v) => v.id}
          colunas={[
            { chave: "nome", titulo: "Nome", render: (v) => <span><span className="font-semibold">{v.nome}</span>{v.demo && <Selo tom="demo" className="ml-2">exemplo</Selo>}</span> },
            { chave: "wa", titulo: "WhatsApp", render: (v) => <a href={`https://wa.me/${v.whatsapp}`} target="_blank" rel="noopener" className="text-cinza hover:text-wa">{mascararTelefone(v.whatsapp)}</a> },
            { chave: "interesse", titulo: "Interesse", render: (v) => v.interesse },
            { chave: "origem", titulo: "Origem", render: (v) => <span className="capitalize text-cinza">{v.origem}</span> },
            { chave: "data", titulo: "Entrou em", render: (v) => <span className="text-cinza">{dataCurta(v.criadoEm)}</span> },
            { chave: "acao", titulo: "Remover", tituloOculto: true, alinhar: "direita", render: (v) => <button type="button" aria-label={`Remover ${v.nome}`} onClick={() => { if (window.confirm(`Remover ${v.nome} do VIP?`)) remover(v.id); }} className="inline-grid size-9 place-items-center rounded-full text-cinza hover:bg-erro/15 hover:text-erro"><Icone nome="lixeira" tamanho={16} /></button> },
          ]}
        />
      </Cartao>

      <Modal aberto={modal === "novo"} titulo="Adicionar ao VIP" aoFechar={() => setModal(null)} rodape={<><Botao variante="contorno" tamanho="sm" onClick={() => setModal(null)}>Cancelar</Botao><Botao variante="ouro" tamanho="sm" onClick={() => { if (novo.nome.trim() && novo.whatsapp.replace(/\D/g, "").length >= 10) { adicionar({ nome: novo.nome.trim(), whatsapp: normalizarWhatsapp(novo.whatsapp), interesse: novo.interesse || "Não informado", origem: novo.origem }); setNovo({ nome: "", whatsapp: "", interesse: "", origem: "loja" }); setModal(null); } }}>Salvar</Botao></>}>
        <div className="grid gap-4">
          <Campo rotulo="Nome"><Entrada value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} /></Campo>
          <Campo rotulo="WhatsApp (com DDD)"><Entrada inputMode="tel" value={novo.whatsapp} onChange={(e) => setNovo({ ...novo, whatsapp: e.target.value })} placeholder="(12) 99999-9999" /></Campo>
          <Campo rotulo="Interesse"><Entrada value={novo.interesse} onChange={(e) => setNovo({ ...novo, interesse: e.target.value })} placeholder="iPhone 18 Pro" /></Campo>
          <Campo rotulo="Origem"><Selecao value={novo.origem} onChange={(e) => setNovo({ ...novo, origem: e.target.value as MembroVip["origem"] })}><option value="loja">Loja</option><option value="instagram">Instagram</option><option value="site">Site</option></Selecao></Campo>
        </div>
      </Modal>
      <Modal aberto={modal === "csv"} titulo="Exportar CSV" aoFechar={() => setModal(null)} rodape={<Botao variante="ouro" tamanho="sm" icone="copiar" onClick={() => navigator.clipboard?.writeText(csv)}>Copiar</Botao>}>
        <p className="mb-2 text-xs text-cinza">Selecione e cole numa planilha (separado por ponto e vírgula).</p>
        <AreaTexto readOnly rows={10} value={csv} onFocus={(e) => e.currentTarget.select()} className="font-mono text-xs" />
      </Modal>
      <Modal aberto={modal === "msg"} titulo="Modelo de mensagem para o grupo" aoFechar={() => setModal(null)} rodape={<Botao variante="ouro" tamanho="sm" icone="copiar" onClick={() => navigator.clipboard?.writeText(mensagem)}>Copiar</Botao>}>
        <AreaTexto readOnly rows={8} value={mensagem} onFocus={(e) => e.currentTarget.select()} />
      </Modal>
    </Pagina>
  );
}
