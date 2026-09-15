import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./estilos/global.css";
import { animado } from "./lib/movimento";

animado(); // marca html.anim (ou não, com ?anim=0) antes do primeiro paint

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
