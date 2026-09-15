/** Rodapé: marca + endereço, Loja, Atendimento, Institucional e crédito da GD Studio X. */
import { Link } from "react-router-dom";
import Logo from "@/componentes/marca/Logo";
import Icone from "@/componentes/ui/Icones";
import { useLoja } from "@/estado/loja";
import { negocio, CONFIGURE_ME } from "@/dados/negocio";
import { wa, linkMapa } from "@/lib/links";

function Coluna({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <nav aria-label={titulo} className="grid content-start gap-2.5 text-sm">
      <p className="rotulo mb-1">{titulo}</p>
      {children}
    </nav>
  );
}

const classeLink = "text-cinza transition-colors hover:text-ouro";

export default function Rodape() {
  const config = useLoja((s) => s.config);
  const endereco = config.endereco !== CONFIGURE_ME ? config.endereco : negocio.endereco;
  const complemento = config.enderecoComplemento !== CONFIGURE_ME ? config.enderecoComplemento : "";
  const horario = config.horario !== CONFIGURE_ME ? config.horario : null;
  const linkWa = wa.padrao(config.whatsappNumero, config.whatsappLink);

  return (
    <footer className="relative mt-20 border-t border-linha bg-carvao">
      <div className="filete-ouro absolute inset-x-0 top-0" aria-hidden="true" />
      <div className="container-pagina grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo altura={36} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cinza">{config.slogan} iPhones novos e seminovos com garantia e nota fiscal, loja física em Caraguatatuba e entrega no Litoral Norte.</p>
          <a href={linkMapa(endereco)} target="_blank" rel="noopener" className="mt-4 flex items-start gap-2 text-sm text-cinza transition-colors hover:text-ouro">
            <Icone nome="mapa" tamanho={18} className="mt-0.5 text-ouro" />
            <span>
              {endereco}
              {complemento ? <><br />{complemento}</> : null}
            </span>
          </a>
          <p className="mt-4 flex items-center gap-2 text-xs text-cinza">
            <Icone nome="instagram" tamanho={16} className="text-ouro" />
            {negocio.provaSocial.seguidoresTexto} · {negocio.provaSocial.destaquesClientes} destaques de clientes
          </p>
        </div>

        <Coluna titulo="Loja">
          <Link className={classeLink} to="/iphones">iPhones novos</Link>
          <Link className={classeLink} to="/seminovos">Seminovos</Link>
          <Link className={classeLink} to="/apple">Apple</Link>
          <Link className={classeLink} to="/acessorios">Acessórios</Link>
          <Link className={classeLink} to="/ofertas">Ofertas</Link>
          <Link className={classeLink} to="/pre-venda">Pré-venda</Link>
          <Link className={classeLink} to="/carrinho">Carrinho</Link>
        </Coluna>

        <Coluna titulo="Atendimento">
          <a className={classeLink} href={linkWa} target="_blank" rel="noopener">WhatsApp da loja</a>
          <a className={classeLink} href={config.instagram} target="_blank" rel="noopener">Instagram {negocio.instagramHandle}</a>
          <Link className={classeLink} to="/contato">Contato e endereço</Link>
          {horario ? <p className="text-cinza">{horario}</p> : <p className="text-cinza-escuro">Horário: combine pelo WhatsApp</p>}
        </Coluna>

        <Coluna titulo="Institucional">
          <Link className={classeLink} to="/sobre">Sobre a iMagicPhone</Link>
          <Link className={classeLink} to="/perguntas">Perguntas frequentes</Link>
          <Link className={classeLink} to="/grupo-vip">Grupo VIP</Link>
          <Link className={classeLink} to="/painel">Painel da loja</Link>
        </Coluna>
      </div>

      <div className="border-t border-linha">
        <div className="container-pagina flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-cinza">
          <span>© {new Date().getFullYear()} {config.nomeLoja}. Todos os direitos reservados.</span>
          <a href="https://www.gdstudiox.com.br" target="_blank" rel="noopener" className="text-ouro transition-colors hover:text-ouro-claro">
            Desenvolvido por GD Studio X
          </a>
        </div>
      </div>
    </footer>
  );
}
