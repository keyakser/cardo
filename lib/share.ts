import type { Deck } from "./types";

// Decks live entirely in the share link: JSON → deflate → base64url.
// No database needed, and nothing about the user is stored on the server.

function toB64Url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function encodeDeck(deck: Deck): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(deck));
  return toB64Url(await pipe(json, new CompressionStream("deflate-raw")));
}

export async function decodeDeck(code: string): Promise<Deck | null> {
  try {
    const bytes = await pipe(fromB64Url(code), new DecompressionStream("deflate-raw"));
    const deck = JSON.parse(new TextDecoder().decode(bytes)) as Deck;
    return Array.isArray(deck.cards) ? deck : null;
  } catch {
    return null;
  }
}
