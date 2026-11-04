import type { Card } from "./types";

// Cards are drawn onto a canvas with the page's own font, so every Kurdish
// letter (ç ê î ş û) renders correctly in JPG and PDF without embedding fonts.

// Cardo design system colours (light theme): paper-raised, ink, ink-muted, line, signal-text, signal.
const C = {
  bg: "#fbf9f4",
  ink: "#141210",
  muted: "#5e574c",
  line: "#d9d1c2",
  green: "#b5320e",
  signal: "#e4421b",
};

function font() {
  return getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function text(
  ctx: CanvasRenderingContext2D,
  s: string,
  x: number,
  y: number,
  opts: { size: number; weight?: number; color?: string; maxW: number; lh?: number; align?: CanvasTextAlign },
) {
  ctx.font = `${opts.weight || 400} ${opts.size}px ${font()}`;
  ctx.fillStyle = opts.color || C.ink;
  ctx.textAlign = opts.align || "left";
  const lines = wrap(ctx, s, opts.maxW);
  const lh = opts.lh || opts.size * 1.3;
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
  return y + lines.length * lh;
}

// The Cardo wordmark (same paths as components/CardoLogo.tsx), drawn at height h with its top-left at x, y.
function wordmark(ctx: CanvasRenderingContext2D, x: number, y: number, h: number) {
  const k = h / 186;
  ctx.save();
  ctx.translate(x, y + 70 * k);
  ctx.scale(k, k);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 22;
  for (const d of ["M87.9 24.9A39 39 0 1 0 87.9 75.1", "M203 0V100", "M241 0V100M241 50A39 39 0 0 1 280 11", "M386 -62V100"]) ctx.stroke(new Path2D(d));
  for (const cx of [164, 347]) {
    ctx.beginPath();
    ctx.arc(cx, 50, 39, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.translate(455, 50);
  ctx.rotate((-8 * Math.PI) / 180);
  ctx.translate(-455, -50);
  ctx.fillStyle = C.signal;
  ctx.fill(new Path2D("M429 -4H481A16 16 0 0 1 497 12V88A16 16 0 0 1 481 104H429A16 16 0 0 1 413 88V12A16 16 0 0 1 429 -4ZM437 50a18 18 0 1 0 36 0a18 18 0 1 0 -36 0Z"), "evenodd");
  ctx.restore();
}

function footer(ctx: CanvasRenderingContext2D, w: number, h: number) {
  wordmark(ctx, 56, h - 84, 50);
  text(ctx, "Learn more Kurdish at kurdolingo.com", w - 60, h - 47, { size: 22, color: C.muted, maxW: 620, align: "right" });
}

// Loads a card illustration (same-origin SVG) so it can be drawn onto a canvas.
const imgCache = new Map<string, Promise<HTMLImageElement | null>>();
function loadImg(src?: string): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  if (!imgCache.has(src))
    imgCache.set(
      src,
      new Promise((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => res(null);
        i.src = src;
      }),
    );
  return imgCache.get(src)!;
}

/** One card, 1080×1350 (portrait, social-friendly). */
export async function cardCanvas(card: Card): Promise<HTMLCanvasElement> {
  const art = await loadImg(card.img);
  const w = 1080,
    h = 1350,
    pad = 90;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = C.signal;
  ctx.fillRect(0, 0, w, 14);

  let y = 260;
  if (art) {
    const iw = 330, ih = 418;
    ctx.drawImage(art, (w - iw) / 2, 96, iw, ih);
    y = 520;
  }
  if (card.pos) y = text(ctx, card.pos.toUpperCase(), w / 2, y, { size: 30, color: C.muted, maxW: w - pad * 2, align: "center" }) + 30;
  y = text(ctx, card.ku, w / 2, y + (art ? 110 : 80), { size: art ? 100 : 120, weight: 800, maxW: w - pad * 2, align: "center", lh: 130 }) + 20;
  y = text(ctx, card.meaning, w / 2, y + 40, { size: 56, weight: 600, color: C.green, maxW: w - pad * 2, align: "center" });

  ctx.strokeStyle = C.line;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(pad + 200, y + 50);
  ctx.lineTo(w - pad - 200, y + 50);
  ctx.stroke();
  y += 130;

  if (card.example_ku) {
    y = text(ctx, card.example_ku, w / 2, y, { size: 44, weight: 600, maxW: w - pad * 2, align: "center" }) + 10;
    y = text(ctx, card.example_tr, w / 2, y, { size: 38, color: C.muted, maxW: w - pad * 2, align: "center" });
  }
  if (card.note) text(ctx, `💡 ${card.note}`, w / 2, y + 70, { size: 32, color: C.muted, maxW: w - pad * 2, align: "center" });

  footer(ctx, w, h);
  return cv;
}

/** A printable A4-ratio sheet listing several cards (used for bulk JPG and PDF). */
export async function sheetCanvas(cards: Card[], title: string, page: number, pages: number): Promise<HTMLCanvasElement> {
  const arts = await Promise.all(cards.map((c) => loadImg(c.img)));
  const w = 1240,
    h = 1754,
    pad = 80;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = C.signal;
  ctx.fillRect(0, 0, w, 12);

  text(ctx, title, pad, 120, { size: 48, weight: 800, maxW: w - pad * 2 - 160 });
  text(ctx, `${page} / ${pages}`, w - pad, 120, { size: 26, color: C.muted, maxW: 200, align: "right" });

  let y = 190;
  const rowH = (h - 190 - 120) / SHEET_SIZE;
  for (const [i, c] of cards.entries()) {
    const art = arts[i];
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(w - pad, y);
    ctx.stroke();

    const top = y + 54;
    const x = art ? pad + 128 : pad;
    if (art) ctx.drawImage(art, pad, y + 16, 108, 137);
    text(ctx, c.ku, x, top, { size: 40, weight: 800, maxW: 480 });
    text(ctx, c.meaning, w - pad, top, { size: 34, weight: 600, color: C.green, maxW: 440, align: "right" });
    let ly = top + 14;
    if (c.pos) ly = text(ctx, c.pos, x, ly + 24, { size: 22, color: C.muted, maxW: 520 });
    if (c.example_ku) {
      ly = text(ctx, c.example_ku, x, ly + 34, { size: 26, weight: 600, maxW: w - pad - x });
      text(ctx, c.example_tr, x, ly + 4, { size: 24, color: C.muted, maxW: w - pad - x });
    }
    y += rowH;
  }
  footer(ctx, w, h);
  return cv;
}

export const SHEET_SIZE = 7;

function save(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

const slug = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "cards";
const toBlob = (cv: HTMLCanvasElement) =>
  new Promise<Blob>((res) => cv.toBlob((b) => res(b!), "image/jpeg", 0.92));

function chunks<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export async function downloadJpg(cards: Card[], title: string) {
  if (cards.length === 1) return save(await toBlob(await cardCanvas(cards[0])), `kurdicards-${slug(cards[0].ku)}.jpg`);
  const pages = chunks(cards, SHEET_SIZE);
  for (let i = 0; i < pages.length; i++) {
    save(await toBlob(await sheetCanvas(pages[i], title, i + 1, pages.length)), `kurdicards-${slug(title)}-${i + 1}.jpg`);
    await new Promise((r) => setTimeout(r, 300)); // browsers drop rapid back-to-back downloads
  }
}

export async function downloadPdf(cards: Card[], title: string) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();
  if (cards.length === 1) {
    const cv = await cardCanvas(cards[0]);
    const iw = pw - 80;
    const ih = (iw * cv.height) / cv.width;
    pdf.addImage(cv.toDataURL("image/jpeg", 0.92), "JPEG", 40, (ph - ih) / 2, iw, ih);
  } else {
    const pages = chunks(cards, SHEET_SIZE);
    for (const [i, p] of pages.entries()) {
      if (i) pdf.addPage();
      const cv = await sheetCanvas(p, title, i + 1, pages.length);
      pdf.addImage(cv.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, pw, ph);
    }
  }
  pdf.save(`kurdicards-${slug(cards.length === 1 ? cards[0].ku : title)}.pdf`);
}

export function downloadCsv(cards: Card[], title: string) {
  const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
  const rows = cards.map((c) => [c.ku, c.meaning, c.pos, c.example_ku, c.example_tr, c.note || ""].map(esc).join(","));
  const csv = ["kurdish,meaning,part_of_speech,example,example_translation,note", ...rows].join("\n");
  // BOM so Excel opens the Kurmanji letters correctly.
  save(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }), `kurdicards-${slug(cards.length === 1 ? cards[0].ku : title)}.csv`);
}

