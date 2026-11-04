import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { LANGS, LEVELS, type Deck } from "@/lib/types";
import { deckFromSet, matchSet } from "@/lib/sets";
import { SET_DATA } from "@/lib/sets-data";
import { segment, type Cut } from "@/lib/sam";

export const runtime = "nodejs";
export const maxDuration = 180;

// Meta Model API speaks the Messages API format, so the Anthropic SDK works
// against it with a different base URL and a bearer token.
const client = new Anthropic({
  baseURL: process.env.MODEL_API_BASE_URL || "https://api.meta.ai",
  authToken: process.env.MODEL_API_KEY || "missing",
});
const MODEL = process.env.MODEL_NAME || "muse-wonder-1.0";
const EFFORT = (process.env.MODEL_EFFORT || "low") as "low" | "medium" | "high";

const SYSTEM = `You are Cardo, an expert teacher of Kurmanji Kurdish (Northern Kurdish).
You create vocabulary flashcards for learners.

Rules:
- Write Kurmanji in the standard Hawar Latin alphabet (a b c ç d e ê f g h i î j k l m n o p q r s ş t u û v w x y z). Never use Sorani or Arabic script.
- Use common, everyday Kurmanji words in their standard dictionary spelling (e.g. "metbex", not dialect forms). Do not invent words. If you are not confident a word is correct Kurmanji, leave it out.
- Nouns: give the bare form (e.g. "sêv", not "sêvê"). Verbs: give the infinitive (e.g. "xwarin").
- Example sentences must be short, natural and match the learner's level.
- Reply with ONLY a JSON object, no markdown, no commentary, in exactly this shape:
{"title": string, "cards": [{"ku": string, "pos": string, "meaning": string, "example_ku": string, "example_tr": string, "note": string}]}
- "title" is a short deck title in the learner's language.
- "pos" is the part of speech in the learner's language (noun, verb, adjective...).
- "meaning" and "example_tr" are in the learner's language.
- "note" is an optional one-line tip (gender, plural, irregular form, or a cultural hint); use "" if none.`;

// Best-effort per-instance rate limit so a public link can't drain the credits.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

