"use client";

// Card pictures made in the browser: SAM 3.1 cut-outs from the learner's photo
// and Muse Image illustrations. Decks travel in the URL, which is too small for
// pictures, so pictures stay in this browser (localStorage), keyed by deck.

import type { Cut } from "./sam";

export const ART_W = 300;
export const ART_H = 380; // same 300:380 frame as the ready-made set art

const PREFIX = "kc-art:";
const INDEX = "kc-art-index";
const KEEP = 8; // decks with pictures kept in this browser

/** Short stable id for a deck, from its encoded share code. */
export function deckKey(code: string): string {
  let h = 2166136261;
  for (let i = 0; i < code.length; i++) h = Math.imul(h ^ code.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36) + code.length.toString(36);
}

export function loadArt(key: string): Record<number, string> {
  try {
    return JSON.parse(localStorage.getItem(PREFIX + key) || "{}");
  } catch {
    return {};
  }
}

export function saveArt(key: string, art: Record<number, string>) {
  try {
    const index: string[] = JSON.parse(localStorage.getItem(INDEX) || "[]").filter((k: string) => k !== key);
    index.unshift(key);
    for (const old of index.splice(KEEP)) localStorage.removeItem(PREFIX + old);
    localStorage.setItem(INDEX, JSON.stringify(index));
    localStorage.setItem(PREFIX + key, JSON.stringify(art));
  } catch {
    // Storage full or blocked: drop the oldest decks and try once more.
    try {
      const index: string[] = JSON.parse(localStorage.getItem(INDEX) || "[]");
      for (const old of index.slice(1)) localStorage.removeItem(PREFIX + old);
      localStorage.setItem(INDEX, JSON.stringify([key]));
      localStorage.setItem(PREFIX + key, JSON.stringify(art));
    } catch {
      /* pictures are a nice-to-have */
    }
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

function frame() {
  const cv = document.createElement("canvas");
  cv.width = ART_W;
  cv.height = ART_H;
  return cv;
}

function encode(cv: HTMLCanvasElement) {
  const webp = cv.toDataURL("image/webp", 0.82);
  return webp.startsWith("data:image/webp") ? webp : cv.toDataURL("image/png");
}

/**
 * Cuts the SAM masks out of the photo and lays the object on a transparent
 * 300×380 frame with a white sticker edge and a soft shadow.
 */
export async function renderCuts(photo: string, cuts: Cut[]): Promise<Record<number, string>> {
  const img = await loadImage(photo);
  const out: Record<number, string> = {};
  for (const cut of cuts) {
    try {
      // Union box of all matched parts, in photo pixels.
      let x1 = Infinity,
        y1 = Infinity,
        x2 = -Infinity,
        y2 = -Infinity;
      const paths = cut.parts.map((p) => {
        const path = new Path2D();
        path.addPath(new Path2D(p.path), new DOMMatrix().translate(p.x, p.y));
        return { p, path };
      });
      for (const { p } of paths) {
        const m = p.path.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
        for (let k = 0; k + 1 < m.length; k += 2) {
          x1 = Math.min(x1, p.x + m[k]);
          x2 = Math.max(x2, p.x + m[k]);
          y1 = Math.min(y1, p.y + m[k + 1]);
          y2 = Math.max(y2, p.y + m[k + 1]);
        }
      }
      const bw = x2 - x1,
        bh = y2 - y1;
      if (!(bw > 8 && bh > 8)) continue;

      // 1) the object alone, at final scale
      const edge = 7;
      const scale = Math.min((ART_W - 2 * (edge + 14)) / bw, (ART_H - 2 * (edge + 14)) / bh, 3);
      const ox = (ART_W - bw * scale) / 2 - x1 * scale;
      const oy = (ART_H - bh * scale) / 2 - y1 * scale;
      const obj = frame();
      const o = obj.getContext("2d")!;
      o.setTransform(scale, 0, 0, scale, ox, oy);
      const clip = new Path2D();
      for (const { path } of paths) clip.addPath(path);
      o.save();
      o.clip(clip);
      o.drawImage(img, 0, 0);
      o.restore();
      o.setTransform(1, 0, 0, 1, 0, 0);

      // 2) white silhouette for the sticker edge
      const sil = frame();
      const s = sil.getContext("2d")!;
      s.drawImage(obj, 0, 0);
      s.globalCompositeOperation = "source-in";
      s.fillStyle = "#fff";
      s.fillRect(0, 0, ART_W, ART_H);

      // 3) compose: shadow, edge, object
      const cv = frame();
      const c = cv.getContext("2d")!;
      c.save();
      c.shadowColor = "rgba(20,18,16,.28)";
      c.shadowBlur = 10;
      c.shadowOffsetY = 4;
      c.drawImage(sil, 0, 0);
      c.restore();
      for (let a = 0; a < 16; a++) {
        const t = (a / 16) * Math.PI * 2;
        c.drawImage(sil, Math.cos(t) * edge, Math.sin(t) * edge);
      }
      c.drawImage(obj, 0, 0);
      out[cut.i] = encode(cv);
    } catch {
      /* skip this card */
    }
  }
  return out;
}

/** Fits a generated illustration into the 300×380 card frame (cover crop). */
export async function fitIllustration(src: string): Promise<string> {
  const img = await loadImage(src);
  const cv = frame();
  const c = cv.getContext("2d")!;
  const scale = Math.max(ART_W / img.width, ART_H / img.height);
  const w = img.width * scale,
    h = img.height * scale;
  c.drawImage(img, (ART_W - w) / 2, (ART_H - h) / 2, w, h);
  return encode(cv);
}
