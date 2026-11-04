"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ALPHABET } from "@/lib/alphabet";
import { useI18n, type TKey } from "@/lib/i18n";
import { setLang, wordArt, type SetData } from "@/lib/sets";

function Highlight({ word, letter }: { word: string; letter: string }) {
  const i = word.indexOf(letter);
  if (i < 0) return <>{word}</>;
  return (
    <>
      {word.slice(0, i)}
      <mark>{word.slice(i, i + letter.length)}</mark>
      {word.slice(i + letter.length)}
    </>
  );
}

export default function AlphabetPage() {
  const { t, lang } = useI18n();
  const [sets, setSets] = useState<Record<string, SetData>>({});
  const explain = setLang(lang);

  // Meanings of the example words come from the ready-made sets.
  useEffect(() => {
    const ids = [...new Set(ALPHABET.map((a) => a.ex[0]))];
    Promise.all(ids.map((id) => fetch(`/sets/${id}.json`).then((r) => r.json() as Promise<SetData>)))
      .then((all) => setSets(Object.fromEntries(all.map((d) => [d.id, d]))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <main className="container page">
      <header className="sets-head">
        <span className="mono accent-text">{t("alpha.nav" as TKey)}</span>
        <h1 className="display sets-title">{t("alpha.title" as TKey)}</h1>
        <p className="lead">{t("alpha.sub" as TKey)}</p>
      </header>

      <ol className="alpha-grid">
        {ALPHABET.map((a, i) => {
          const [setId, level, idx] = a.ex;
          const w = sets[setId]?.levels[level][idx];
          const mean = w ? w.mean[explain] || w.mean.en : "";
          return (
            <li key={a.l} id={`l-${i}`} className={`alpha-card ${a.special ? "is-special" : ""}`}>
              <div className="alpha-head">
                <span className="alpha-letter" lang="ku">
                  {a.l.toLocaleUpperCase("ku")}
                  <span>{a.l}</span>
                </span>
                <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
              </div>
              {(a.special || a.notInTr) && (
                <div className="alpha-tags">
                  {a.special && <span className="cd-pill pill pill-orange">{t("alpha.special" as TKey)}</span>}
                  {a.notInTr && <span className="cd-pill pill pill-blue">{t("alpha.notInTr" as TKey)}</span>}
                </div>
              )}
              <dl className="alpha-sounds">
                <div>
                  <dt className="mono">{t("alpha.tr" as TKey)}</dt>
                  <dd lang="tr">{a.tr}</dd>
                </div>
                <div>
                  <dt className="mono">{t("alpha.en" as TKey)}</dt>
                  <dd lang="en">{a.en}</dd>
                </div>
              </dl>
              <Link href={`/sets/${setId}`} className="alpha-ex">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={wordArt(setId, level, idx)} alt="" loading="lazy" />
                <span>
                  <span className="mono muted">{t("alpha.example" as TKey)}</span>
                  <strong lang="ku">
                    <Highlight word={a.word} letter={a.l} />
                  </strong>
                  <span className="muted">{mean}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
