export const runtime = "nodejs";
export const maxDuration = 90;

// Muse Image draws one card illustration on demand, in Cardo's riso print look.
const BASE = (process.env.MODEL_API_BASE_URL || "https://api.meta.ai").replace(/\/v1\/?$/, "") + "/v1";

// Images cost more than text, so keep a tighter per-instance limit.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 12;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ code: "rate" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const word = String(body?.ku || "").slice(0, 60).trim();
  const meaning = String(body?.meaning || "").slice(0, 80).trim();
  const example = String(body?.example || "").slice(0, 160).trim();
  if (!word || !meaning) return Response.json({ code: "topic" }, { status: 400 });

  const prompt = `A single centered illustration that shows the meaning of the word "${meaning}"${
    example ? ` (as in: "${example}")` : ""
  }. Risograph print style: flat shapes, visible grain, slight misregistration, only these ink colors: cornflower blue #6a9cc8, pink #e58bcb, olive #8c8519, orange #f04e1f and near-black #141210, on warm off-white paper #f3efe6. Simple, friendly, clear at a small size, plenty of empty paper around the subject. No text, no letters, no words, no border.`;

  const started = Date.now();
  try {
    const res = await fetch(`${BASE}/responses`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.MODEL_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "muse-image-1.0",
        // Note: store:false currently makes Muse Image return a 500.
        input: prompt,
        tools: [
          {
            type: "image_generation",
            enable_web_search: false,
            enable_shell: false,
            enable_image_search: false,
            reasoning_strength: "low",
            size: "1024x1536",
            output_format: "jpeg",
          },
        ],
      }),
    });
    const data = await res.json().catch(() => null);
    const b64 = data?.output?.find((o: { type: string }) => o.type === "image_generation_call")?.result;
    if (!res.ok || !b64) {
      console.error("illustrate failed:", res.status, JSON.stringify(data?.error || {}).slice(0, 300));
      return Response.json({ code: res.status === 429 ? "busy" : "server" }, { status: 502 });
    }
    console.log(`illustrate: "${word}" in ${Date.now() - started} ms`);
    return Response.json({ image: `data:image/jpeg;base64,${b64}` });
  } catch (e) {
    console.error("illustrate error:", e);
    return Response.json({ code: "server" }, { status: 500 });
  }
}
