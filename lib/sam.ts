import { decodeMaskToSVGPath, parseImageStream, recordsOfKind, type ResponsesEvent } from "@meta-sam/parser";

// SAM 3.1 on Meta Model API: name an object, get a box and a pixel mask for
// every match. We turn each mask into an SVG path (in the mask's own pixel
// grid, which starts at its box's top-left corner) so the browser can cut the
// object out of the learner's photo.

export type CutPart = { x: number; y: number; path: string; area: number };
export type Cut = { i: number; parts: CutPart[] };

const BASE = (process.env.MODEL_API_BASE_URL || "https://api.meta.ai").replace(/\/v1\/?$/, "") + "/v1";

async function* sseEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<ResponsesEvent> {
  const dec = new TextDecoder();
  let buf = "";
  const reader = body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n\n")) >= 0) {
      const block = buf.slice(0, i);
      buf = buf.slice(i + 2);
      const data = block
        .split("\n")
        .filter((l) => l.startsWith("data:"))
        .map((l) => l.slice(5).trim())
        .join("");
      if (data && data !== "[DONE]") yield JSON.parse(data) as ResponsesEvent;
    }
  }
}

/** Segments one noun phrase in a data-URL image. Returns null on no match or error. */
export async function segment(image: string, phrase: string, i: number): Promise<Cut | null> {
  // One retry: the endpoint occasionally returns a 5xx/429 under a burst of parallel calls.
  const first = await segmentOnce(image, phrase, i);
  return first !== undefined ? first : ((await segmentOnce(image, phrase, i, 15000)) ?? null);
}

/** null = no match, undefined = request failed. */
async function segmentOnce(image: string, phrase: string, i: number, timeoutMs = 20000): Promise<Cut | null | undefined> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}/responses`, {
      method: "POST",
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${process.env.MODEL_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "sam-3.1",
        stream: true,
        metadata: { mask_encoding: "one_bit" },
        input: [
          {
            type: "message",
            role: "user",
            content: [
              { type: "input_text", text: phrase },
              { type: "input_image", image_url: image },
            ],
          },
        ],
      }),
    });
    if (!res.ok || !res.body) {
      console.error("sam failed:", res.status, phrase);
      return undefined;
    }
    const result = await parseImageStream(sseEvents(res.body)).finalResult;
    const parts: CutPart[] = [];
    for (const m of recordsOfKind(result.records, "mask")) {
      const path = decodeMaskToSVGPath(m.mask);
      if (!path) continue;
      const b = m.bounds;
      parts.push({ x: b.left, y: b.top, path, area: (b.right - b.left) * (b.bottom - b.top) });
    }
    if (!parts.length) return null;
    // Keep the biggest matches only (e.g. a bunch of keys, not 20 tiny ones).
    parts.sort((a, b) => b.area - a.area);
    return { i, parts: parts.slice(0, 6) };
  } catch (e) {
    console.error("sam error:", phrase, e instanceof Error ? e.message : e);
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}
