"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FavButton from "./FavButton";
import { useI18n, type TKey } from "@/lib/i18n";
import { shareStory } from "@/lib/export";
import { setLang, setName, wordArt, wordToCard, type SetData } from "@/lib/sets";
import { useToast } from "@/lib/toast";
import type { Card } from "@/lib/types";
import { wordOfDay } from "@/lib/wotd";

export default function WordOfDay() {
  const { t, lang } = useI18n();
  const toast = useToast();
  const [card, setCard] = useState<Card | null>(null);
  const [busy, setBusy] = useState(false);
  const [pick] = useState(() => wordOfDay());
  const explain = setLang(lang);

  useEffect(() => {
    fetch(`/sets/${pick.setId}.json`)
      .then((r) => r.json())
      .then((d: SetData) => setCard(wordToCard(d.levels[pick.level][pick.index], explain, wordArt(pick.setId, pick.level, pick.index))))
      .catch(() => setCard(null));
  }, [pick, explain]);

  const date = new Date().toLocaleDateString(lang === "ku" ? "tr" : lang, { day: "numeric", month: "long" });
  const set = setName(pick.setId, lang);

  async function share() {
    if (!card) return;
    setBusy(true);
    try {
      await document.fonts?.ready;
      const r = await shareStory(card, { kicker: t("wotd.kicker" as TKey), date, setName: set });
      if (r === "saved") toast(t("wotd.ready" as TKey));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container wotd" aria-labelledby="wotd-word">
      <div className={`wotd-card ${card ? "" : "is-loading"}`}>
        <div className="wotd-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {card?.img && <img src={card.img} alt="" />}
        </div>
        <div className="wotd-body">
          <p className="mono wotd-kicker">
            <span>{t("wotd.kicker" as TKey)}</span>
            <span className="muted">{date}</span>
          </p>
          <h2 className="wotd-word" id="wotd-word">
            {card?.ku ?? " "}
          </h2>
          <p className="wotd-mean">{card?.meaning ?? " "}</p>
          {card?.example_ku && (
            <p className="wotd-ex">
              <b>{card.example_ku}</b>
              <span>{card.example_tr}</span>
            </p>
          )}
          <div className="wotd-actions">
            <button className="btn primary" onClick={share} disabled={!card || busy}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6" />
              </svg>
              {busy ? "…" : t("wotd.share" as TKey)}
            </button>
            <Link href={`/sets/${pick.setId}`} className="btn ghost">
              {t("wotd.study" as TKey)}
            </Link>
            {card && <FavButton card={card} lang={explain} />}
          </div>
          <p className="muted small wotd-set">{t("wotd.from" as TKey, { set })}</p>
        </div>
      </div>
    </section>
  );
}
