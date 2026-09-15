/**
 * Grupo VIP — formulário controlado (nome, WhatsApp com máscara, interesse)
 * com validação inline. Ao enviar: grava na store (`adicionarVip`, origem
 * "site") e mostra o sucesso com botão que abre `wa.vip()` em nova aba —
 * no clique do usuário, nunca automático (popup bloqueado não derruba o fluxo).
 */
import { useId, useMemo, useState, type FormEvent } from "react";
import { useLoja } from "@/estado/loja";
import { wa } from "@/lib/links";
import { mascararTelefone, normalizarWhatsapp } from "@/lib/formatar";
import { usarReveal } from "@/lib/movimento";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";

interface Campos {
  nome: string;
  whatsappDigitos: string; // só dígitos, sem o 55
  interesse: string;
}
type Erros = Partial<Record<keyof Campos, string>>;

const OUTRO = "Outro";

/** Máscara progressiva enquanto digita; completa, usa a do sistema. */
function formatarParcial(d: string): string {
  if (d.length >= 10) return mascararTelefone(d);
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 0) return `(${d}`;
  return "";
}

function validar(c: Campos): Erros {
  const erros: Erros = {};
  if (c.nome.trim().length < 2) erros.nome = "Digite seu nome.";
  if (c.whatsappDigitos.length < 10 || c.whatsappDigitos.length > 11) erros.whatsappDigitos = "Digite o WhatsApp com DDD (10 ou 11 dígitos).";
  if (!c.interesse) erros.interesse = "Escolha o que você procura.";
  return erros;
}

const VANTAGENS = [
  { icone: "brilho" as const, texto: "Chegadas e pré-vendas antes de publicar no Instagram" },
  { icone: "estrela" as const, texto: "Ofertas exclusivas de iPhones novos e seminovos" },
  { icone: "whatsapp" as const, texto: "Atendimento direto pelo WhatsApp da loja" },
];

