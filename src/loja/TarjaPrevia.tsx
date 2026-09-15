/**
 * Tarja fixa de prévia — aparece enquanto o build não for de produção
 * (`VITE_PRODUCAO=true` some com ela). Estilo em `.tarja-previa` (global.css):
 * fixa no rodapé, z-index 90, sem capturar cliques.
 * `ehPrevia()` é exportada para quem precisa desviar da tarja (ex.: botão
 * flutuante do WhatsApp sobe um pouco quando ela está na tela).
 */
export function ehPrevia(): boolean {
  return import.meta.env.VITE_PRODUCAO !== "true";
}

export default function TarjaPrevia() {
  if (!ehPrevia()) return null;
  return (
    <div className="tarja-previa" role="note" aria-label="Aviso de prévia">
      PRÉVIA CONFIDENCIAL — iMagicPhone × GD Studio X — dados de exemplo
    </div>
  );
}
