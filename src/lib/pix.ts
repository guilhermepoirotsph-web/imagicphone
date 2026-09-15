/**
 * Pix nativo no navegador — BR Code EMV (padrão BCB), CRC16-CCITT.
 * Zero gateway, zero taxa: o QR aponta direto para a chave do lojista.
 * Padrão da casa validado no Motozo (CRC16 de "123456789" = 29B1).
 * QR: codificador próprio (byte mode, EC nível M, versões 1–10) — sem dependência.
 */
function campo(id: string, valor: string): string {
  return `${id}${String(valor.length).padStart(2, "0")}${valor}`;
}

export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function ascii(texto: string, max: number): string {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .trim()
    .slice(0, max);
}

export interface DadosPix {
  chave: string;
  nome: string;
  cidade: string;
  valorCentavos: number;
  txid?: string;
}

/** Monta o payload "copia e cola". Nome ≤ 25 e cidade ≤ 15 caracteres (regra do BCB). */
export function payloadPix({ chave, nome, cidade, valorCentavos, txid = "***" }: DadosPix): string {
  let k = String(chave || "").trim();
  // chave-celular anotada sem +55: o BR Code exige o formato internacional
  if (/^\d{10,11}$/.test(k)) k = `+55${k}`;
  const semCrc =
    campo("00", "01") +
    campo("26", campo("00", "BR.GOV.BCB.PIX") + campo("01", k)) +
    campo("52", "0000") +
    campo("53", "986") +
    (valorCentavos > 0 ? campo("54", (valorCentavos / 100).toFixed(2)) : "") +
    campo("58", "BR") +
    campo("59", ascii(nome, 25) || "LOJA") +
    campo("60", ascii(cidade, 15).toUpperCase() || "BRASIL") +
    campo("62", campo("05", txid.slice(0, 25))) +
    "6304";
  return semCrc + crc16(semCrc);
}

/* ------------------------------------------------------------------
   QR Code mínimo (byte mode, EC M, versões 1–10) — cabe payload Pix.
   ------------------------------------------------------------------ */
const EC_TABLE: Record<number, [number, number, number[]]> = {
  1: [16, 10, [16]],
  2: [28, 16, [28]],
  3: [44, 26, [44]],
  4: [64, 18, [32, 32]],
  5: [86, 24, [43, 43]],
  6: [108, 16, [27, 27, 27, 27]],
  7: [124, 18, [31, 31, 31, 31]],
  8: [154, 22, [38, 38, 39, 39]],
  9: [182, 22, [36, 36, 36, 37, 37]],
  10: [216, 26, [43, 43, 43, 44, 44]],
};
const ALIGN: Record<number, number[]> = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
};

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();
function gfMul(a: number, b: number): number {
  return a && b ? EXP[LOG[a] + LOG[b]] : 0;
}
function rsGenerator(n: number): number[] {
  let g = [1];
  for (let i = 0; i < n; i++) {
    const ng = new Array<number>(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      ng[j] ^= g[j];
      ng[j + 1] ^= gfMul(g[j], EXP[i]);
    }
    g = ng;
  }
  return g;
}
function rsEncode(data: number[], ecLen: number): number[] {
  const gen = rsGenerator(ecLen);
  const res = new Array<number>(ecLen).fill(0);
  for (const d of data) {
    const f = d ^ res[0];
    res.shift();
    res.push(0);
    if (f) for (let j = 0; j < ecLen; j++) res[j] ^= gfMul(gen[j + 1], f);
  }
  return res;
}

