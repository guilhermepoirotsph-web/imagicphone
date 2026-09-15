/**
 * Rotas. Loja pública em "/", painel administrativo em "/painel".
 * Páginas carregam sob demanda (lazy) — o painel não pesa a loja.
 * Error boundary global: erro de render vira recado + caminho de volta,
 * nunca tela preta (aprendizado da Enciclopédia).
 */
import { Component, lazy, Suspense, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const CascaLoja = lazy(() => import("./loja/Casca"));
const Inicio = lazy(() => import("./loja/paginas/Inicio"));
const Catalogo = lazy(() => import("./loja/paginas/Catalogo"));
const Produto = lazy(() => import("./loja/paginas/Produto"));
const Carrinho = lazy(() => import("./loja/paginas/Carrinho"));
const Checkout = lazy(() => import("./loja/paginas/Checkout"));
const PedidoConfirmado = lazy(() => import("./loja/paginas/PedidoConfirmado"));
const Sobre = lazy(() => import("./loja/paginas/Sobre"));
const Contato = lazy(() => import("./loja/paginas/Contato"));
const GrupoVip = lazy(() => import("./loja/paginas/GrupoVip"));
const Perguntas = lazy(() => import("./loja/paginas/Perguntas"));
const NaoEncontrada = lazy(() => import("./loja/paginas/NaoEncontrada"));

const CascaPainel = lazy(() => import("./painel/Casca"));
const PainelEntrar = lazy(() => import("./painel/paginas/Entrar"));
const PainelInicio = lazy(() => import("./painel/paginas/Inicio"));
const PainelProdutos = lazy(() => import("./painel/paginas/Produtos"));
const PainelProdutoForm = lazy(() => import("./painel/paginas/ProdutoForm"));
const PainelPedidos = lazy(() => import("./painel/paginas/Pedidos"));
const PainelPedidoDetalhe = lazy(() => import("./painel/paginas/PedidoDetalhe"));
const PainelClientes = lazy(() => import("./painel/paginas/Clientes"));
const PainelVitrine = lazy(() => import("./painel/paginas/Vitrine"));
const PainelVip = lazy(() => import("./painel/paginas/Vip"));
const PainelEquipe = lazy(() => import("./painel/paginas/Equipe"));
const PainelConfiguracoes = lazy(() => import("./painel/paginas/Configuracoes"));
const PainelTutorial = lazy(() => import("./painel/paginas/Tutorial"));

class LimiteDeErro extends Component<{ children: ReactNode }, { erro: Error | null }> {
  state = { erro: null as Error | null };
  static getDerivedStateFromError(erro: Error) {
    return { erro };
  }
  render() {
    if (this.state.erro) {
      return (
        <main className="grid min-h-svh place-items-center bg-fundo p-6 text-center text-tinta">
          <div className="cartao max-w-md p-8">
            <p className="rotulo justify-center">Ops</p>
            <h1 className="texto-display mt-3 text-2xl">Algo saiu do lugar nesta tela.</h1>
            <p className="mt-3 text-sm text-cinza">Recarregue a página ou volte para o início. Se continuar, chame a gente no WhatsApp.</p>
            <a href="/" className="botao-ouro mt-6">Voltar ao início</a>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

function Carregando() {
  return (
    <div className="grid min-h-svh place-items-center bg-fundo" role="status" aria-live="polite">
      <div className="size-10 animate-spin rounded-full border-2 border-linha-forte border-t-ouro" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}

export default function App() {
  return (
    <LimiteDeErro>
      <Suspense fallback={<Carregando />}>
        <Routes>
          <Route element={<CascaLoja />}>
            <Route index element={<Inicio />} />
            <Route path="produtos" element={<Catalogo chave="todos" />} />
            <Route path="iphones" element={<Catalogo chave="iphones" />} />
            <Route path="seminovos" element={<Catalogo chave="seminovos" />} />
            <Route path="apple" element={<Catalogo chave="apple" />} />
            <Route path="acessorios" element={<Catalogo chave="acessorios" />} />
            <Route path="ofertas" element={<Catalogo chave="ofertas" />} />
            <Route path="pre-venda" element={<Catalogo chave="pre-venda" />} />
            <Route path="produto/:slug" element={<Produto />} />
            <Route path="carrinho" element={<Carrinho />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="pedido/:id" element={<PedidoConfirmado />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="contato" element={<Contato />} />
            <Route path="grupo-vip" element={<GrupoVip />} />
            <Route path="perguntas" element={<Perguntas />} />
            <Route path="*" element={<NaoEncontrada />} />
          </Route>

          <Route path="painel" element={<CascaPainel />}>
            <Route path="entrar" element={<PainelEntrar />} />
            <Route index element={<PainelInicio />} />
            <Route path="produtos" element={<PainelProdutos />} />
            <Route path="produtos/novo" element={<PainelProdutoForm />} />
            <Route path="produtos/:id" element={<PainelProdutoForm />} />
            <Route path="pedidos" element={<PainelPedidos />} />
            <Route path="pedidos/:id" element={<PainelPedidoDetalhe />} />
            <Route path="clientes" element={<PainelClientes />} />
            <Route path="vitrine" element={<PainelVitrine />} />
            <Route path="vip" element={<PainelVip />} />
            <Route path="equipe" element={<PainelEquipe />} />
            <Route path="configuracoes" element={<PainelConfiguracoes />} />
            <Route path="tutorial" element={<PainelTutorial />} />
            <Route path="*" element={<Navigate to="/painel" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </LimiteDeErro>
  );
}
