/** Login do painel — com os logins de demonstração visíveis (descartáveis). */
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/componentes/marca/Logo";
import Botao from "@/componentes/ui/Botao";
import Icone from "@/componentes/ui/Icones";
import { useLoja } from "@/estado/loja";
import { SENHA_DEMO } from "@/dados/sementes";
import { Campo, Entrada } from "@/painel/componentes/Campo";

const DEMOS = [
  { email: "dono@imagicphone.demo", rotulo: "Entrar como dono" },
  { email: "vendedor@imagicphone.demo", rotulo: "Entrar como vendedor" },
];

export default function PainelEntrar() {
  const navigate = useNavigate();
  const entrar = useLoja((s) => s.entrar);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Entrar · Painel iMagicPhone";
  }, []);

  function tentar(e: string, s: string) {
    const r = entrar(e, s);
    if (r.ok) navigate("/painel");
    else setErro(r.erro ?? "Não foi possível entrar.");
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    tentar(email, senha);
  }

  return (
    <div className="grid min-h-svh place-items-center bg-preto bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,178,76,.16),transparent_70%)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo altura={40} /></div>
        <form onSubmit={enviar} className="cartao p-6 sm:p-8">
          <h1 className="texto-display text-2xl">Painel da loja</h1>
          <p className="mt-1 text-sm text-cinza">Entre para cadastrar produtos, acompanhar pedidos e configurar a loja.</p>
          <div className="mt-6 grid gap-4">
            <Campo rotulo="E-mail">
              <Entrada type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Campo>
            <Campo rotulo="Senha">
              <Entrada type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </Campo>
            {erro && <p role="alert" className="text-sm text-erro">{erro}</p>}
            <Botao type="submit" variante="ouro" cheio>Entrar</Botao>
          </div>
        </form>

        <div className="mt-4 rounded-[1.25rem] border border-dashed border-aviso/50 bg-aviso/8 p-5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-aviso"><Icone nome="info" tamanho={14} />Login de demonstração (descartável)</p>
          <p className="mt-2 text-sm text-cinza">Senha: <code className="rounded bg-preto px-1.5 py-0.5 text-marfim">{SENHA_DEMO}</code>. Nada aqui é conta real — na loja de verdade cada pessoa cria a própria senha.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {DEMOS.map((d) => (
              <button key={d.email} type="button" onClick={() => { setEmail(d.email); setSenha(SENHA_DEMO); tentar(d.email, SENHA_DEMO); }} className="botao-contorno !min-h-11 text-sm">
                {d.rotulo}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-cinza"><a href="/" className="hover:text-ouro">← Voltar para a loja</a></p>
      </div>
    </div>
  );
}
