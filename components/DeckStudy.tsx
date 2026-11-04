"use client";

import { useEffect, useState } from "react";
import FavButton from "@/components/FavButton";
import ReportButton from "@/components/ReportButton";
import KurdolingoPromo from "@/components/KurdolingoPromo";
import { useI18n } from "@/lib/i18n";
import type { Card } from "@/lib/types";

export function Study({ cards, lang }: { cards: Card[]; lang: string }) {
  const { t } = useI18n();
  const [queue, setQueue] = useState<number[]>(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);

  // Space flips, ← = again, → = got it (ignored while typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!queue.length || (e.target as HTMLElement)?.closest("input, textarea, select, button")) return;
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const got = e.key === "ArrowRight";
        setFlipped(false);
        setQueue((q) => (got ? q.slice(1) : [...q.slice(1), q[0]]));
        if (got) setKnown((k) => k + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [queue.length]);

  if (!queue.length) {
    return (
      <div className="done">
        <div className="done-mark">✓</div>
        <h2 className="h3">{t("study.done")}</h2>
        <button
          className="btn primary"
          onClick={() => {
            setQueue(cards.map((_, i) => i));
            setKnown(0);
          }}
        >
          {t("study.restart")}
        </button>
        <KurdolingoPromo variant="done" place="deck-finished" />
      </div>
    );
  }

  const card = cards[queue[0]];
  const answer = (gotIt: boolean) => {
    setFlipped(false);
    setQueue((q) => (gotIt ? q.slice(1) : [...q.slice(1), q[0]]));
    if (gotIt) setKnown((k) => k + 1);
  };

  return (
    <div className="study">
      <div className="progress" aria-label={t("study.learned", { n: known, total: cards.length })}>
        <div style={{ width: `${(known / cards.length) * 100}%` }} />
      </div>
      <div className="card-wrap">
        <div
          className={`card ${flipped ? "flipped" : ""} ${card.img ? "has-art" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), setFlipped((f) => !f))}
        >
          <div className="face front">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {card.img && <img className="card-art" src={card.img} alt="" />}
            <span className="pos">{card.pos}</span>
            <span className="word">{card.ku}</span>
            <span className="hint">{t("study.flip")}</span>
          </div>
          <div className="face back">
            <span className="word sm">{card.meaning}</span>
            {card.example_ku && (
              <p className="ex">
                <b>{card.example_ku}</b>
                <br />
                {card.example_tr}
              </p>
            )}
            {card.note && <p className="note">💡 {card.note}</p>}
          </div>
        </div>
        <div className="card-fav">
          <FavButton card={card} lang={lang} />
          <ReportButton card={card} lang={lang} />
        </div>
      </div>
      <div className="answer">
        <button className="again" onClick={() => answer(false)}>
          {t("study.again")}
        </button>
        <button className="got" onClick={() => answer(true)}>
          {t("study.got")}
        </button>
      </div>
      <p className="muted center small">{t("study.learned", { n: known, total: cards.length })}</p>
      <p className="muted center small hide-touch">{t("study.keys")}</p>
    </div>
  );
}

export function List({ cards, lang }: { cards: Card[]; lang: string }) {
  return (
    <ul className="list">
      {cards.map((c, i) => (
        <li key={i} className={c.img ? "with-art" : ""}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {c.img && <img className="list-art" src={c.img} alt="" loading="lazy" />}
          <div className="row">
            <b className="ku">{c.ku}</b>
            <span className="pos">{c.pos}</span>
            <span className="mean">{c.meaning}</span>
            <FavButton card={c} lang={lang} />
            <ReportButton card={c} lang={lang} />
          </div>
          {c.example_ku && (
            <p className="ex">
              <i>{c.example_ku}</i> — {c.example_tr}
            </p>
          )}
          {c.note && <p className="note">💡 {c.note}</p>}
        </li>
      ))}
    </ul>
  );
}