/** Instagram-story sized (1080×1920) "word of the day" image; shared as a file where the browser allows, else downloaded. */
export async function shareStory(card: Card, opts: { kicker: string; date: string; setName: string }) {
  const w = 1080,
    h = 1920,
    pad = 96;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "ui-monospace, monospace";
  ctx.fillStyle = "#f3efe6";
  ctx.fillRect(0, 0, w, h);

  wordmark(ctx, pad, 110, 76);
  ctx.font = `500 30px ${mono}`;
  ctx.fillStyle = C.green;
  ctx.textAlign = "right";
  ctx.fillText(opts.kicker.toUpperCase(), w - pad, 168);

  const art = await loadImg(card.img);
  const iw = w - pad * 2,
    ih = Math.round((iw * 380) / 300) - 260,
    iy = 290;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pad, iy, iw, ih, 40);
  ctx.clip();
  if (art) ctx.drawImage(art, pad, iy - 130, iw, Math.round((iw * 380) / 300));
  else {
    ctx.fillStyle = "#6a9cc8";
    ctx.fillRect(pad, iy, iw, ih);
  }
  ctx.restore();

  let y = iy + ih + 170;
  y = text(ctx, card.ku, pad, y, { size: 160, weight: 800, maxW: iw, lh: 160 });
  y = text(ctx, card.meaning, pad, y + 30, { size: 72, weight: 700, color: C.green, maxW: iw, lh: 80 });
  if (card.example_ku) {
    y = text(ctx, card.example_ku, pad, y + 60, { size: 44, weight: 700, maxW: iw, lh: 56 });
    text(ctx, card.example_tr, pad, y + 6, { size: 40, color: C.muted, maxW: iw, lh: 52 });
  }
  ctx.font = `500 28px ${mono}`;
  ctx.fillStyle = C.muted;
  ctx.textAlign = "left";
  ctx.fillText(`${opts.date} · ${opts.setName}`.toUpperCase(), pad, h - 110);
  ctx.textAlign = "right";
  ctx.fillStyle = C.ink;
  ctx.fillText("CARDOKURDISH.VERCEL.APP", w - pad, h - 110);

  const blob = await toBlob(cv);
  const file = new File([blob], `cardo-${slug(card.ku)}.jpg`, { type: "image/jpeg" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: `Cardo: ${card.ku}` });
      return "shared";
    } catch {
      /* user closed the share sheet: fall back to download */
    }
  }
  save(blob, file.name);
  return "saved";
}
