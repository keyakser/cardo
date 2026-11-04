# Cardo: Kurdish Cards

**Everything has a Kurdish name.** Cardo turns a photo, a topic or a text into Kurdish flashcards in seconds, using Meta's Muse model. A free tool by [Kurdolingo](https://kurdolingo.com).

Live: https://cardokurdish.vercel.app

## What it does

- **Photo → cards:** take a picture of anything around you; Muse recognises the objects and writes Kurdish (Northern Kurdish, Hawar Latin script) cards with example sentences.
- **Topic and text → cards:** type a topic or paste a song, story or article.
- **300 ready-made words** in 10 topics × 3 levels, each with its own risograph-style illustration. Topics that match a set are answered instantly from the set, with no model call.
- **Study, test, keep:** flip cards, a quiz mode (meaning, picture, spelling with ç ê î ş û keys), favorites, deck history, word of the day with a shareable story image.
- **Export:** single cards or whole decks as JPG, PDF or CSV (Anki-ready).
- **Kurdish alphabet page**, **report-a-mistake** button with an admin review list, admin usage dashboard.
- **14 interface languages** (Kurdî, Türkçe, English, Deutsch, Français, Español, Italiano, Português, Русский, العربية, فارسی, 中文, 日本語, 한국어) with right-to-left support; card explanations in 15.

## How Meta Muse is used

`app/api/generate/route.ts` calls the Meta Model API (`muse-wonder-1.0`), which speaks the Messages API format, through `@anthropic-ai/sdk` with `baseURL: https://api.meta.ai`. Photos are resized in the browser and sent as base64 image blocks. The model is asked for strict JSON (title + cards), with `output_config.effort: "low"` (about 10 s per deck instead of ~40 s). Responses are validated, retried once on bad JSON, and logged (no photos stored) for the usage dashboard.

## Stack

Next.js 16 (App Router) · TypeScript · Supabase (auth, Postgres, row-level security) · Vercel · Geist / Geist Mono · plain CSS with design tokens (Cardo design system).

## Run locally

```bash
npm install
cp .env.example .env.local   # add MODEL_API_KEY and the Supabase URL + publishable key
npm run dev                  # http://localhost:3005
```

Environment variables:

| Name | What |
| --- | --- |
| `MODEL_API_KEY` | Meta Model API key (dev.meta.ai → API keys) |
| `MODEL_API_BASE_URL` | optional, defaults to `https://api.meta.ai` |
| `MODEL_NAME` | optional, defaults to `muse-wonder-1.0` |
| `MODEL_EFFORT` | optional, defaults to `low` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable (anon) key |

Database: run `supabase/schema.sql` once in the Supabase SQL editor (safe to re-run).

## Project map

- `app/` pages: home, `deck`, `sets`, `alphabet`, `login`, `reset-password`, `profile`, `admin`, `privacy`, and the `api/generate` route
- `components/` UI (cards, quiz, word of the day, logo, illustrations)
- `lib/` i18n (`lib/locales/*`), ready-made sets, exports (JPG/PDF/CSV), Supabase client
- `public/sets/` 300-word data (`<topic>.json`) and illustrations (`art/<topic>/<level>-<n>.svg`)
- `KURMANCI-KONTROL.md` words flagged for native-speaker review

AI-generated cards can contain mistakes; ready-made content is being reviewed by native speakers.
