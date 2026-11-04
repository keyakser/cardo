# Cardo: Kurdish Cards — handoff for Claude

Read this whole file before doing anything. It replaces the conversation history from the previous Claude session (2026-11-03 → 11-04). Also read `HACKATHON.md` (deadline, rules, open tasks).

## The user
- Filmmaker, founder of Kurdolingo (info@kurdolingo.com, GitHub `keyakser`). No CS background: explain simply, in **Turkish**. The user writes Turkish.
- Never delete the user's files. Never print, paste or commit API keys or `.env*` contents. Never ask for / use the Supabase service_role key. Payments and purchases are done by the user.
- Prefers action over long option lists; give short progress notes.

## What the product is
Cardo turns a photo, a topic or a pasted text into Kurdish (Kurmanji, Hawar Latin script) flashcards using Meta's **Muse Wonder** model. Built for the **Meta Global AI Developer Hackathon** (Indie track, theme "Build for Your World"). A free tool by Kurdolingo, promotes kurdolingo.com.
- Live: https://cardokurdish.vercel.app (also https://kurdicards.vercel.app)
- Repo: https://github.com/keyakser/cardo (currently **private**; must become public before submitting — ask the user first)
- Local path: `~/Developer/kurdicards` (never work from Desktop: iCloud breaks node_modules)

## Stack and commands
- Next.js 16 App Router (Turbopack), React 19, TypeScript, plain CSS (`app/globals.css`; the "Cardo design system layer" is at the end of the file).
- npm needs a cache workaround: `npm install --cache ~/Developer/.npm-cache-linkro`
- Dev: `npm run dev` → http://localhost:3005
- Deploy (prod, both domains): `cd ~/Developer/kurdicards && npx --cache "$HOME/Developer/.npm-cache-linkro" -y vercel@latest deploy --prod --yes` (Vercel project `keyakser/kurdicards`; alias can lag a few seconds → brief 404s on new routes).
- Env (`.env.local`, also set in Vercel): `MODEL_API_KEY`, optional `MODEL_API_BASE_URL`, `MODEL_NAME`, `MODEL_EFFORT`, `NEXT_PUBLIC_SUPABASE_URL=https://qzvqyoyqirjmringxpwo.supabase.co`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable key).

## Meta Model API (important details)
- Messages-API compatible. `app/api/generate/route.ts` uses `@anthropic-ai/sdk` with `baseURL: "https://api.meta.ai"`, `authToken: process.env.MODEL_API_KEY`, model `muse-wonder-1.0`.
- `output_config: { effort: "low" }` → ~10 s per deck instead of ~42 s. "minimal"/disabled thinking are rejected. `max_tokens: 16000` (thinking eats tokens), retry once on bad JSON.
- Vision: photos resized in the browser, sent as base64 image blocks.
- System prompt intentionally says "Kurmanji Kurdish" (UI never does, see below).
- Rate limit 8 req/min/IP; error codes rate/photo/text/topic/busy/photoRead/server.
- Topics matching a ready-made set are answered from the set without calling Muse (logged as mode "set").
- The key can access: `muse-wonder-1.0, muse-spark-1.1/1.2/1.3, muse-image-1.0, sam-3.1, muse-voice-transcribe-1.0`. Muse Image / SAM 3.1 are NOT used yet (see HACKATHON.md for the plan). Check https://dev.meta.ai docs for their request format before coding.
- The key was printed once in a tool output on 2026-11-03 → the user should rotate it after the hackathon.

## Supabase
- Project ref `qzvqyoyqirjmringxpwo`. Schema: `supabase/schema.sql` (idempotent). The user runs it in Supabase SQL Editor; copy it for them with `pbcopy < supabase/schema.sql` (TextEdit showed a stale copy once).
- Tables: profiles, favorites, generations, admins, reports. RPCs: `is_admin()`, `my_stats()`, `admin_stats()`. Trigger makes info@kurdolingo.com admin. RLS everywhere. Confirm-email is OFF.
- Password reset (`/login?mode=forgot` → `/reset-password`) is built; email delivery needs the user to set Supabase Auth → URL Configuration (Site URL https://cardokurdish.vercel.app, redirect URLs `…/reset-password` on both domains) and custom SMTP. Not confirmed done.

## Code map
- `app/page.tsx` home: hero (3-line headline, HeroDemo phone), PrintRail, WordOfDay, how-it-works, InfoMotion (`#how`), Features, sets strip, stats band (14 languages, 3 ways), Creator (`#create`), Faq, KurdolingoPromo.
- Pages: `deck` (study/list/quiz tabs), `sets`, `sets/[id]`, `alphabet`, `login`, `reset-password`, `profile`, `admin` (usage stats + AdminReports), `privacy` (EN + TR privacy & terms).
- `components/`: Header, Footer, CardoLogo (wordmark + mark), LangMenu, Creator (chips only fill the topic; generation only on button), DeckStudy, Quiz, WordOfDay, ReportButton, FavButton, DownloadMenu, SetArt, Prints, InfoMotion, HeroDemo, Features, Faq, KurdolingoPromo.
- `lib/`: `i18n.tsx` (UI_LANGS order ku, tr, en, de, fr, es, it, pt, ru, ar, fa, zh, ja, ko; RTL ar/fa; tr + ku dicts inline; localStorage `kc-lang`, theme `kc-theme`), `locales/*.ts` (en.ts is the Dict source; `extra.ts` holds later strings, Partial per language, falls back to EN), `sets.ts` (SETS meta, aliases, matchSet, deckFromSet, wordArt), `sets-data.ts`, `export.ts` (canvas JPG/PDF/CSV + `shareStory` 1080×1920), `wotd.ts`, `alphabet.ts`, `supabase.ts`, `auth.tsx`, `toast.tsx`.
- Ready sets: `public/sets/<id>.json` (10 topics × 3 levels × 10 words, explanations in 13 languages) + 300 SVG illustrations `public/sets/art/<id>/<level>-<n>.svg`.
- `KURMANCI-KONTROL.md`: Kurdish words that need native-speaker review (Kurdish strings were written by Claude).

## Rules that must not be broken
- User-facing text never says "Kurmanji/Kurmancî"; use each language's word for "Kurdish" (TR "Kürtçe", KU "Kurdî"). Language picker order: Kurdî, Türkçe, English, then the rest.
- Every new UI string goes into all 14 languages (`lib/locales/extra.ts` is the easy place).
- Design: Cardo design system (artifact https://claude.ai/artifact/VbiPT7sF8HCpCdeoXXGjo9). Tokens: paper #f3efe6 / dark #12110f, raised #fbf9f4, ink #141210 / #f2ede3, muted #5e574c, signal orange #e4421b (dark #ff6a3d), card inks blue #6a9cc8, pink #e58bcb, olive #8c8519, orange #f04e1f. Fonts Geist + Geist Mono. Primary buttons are ink; orange `btn signal` only for the hero CTA. Riso/print look.
- Verify UI changes in the browser (light/dark, mobile, one RTL language) before deploying; deploy after changes the user asked for.

## Related folder: promo video
`~/Developer/cardo-video` (Remotion 4.0.300, not in git). See `~/Developer/cardo-video/README.md`. Output: `~/Desktop/Claude 1/Cardo_Kurdish_Cards_90s.mp4` (90 s, vertical, for social / the "Most Viral" X prize).
