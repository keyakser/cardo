"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DownloadMenu from "@/components/DownloadMenu";
import { List, Study } from "@/components/DeckStudy";
import Quiz from "@/components/Quiz";
import KurdolingoPromo from "@/components/KurdolingoPromo";
import { GrainDefs } from "@/components/Prints";
import { SET_ART } from "@/components/SetArt";
import { useI18n, type TKey } from "@/lib/i18n";
import { SETS, setLang, wordArt, wordToCard, type SetData } from "@/lib/sets";
import { LEVELS } from "@/lib/types";

type Level = (typeof LEVELS)[number];

export default function SetPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useI18n();
  const meta = SETS.find((s) => s.id === id);
  const [data, setData] = useState<SetData | null>(null);
  const [failed, setFailed] = useState(false);
  const [level, setLevel] = useState<Level>("beginner");
  const [tab, setTab] = useState<"study" | "list" | "quiz">("study");

  useEffect(() => {
    if (!meta) return;
    fetch(`/sets/${meta.id}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setFailed(true));
  }, [meta]);

  const explain = setLang(lang);
  const cards = useMemo(() => (data ? data.levels[level].map((w, i) => wordToCard(w, explain, wordArt(data.id, level, i))) : []), [data, level, explain]);

  if (!meta || failed)
    return (
      <main className="container page center">
        <p className="muted">{t("deck.missing")}</p>
        <Link href="/sets" className="btn primary">
          {t("sets.all")}
        </Link>
      </main>
    );

  const Art = SET_ART[meta.id];
  const name = meta.name[lang] || meta.name.en;

  return (
    <main className="container page narrow">
      <GrainDefs />
      <Link href="/sets" className="mono back-link">
        ← {t("sets.all")}
      </Link>

      <div className="set-hero">
        <span className="set-thumb">
          <Art />
        </span>
        <div>
          <h1 className="h2">{name}</h1>
          <p className="muted">
            {lang !== "ku" && <span className="set-ku inline">{meta.name.ku} · </span>}
            {t("sets.count", { n: 30 })}
          </p>
        </div>
        <div className="actions">
          <DownloadMenu cards={cards} title={`${name} — ${t(`level.${level}` as TKey)}`} label={t("profile.download")} disabled={!cards.length} />
        </div>
      </div>

      <div className="tabs level-tabs" role="tablist">
        {LEVELS.map((l) => (
          <button key={l} role="tab" aria-selected={level === l} className={level === l ? "on" : ""} onClick={() => setLevel(l)}>
            {t(`level.${l}` as TKey)}
          </button>
        ))}
      </div>

      <div className="tabs small" role="tablist">
        <button role="tab" aria-selected={tab === "study"} className={tab === "study" ? "on" : ""} onClick={() => setTab("study")}>
          {t("deck.study")}
        </button>
        <button role="tab" aria-selected={tab === "list"} className={tab === "list" ? "on" : ""} onClick={() => setTab("list")}>
          {t("deck.all")}
        </button>
        <button role="tab" aria-selected={tab === "quiz"} className={tab === "quiz" ? "on" : ""} onClick={() => setTab("quiz")}>
          {t("quiz.tab" as TKey)}
        </button>
      </div>

      {!data ? (
        <div className="card-skeleton" />
      ) : tab === "quiz" ? (
        <Quiz key={level} cards={cards} />
      ) : tab === "study" ? (
        <Study key={level} cards={cards} lang={explain} />
      ) : (
        <List cards={cards} lang={explain} />
      )}

      <div className="deck-promo">
        <KurdolingoPromo variant="deck" place={`set-${meta.id}`} />
      </div>
    </main>
  );
}