// Usage log for the profile and admin pages. Runs as the signed-in user (via
// their access token) so row level security stamps the right user_id.
async function logGeneration(token: string | null, row: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;
  try {
    const db = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    });
    let userId: string | null = null;
    if (token) userId = (await db.auth.getUser(token)).data.user?.id ?? null;
    const { error } = await db.from("generations").insert({ ...row, user_id: userId, deck: userId ? row.deck : null });
    if (error) console.error("log failed:", error.message);
  } catch (e) {
    console.error("log failed:", e);
  }
}

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("no JSON in model output");
  return JSON.parse(text.slice(start, end + 1));
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return Response.json({ error: "Too many requests. Please wait a minute.", code: "rate" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const mode: string = body?.mode;
  const input: string = String(body?.input || "").slice(0, 4000).trim();
  const image: string = String(body?.image || "");
  const langCode = LANGS.some((l) => l.code === body?.lang) ? body.lang : "en";
  const level = LEVELS.includes(body?.level) ? body.level : "beginner";
  const count = Math.min(Math.max(Number(body?.count) || 8, 4), 15);
  const langName = LANGS.find((l) => l.code === langCode)!.name;
  const uiLang = /^[a-z]{2}$/.test(body?.uiLang || "") ? body.uiLang : "en";
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || null;
  const started = Date.now();
  const logBase = { mode: mode === "photo" || mode === "text" ? mode : "topic", lang: langCode, level, ui_lang: uiLang };

  // Topics that match a ready-made set are answered from the set, with no model call.
  const setId = mode !== "photo" && mode !== "text" ? matchSet(input) : null;
  if (setId && SET_DATA[setId]) {
    const deck = deckFromSet(SET_DATA[setId], level, langCode, count, uiLang);
    await logGeneration(token, {
      mode: "set",
      lang: langCode,
      level,
      ui_lang: uiLang,
      card_count: deck.cards.length,
      duration_ms: Date.now() - started,
      success: true,
      title: deck.title,
      deck,
    });
    return Response.json({ ...deck, setId });
  }

  const content: Anthropic.ContentBlockParam[] = [];
  let task: string;

  if (mode === "photo") {
    const m = image.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
    if (!m || image.length > 3_000_000) {
      return Response.json({ error: "Please upload a JPEG, PNG or WebP photo.", code: "photo" }, { status: 400 });
    }
    content.push({
      type: "image",
      source: { type: "base64", media_type: m[1] as "image/jpeg", data: m[2] },
    });
    task = `Look at this photo. Identify up to ${count} clearly visible objects, colors, actions or features in it, and make one flashcard for each with its Kurmanji word. Example sentences should describe what is in the photo. Add one more field to every card: "seg", a short English noun phrase (1-3 words, e.g. "red apple", "coffee cup") naming the single physical object in the photo that the card is about, so an image segmentation model can cut it out. Use "" when the card is not one visible object (a color, an action, the whole scene).${input ? ` Extra context from the learner: "${input}".` : ""}`;
  } else if (mode === "text") {
    if (input.length < 10) return Response.json({ error: "Paste a longer text.", code: "text" }, { status: 400 });
    task = `Here is a text. Pick the ${count} most useful words or phrases for a ${level} learner and make flashcards. If the text is in Kurmanji, take words from it; if it is in another language, give the Kurmanji equivalents of its key words.\n\n"""${input}"""`;
  } else {
    if (input.length < 2) return Response.json({ error: "Enter a topic.", code: "topic" }, { status: 400 });
    task = `Topic: "${input}". Make ${count} flashcards with the most useful Kurmanji words for this topic.`;
  }

  content.push({
    type: "text",
    text: `${task}\n\nLearner's language: ${langName}. Level: ${level}. Return exactly ${mode === "photo" ? `up to ${count}` : count} cards as JSON.${
      mode === "photo" ? ` For this photo, every card object must also have the "seg" field: {"ku", "pos", "meaning", "example_ku", "example_tr", "note", "seg"}.` : ""
    }`,
  });

  // Muse always thinks before answering, and the thinking counts against
  // max_tokens, so leave plenty of room and retry once if no JSON comes back.
  // Effort "low" cut an 8-card deck from ~42 s to ~13 s with the same card
  // quality in testing ("minimal" and disabling thinking are rejected).
  async function ask() {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: EFFORT },
      system: SYSTEM,
      messages: [{ role: "user", content }],
    });
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    try {
      return extractJson(text);
    } catch (e) {
      console.error("bad model output:", msg.stop_reason, JSON.stringify(msg.usage), text.slice(0, 300));
      throw e;
    }
  }

  try {
    let parsed;
    try {
      parsed = await ask();
    } catch (e) {
      if (e instanceof Anthropic.APIError) throw e;
      parsed = await ask();
    }
    const cards = (Array.isArray(parsed.cards) ? parsed.cards : [])
      .filter((c: Record<string, unknown>) => c && typeof c.ku === "string" && typeof c.meaning === "string")
      .map((c: Record<string, unknown>) => ({
        ku: String(c.ku),
        pos: String(c.pos || ""),
        meaning: String(c.meaning),
        example_ku: String(c.example_ku || ""),
        example_tr: String(c.example_tr || ""),
        note: String(c.note || ""),
        seg: typeof c.seg === "string" ? c.seg.trim().slice(0, 40) : "",
      }));
    if (!cards.length) throw new Error("model returned no cards");
    // Photo decks: SAM 3.1 cuts each named object out of the learner's own
    // photo (all cards in parallel). The browser turns the masks into stickers.
    let cuts: Cut[] = [];
    if (mode === "photo") {
      const samStart = Date.now();
      // If the model skipped "seg" and explains in English, its meaning names the object.
      const phrase = (c: { seg: string; meaning: string; pos: string }) =>
        c.seg || (langCode === "en" && /noun/i.test(c.pos) ? c.meaning.split(/[,;(]/)[0].trim().slice(0, 40) : "");
      const found = await Promise.all(cards.map((c: { seg: string; meaning: string; pos: string }, i: number) => (phrase(c) ? segment(image, phrase(c), i) : null)));
      cuts = found.filter((c): c is Cut => !!c);
      console.log(`sam: ${cuts.length}/${cards.length} cut (${cards.filter((c: { seg: string }) => c.seg).length} named) in ${Date.now() - samStart} ms`);
    }
    const deck: Deck = {
      title: String(parsed.title || input || "Cardo"),
      lang: langCode,
      level,
      cards: cards.map(({ seg: _seg, ...c }: { seg: string }) => c) as Deck["cards"],
    };
    await logGeneration(token, {
      ...logBase,
      card_count: cards.length,
      duration_ms: Date.now() - started,
      success: true,
      title: deck.title.slice(0, 200),
      deck,
    });
    return Response.json({ ...deck, cuts });
  } catch (err) {
    console.error("generate failed:", err);
    await logGeneration(token, { ...logBase, duration_ms: Date.now() - started, success: false });
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
      return Response.json({ error: "The AI service rejected our key. Check MODEL_API_KEY and billing.", code: "server" }, { status: 502 });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "The AI service is busy. Try again in a moment.", code: "busy" }, { status: 503 });
    }
    if (err instanceof Anthropic.BadRequestError && mode === "photo") {
      return Response.json({ error: "The AI couldn't read this photo. Try another one.", code: "photoRead" }, { status: 502 });
    }
    return Response.json({ error: "Something went wrong while making your cards. Please try again.", code: "server" }, { status: 500 });
  }
}
