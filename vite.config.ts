import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// Base fica AQUI, nunca na CLI (ver aprendizado "--base na CLI do Git Bash vira C:/Program Files/Git/...").
// Página de projeto no GitHub Pages: REPO_PAGES=imagicphone → base "/imagicphone/".
// Domínio próprio ou dev local: sem a variável → "/".
const repo = (process.env.REPO_PAGES ?? "").replace(/[^a-z0-9-_]/gi, "");
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: repo ? `/${repo}/` : "/",
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          gsap: ["gsap", "gsap/ScrollTrigger", "gsap/SplitText"],
          react: ["react", "react-dom", "react-router-dom", "zustand"],
        },
      },
    },
  },
  server: { host: true },
});
