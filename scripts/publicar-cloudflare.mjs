#!/usr/bin/env node
/**
 * publicar-cloudflare.mjs — prepara a pasta `dist/` para o Cloudflare Pages.
 *
 *   node scripts/publicar-cloudflare.mjs                          → PRÉVIA (endereço .pages.dev):
 *                                                                    noindex na página e no header, robots fechado
 *   node scripts/publicar-cloudflare.mjs https://imagicphone.com.br → PRODUÇÃO: robots aberto, canonical,
 *                                                                    og:url/og:image absolutos, sitemap
 *
 * Diferença para o GitHub Pages (scripts/publicar.mjs): aqui a base é "/" (o Pages serve na raiz do
 * domínio), não existe 404.html nem pasta por rota — quem resolve a rota funda é o `_redirects`
 * (`/* /index.html 200`), que devolve HTTP 200 de verdade.
 *
 * Depois:  npx wrangler pages deploy dist --project-name imagicphone
 * Ou no painel (Git): build `node scripts/publicar-cloudflare.mjs` · output `dist`.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RAIZ, 'dist');
const VITE = join(RAIZ, 'node_modules', 'vite', 'bin', 'vite.js');

const cru = (process.argv[2] || '').trim();
// o Git Bash converte argumento que começa com "/" num caminho do Windows
const dominio = /Program Files[\\/]Git/i.test(cru) ? '' : cru.replace(/\/+$/, '');
if (dominio && !/^https:\/\/[a-z0-9.-]+$/i.test(dominio)) {
  console.error('✗ domínio precisa ser https://dominio (sem caminho). Recebido:', cru);
  process.exit(1);
}
const PRODUCAO = !!dominio;
const falhas = [];

/* ------------------------------------------------------------------ build */
console.log(`build com base "/" (${PRODUCAO ? 'produção · ' + dominio : 'prévia'})…`);
rmSync(DIST, { recursive: true, force: true });
execFileSync(process.execPath, [VITE, 'build'], {
  cwd: RAIZ, stdio: 'inherit',
  env: { ...process.env, REPO_PAGES: '' }, // sem prefixo de repositório: o Pages serve na raiz
});

/* ------------------------------------------------------- index.html final */
const idx = join(DIST, 'index.html');
let html = readFileSync(idx, 'utf8');
if (PRODUCAO) {
  html = html.replace(/\s*<!-- PRÉVIA:[^\n]*\n/, '\n');
  html = html.replace(/\s*<meta name="robots" content="noindex, nofollow" \/>/, '');
  if (!/rel="canonical"/.test(html)) html = html.replace('</head>', `  <link rel="canonical" href="${dominio}/" />\n    <meta property="og:url" content="${dominio}/" />\n  </head>`);
  if (/name="robots"/.test(html)) falhas.push('produção: a meta noindex continua no index.html');
} else if (!/name="robots" content="noindex/.test(html)) {
  falhas.push('prévia: index.html está SEM a meta noindex');
}
writeFileSync(idx, html);

/* ------------------------------------------------- _redirects e _headers */
// SPA: qualquer rota funda entrega o index com HTTP 200 (o GitHub Pages precisava de pasta por rota)
writeFileSync(join(DIST, '_redirects'), '/*    /index.html   200\n');

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.supabase.co",
  "connect-src 'self' https://*.supabase.co",
  "frame-src https://www.instagram.com https://instagram.com https://www.google.com",
  "worker-src 'self' blob:",
  "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
  // 'upgrade-insecure-requests' fica de fora: o navegador IGNORA e avisa no console quando a CSP é Report-Only
].join('; ');
writeFileSync(join(DIST, '_headers'), [
  '/*',
  '  X-Content-Type-Options: nosniff',
  '  X-Frame-Options: DENY',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  '  Cross-Origin-Opener-Policy: same-origin',
  '  Strict-Transport-Security: max-age=31536000; includeSubDomains',
  // Report-Only enquanto o site é prévia: registra sem quebrar nada (vira enforce depois do domínio)
  `  Content-Security-Policy${PRODUCAO ? '-Report-Only' : '-Report-Only'}: ${csp}`,
  ...(PRODUCAO ? [] : ['  X-Robots-Tag: noindex, nofollow']),
  '',
  '/painel/*',
  '  X-Robots-Tag: noindex, nofollow',   // o painel nunca entra em buscador
  '',
  '/assets/*',
  '  Cache-Control: public, max-age=31536000, immutable',  // nomes com hash: cache longo
  '',
  '/index.html',
  '  Cache-Control: public, max-age=0, must-revalidate',
  '',
].join('\n'));

/* ------------------------------------------------- robots.txt e sitemap */
if (PRODUCAO) {
  writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /painel\n\nSitemap: ${dominio}/sitemap.xml\n`);
  const rotas = ['/', '/catalogo', '/sobre', '/contato', '/vip', '/perguntas'];
  writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rotas.map(r => `  <url><loc>${dominio}${r}</loc></url>`).join('\n')}\n</urlset>\n`);
} else {
  writeFileSync(join(DIST, 'robots.txt'), '# Endereco provisorio: fora do buscador ate o dominio definitivo.\nUser-agent: *\nDisallow: /\n');
}

/* ------------------------------------------------------ rede de segurança */
const arquivos = [];
(function andar(d) { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? andar(p) : arquivos.push(p); } })(DIST);
const jwtPerigoso = (txt) => {
  for (const [, payload] of txt.matchAll(/\beyJ[A-Za-z0-9_-]{8,}\.([A-Za-z0-9_-]{20,})\./g)) {
    try { const p = JSON.parse(Buffer.from(payload, 'base64url').toString()); if (p.role && p.role !== 'anon') return p.role; } catch {}
  }
  return null;
};
for (const p of arquivos) {
  if (!/\.(html|css|js|mjs|json|txt|xml|svg)$/i.test(p) && !/_headers|_redirects/.test(p)) continue;
  const txt = readFileSync(p, 'utf8');
  const role = jwtPerigoso(txt);
  if (role) falhas.push(`JWT com role "${role}" em ${relative(DIST, p)}`);
  if (/(service_role|sk_live|xoxb-|ghp_[A-Za-z0-9]{20,})/.test(txt)) falhas.push(`possível segredo em ${relative(DIST, p)}`);
}
if (!existsSync(join(DIST, 'index.html'))) falhas.push('dist/index.html não existe');

const total = arquivos.reduce((s, p) => s + statSync(p).size, 0);
console.log(`\n${PRODUCAO ? '🚀 PRODUÇÃO' : '👀 PRÉVIA'} → dist/ (${arquivos.length} arquivos, ${(total / 1024 / 1024).toFixed(1)} MB)`);
console.log('  ✓ _redirects (SPA 200) · _headers (segurança + cache) · robots' + (PRODUCAO ? ' aberto + sitemap' : ' fechado'));
if (falhas.length) { console.error('\n✗ PUBLICAÇÃO ABORTADA:'); falhas.forEach(f => console.error('  - ' + f)); process.exit(1); }
console.log('  ✓ varredura: sem segredo no pacote');
console.log(`\npublicar:  npx wrangler pages deploy dist --project-name imagicphone`);
