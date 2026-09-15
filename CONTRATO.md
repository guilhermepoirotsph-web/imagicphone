# iMagicPhone — contrato de construção (loja + painel)

**Cliente:** iMagicPhone (@imagicphone, 10 mil seguidores) — "Sua Referência Apple no litoral". Loja física em Caraguatatuba (Av. Dr. Arthur da Costa Filho, 1659 — Sumaré, Sala 604), entrega no Litoral Norte, garantia e NF, Grupo VIP no WhatsApp. Pré-venda real do iPhone 18 Pro (R$ 10.999 / 256 GB, sinal 50%, entrega 23/09) publicada em 10/09/2026.
**Objetivo desta entrega:** prévia COMPLETA e navegável (e-commerce + painel admin) para o Guilherme apresentar ao cliente. Impacto visual "uau" (3D, scroll narrativo) sem degradar a loja.
**Data:** 14/09/2026. Autor: o arquiteto (sessão principal). Leitores: os construtores.

Leia inteiro antes de escrever uma linha. O contrato ganha do gosto pessoal — o valor está em todas as telas parecerem o mesmo produto.

---

## 1. Stack (já instalada — não instale nada)
Vite 7 + React 19 + TypeScript strict · Tailwind v4 (`@theme` em `src/estilos/global.css`) · react-router-dom 7 · zustand 5 (persist) · GSAP 3.15 (ScrollTrigger, SplitText) · Lenis · three 0.186 (só no herói).
Alias `@/` = `src/`. Build: `npm run build` (= `tsc -b && vite build`). Dev: `npm run dev` (porta 5190). **Não rode o dev server** — a sessão principal roda. Rode `npx tsc -b` para conferir tipos ao terminar.

## 2. Árvore e quem é dono de quê (NÃO edite arquivo de outro construtor)
```
src/
  estilos/global.css            tokens + utilitários (pronto — pode ADICIONAR utilitários no fim, nunca renomear)
  dados/negocio.ts              dados verificados do cliente + CONFIGURE_ME (pronto, só leitura)
  dados/tipos.ts                tipos do domínio (pronto, só leitura)
  dados/catalogo.ts             produtos semente + CATEGORIAS + CORES_VISUAIS (pronto)
  dados/sementes.ts             pedidos/clientes/vip/equipe/banners/config demo (pronto)
  dados/perguntas.ts            FAQ verificado (pronto)
  estado/loja.ts                A STORE (useLoja) — produtos, pedidos, clientes, vip, banners, config, usuarios, sessao
  estado/carrinho.ts            useCarrinho + usarLinhasCarrinho()
  lib/formatar.ts               moeda(), parcelas(), dataCurta(), slugificar(), idCurto(), normalizarWhatsapp()…
  lib/links.ts                  wa.padrao()/produto()/vip()/pedido(), linkMapa(), linkInfinitePay()
  lib/pix.ts                    payloadPix() + svgQr() (Pix nativo, sem gateway)
  lib/movimento.ts              gsap/ScrollTrigger/SplitText/Lenis + hooks: usarReveal, usarProgressoTrilho, usarTituloSplit, usarTilt, usarMagnetico, usarContador, animado(), rolarPara(), aoTrocarRota()
  componentes/marca/Logo.tsx    <Logo variante="completa|marca|wordmark" altura />, <MarcaMaca />, <Wordmark />
  componentes/marca/ArteProduto.tsx  <ArteProduto produto indice vista /> arte SVG do iPhone/acessório
  componentes/ui/Icones.tsx     <Icone nome="whatsapp|carrinho|escudo|…" tamanho />
  componentes/ui/Botao.tsx      <Botao variante="ouro|contorno|wa|fantasma|perigo" tamanho para|href|onClick icone magnetico cheio />
  componentes/ui/Selo.tsx       <Selo tom="ouro|neutro|ok|aviso|erro|demo|escuro|novo|seminovo" />
  componentes/ui/Secao.tsx      <Secao id rotulo titulo descricao acao alinhamento> filhos </Secao>
  componentes/ui/CartaoProduto.tsx  <CartaoProduto produto compacto />
  componentes/tres/             [construtor HERÓI] CenaIphone.tsx (three.js)
  loja/Casca.tsx                [construtor CASCA] layout da loja: BarraAnuncios + Cabecalho + <Outlet/> + Rodape + WhatsAppFlutuante + GavetaCarrinho + TarjaPrevia; usarLenis(); aoTrocarRota() no useEffect de location
  loja/Cabecalho.tsx, Rodape.tsx, BarraAnuncios.tsx, WhatsAppFlutuante.tsx, GavetaCarrinho.tsx, TarjaPrevia.tsx   [construtor CASCA]
  loja/secoes/Heroi.tsx         [construtor HERÓI]
  loja/secoes/Marquee.tsx, Categorias.tsx, Destaques.tsx, PreVenda.tsx, PorQue.tsx        [construtor HOME-A]
  loja/paginas/Inicio.tsx       [construtor HOME-A] compõe TODAS as seções na ordem da §5
  loja/secoes/ComoComprar.tsx, Clientes.tsx, Vip.tsx, Faq.tsx, Instagram.tsx, ChamadaFinal.tsx   [construtor HOME-B]
  loja/paginas/Catalogo.tsx, Produto.tsx                       [construtor CATÁLOGO]
  loja/paginas/Carrinho.tsx, Checkout.tsx, PedidoConfirmado.tsx  [construtor CHECKOUT]
  loja/paginas/Sobre.tsx, Contato.tsx, GrupoVip.tsx, Perguntas.tsx, NaoEncontrada.tsx  [construtor INSTITUCIONAL]
  painel/Casca.tsx, painel/componentes/*                       [construtor PAINEL-CASCA] + paginas/Entrar.tsx, Inicio.tsx (dashboard), Tutorial.tsx
  painel/paginas/Produtos.tsx, ProdutoForm.tsx, Vitrine.tsx    [construtor PAINEL-CATÁLOGO]
  painel/paginas/Pedidos.tsx, PedidoDetalhe.tsx, Clientes.tsx, Vip.tsx, Equipe.tsx, Configuracoes.tsx  [construtor PAINEL-OPERAÇÃO]
```
Cada seção/página tem `export default`. As seções da home NÃO recebem props (leem a store). Os stubs existentes já têm o nome certo — substitua o conteúdo.

