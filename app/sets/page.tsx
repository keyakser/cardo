"use client";

import Link from "next/link";
import { GrainDefs } from "@/components/Prints";
import { SET_ART } from "@/components/SetArt";
import KurdolingoPromo from "@/components/KurdolingoPromo";
import { useI18n } from "@/lib/i18n";
import { SETS } from "@/lib/sets";

export default function SetsPage() {
  const { t, lang } = useI18n();

  return (
    <main className="container page">
      <GrainDefs />
      <header className="sets-head">
        <span className="mono accent-text">{t("nav.sets")}</span>
        <h1 className="display sets-title">{t("sets.title")}</h1>
        <p className="lead">{t("sets.sub")}</p>
      </header>

      <ul className="sets-grid">
        {SETS.map((s, i) => {
          const Art = SET_ART[s.id];
          return (
            <li key={s.id}>
              <Link href={`/sets/${s.id}`} className="set-card">
                <span className="set-art">
                  <Art />
                </span>
                <span className="print-meta">
                  <span className="mono print-n">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="print-word">{s.name[lang] || s.name.en}</span>
                    {lang !== "ku" && <span className="set-ku">{s.name.ku}</span>}
                    <span className={`pill pill-${s.color}`}>{t("sets.count", { n: 30 })}</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="sets-promo">
        <KurdolingoPromo variant="deck" place="sets" />
      </div>
    </main>
  );
}
