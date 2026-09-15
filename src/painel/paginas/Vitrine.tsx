/** Vitrine — banners, avisos da barra superior e slogan do herói. Tudo reflete na loja na hora. */
import { useState } from "react";
import Pagina from "@/painel/componentes/Pagina";
import Cartao from "@/painel/componentes/Cartao";
import Modal from "@/painel/componentes/Modal";
import { Campo, Entrada, Alternador } from "@/painel/componentes/Campo";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";
import { useLoja } from "@/estado/loja";
import type { Banner } from "@/dados/tipos";

const NOVO: Banner = { id: "", rotulo: "", titulo: "", subtitulo: "", cta: "Ver", link: "/produtos", ativo: true, ordem: 99 };

export default function PainelVitrine() {
  const banners = useLoja((s) => [...s.banners].sort((a, b) => a.ordem - b.ordem));
  const config = useLoja((s) => s.config);
  const salvarBanner = useLoja((s) => s.salvarBanner);
  const removerBanner = useLoja((s) => s.removerBanner);
  const salvarConfig = useLoja((s) => s.salvarConfig);
  const [editando, setEditando] = useState<Banner | null>(null);
  const [novoAnuncio, setNovoAnuncio] = useState("");
  const [slogan, setSlogan] = useState(config.slogan);

  function mover(b: Banner, dir: -1 | 1) {
    const i = banners.findIndex((x) => x.id === b.id);
    const j = i + dir;
    if (j < 0 || j >= banners.length) return;
    const a = banners[i], c = banners[j];
    salvarBanner({ ...a, ordem: c.ordem });
    salvarBanner({ ...c, ordem: a.ordem });
  }

  return (
    <Pagina titulo="Vitrine" descricao="O que o visitante vê primeiro. Alterou, apareceu." acoes={<Botao variante="contorno" href="/" tamanho="sm" iconeDepois="externo">Ver a loja</Botao>}>
      <Cartao titulo="Banners e chamadas" descricao="Usados nas chamadas da home e em campanhas" acoes={<Botao variante="ouro" tamanho="sm" icone="mais" onClick={() => setEditando({ ...NOVO })}>Novo banner</Botao>} semPadding>
        <ul className="divide-y divide-linha">
          {banners.map((b, i) => (
            <li key={b.id} className={`flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5 ${b.ativo ? "" : "opacity-60"}`}>
              <div className="flex flex-col"><button type="button" aria-label="Subir" disabled={i === 0} onClick={() => mover(b, -1)} className="text-cinza hover:text-tinta disabled:opacity-30">▲</button><button type="button" aria-label="Descer" disabled={i === banners.length - 1} onClick={() => mover(b, 1)} className="text-cinza hover:text-tinta disabled:opacity-30">▼</button></div>
              <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ouro">{b.rotulo}</p><p className="font-semibold">{b.titulo}</p><p className="truncate text-xs text-cinza">{b.subtitulo}</p></div>
              <Alternador ligado={b.ativo} aoMudar={(v) => salvarBanner({ ...b, ativo: v })} rotulo="" />
              <button type="button" onClick={() => setEditando(b)} aria-label="Editar banner" className="grid size-9 place-items-center rounded-full text-cinza hover:bg-white/8 hover:text-tinta"><Icone nome="editar" tamanho={16} /></button>
              <button type="button" onClick={() => { if (window.confirm("Excluir este banner?")) removerBanner(b.id); }} aria-label="Excluir banner" className="grid size-9 place-items-center rounded-full text-cinza hover:bg-erro/15 hover:text-erro"><Icone nome="lixeira" tamanho={16} /></button>
            </li>
          ))}
        </ul>
      </Cartao>

      <div className="grid gap-4 lg:grid-cols-2">
        <Cartao titulo="Avisos da barra superior" descricao="Rodam no topo da loja, um por vez">
          <ul className="grid gap-2">
            {config.anuncios.map((a, i) => (
              <li key={`${a}-${i}`} className="flex items-center gap-2">
                <Entrada value={a} onChange={(e) => salvarConfig({ anuncios: config.anuncios.map((x, j) => (j === i ? e.target.value : x)) })} />
                <button type="button" aria-label="Remover aviso" onClick={() => salvarConfig({ anuncios: config.anuncios.filter((_, j) => j !== i) })} className="grid size-10 shrink-0 place-items-center rounded-full text-cinza hover:text-erro"><Icone nome="lixeira" tamanho={16} /></button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <Entrada value={novoAnuncio} onChange={(e) => setNovoAnuncio(e.target.value)} placeholder="Novo aviso…" />
            <Botao variante="contorno" tamanho="sm" onClick={() => { if (novoAnuncio.trim()) { salvarConfig({ anuncios: [...config.anuncios, novoAnuncio.trim()] }); setNovoAnuncio(""); } }}>Adicionar</Botao>
          </div>
        </Cartao>
        <Cartao titulo="Slogan" descricao="Aparece no rodapé e em textos da loja">
          <Campo rotulo="Slogan"><Entrada value={slogan} onChange={(e) => setSlogan(e.target.value)} /></Campo>
          <div className="mt-3"><Botao variante="ouro" tamanho="sm" onClick={() => salvarConfig({ slogan })} icone="check">Salvar slogan</Botao></div>
        </Cartao>
      </div>

      <Modal aberto={editando !== null} titulo={editando?.id ? "Editar banner" : "Novo banner"} aoFechar={() => setEditando(null)} rodape={<><Botao variante="contorno" tamanho="sm" onClick={() => setEditando(null)}>Cancelar</Botao><Botao variante="ouro" tamanho="sm" onClick={() => { if (editando && editando.titulo.trim()) { salvarBanner({ ...editando, id: editando.id || `b-${Date.now().toString(36)}` }); setEditando(null); } }}>Salvar</Botao></>}>
        {editando && (
          <div className="grid gap-4">
            <Campo rotulo="Rótulo"><Entrada value={editando.rotulo} onChange={(e) => setEditando({ ...editando, rotulo: e.target.value })} placeholder="Pré-venda aberta" /></Campo>
            <Campo rotulo="Título"><Entrada value={editando.titulo} onChange={(e) => setEditando({ ...editando, titulo: e.target.value })} /></Campo>
            <Campo rotulo="Subtítulo"><Entrada value={editando.subtitulo} onChange={(e) => setEditando({ ...editando, subtitulo: e.target.value })} /></Campo>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo rotulo="Texto do botão"><Entrada value={editando.cta} onChange={(e) => setEditando({ ...editando, cta: e.target.value })} /></Campo>
              <Campo rotulo="Link"><Entrada value={editando.link} onChange={(e) => setEditando({ ...editando, link: e.target.value })} placeholder="/pre-venda" /></Campo>
            </div>
          </div>
        )}
      </Modal>
    </Pagina>
  );
}
