/** Equipe — só dono/suporte. Novo perfil nasce inativo (anti-takeover); ninguém remove a si mesmo. */
import { useState } from "react";
import Pagina from "@/painel/componentes/Pagina";
import Cartao from "@/painel/componentes/Cartao";
import Aviso from "@/painel/componentes/Aviso";
import Tabela from "@/painel/componentes/Tabela";
import Modal from "@/painel/componentes/Modal";
import { Campo, Entrada, Selecao, Alternador } from "@/painel/componentes/Campo";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";
import { useLoja, selUsuarioAtual, ROTULO_PAPEL } from "@/estado/loja";
import { dataCurta } from "@/lib/formatar";
import type { Papel, Usuario } from "@/dados/tipos";

export default function PainelEquipe() {
  const eu = useLoja(selUsuarioAtual);
  const usuarios = useLoja((s) => s.usuarios);
  const salvar = useLoja((s) => s.salvarUsuario);
  const remover = useLoja((s) => s.removerUsuario);
  const [modal, setModal] = useState(false);
  const [novo, setNovo] = useState({ nome: "", email: "", papel: "vendedor" as Papel });

  if (!eu || eu.papel === "vendedor") {
    return (
      <Pagina titulo="Equipe">
        <Aviso tom="aviso" titulo="Sem permissão">Só o dono (ou o suporte) gerencia a equipe. <a href="/painel" className="text-ouro hover:underline">Voltar ao início</a></Aviso>
      </Pagina>
    );
  }

  return (
    <Pagina titulo="Equipe" descricao="Quem entra no painel e o que cada um pode fazer." acoes={<Botao variante="ouro" tamanho="sm" icone="mais" onClick={() => setModal(true)}>Adicionar pessoa</Botao>}>
      <Aviso tom="info" titulo="Nunca peça senha por WhatsApp">Cada pessoa cria a própria senha pelo e-mail. Aqui você só cadastra o e-mail, define o papel e ativa quando quiser.</Aviso>
      <Cartao semPadding>
        <Tabela<Usuario>
          legenda="Equipe"
          linhas={usuarios}
          chaveLinha={(u) => u.id}
          colunas={[
            { chave: "nome", titulo: "Pessoa", render: (u) => <span><span className="font-semibold">{u.nome}</span>{u.id === eu.id && <span className="ml-2 text-xs text-ouro">(você)</span>}<span className="block text-xs text-cinza">{u.email}</span></span> },
            { chave: "papel", titulo: "Papel", render: (u) => <Selecao value={u.papel} aria-label={`Papel de ${u.nome}`} disabled={u.id === eu.id} onChange={(e) => salvar({ ...u, papel: e.target.value as Papel })} className="!w-auto">{(Object.keys(ROTULO_PAPEL) as Papel[]).map((p) => <option key={p} value={p}>{ROTULO_PAPEL[p]}</option>)}</Selecao> },
            { chave: "desde", titulo: "Desde", render: (u) => <span className="text-cinza">{dataCurta(u.criadoEm)}</span> },
            { chave: "ativo", titulo: "Ativo", largura: "6rem", render: (u) => <Alternador ligado={u.ativo} aoMudar={(v) => salvar({ ...u, ativo: v })} rotulo="" /> },
            { chave: "acao", titulo: "Remover", tituloOculto: true, alinhar: "direita", render: (u) => u.id === eu.id ? null : <button type="button" aria-label={`Remover ${u.nome}`} onClick={() => { if (window.confirm(`Remover ${u.nome} da equipe?`)) remover(u.id); }} className="inline-grid size-9 place-items-center rounded-full text-cinza hover:bg-erro/15 hover:text-erro"><Icone nome="lixeira" tamanho={16} /></button> },
          ]}
        />
      </Cartao>
      <Modal aberto={modal} titulo="Adicionar pessoa" aoFechar={() => setModal(false)} rodape={<><Botao variante="contorno" tamanho="sm" onClick={() => setModal(false)}>Cancelar</Botao><Botao variante="ouro" tamanho="sm" onClick={() => { if (novo.nome.trim() && /\S+@\S+\.\S+/.test(novo.email)) { salvar({ nome: novo.nome.trim(), email: novo.email.trim(), papel: novo.papel, ativo: false }); setNovo({ nome: "", email: "", papel: "vendedor" }); setModal(false); } }}>Cadastrar</Botao></>}>
        <div className="grid gap-4">
          <Campo rotulo="Nome"><Entrada value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} /></Campo>
          <Campo rotulo="E-mail"><Entrada type="email" value={novo.email} onChange={(e) => setNovo({ ...novo, email: e.target.value })} /></Campo>
          <Campo rotulo="Papel"><Selecao value={novo.papel} onChange={(e) => setNovo({ ...novo, papel: e.target.value as Papel })}>{(Object.keys(ROTULO_PAPEL) as Papel[]).map((p) => <option key={p} value={p}>{ROTULO_PAPEL[p]}</option>)}</Selecao></Campo>
          <Aviso tom="info">O perfil nasce <strong>inativo</strong>: você liga o acesso quando a pessoa tiver criado a senha.</Aviso>
        </div>
      </Modal>
    </Pagina>
  );
}
