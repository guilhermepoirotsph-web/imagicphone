/** Tutorial — passo a passo das tarefas do dia a dia + o que ainda falta o cliente enviar. */
import Pagina from "@/painel/componentes/Pagina";
import Cartao from "@/painel/componentes/Cartao";
import Icone, { type NomeIcone } from "@/componentes/ui/Icones";
import Botao from "@/componentes/ui/Botao";

const PASSOS: { icone: NomeIcone; titulo: string; passos: string[]; link: string }[] = [
  { icone: "caixa", titulo: "Cadastrar um produto", passos: ["Produtos → Novo produto", "Preencha nome, cor, GB, preço e estoque", "Marque 'Em destaque' para aparecer na home", "Salve — já está na loja"], link: "/painel/produtos/novo" },
  { icone: "calendario", titulo: "Publicar uma pré-venda", passos: ["No produto, ligue 'Pré-venda'", "Informe o sinal (%) e a data prevista", "O bloco de pré-venda da home muda sozinho"], link: "/painel/produtos" },
  { icone: "pedidos", titulo: "Responder um pedido", passos: ["Pedidos → abra o pedido novo", "Confirme, marque como pago quando o Pix cair", "Use 'Avisar no WhatsApp' para falar com o cliente", "Marque enviado/entregue"], link: "/painel/pedidos" },
  { icone: "pix", titulo: "Colocar a chave Pix", passos: ["Configurações → Pagamento", "Cole a chave e o nome do recebedor", "Confira a prévia do QR e salve", "A partir daí o site gera o QR de cada pedido"], link: "/painel/configuracoes" },
  { icone: "vitrine", titulo: "Trocar um banner ou aviso", passos: ["Vitrine → edite o banner ou o aviso", "Ative/desative sem apagar", "Reordene com as setas"], link: "/painel/vitrine" },
];

const FALTA = ["Fotos reais dos produtos (o site usa arte enquanto não tem)", "Número do WhatsApp em dígitos (para as mensagens do site já saírem com o produto)", "Horário de funcionamento", "Chave Pix e nome do recebedor", "InfiniteTag (para pagamento no cartão)", "Logo em PNG/SVG de alta resolução", "CNPJ / razão social para o rodapé e a nota"];

export default function PainelTutorial() {
  return (
    <Pagina titulo="Tutorial" descricao="Tudo que a loja precisa fazer no dia a dia cabe aqui. Nada depende da agência.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PASSOS.map((p) => (
          <Cartao key={p.titulo}>
            <span className="grid size-10 place-items-center rounded-xl border border-ouro/30 bg-ouro/10 text-ouro"><Icone nome={p.icone} tamanho={18} /></span>
            <h3 className="mt-3 font-display font-bold">{p.titulo}</h3>
            <ol className="mt-2 grid gap-1.5 text-sm text-cinza">{p.passos.map((s, i) => <li key={s} className="flex gap-2"><span className="font-bold text-ouro">{i + 1}.</span>{s}</li>)}</ol>
            <div className="mt-4"><Botao variante="contorno" tamanho="sm" para={p.link} iconeDepois="seta">Ir para lá</Botao></div>
          </Cartao>
        ))}
      </div>
      <Cartao titulo="O que ainda falta a loja enviar" descricao="Enquanto não chega, o site mostra 'exemplo' ou manda para o WhatsApp — nunca inventa">
        <ul className="grid gap-2 sm:grid-cols-2">{FALTA.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-cinza"><Icone nome="check" tamanho={16} className="mt-0.5 shrink-0 text-ouro" />{f}</li>)}</ul>
      </Cartao>
    </Pagina>
  );
}