export function matrizQr(texto: string): boolean[][] {
  const bytes = new TextEncoder().encode(texto);
  let versao = 1;
  while (versao <= 10 && EC_TABLE[versao][0] < bytes.length + 3) versao++;
  if (versao > 10) throw new Error("payload grande demais para o QR mínimo");
  const [total, ecPer, blocksSizes] = EC_TABLE[versao];
  const bits: number[] = [];
  const push = (v: number, n: number) => {
    for (let i = n - 1; i >= 0; i--) bits.push((v >> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, versao < 10 ? 8 : 16);
  bytes.forEach((b) => push(b, 8));
  push(0, Math.min(4, total * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2));
  const pads = [0xec, 0x11];
  for (let i = 0; data.length < total; i++) data.push(pads[i % 2]);
  const blocks: number[][] = [];
  const ecs: number[][] = [];
  let off = 0;
  for (const s of blocksSizes) {
    const b = data.slice(off, off + s);
    off += s;
    blocks.push(b);
    ecs.push(rsEncode(b, ecPer));
  }
  const out: number[] = [];
  const maxB = Math.max(...blocksSizes);
  for (let i = 0; i < maxB; i++) for (const b of blocks) if (i < b.length) out.push(b[i]);
  for (let i = 0; i < ecPer; i++) for (const e of ecs) out.push(e[i]);

  const n = versao * 4 + 17;
  const m: (boolean | null)[][] = Array.from({ length: n }, () => Array<boolean | null>(n).fill(null));
  const set = (r: number, c: number, v: boolean) => {
    if (r >= 0 && r < n && c >= 0 && c < n) m[r][c] = v;
  };
  const finder = (r: number, c: number) => {
    for (let i = -1; i <= 7; i++)
      for (let j = -1; j <= 7; j++) {
        const on =
          (i >= 0 && i <= 6 && (j === 0 || j === 6)) ||
          (j >= 0 && j <= 6 && (i === 0 || i === 6)) ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4);
        set(r + i, c + j, on);
      }
  };
  finder(0, 0);
  finder(0, n - 7);
  finder(n - 7, 0);
  for (let i = 8; i < n - 8; i++) {
    if (m[6][i] === null) m[6][i] = i % 2 === 0;
    if (m[i][6] === null) m[i][6] = i % 2 === 0;
  }
  const al = ALIGN[versao];
  for (const r of al)
    for (const c of al) {
      if (m[r][c] !== null) continue;
      for (let i = -2; i <= 2; i++)
        for (let j = -2; j <= 2; j++) set(r + i, c + j, Math.max(Math.abs(i), Math.abs(j)) !== 1);
    }
  for (let i = 0; i < 9; i++) {
    if (m[8][i] === null) m[8][i] = false;
    if (m[i][8] === null) m[i][8] = false;
  }
  for (let i = 0; i < 8; i++) {
    if (m[8][n - 1 - i] === null) m[8][n - 1 - i] = false;
    if (m[n - 1 - i][8] === null) m[n - 1 - i][8] = false;
  }
  m[n - 8][8] = true;
  if (versao >= 7) {
    let v = versao;
    for (let i = 0; i < 12; i++) v = (v << 1) ^ ((v >> 11) & 1 ? 0x1f25 : 0);
    const vb = (versao << 12) | (v & 0xfff);
    for (let i = 0; i < 18; i++) {
      const b = ((vb >> i) & 1) === 1;
      m[Math.floor(i / 3)][n - 11 + (i % 3)] = b;
      m[n - 11 + (i % 3)][Math.floor(i / 3)] = b;
    }
  }
  const dbits: number[] = [];
  out.forEach((b) => {
    for (let i = 7; i >= 0; i--) dbits.push((b >> i) & 1);
  });
  let idx = 0;
  let up = true;
  for (let col = n - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let k = 0; k < n; k++) {
      const r = up ? n - 1 - k : k;
      for (const c of [col, col - 1]) {
        if (m[r][c] === null) m[r][c] = idx < dbits.length ? dbits[idx++] === 1 : false;
      }
    }
    up = !up;
  }
  const isFunc = (r: number, c: number) =>
    (r < 9 && c < 9) ||
    (r < 9 && c >= n - 8) ||
    (r >= n - 8 && c < 9) ||
    r === 6 ||
    c === 6 ||
    al.some((a) => al.some((b) => Math.abs(r - a) <= 2 && Math.abs(c - b) <= 2)) ||
    (versao >= 7 && ((r < 6 && c >= n - 11) || (c < 6 && r >= n - 11)));
  const masks: ((r: number, c: number) => boolean)[] = [
    (r, c) => (r + c) % 2 === 0,
    (r) => r % 2 === 0,
    (_r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
  ];
  const applyFormat = (mat: boolean[][], mask: number) => {
    let f = (0b00 << 3) | mask; // EC M = 00
    let r = f << 10;
    for (let i = 14; i >= 10; i--) if ((r >> i) & 1) r ^= 0x537 << (i - 10);
    f = ((f << 10) | r) ^ 0x5412;
    const b = (i: number) => ((f >> i) & 1) === 1;
    for (let i = 0; i < 6; i++) mat[8][i] = b(14 - i);
    mat[8][7] = b(8);
    mat[8][8] = b(7);
    mat[7][8] = b(6);
    for (let i = 0; i < 6; i++) mat[5 - i][8] = b(i);
    for (let i = 0; i < 8; i++) mat[n - 1 - i][8] = b(14 - i);
    for (let i = 0; i < 8; i++) mat[8][n - 8 + i] = b(7 - i);
    mat[n - 8][8] = true;
  };
  let best: boolean[][] = [];
  let bestScore = Infinity;
  for (let mk = 0; mk < 8; mk++) {
    const mat = m.map((row, r) => row.map((v, c) => (isFunc(r, c) ? Boolean(v) : Boolean(v) !== masks[mk](r, c))));
    applyFormat(mat, mk);
    let score = 0;
    for (let r = 0; r < n; r++) {
      let run = 1;
      for (let c = 1; c < n; c++) {
        if (mat[r][c] === mat[r][c - 1]) {
          run++;
          if (run === 5) score += 3;
          else if (run > 5) score++;
        } else run = 1;
      }
    }
    for (let c = 0; c < n; c++) {
      let run = 1;
      for (let r = 1; r < n; r++) {
        if (mat[r][c] === mat[r - 1][c]) {
          run++;
          if (run === 5) score += 3;
          else if (run > 5) score++;
        } else run = 1;
      }
    }
    if (score < bestScore) {
      bestScore = score;
      best = mat;
    }
  }
  return best;
}

/** SVG do QR (string) — módulos escuros sobre fundo branco, zona quieta de 4. */
export function svgQr(texto: string, aria = "QR Code Pix"): string {
  const m = matrizQr(texto);
  const n = m.length;
  const q = 4;
  const lado = n + q * 2;
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (m[r][c]) d += `M${c + q} ${r + q}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" role="img" aria-label="${aria}" shape-rendering="crispEdges"><rect width="${lado}" height="${lado}" fill="#ffffff"/><path d="${d}" fill="#050505"/></svg>`;
}
