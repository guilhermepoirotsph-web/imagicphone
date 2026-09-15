/**
 * iPhone 3D PROCEDURAL em three.js (sem modelo externo): corpo em
 * RoundedBox com clearcoat, aro dourado, tela emissiva com wallpaper da marca,
 * módulo de câmeras nas costas, luzes de borda douradas e sombra de contato.
 * O componente não sabe de scroll: recebe `progresso` (0..1) e `mouse`
 * (-1..1) por refs escritas pelo herói e reage a cada quadro.
 * Pausa fora da viewport (`ativo=false`) e com a aba escondida.
 */
import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface Props {
  progresso: RefObject<number>;
  mouse: RefObject<{ x: number; y: number }>;
  ativo: boolean;
  aoFalhar?: () => void;
}

const OURO = "#d4b24c";

function estrela(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const raio = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    ctx.lineTo(cx + Math.cos(a) * raio, cy + Math.sin(a) * raio);
  }
  ctx.closePath();
  ctx.fill();
}

function texturaTela(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, 512, 1024);
  const g = ctx.createRadialGradient(256, 560, 20, 256, 560, 520);
  g.addColorStop(0, "rgba(212,178,76,.55)");
  g.addColorStop(0.35, "rgba(140,106,20,.28)");
  g.addColorStop(1, "rgba(5,5,5,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 1024);
  // anéis
  ctx.strokeStyle = "rgba(212,178,76,.35)";
  ctx.lineWidth = 2;
  for (const r of [120, 190, 260]) {
    ctx.beginPath();
    ctx.arc(256, 470, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  // hora
  ctx.fillStyle = "rgba(245,239,224,.9)";
  ctx.font = "700 42px Sora, Manrope, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("9:41", 48, 78);
  // estrela + marca
  ctx.fillStyle = OURO;
  estrela(ctx, 256, 440, 54);
  ctx.textAlign = "center";
  ctx.font = "700 52px Sora, Manrope, system-ui, sans-serif";
  ctx.fillText("iMagicPhone", 256, 600);
  ctx.fillStyle = "rgba(245,239,224,.55)";
  ctx.font = "600 20px Manrope, system-ui, sans-serif";
  ctx.fillText("SUA REFERÊNCIA APPLE NO LITORAL", 256, 650);
  // dock
  ctx.fillStyle = "rgba(255,255,255,.08)";
  ctx.beginPath();
  ctx.roundRect(56, 880, 400, 96, 32);
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i === 1 ? OURO : "rgba(255,255,255,.18)";
    ctx.beginPath();
    ctx.roundRect(88 + i * 96, 900, 56, 56, 14);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255,255,255,.6)";
  ctx.beginPath();
  ctx.roundRect(196, 1000, 120, 8, 4);
  ctx.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function texturaCostas(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = OURO;
  estrela(ctx, 128, 96, 44);
  ctx.textAlign = "center";
  ctx.font = "700 30px Sora, Manrope, system-ui, sans-serif";
  ctx.fillText("iMagicPhone", 128, 190);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function texturaSombra(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(212,178,76,.42)");
  g.addColorStop(0.5, "rgba(212,178,76,.12)");
  g.addColorStop(1, "rgba(212,178,76,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export default function CenaIphone({ progresso, mouse, ativo, aoFalhar }: Props) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refAtivo = useRef(ativo);
  refAtivo.current = ativo;

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      aoFalhar?.();
      return;
    }
    // 1.75 é o teto: acima disso o ganho é invisível e o custo em celular dobra
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const cena = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 30);
    camera.position.set(0, 0.08, 5.6);
    camera.lookAt(0, 0, 0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    cena.environment = ambiente;

    // ---------- luzes ----------
    cena.add(new THREE.AmbientLight(0xffffff, 0.12));
    const chave = new THREE.DirectionalLight(0xf1d97a, 2.4);
    chave.position.set(2.6, 2.2, 3.2);
    cena.add(chave);
    const fria = new THREE.DirectionalLight(0x8fb2e8, 0.7);
    fria.position.set(-3, 1, -2);
    cena.add(fria);
    const borda = new THREE.PointLight(0xd4b24c, 9, 9, 1.6);
    borda.position.set(-1.6, 0.6, -1.4);
    cena.add(borda);
    const borda2 = new THREE.PointLight(0xf1d97a, 5, 8, 1.6);
    borda2.position.set(1.8, -0.8, -1.2);
    cena.add(borda2);

    // ---------- telefone ----------
    const telefone = new THREE.Group();
    cena.add(telefone);

    const matCorpo = new THREE.MeshPhysicalMaterial({ color: 0x232326, metalness: 0.85, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.18 });
    const corpo = new THREE.Mesh(new RoundedBoxGeometry(0.76, 1.56, 0.082, 6, 0.1), matCorpo);
    telefone.add(corpo);

    const matOuro = new THREE.MeshStandardMaterial({ color: 0xd4b24c, metalness: 1, roughness: 0.26 });
    const aro = new THREE.Mesh(new RoundedBoxGeometry(0.79, 1.59, 0.07, 6, 0.11), matOuro);
    telefone.add(aro);

    const texTela = texturaTela();
    const matTela = new THREE.MeshBasicMaterial({ map: texTela, toneMapped: false });
    const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.69, 1.49), matTela);
    tela.position.z = 0.0415;
    telefone.add(tela);

    const matVidro = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.05, transmission: 0.2, transparent: true, opacity: 0.18, clearcoat: 1 });
    const vidro = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.5), matVidro);
    vidro.position.z = 0.0425;
    telefone.add(vidro);

    const matIlha = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const ilha = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.05, 0.004, 3, 0.024), matIlha);
    ilha.position.set(0, 0.66, 0.0435);
    telefone.add(ilha);

    // costas: módulo de câmeras + marca
    const matModulo = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1c, metalness: 0.7, roughness: 0.4, clearcoat: 0.6 });
    const modulo = new THREE.Mesh(new RoundedBoxGeometry(0.31, 0.31, 0.03, 4, 0.07), matModulo);
    modulo.position.set(-0.19, 0.56, -0.05);
    telefone.add(modulo);
    const matLenteAro = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.9, roughness: 0.3 });
    const matLente = new THREE.MeshPhysicalMaterial({ color: 0x0b1633, metalness: 0.2, roughness: 0.1, clearcoat: 1 });
    const geoAro = new THREE.CylinderGeometry(0.058, 0.058, 0.026, 40);
    geoAro.rotateX(Math.PI / 2);
    const geoLente = new THREE.CylinderGeometry(0.036, 0.036, 0.03, 40);
    geoLente.rotateX(Math.PI / 2);
    for (const [x, y] of [
      [-0.26, 0.63],
      [-0.26, 0.49],
      [-0.12, 0.56],
    ]) {
      const a = new THREE.Mesh(geoAro, matLenteAro);
      a.position.set(x, y, -0.072);
      telefone.add(a);
      const l = new THREE.Mesh(geoLente, matLente);
      l.position.set(x, y, -0.078);
      telefone.add(l);
    }
    const flash = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), new THREE.MeshStandardMaterial({ color: 0xf6e6a2, emissive: 0x8c6a14, emissiveIntensity: 0.6 }));
    flash.position.set(-0.11, 0.66, -0.066);
    telefone.add(flash);

    const texCostas = texturaCostas();
    const matCostas = new THREE.MeshBasicMaterial({ map: texCostas, transparent: true, toneMapped: false });
    const costas = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), matCostas);
    costas.position.set(0, -0.05, -0.0415);
    costas.rotation.y = Math.PI;
    telefone.add(costas);

    // sombra de contato
    const texSombra = texturaSombra();
    const sombra = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), new THREE.MeshBasicMaterial({ map: texSombra, transparent: true, depthWrite: false }));
    sombra.rotation.x = -Math.PI / 2;
    sombra.position.y = -1.02;
    cena.add(sombra);

    // ---------- tamanho ----------
    const pai = canvas.parentElement ?? canvas;
    function ajustar() {
      const r = pai.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // em coluna estreita afasta a câmera para o aparelho caber inteiro
      camera.position.z = camera.aspect < 0.8 ? 6.6 : 5.6;
      camera.updateProjectionMatrix();
    }
    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(pai);

    // ---------- laço ----------
    const relogio = new THREE.Clock();
    const atual = { rx: 0.15, ry: -0.35, s: 1 };
    let raf = 0;
    let vivo = true;
    function quadro() {
      if (!vivo) return;
      raf = requestAnimationFrame(quadro);
      if (!refAtivo.current || document.hidden) return;
      const t = relogio.getElapsedTime();
      const p = Math.min(1, Math.max(0, progresso.current ?? 0));
      const m = mouse.current ?? { x: 0, y: 0 };
      const alvoRy = -0.35 + p * Math.PI * 1.25 + m.x * 0.28;
      const alvoRx = 0.15 - p * 0.35 - m.y * 0.16;
      const alvoS = p > 0.7 ? 1 - ((p - 0.7) / 0.3) * 0.28 : 1;
      atual.ry += (alvoRy - atual.ry) * 0.08;
      atual.rx += (alvoRx - atual.rx) * 0.08;
      atual.s += (alvoS - atual.s) * 0.1;
      telefone.rotation.set(atual.rx, atual.ry, 0.035 * Math.sin(t * 0.7));
      telefone.position.y = Math.sin(t * 0.9) * 0.045;
      telefone.scale.setScalar(atual.s);
      sombra.material.opacity = 0.9 - Math.sin(t * 0.9) * 0.15;
      sombra.scale.setScalar(atual.s);
      renderer.render(cena, camera);
    }
    quadro();

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      cena.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      [texTela, texCostas, texSombra, ambiente].forEach((x) => x.dispose());
      pmrem.dispose();
      renderer.dispose();
    };
  }, [progresso, mouse, aoFalhar]);

  return <canvas ref={refCanvas} className="absolute inset-0 block h-full w-full" aria-hidden="true" />;
}
