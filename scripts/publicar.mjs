/**
 * Prepara (e opcionalmente publica) o pacote do GitHub Pages.
 *
 *   node scripts/publicar.mjs                 → build com base "/" (domínio próprio / prévia local)
 *   node scripts/publicar.mjs imagicphone     → build como página de projeto (base "/imagicphone/")
 *   node scripts/publicar.mjs imagicphone --push  → …e publica na branch gh-pages do remote origin
 *
 * O que faz além do build:
 *  - 404.html = index.html (o Pages serve 404.html em rota funda; o app assume e roteia);
 *  - pré-gera um index.html POR ROTA (inclusive /produto/<slug> de todo o catálogo) para
 *    a rota funda responder HTTP 200, não 404 (aprendizado da Enciclopédia);
 *  - varre o pacote atrás de segredo antes de liberar (chave de serviço, JWT, token);
 *  - publica só o pacote: o repositório guarda o projeto inteiro, a hospedagem recebe o dist.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(RAIZ, "dist");
const VITE = join(RAIZ, "node_modules", "vite", "bin", "vite.js");
const ESBUILD = join(RAIZ, "node_modules", "esbuild", "bin", "esbuild");

const args = process.argv.slice(2);
const push = args.includes("--push");
// o Git Bash converte "/" solto em "C:/Program Files/Git" — aceitamos só o NOME do repo
const cru = args.find((a) => !a.startsWith("--")) ?? "";
const repo = /^[a-z0-9-_]+$/i.test(cru) ? cru : "";
if (cru && !repo) console.log(`aviso: argumento "${cru}" ignorado (passe só o nome do repositório, ex.: imagicphone)`);

/* ---------------------------------------------------------------- build */
console.log(`build com base "${repo ? `/${repo}/` : "/"}"…`);
execFileSync(process.execPath, [VITE, "build"], { cwd: RAIZ, stdio: "inherit", env: { ...process.env, REPO_PAGES: repo } });

/* ---------------------------------------------------- rotas pré-geradas */
copyFileSync(join(DIST, "index.html"), join(DIST, "404.html"));

// slugs do catálogo: empacota o TS num módulo temporário e importa
const tmpCatalogo = join(DIST, "_catalogo.mjs");
execFileSync(process.execPath, [ESBUILD, join(RAIZ, "src/dados/catalogo.ts"), "--bundle", "--format=esm", "--platform=node", `--outfile=${tmpCatalogo}`, "--log-level=error"], { cwd: RAIZ, stdio: "inherit" });
const { catalogoSemente } = await import(pathToFileURL(tmpCatalogo).href);
rmSync(tmpCatalogo, { force: true });

const ROTAS = [
  "produtos", "iphones", "seminovos", "apple", "acessorios", "ofertas", "pre-venda",
  "carrinho", "checkout", "sobre", "contato", "grupo-vip", "perguntas",
  "painel", "painel/entrar",
  ...catalogoSemente.map((p) => `produto/${p.slug}`),
];
const indexHtml = readFileSync(join(DIST, "index.html"), "utf8");
for (const rota of ROTAS) {
  const pasta = join(DIST, rota);
  mkdirSync(pasta, { recursive: true });
  writeFileSync(join(pasta, "index.html"), indexHtml);
}
console.log(`${ROTAS.length} rotas pré-geradas + 404.html`);

/* ----------------------------------------------------- varredura anti-segredo */
const SUSPEITOS = [
  /service_role/i,
  /eyJ[A-Za-z0-9_-]{60,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/, // JWT
  /sk-[A-Za-z0-9]{20,}/,
  /ghp_[A-Za-z0-9]{30,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];
const TEXTO = new Set([".html", ".js", ".css", ".json", ".txt", ".svg", ".map"]);
let achados = 0;
function varrer(pasta) {
  for (const nome of readdirSync(pasta)) {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) {
      varrer(caminho);
      continue;
    }
    if (!TEXTO.has(extname(nome))) continue;
    const conteudo = readFileSync(caminho, "utf8");
    for (const re of SUSPEITOS) {
      const m = conteudo.match(re);
      if (m) {
        achados++;
        console.error(`SEGREDO SUSPEITO em ${caminho.replace(RAIZ, "")}: ${m[0].slice(0, 24)}…`);
      }
    }
  }
}
varrer(DIST);
if (achados) {
  console.error(`\n${achados} trecho(s) suspeito(s) — publicação BLOQUEADA.`);
  process.exit(1);
}
console.log("varredura anti-segredo: limpa");

/* ------------------------------------------------------------ publicar */
if (!push) {
  console.log(`\npacote pronto em ${DIST}. Para publicar: node scripts/publicar.mjs ${repo || "<repo>"} --push`);
  process.exit(0);
}
const remoto = execFileSync("git", ["remote", "get-url", "origin"], { cwd: RAIZ, encoding: "utf8" }).trim();
if (!remoto) {
  console.error("sem remote origin no repositório — configure antes de publicar");
  process.exit(1);
}
const temp = mkdtempSync(join(tmpdir(), "imagic-pages-"));
cpSync(DIST, temp, { recursive: true });
writeFileSync(join(temp, ".nojekyll"), "");
const git = (...a) => execFileSync("git", a, { cwd: temp, stdio: "inherit" });
git("init", "-q", "-b", "gh-pages");
git("add", "-A");
git("-c", "user.name=GD Studio X", "-c", "user.email=gdstudiox6@gmail.com", "commit", "-q", "-m", `publicação ${new Date().toISOString()}`);
git("push", "--force", remoto, "HEAD:gh-pages");
rmSync(temp, { recursive: true, force: true });
const usuario = remoto.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
console.log(`\npublicado na branch gh-pages${usuario ? ` → https://${usuario[1]}.github.io/${usuario[2]}/` : ""}`);
console.log("Se for a primeira vez: Settings → Pages → Source: Deploy from a branch → gh-pages / (root).");
