"use client";

import { useI18n, type TKey } from "@/lib/i18n";
import { INK } from "./Prints";

// Small riso tiles for the features grid (uses the page's #kc-grain filter).
const B = INK.black;
const P = INK.paper;
const ICONS: Record<string, { bg: string; draw: React.ReactNode }> = {
  sets: {
    bg: INK.olive,
    draw: (
      <>
        <rect x="22" y="30" width="40" height="50" rx="4" fill={INK.pink} transform="rotate(-10 42 55)" />
        <rect x="36" y="24" width="40" height="50" rx="4" fill={P} />
        <circle cx="56" cy="44" r="10" fill={INK.orange} />
        <path d="M46 62h20" stroke={B} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  photo: {
    bg: INK.blue,
    draw: (
      <>
        <path d="M18 36h16l6-9h20l6 9h16v38H18z" fill={B} />
        <circle cx="50" cy="55" r="14" fill={P} />
        <circle cx="50" cy="55" r="7" fill={INK.orange} />
      </>
    ),
  },
  topic: {
    bg: INK.orange,
    draw: (
      <>
        <circle cx="50" cy="42" r="20" fill={P} />
        <rect x="41" y="60" width="18" height="12" rx="3" fill={B} />
        <path d="M43 78h14" stroke={B} strokeWidth="4" strokeLinecap="round" />
        <path d="M50 14v-4M24 24l-4-4M76 24l4-4" stroke={P} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  text: {
    bg: INK.pink,
    draw: (
      <>
        <rect x="26" y="18" width="48" height="64" rx="4" fill={P} />
        <path d="M34 32h32M34 42h32M34 52h22M34 62h28" stroke={B} strokeWidth="4" strokeLinecap="round" />
        <path d="M60 58h10" stroke={INK.orange} strokeWidth="6" strokeLinecap="round" />
      </>
    ),
  },
  fav: {
    bg: INK.olive,
    draw: <path d="M50 80S20 62 18 42c-1-12 8-20 17-20 7 0 12 4 15 9 3-5 8-9 15-9 9 0 18 8 17 20-2 20-32 38-32 38z" fill={INK.orange} />,
  },
  art: {
    bg: INK.blue,
    draw: (
      <>
        <path d="M50 20c-22 0-32 16-30 32 2 15 14 26 28 26 8 0 10-6 6-10-3-4-1-8 4-8h10c10 0 14-7 12-17-3-14-15-23-30-23z" fill={P} />
        <circle cx="36" cy="42" r="5" fill={INK.orange} />
        <circle cx="50" cy="34" r="5" fill={INK.pink} />
        <circle cx="64" cy="42" r="5" fill={INK.olive} />
        <circle cx="34" cy="58" r="5" fill={B} />
      </>
    ),
  },
  history: {
    bg: INK.pink,
    draw: (
      <>
        <circle cx="50" cy="50" r="28" fill={P} />
        <path d="M50 32v18l12 8" stroke={B} strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M18 46l6 8 8-6" stroke={B} strokeWidth="5" strokeLinecap="round" fill="none" />
      </>
    ),
  },
  export: {
    bg: INK.olive,
    draw: (
      <>
        <path d="M50 18v38M34 42l16 16 16-16" stroke={P} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="22" y="68" width="56" height="12" rx="3" fill={B} />
      </>
    ),
  },
  mobile: {
    bg: INK.orange,
    draw: (
      <>
        <rect x="32" y="14" width="36" height="72" rx="7" fill={B} />
        <rect x="37" y="22" width="26" height="50" rx="2" fill={P} />
        <rect x="41" y="30" width="18" height="22" rx="2" fill={INK.blue} />
        <circle cx="50" cy="79" r="3" fill={P} />
      </>
    ),
  },
  langs: {
    bg: INK.blue,
    draw: (
      <>
        <circle cx="50" cy="50" r="30" fill={P} />
        <path d="M20 50h60M50 20c10 9 14 19 14 30s-4 21-14 30c-10-9-14-19-14-30s4-21 14-30z" stroke={B} strokeWidth="4" fill="none" />
        <circle cx="74" cy="26" r="9" fill={INK.orange} />
      </>
    ),
  },
};

const IDS = ["sets", "photo", "topic", "text", "fav", "art", "history", "export", "mobile", "langs"];

export default function Features() {
  const { t } = useI18n();
  return (
    <section className="container section features">
      <div className="features-head">
        <h2 className="h2">{t("feat.title")}</h2>
        <p className="muted">{t("feat.sub")}</p>
      </div>
      <ul className="features-grid">
        {IDS.map((id, i) => (
          <li key={id} className="feature">
            <svg className="feature-icon" viewBox="0 0 100 100" aria-hidden>
              <rect width="100" height="100" fill={ICONS[id].bg} />
              <g filter="url(#kc-grain)">{ICONS[id].draw}</g>
            </svg>
            <span className="mono feature-n">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="h3">{t(`feat.${id}.t` as TKey)}</h3>
            <p className="muted">{t(`feat.${id}.d` as TKey)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
