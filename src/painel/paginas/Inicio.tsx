/** Dashboard — KPIs calculados da store, faturamento por dia (SVG), últimos pedidos e alertas. */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import Pagina from "@/painel/componentes/Pagina";
import Cartao from "@/painel/componentes/Cartao";
import Kpi from "@/painel/componentes/Kpi";
import Aviso from "@/painel/componentes/Aviso";
import Selo from "@/componentes/ui/Selo";
import Botao from "@/componentes/ui/Botao";
import { useLoja, ROTULO_STATUS } from "@/estado/loja";
import { moeda, dataHora } from "@/lib/formatar";
import { CONFIGURE_ME } from "@/dados/negocio";
import { TOM_STATUS } from "@/loja/checkout/util";

const FATURADOS = new Set(["pago", "enviado", "entregue"]);

function GraficoLinha({ pontos }: { pontos: { rotulo: string; valor: number }[] }) {
  const L = 600, A = 180, m = 24;
  const max = Math.max(1, ...pontos.map((p) => p.valor));
  const x = (i: number) => m + (i * (L - m * 2)) / Math.max(1, pontos.length - 1);
  const y = (v: number) => A - m - (v / max) * (A - m * 2);
  const linha = pontos.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.valor).toFixed(1)}`).join(" ");
  const area = `${linha} L${x(pontos.length - 1).toFixed(1)} ${A - m} L${x(0)} ${A - m} Z`;
  return (
    <svg viewBox={`0 0 ${L} ${A}`} className="h-44 w-full" role="img" aria-label="Faturamento por dia nos últimos 14 dias">
      <defs>
        <linearGradient id="g-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d4b24c" stopOpacity=".35" /><stop offset="1" stopColor="#d4b24c" stopOpacity="0" /></linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={m} x2={L - m} y1={y(max * f)} y2={y(max * f)} stroke="rgba(255,255,255,.06)" />)}
      <path d={area} fill="url(#g-area)" />
      <path d={linha} fill="none" stroke="#d4b24c" strokeWidth="2.5" strokeLinejoin="round" />
      {pontos.map((p, i) => (
        <g key={p.rotulo}>
          <circle cx={x(i)} cy={y(p.valor)} r="3.5" fill="#0d0d0f" stroke="#d4b24c" strokeWidth="2"><title>{p.rotulo}: {moeda(p.valor)}</title></circle>
          {i % 2 === 0 && <text x={x(i)} y={A - 6} textAnchor="middle" fontSize="10" fill="#6b6b72">{p.rotulo}</text>}
        </g>
      ))}
    </svg>
  );
}

export default function PainelInicio() {
  const pedidos = useLoja((s) => s.pedidos);
  const produtos = useLoja((s) => s.produtos);
  const vip = useLoja((s) => s.vip);
  const config = useLoja((s) => s.config);

  const dados = useMemo(() => {
    const agora = new Date();
    const hoje = agora.toISOString().slice(0, 10);
    const semana = new Date(agora.getTime() - 7 * 864e5);
    const mes = agora.toISOString().slice(0, 7);
    const faturados = pedidos.filter((p) => FATURADOS.has(p.status));
    const doMes = faturados.filter((p) => p.criadoEm.startsWith(mes));
    const fat = doMes.reduce((a, p) => a + p.total, 0);
    const dias = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(agora.getTime() - (13 - i) * 864e5);
      const chave = d.toISOString().slice(0, 10);
      return { rotulo: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`, valor: faturados.filter((p) => p.criadoEm.startsWith(chave)).reduce((a, p) => a + p.total, 0) };
    });
    return {
      hoje: pedidos.filter((p) => p.criadoEm.startsWith(hoje)).length,
      semana: pedidos.filter((p) => new Date(p.criadoEm) >= semana).length,
      novos: pedidos.filter((p) => p.status === "novo").length,
      fatMes: fat,
      ticket: doMes.length ? Math.round(fat / doMes.length) : 0,
      ativos: produtos.filter((p) => p.ativo).length,
      baixos: produtos.filter((p) => p.ativo && p.estoque <= 1),
      vipTotal: vip.length,
      dias,
      ultimos: [...pedidos].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 6),
      porCategoria: ["iphones", "seminovos", "apple", "acessorios"].map((c) => ({ rotulo: c, valor: produtos.filter((p) => p.ativo && p.categoria === c).length })),
    };
  }, [pedidos, produtos, vip]);

  const pendentes = [
    config.whatsappNumero === CONFIGURE_ME && "número do WhatsApp",
    config.pixChave === CONFIGURE_ME && "chave Pix",
    config.infiniteTag === CONFIGURE_ME && "InfiniteTag (cartão)",
    config.horario === CONFIGURE_ME && "horário de funcionamento",
  ].filter(Boolean) as string[];

  return (
    <Pagina titulo="Visão geral" descricao="O que está acontecendo na loja agora." acoes={<><Botao variante="ouro" para="/painel/produtos/novo" icone="mais" tamanho="sm">Novo produto</Botao><Botao variante="contorno" para="/painel/pedidos" tamanho="sm">Ver pedidos</Botao></>}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi rotulo="Pedidos hoje" valor={String(dados.hoje)} variacao={dados.novos ? `${dados.novos} para confirmar` : "nenhum pendente"} tom={dados.novos ? "aviso" : "ok"} icone="pedidos" />
        <Kpi rotulo="Faturamento do mês" valor={moeda(dados.fatMes)} variacao={`ticket médio ${moeda(dados.ticket)}`} tom="ouro" icone="grafico" />
        <Kpi rotulo="Produtos ativos" valor={String(dados.ativos)} variacao={dados.baixos.length ? `${dados.baixos.length} com estoque baixo` : "estoque ok"} tom={dados.baixos.length ? "aviso" : "neutro"} icone="caixa" />
        <Kpi rotulo="Grupo VIP" valor={String(dados.vipTotal)} variacao={`${dados.semana} pedidos na semana`} tom="neutro" icone="vip" />
      </div>

      {(pendentes.length > 0 || dados.novos > 0) && (
        <div className="grid gap-3 md:grid-cols-2">
          {dados.novos > 0 && <Aviso tom="aviso" titulo={`${dados.novos} pedido(s) novo(s) esperando confirmação`}><Link to="/painel/pedidos" className="text-ouro hover:underline">Abrir pedidos →</Link></Aviso>}
          {pendentes.length > 0 && <Aviso tom="info" titulo="Falta configurar"><span>{pendentes.join(", ")}. </span><Link to="/painel/configuracoes" className="text-ouro hover:underline">Ir para Configurações →</Link></Aviso>}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Cartao titulo="Faturamento por dia" descricao="Pedidos pagos, enviados ou entregues — últimos 14 dias">
          <GraficoLinha pontos={dados.dias} />
        </Cartao>
        <Cartao titulo="Produtos ativos por categoria">
          <ul className="grid gap-3">
            {dados.porCategoria.map((c) => (
              <li key={c.rotulo}>
                <div className="flex justify-between text-xs"><span className="capitalize text-cinza">{c.rotulo}</span><span className="font-bold text-marfim">{c.valor}</span></div>
                <div className="mt-1 h-2 rounded-full bg-white/6"><div className="h-2 rounded-full bg-[linear-gradient(90deg,#9c7a1e,#f1d97a)]" style={{ width: `${(c.valor / Math.max(1, dados.ativos)) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Cartao>
      </div>

      <Cartao titulo="Últimos pedidos" acoes={<Link to="/painel/pedidos" className="text-xs font-bold text-ouro hover:underline">ver todos</Link>} semPadding>
        <ul className="divide-y divide-linha">
          {dados.ultimos.map((p) => (
            <li key={p.id}>
              <Link to={`/painel/pedidos/${p.id}`} className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-white/[0.03] sm:px-5">
                <span className="min-w-0"><span className="font-semibold">#{p.numero} · {p.cliente.nome}</span><span className="block text-xs text-cinza">{dataHora(p.criadoEm)} · {p.itens.length} {p.itens.length === 1 ? "item" : "itens"}</span></span>
                <span className="flex shrink-0 items-center gap-3"><span className="font-display font-bold text-marfim">{moeda(p.total)}</span><Selo tom={TOM_STATUS[p.status]}>{ROTULO_STATUS[p.status]}</Selo></span>
              </Link>
            </li>
          ))}
        </ul>
      </Cartao>

      {dados.baixos.length > 0 && (
        <Cartao titulo="Estoque baixo" descricao="1 unidade ou menos">
          <ul className="flex flex-wrap gap-2">
            {dados.baixos.map((p) => <li key={p.id}><Link to={`/painel/produtos/${p.id}`} className="inline-flex min-h-9 items-center rounded-full border border-aviso/40 bg-aviso/10 px-3 text-xs font-semibold text-aviso hover:bg-aviso/20">{p.nome} · {p.cor} ({p.estoque})</Link></li>)}
          </ul>
        </Cartao>
      )}
    </Pagina>
  );
}
