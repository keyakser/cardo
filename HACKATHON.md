# Hackathon status and to-do (as of 2026-11-04, ~17:00 Turkey time)

## Deadline
**Nov 4, 9:00 PM ET = Nov 5, 05:00 Turkey time.** Late submissions are not accepted. Submit early.
- Rules / guide: https://cerebralvalley.ai/e/meta-ai-developer-hackathon/details (needs the user's Cerebral Valley login)
- Submission form: https://cerebralvalley.ai/e/meta-ai-developer-hackathon/hackathon/submit

## Rules that matter for us
- Must use Meta models (we use Muse Wonder via Meta Model API ✅).
- **Repository must be public** (mandatory). `keyakser/cardo` is private → `gh repo edit keyakser/cardo --visibility public --accept-visibility-change-consequences` (ask the user first; repo was scanned, no secrets).
- **3-minute demo video** (YouTube link) highlighting the features, code and functionality built during the hackathon. Judges use it with the code and live product.
- Must be clear what was built during the hackathon (everything was built Nov 3–4, 2026) → state it in README and video, or risk disqualification.
- No assets without rights. Our music/illustrations are original. The 90 s video's voice is Microsoft Edge TTS (edge-tts) — rights unclear; for the judge video prefer ElevenLabs or the user's own voice.
- Anti-projects list includes "simple AI for Education chatbots", "simple image analyzers", "anything political". Cardo is not a chatbot, but stress what's beyond that (low-resource language, structured cards, sets, quiz, export, multi-model). In the judge video soften "suppressed / kept out of schools" to cultural/linguistic framing.

## Judging (0–10 per category)
Impact 30% · Use of Meta AI tooling 25% · Technical depth 20% · Demo 25%. Stage 1 is pass/fail (fits theme + uses Meta API). Top 5 per track go to live finals Nov 9.

## Bonus prizes
- **Most Viral ($20k)**: engagement on **one X post** (likes, reposts, comments) until Nov 8 EOD; post link goes in the form. Upload the 90 s video natively to X, pin it, drive traffic from Instagram/TikTok/WhatsApp/Telegram/Reddit/Kurdolingo. Idea: "comment a word, we reply with its Kurdish card" and reply with Cardo card images. No bots/bought engagement.
- **Best Creative Build ($5k)**: Muse Image or Muse Wonder → we qualify.
- **Community Vote ($10k)**: public gallery on the CV platform, one vote per verified account, opens ~Nov 9, winner Nov 16. Prepare a TR/KU "how to vote" guide (create CV account → find Cardo → vote).

## Submission form fields
Team name · Track: **Indie Developer** · Problem statement: **Build for Your World** · X post link (Most Viral) · Project description · Public GitHub repo · 3-min demo video URL · "Describe your use of Meta products" · "Why are Meta's models important to your solution?" · partner feedback (optional, we used none) · survey questions (user's own opinion) · consent checkbox. The user fills and submits; Claude drafts the English texts.

## Done on Nov 4 (evening)
- SAM 3.1 cut-out cards (lib/sam.ts, lib/art.ts), Muse Image "Draw it" / "Draw all pictures" (app/api/illustrate, components/IllustrateButton.tsx), "Try a sample photo" (public/sample/table.jpg, made by Muse Image). Deployed. Muse Image: `store:false` returns 500, size must be a standard value (1024x1536).
- README rewritten, SUBMISSION.md has all form texts.
- Judge video: ~/Developer/cardo-video composition "Judge" (src/judge.tsx, script_judge.json, capture_judge.mjs, mix_judge.py) → ~/Desktop/Claude 1/Cardo_Judge_Demo_3min.mp4 (2:41, Edge TTS voice by the user's choice).

## Planned improvements (original list; 1, 2, 3, 5 done)
1. **SAM 3.1 cut-out cards** (top priority): Muse Wonder finds objects in the photo (ask it for points/boxes), SAM 3.1 segments each object, each card front shows the object cut out of the user's own photo (sticker look). Big for "Use of Meta tooling".
2. **Muse Image card illustration**: "Illustrate" button on AI-made cards, riso style prompt, on demand (cost). Helps Best Creative Build.
3. "Try with a sample photo" button so judges can test without a camera.
4. Optional: Muse Voice Transcribe (say a sentence → cards); unknown if it handles Kurdish.
5. README: architecture diagram, "built during the hackathon" section, measured numbers (effort low 42 s → 10 s; sets skip the model).
6. Real usage numbers from /admin for the video and form (don't invent numbers).

## Judge video plan (3 min, 16:9)
Hook + problem (low-resource language) → optional 10–15 s of the user on camera (founder story) → real use ~90 s (photo → cards live, topic, study/quiz/export) → how it works ~40 s (animated architecture Wonder→SAM→Image, real code snippets, speed numbers) → impact + "built during the hackathon" list → CTA. Screen recordings can be made with puppeteer against the live site (`~/Developer/cardo-video/capture.mjs` shows how). The user can supply a real photo (4–6 clear objects, no people/documents) and/or a 10–15 s clip of snapping a photo with a phone. Reuse the Remotion pipeline in `~/Developer/cardo-video` (new composition 1920×1080).

## Other open items
- Rotate the Meta API key after the hackathon.
- Supabase URL configuration + SMTP for password reset emails.
- Native review of `KURMANCI-KONTROL.md`.
- Deferred by the user: audio pronunciation, teacher mode, streaks/SRS, PWA.