## 3. Direção de arte — "vitrine de joalheria para iPhone"
- **Fundo preto** (`bg-fundo` #070708 / `bg-preto`), **ouro** (`text-ouro`, `botao-ouro`, `texto-ouro`, `filete-ouro`) como ÚNICO papel de ação. Marfim (`text-marfim`) para preço e destaque, cinza (`text-cinza`) para apoio. Nunca azul, nunca roxo de SaaS, nunca gradiente arco-íris.
- Tipografia: títulos `texto-display` (Sora), corpo Manrope. Rótulos `rotulo` (caixa alta, tracking largo, ouro).
- Superfícies: `cartao` (vidro escuro com filete 1px), `cartao-ouro` para destaque. Raio 1.25rem. Grão `grao` só em seções grandes.
- Luz: um `radial-gradient` dourado suave por seção grande (ex.: `bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,178,76,.12),transparent_70%)]`). Um filete dourado (`filete-ouro`) abre cada seção grande.
- Escada de z-index explícita nas cenas: 0 fundo · 1 efeito/canvas · 2 véu · 3 grão · 4+ conteúdo. Nunca dois irmãos posicionados no mesmo z-index.
- Ícones: só `<Icone nome=… />`. Sem emoji em títulos (emoji só onde já vem do dado do cliente, ex.: "🇺🇸").
- Selos: `<Selo tom="demo">exemplo</Selo>` em todo dado `demo: true`; **nunca esconder**.

## 4. Movimento (regras duras)
- `import { gsap, ScrollTrigger, usarReveal, … } from "@/lib/movimento"` — nunca importe gsap direto.
- **PROIBIDO `pin: true`** em qualquer ScrollTrigger (derruba o React no desmonte). Cena fixa = trilho alto (`h-[260svh]`) + filho `sticky top-0 h-svh` + `usarProgressoTrilho((p) => …)`. Use `svh`, não `dvh`.
- Tudo em `gsap.context` ou nos hooks de `movimento.ts`, com cleanup. Strict Mode monta duas vezes: sem vazamento.
- Animações só em `transform`/`opacity`. Nada de `transition: transform` em CSS num elemento que o GSAP move.
- `animado()` false (`?anim=0`) ⇒ tudo estático e legível, sem elemento com opacity 0. NÃO checar `prefers-reduced-motion` (decisão do Guilherme para e-commerces).
- Efeitos pesados (three, canvas) pausam fora da viewport (IntersectionObserver) e no `document.hidden`.
- Um `<h1>` por página. Foco visível. Tap targets ≥ 44px. Inputs 16px no mobile (já no CSS).

## 5. Home — ordem e briefing das seções (Inicio.tsx)
1. **Heroi** (HERÓI): trilho `h-[280svh]` com cena sticky `h-svh`. iPhone 3D procedural em three.js (RoundedBoxGeometry + tela emissiva com wallpaper dourado + módulo de câmera), luz de borda dourada, `MeshPhysicalMaterial` (clearcoat). O scroll gira o aparelho (rotação Y 0→~1.2π e leve tilt), o mouse dá parallax suave; ao final do trilho o iPhone diminui e a copy some para dar lugar à próxima seção. Copy à esquerda (desktop) / em cima (mobile): rotulo `negocio.heroi.rotulo`, h1 `negocio.heroi.titulo` (SplitText), subtítulo, CTAs (`Botao variante="wa"` com `wa.padrao(config.whatsappNumero, config.whatsappLink)` e `Botao variante="contorno" para="/iphones"`), linha de prova: "10 mil seguidores · garantia e NF · loja física em Caraguá". Fallback sem WebGL: `<ArteProduto>` grande com flutuação CSS. Pré-carrega nada pesado (three é chunk separado). Indicador "role para explorar".
2. **Marquee** (HOME-A): faixa dourada com os `config.anuncios` + destaques, duplicada para loop (`animate-marquee`), pausa no hover, `aria-hidden` no clone.
3. **PreVenda** (HOME-A): bloco de impacto do iPhone 18 Pro — os 4 produtos `preVenda` do catálogo em fila com seletor de cor (troca a `ArteProduto`), preço, "sinal de 50%", "entrega prevista 23/09", fonte visível (`produto.fonte`) em texto pequeno, CTA "Reservar pelo WhatsApp" e "Ver detalhes".
4. **Categorias** (HOME-A): 4 cartões (`CATEGORIAS`) em **carrossel 3D** (CSS `preserve-3d`, cada cartão rotacionado no eixo Y em torno de um centro; arrastar/setas/auto-giro lento; no mobile vira scroll horizontal com snap). Cada cartão com contagem real de produtos ativos da store.
5. **Destaques** (HOME-A): "Disponíveis" — grid dos `emDestaque` (máx. 8) com `CartaoProduto`, `usarReveal({stagger:.08})`, link "ver todos".
6. **PorQue** (HOME-A): 4 diferenciais de `negocio.diferenciais` com ícones (escudo/loja/entrega/vip), cartões com holofote no hover; contador `usarContador(10080)` "seguidores no Instagram".
7. **ComoComprar** (HOME-B): scroll-stack — 4 passos (Escolha → Fale no WhatsApp → Pague como preferir (Pix/cartão) → Receba no Litoral Norte ou retire na loja) empilhando com `sticky top-[..]` e escala/opacity dirigidas por `usarProgressoTrilho`.
8. **Clientes** (HOME-B): prova social HONESTA — "6 destaques de clientes no perfil" + "10 mil seguidores" (números de `negocio.provaSocial`) + 3 cartões de depoimento **claramente marcados** `<Selo tom="demo">exemplo</Selo>` com texto "Depoimento de exemplo — substituir pelos reais dos destaques Clientes" + botão "Ver depoimentos reais no Instagram" (`negocio.instagram`). Nenhum depoimento inventado como se fosse real.
9. **Vip** (HOME-B): "Grupo VIP" — formulário nome + WhatsApp + interesse (select dos modelos) → `useLoja().adicionarVip` + abre `wa.vip()`; validação; estado de sucesso.
10. **Faq** (HOME-B): acordeão de `perguntas` (details/summary estilizado, animação de altura).
11. **Instagram** (HOME-B): grade 6 cartões "posts" ESTILIZADOS (sem foto de terceiro): use temas reais dos posts recentes (pré-venda 18 Pro, "Nosso endereço", "iPhone 17 🇺🇸") como cartões tipográficos dourados com link para `negocio.instagram`. Rotule "Siga @imagicphone".
12. **ChamadaFinal** (HOME-B): CTA grande "iPhone é na iMagicPhone." + WhatsApp + endereço com `linkMapa`.

## 6. Loja — páginas
- **Catalogo** (`chave`: todos|iphones|seminovos|apple|acessorios|ofertas|pre-venda): título por chave, filtros (modelo, armazenamento, cor, condição, origem, faixa de preço), ordenação, busca por texto, contagem, grid `CartaoProduto`, estado vazio com CTA WhatsApp. Estado dos filtros na URL (`useSearchParams`).
- **Produto** (`/produto/:slug`): galeria (vistas costas/frente da `ArteProduto` com miniaturas + tilt), nome, variação, selos, preço/de, parcelas, pré-venda (sinal e data), destaques em lista com `check`, descrição, "Outras cores/armazenamentos" (mesmo `nome`, outros produtos), botões Adicionar ao carrinho / Comprar agora (adiciona e vai a /checkout) / Perguntar no WhatsApp (`wa.produto`), garantias (escudo/loja/entrega), relacionados (mesma categoria). Slug inexistente → NaoEncontrada. `fonte` visível em texto pequeno quando `demo`.
- **Carrinho**: linhas de `usarLinhasCarrinho()`, quantidade ±, remover, subtotal, aviso de estoque, CTA checkout, "continuar comprando".
- **Checkout**: 3 passos numa tela (dados: nome, WhatsApp; entrega: retirada na loja (endereço visível) ou entrega no Litoral Norte (select cidade + endereço); pagamento: Pix / Cartão / Combinar no WhatsApp). `criarPedido` da store → navega `/pedido/:id`. Pix: gera QR (`svgQr(payloadPix(...))` com `config.pixChave/pixNome/pixCidade`) — se chave for CONFIGURE_ME mostra aviso "Chave Pix ainda não configurada no painel" em vez de QR falso. Cartão: `linkInfinitePay(config.infiniteTag, …)` — sem tag, aviso equivalente. Sempre monta a mensagem do pedido para o WhatsApp (`wa.pedido(resumo)`) à prova de popup bloqueado (abre em clique, não automático).
- **PedidoConfirmado** (`/pedido/:id`): número, status, itens, total, "copia e cola" do Pix (botão copiar), botão WhatsApp com o resumo, linha do tempo do status (lê a store — muda se o painel mudar).
- **Sobre**: história curta com o que é verificável (bio, endereço, destaques), mapa embutido via link, valores. **Contato**: WhatsApp, Instagram, endereço + `linkMapa`, horário só se ≠ CONFIGURE_ME (senão "combine pelo WhatsApp"). **GrupoVip**: página do VIP (mesmo form da seção). **Perguntas**: FAQ completo. **NaoEncontrada**: 404 com busca e CTA.

## 7. Painel (`/painel`) — cliente se alimenta sozinho
- **Casca**: guarda de sessão (`useLoja().sessao`; sem sessão → `<Navigate to="/painel/entrar" />`, exceto na própria rota entrar). Sidebar (desktop) / barra inferior (mobile) com Início, Produtos, Pedidos, Clientes, Vitrine, Grupo VIP, Equipe, Configurações, Tutorial; topo com nome do usuário, papel (`ROTULO_PAPEL`), "Ver loja", "Sair". Papel `vendedor` NÃO vê Equipe nem Configurações (esconder no menu E bloquear na rota com aviso). Faixa fixa "DEMONSTRAÇÃO — dados fictícios · botão Resetar demo" (`resetarDemo`). Painel é `noindex` (já no index.html).
- **Entrar**: e-mail + senha; mostra os logins de demonstração na própria tela ("login descartável de demonstração"): `dono@imagicphone.demo`, `vendedor@imagicphone.demo`, senha `imagic2026` (constante `SENHA_DEMO`). Erro inline.
- **Inicio (dashboard)**: KPIs (pedidos hoje/semana, faturamento do mês, ticket médio, novos VIP, produtos ativos, estoque baixo), gráfico SVG de faturamento por dia (últimos 14 dias) e por categoria, lista dos últimos pedidos com status, alertas (estoque ≤1, pedidos novos, chave Pix não configurada).
- **Produtos**: tabela com busca, filtros (categoria, condição, ativo, demo), ações ativar/destacar/duplicar/excluir (confirmação), estoque inline. **ProdutoForm**: todos os campos do tipo `Produto` (nome, modelo, categoria, condição, família, origem, armazenamento, cor + corVisual (seletor visual com amostras de `CORES_VISUAIS`), preço/de em reais (converter para centavos), parcelas, estoque, destaque, pré-venda (sinal %, data), bateria, descrição, destaques (lista), imagens (arte automática + campo de URL de foto), demo/fonte), pré-visualização ao vivo do `CartaoProduto` ao lado, validação, salvar/cancelar. **Vitrine**: banners (CRUD com ordem/ativo), anúncios da barra (lista editável), texto do herói (edita `config.slogan`).
- **Pedidos**: kanban por status (colunas de `ROTULO_STATUS`) + tabela; **PedidoDetalhe**: itens, cliente (botão WhatsApp), entrega, pagamento, total, histórico, botões de transição (`proximosStatus`) com nota. **Clientes**: tabela, busca, marcar VIP, WhatsApp. **Vip**: lista + adicionar manual + exportar CSV (download só como texto em `<textarea>` copiável — download real é bloqueado em alguns webviews). **Equipe**: lista, adicionar (nome, e-mail, papel, ativo=false por padrão → "perfil nasce inerte"), promover/desativar; só `dono`/`suporte`. **Configuracoes**: formulário de `Configuracoes` (WhatsApp número + link, Instagram, endereço, horário, entrega, cidades, desconto Pix, parcelas, Pix chave/nome/cidade, InfiniteTag) com avisos do que está CONFIGURE_ME e prévia do QR Pix de R$ 1,00 quando a chave existe.
- **Tutorial**: passo a passo em cartões (cadastrar produto, publicar pré-venda, responder pedido, colocar chave Pix, trocar banner) + "o que ainda falta o cliente enviar" (fotos, horário, número do WhatsApp, chave Pix, InfiniteTag, logo em PNG).

## 8. Regras de conteúdo
- PT-BR em tudo (código, nomes, textos, commits). Sem Lorem ipsum.
- **Dado real ou lacuna honesta:** nada de depoimento/preço/horário inventado como real. `demo: true` → selo "exemplo". CONFIGURE_ME → elemento some ou vira aviso — nunca aparece a string "CONFIGURE_ME" para o visitante.
- Não use o logo/imagem da Apple. Nossa marca é `<Logo/>`. Fotos de terceiros: nenhuma.
- WhatsApp é o canal em todo lugar: `wa.*` de `@/lib/links` com `config.whatsappNumero`/`config.whatsappLink` da store (nunca número digitado no JSX).
- Crédito no rodapé: "Desenvolvido por GD Studio X" → https://www.gdstudiox.com.br.

## 9. Ao terminar (cada construtor)
1. `npx tsc -b` limpo nos SEUS arquivos (se um erro vier de arquivo de outro construtor, ignore e diga no relatório).
2. Relatório final (é o retorno da função, não fala com o Guilherme): arquivos criados, o que ficou pendente, riscos.
