# iMagicPhone — roteiro de apresentação da prévia

**Link da prévia:** https://guilhermepoirotsph-web.github.io/imagicphone/
(fica no ar sozinho; não depende do seu computador ligado)

**Painel:** https://guilhermepoirotsph-web.github.io/imagicphone/painel
Login de demonstração (aparece na própria tela): `dono@imagicphone.demo` · senha `imagic2026`
(ou `vendedor@imagicphone.demo` para mostrar que o vendedor vê menos coisas)

## O que dizer em cada parte (5 minutos)

1. **Home** — role devagar: o iPhone 3D gira com a rolagem e segue o mouse. Tudo que está
   escrito veio do Instagram deles (bio, endereço, "Garantia e NF", "Entrega no Litoral
   Norte", 10 mil seguidores).
2. **Pré-venda do iPhone 18 Pro** — é o post real de 10/09 (R$ 10.999, 256 GB, sinal de 50%,
   entrega 23/09). Troque a cor com os botões. Diga: "quando você postar a próxima pré-venda,
   é só cadastrar no painel que esse bloco muda sozinho".
3. **Categorias em 3D, destaques, por quê, como comprar** — rolagem narrativa. Os produtos
   com selo **"exemplo"** são fictícios só para mostrar o layout; os reais entram pelo painel.
4. **Produto → carrinho → finalizar** — preencha nome e WhatsApp, escolha retirada na loja,
   Pix. A tela do pedido mostra o número, o andamento e o botão que abre o WhatsApp com o
   resumo pronto. O QR Pix aparece assim que a chave for cadastrada (hoje mostra o aviso).
5. **Painel** — entre como dono: dashboard, cadastre um produto (ele aparece na loja na hora),
   abra o pedido que você acabou de fazer e marque como "confirmado" → volte na loja e a página
   do pedido já mudou. Mostre Configurações (chave Pix com prévia do QR) e o Tutorial.
6. **Mobile** — abra no celular: mesmo link. O painel tem barra inferior.

## O que é de verdade e o que é exemplo
- Verdade (do IG): nome, slogan, endereço (Green Office, sala 604), WhatsApp oficial (link da
  bio), destaques, seguidores, pré-venda 18 Pro.
- Exemplo (com selo): os outros produtos e preços, pedidos, clientes, VIP, equipe.
- Não existe ainda: número do WhatsApp em dígitos, horário, chave Pix, InfiniteTag, fotos,
  CNPJ. O site esconde ou avisa, nunca inventa.

## O que pedir ao cliente se fechar
Fotos reais dos produtos, número do WhatsApp, horário, chave Pix + nome do recebedor,
InfiniteTag (cartão), logo em PNG/SVG, CNPJ/razão social e a lista de produtos com preço.

## Se precisar republicar
Na pasta `site`, no terminal (PowerShell): `node scripts/publicar.mjs imagicphone --push`