export default function Vip() {
  const produtos = useLoja((s) => s.produtos);
  const config = useLoja((s) => s.config);
  const id = useId();
  const refBloco = usarReveal<HTMLDivElement>({ stagger: 0.12, y: 30 });

  const opcoes = useMemo(() => {
    const nomes = new Set<string>();
    for (const p of produtos) if (p.ativo) nomes.add(p.nome);
    return [...nomes, OUTRO];
  }, [produtos]);

  const [campos, setCampos] = useState<Campos>({ nome: "", whatsappDigitos: "", interesse: "" });
  const [erros, setErros] = useState<Erros>({});
  const [tocado, setTocado] = useState(false);
  const [sucesso, setSucesso] = useState<{ nome: string } | null>(null);

  const linkVip = wa.vip(config.whatsappNumero, config.whatsappLink);

  function atualizar<K extends keyof Campos>(chave: K, valor: Campos[K]) {
    const proximo = { ...campos, [chave]: valor };
    setCampos(proximo);
    if (tocado) setErros(validar(proximo));
  }

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const encontrados = validar(campos);
    setErros(encontrados);
    setTocado(true);
    if (Object.keys(encontrados).length > 0) {
      const primeiro = Object.keys(encontrados)[0];
      document.getElementById(`${id}-${primeiro}`)?.focus();
      return;
    }
    const nome = campos.nome.trim();
    useLoja.getState().adicionarVip({
      nome,
      whatsapp: normalizarWhatsapp(campos.whatsappDigitos),
      interesse: campos.interesse,
      origem: "site",
    });
    setSucesso({ nome });
  }

  function novoCadastro() {
    setCampos({ nome: "", whatsappDigitos: "", interesse: "" });
    setErros({});
    setTocado(false);
    setSucesso(null);
  }

  const idNome = `${id}-nome`;
  const idZap = `${id}-whatsappDigitos`;
  const idInteresse = `${id}-interesse`;

  return (
    <section id="grupo-vip" aria-labelledby="grupo-vip-titulo" className="relative py-20 sm:py-24">
      <div aria-hidden="true" className="filete-ouro absolute inset-x-0 top-0" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,178,76,.12),transparent_70%)]" />

      <div ref={refBloco} data-reveal className="container-pagina grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* copy */}
        <div>
          <p className="rotulo">
            <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" />
            Grupo VIP
          </p>
          <h2 id="grupo-vip-titulo" className="texto-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
            Chegadas e ofertas <span className="texto-ouro">antes de todo mundo.</span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cinza sm:text-lg">
            O Grupo VIP é o canal da loja no WhatsApp para avisar primeiro quem está na lista. Entrada gratuita — deixe seu contato e o que você procura.
          </p>
          <ul className="mt-8 space-y-4">
            {VANTAGENS.map((v) => (
              <li key={v.texto} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-ouro/30 bg-ouro/10 text-ouro" aria-hidden="true">
                  <Icone nome={v.icone} tamanho={16} />
                </span>
                <span className="text-sm text-marfim/90 sm:text-base">{v.texto}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* formulário / sucesso */}
        <div className="cartao-ouro relative p-6 sm:p-8 lg:p-10">
          {sucesso ? (
            <div role="status" aria-live="polite" className="flex flex-col items-start gap-5">
              <span className="grid size-14 place-items-center rounded-full bg-ok/15 text-ok" aria-hidden="true">
                <Icone nome="check" tamanho={28} espessura={2.2} />
              </span>
              <div>
                <h3 className="texto-display text-2xl sm:text-3xl">Você está na lista, {sucesso.nome.split(" ")[0]}!</h3>
                <p className="mt-3 text-sm leading-relaxed text-cinza sm:text-base">
                  Seu contato foi registrado para a loja. Agora toque no botão para entrar no grupo pelo WhatsApp — o link abre em nova aba.
                </p>
              </div>
              <Botao variante="wa" href={linkVip} icone="whatsapp" tamanho="lg" cheio magnetico>
                Entrar no grupo pelo WhatsApp
              </Botao>
              <button type="button" onClick={novoCadastro} className="min-h-11 text-sm text-cinza underline-offset-4 hover:text-tinta hover:underline">
                Cadastrar outra pessoa
              </button>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
              <div>
                <h3 className="texto-display text-xl sm:text-2xl">Entrar no Grupo VIP</h3>
                <p className="mt-1 text-sm text-cinza">Leva 20 segundos. Sem spam: só chegadas e ofertas.</p>
              </div>

              <div>
                <label htmlFor={idNome} className="mb-1.5 block text-sm font-semibold text-marfim">
                  Nome
                </label>
                <input
                  id={idNome}
                  name="nome"
                  type="text"
                  autoComplete="name"
                  className="campo"
                  placeholder="Como quer ser chamado"
                  value={campos.nome}
                  onChange={(e) => atualizar("nome", e.target.value)}
                  aria-invalid={erros.nome ? true : undefined}
                  aria-describedby={erros.nome ? `${idNome}-erro` : undefined}
                  maxLength={80}
                />
                {erros.nome && (
                  <p id={`${idNome}-erro`} className="mt-1.5 text-sm text-erro">
                    {erros.nome}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={idZap} className="mb-1.5 block text-sm font-semibold text-marfim">
                  WhatsApp
                </label>
                <input
                  id={idZap}
                  name="whatsapp"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  className="campo"
                  placeholder="(12) 99999-9999"
                  value={formatarParcial(campos.whatsappDigitos)}
                  onChange={(e) => atualizar("whatsappDigitos", e.target.value.replace(/\D/g, "").replace(/^55(?=\d{10,})/, "").slice(0, 11))}
                  aria-invalid={erros.whatsappDigitos ? true : undefined}
                  aria-describedby={erros.whatsappDigitos ? `${idZap}-erro` : `${idZap}-ajuda`}
                />
                {erros.whatsappDigitos ? (
                  <p id={`${idZap}-erro`} className="mt-1.5 text-sm text-erro">
                    {erros.whatsappDigitos}
                  </p>
                ) : (
                  <p id={`${idZap}-ajuda`} className="mt-1.5 text-xs text-cinza-escuro">
                    Com DDD. Usamos só para o grupo.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={idInteresse} className="mb-1.5 block text-sm font-semibold text-marfim">
                  O que você procura
                </label>
                <div className="relative">
                  <select
                    id={idInteresse}
                    name="interesse"
                    className="campo appearance-none pr-11"
                    value={campos.interesse}
                    onChange={(e) => atualizar("interesse", e.target.value)}
                    aria-invalid={erros.interesse ? true : undefined}
                    aria-describedby={erros.interesse ? `${idInteresse}-erro` : undefined}
                  >
                    <option value="" disabled>
                      Escolha um modelo
                    </option>
                    {opcoes.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <Icone nome="chevron" tamanho={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-cinza" />
                </div>
                {erros.interesse && (
                  <p id={`${idInteresse}-erro`} className="mt-1.5 text-sm text-erro">
                    {erros.interesse}
                  </p>
                )}
              </div>

              <Botao type="submit" variante="ouro" tamanho="lg" cheio icone="vip">
                Quero entrar no VIP
              </Botao>
              <p className="text-center text-xs leading-relaxed text-cinza-escuro">
                Depois de enviar, um botão abre o WhatsApp da loja para você entrar no grupo.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
