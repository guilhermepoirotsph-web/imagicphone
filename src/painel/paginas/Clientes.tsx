/** Clientes — tabela com busca, cidade, pedidos, total gasto, VIP e WhatsApp. */
import { useState } from "react";
import Pagina from "@/painel/componentes/Pagina";
import Cartao from "@/painel/componentes/Cartao";
import Tabela from "@/painel/componentes/Tabela";
import { Entrada, Alternador } from "@/painel/componentes/Campo";
import Selo from "@/componentes/ui/Selo";
import Icone from "@/componentes/ui/Icones";
import { useLoja } from "@/estado/loja";
import { moeda, dataCurta, mascararTelefone } from "@/lib/formatar";
import type { Cliente } from "@/dados/tipos";

export default function PainelClientes() {
  const clientes = useLoja((s) => s.clientes);
  const alternarVip = useLoja((s) => s.alternarClienteVip);
  const [q, setQ] = useState("");
  const lista = clientes.filter((c) => !q || `${c.nome} ${c.whatsapp} ${c.cidade ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <Pagina titulo="Clientes" descricao={`${clientes.length} clientes · ${clientes.filter((c) => c.vip).length} no VIP. Quem compra pelo site entra aqui sozinho.`}>
      <Cartao semPadding>
        <div className="border-b border-linha p-4 sm:p-5"><Entrada value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, WhatsApp ou cidade" aria-label="Buscar clientes" /></div>
        <Tabela<Cliente>
          legenda="Clientes"
          linhas={lista}
          chaveLinha={(c) => c.id}
          colunas={[
            { chave: "nome", titulo: "Cliente", render: (c) => <span><span className="font-semibold">{c.nome}</span>{c.demo && <Selo tom="demo" className="ml-2">exemplo</Selo>}<span className="block text-xs text-cinza">{mascararTelefone(c.whatsapp)}</span></span> },
            { chave: "cidade", titulo: "Cidade", render: (c) => <span className="text-cinza">{c.cidade ?? "—"}</span> },
            { chave: "desde", titulo: "Desde", render: (c) => <span className="text-cinza">{dataCurta(c.criadoEm)}</span> },
            { chave: "pedidos", titulo: "Pedidos", alinhar: "centro", render: (c) => String(c.pedidos) },
            { chave: "gasto", titulo: "Total gasto", alinhar: "direita", render: (c) => <span className="font-semibold text-marfim">{moeda(c.totalGasto)}</span> },
            { chave: "vip", titulo: "VIP", largura: "5rem", render: (c) => <Alternador ligado={c.vip} aoMudar={() => alternarVip(c.id)} rotulo="" /> },
            { chave: "wa", titulo: "WhatsApp", tituloOculto: true, alinhar: "direita", render: (c) => <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener" aria-label={`WhatsApp de ${c.nome}`} className="inline-grid size-9 place-items-center rounded-full text-wa hover:bg-wa/15"><Icone nome="whatsapp" tamanho={18} /></a> },
          ]}
        />
      </Cartao>
    </Pagina>
  );
}
