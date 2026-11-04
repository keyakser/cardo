"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LANGS, LEVELS, type Deck } from "@/lib/types";
import { encodeDeck } from "@/lib/share";
import { deckKey, renderCuts, saveArt } from "@/lib/art";
import { useI18n, type TKey } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import KurdolingoPromo from "./KurdolingoPromo";

type Mode = "photo" | "topic" | "text";

// Shrink photos in the browser so uploads stay small and fast.
async function resizeImage(file: File, max = 800): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function Creator({ initialMode }: { initialMode?: Mode }) {
  const { t, lang: uiLang } = useI18n();
  const router = useRouter();
  const { token } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode || "photo");
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [level, setLevel] = useState<string>("beginner");
  const [count, setCount] = useState(8);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Default the explanation language to the UI language (Kurmanji UI → Turkish).
  useEffect(() => {
    setLang(LANGS.some((l) => l.code === uiLang) ? uiLang : uiLang === "ku" ? "tr" : "en");
  }, [uiLang]);

  useEffect(() => {
    const onMode = (e: Event) => setMode((e as CustomEvent<Mode>).detail);
    window.addEventListener("kc-mode", onMode);
    return () => window.removeEventListener("kc-mode", onMode);
  }, []);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    try {
      setImage(await resizeImage(f));
    } catch {
      setError(t("photo.error"));
    }
  }

  // Cards are only made from the "Make flashcards" button.
  async function generate() {
    const text = input;
    setBusy(true);
    setError("");
    try {
      const auth = await token();
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${auth}` } : {}) },
        body: JSON.stringify({ mode, input: text, image, lang, level, count, uiLang }),
      });
      const data = await res.json().catch(() => ({ error: t("err.timeout") }));
      if (!res.ok) throw new Error(data.code ? t(`err.${data.code}` as TKey) : data.error || t("err.generic"));
      const { cuts, ...deck } = data as Deck & { cuts?: Parameters<typeof renderCuts>[1] };
      const code = await encodeDeck(deck);
      // SAM 3.1 masks → sticker pictures cut from the learner's own photo.
      if (mode === "photo" && image && cuts?.length) {
        try {
          saveArt(deckKey(code), await renderCuts(image, cuts));
        } catch {
          /* cards still work without pictures */
        }
      }
      router.push(`/deck?new=1#d=${code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("err.generic"));
      setBusy(false);
    }
  }

  const ready = mode === "photo" ? !!image : mode === "topic" ? input.trim().length > 1 : input.trim().length > 9;
  const tabs: [Mode, TKey, string][] = [
    ["photo", "tab.photo", "M4 8h3l2-3h6l2 3h3v11H4z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
    ["topic", "tab.topic", "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"],
    ["text", "tab.text", "M5 5h14M5 10h14M5 15h9M5 20h6"],
  ];

  return (
    <div className="panel creator">
      <div className="tabs" role="tablist">
        {tabs.map(([m, key, d]) => (
          <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? "on" : ""} onClick={() => setMode(m)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={d} />
            </svg>
            {t(key)}
          </button>
        ))}
      </div>

      {mode === "photo" && (
        <div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} hidden />
          {image ? (
            <div className="preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" />
              <button className="btn ghost sm" onClick={() => fileRef.current?.click()}>
                {t("photo.change")}
              </button>
            </div>
          ) : (
            <button className="drop" onClick={() => fileRef.current?.click()}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <strong>{t("photo.take")}</strong>
              <small>{t("photo.hint")}</small>
            </button>
          )}
          {!image && (
            <button
              className="btn ghost sm sample-btn"
              onClick={async () => {
                const blob = await (await fetch("/sample/table.jpg")).blob();
                setImage(await resizeImage(new File([blob], "sample.jpg", { type: blob.type })));
              }}
            >
              {t("photo.sample" as TKey)}
            </button>
          )}
          <input className="field" placeholder={t("photo.focus")} value={input} onChange={(e) => setInput(e.target.value)} />
          <p className="hint sam-hint">{t("photo.samHint" as TKey)}</p>
        </div>
      )}

      {mode === "topic" && (
        <div>
          <input
            className="field"
            placeholder={t("topic.placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="chips">
            {t("topics")
              .split("|")
              .map((tp) => (
                <button key={tp} className={`chip ${input === tp ? "on" : ""}`} disabled={busy} onClick={() => setInput(tp)} aria-pressed={input === tp}>
                  {tp}
                </button>
              ))}
          </div>
        </div>
      )}

      {mode === "text" && (
        <textarea
          className="field area"
          placeholder={t("text.placeholder")}
          value={input}
          maxLength={4000}
          onChange={(e) => setInput(e.target.value)}
        />
      )}

      <div className="opts">
        <label>
          {t("opt.explain")}
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("opt.level")}
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {t(`level.${l}` as TKey)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("opt.cards")}
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {[6, 8, 10, 12, 15].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <button className="btn primary block" disabled={!ready || busy} onClick={generate}>
        {busy ? <span className="spinner">{t("btn.making")}</span> : t("btn.make")}
      </button>
      {busy && (
        <>
          <p className="muted center small">{t("wait")}</p>
          <KurdolingoPromo variant="wait" place="loading" />
        </>
      )}
    </div>
  );
}
