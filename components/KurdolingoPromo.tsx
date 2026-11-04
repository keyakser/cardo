"use client";

import { useI18n, type TKey } from "@/lib/i18n";

export const kurdolingoUrl = (place: string) =>
  `https://kurdolingo.com/?utm_source=kurdicards&utm_medium=referral&utm_campaign=${place}`;

export function KurdolingoMark({ size = 28 }: { size?: number }) {
  return (
    <span className="kl-mark" style={{ width: size, height: size, fontSize: size * 0.5 }} aria-hidden>
      K
    </span>
  );
}

/** Kurdolingo call-to-action. `variant` picks the copy and layout for each spot. */
export default function KurdolingoPromo({
  variant,
  place,
}: {
  variant: "section" | "deck" | "done" | "wait";
  place: string;
}) {
  const { t } = useI18n();

  if (variant === "wait") {
    return (
      <p className="kl-wait">
        <KurdolingoMark size={20} />
        <span>{t("promo.wait")}</span>
      </p>
    );
  }

  if (variant === "section") {
    return (
      <div className="kl-section">
        <div className="kl-section-copy">
          <span className="kl-kicker">
            <KurdolingoMark size={22} />
            {t("promo.kicker")}
          </span>
          <h2 className="h2">{t("promo.title")}</h2>
          <p className="muted">{t("promo.body")}</p>
        </div>
        <a className="btn kl-btn lg" href={kurdolingoUrl(place)} target="_blank" rel="noopener">
          {t("promo.cta")} →
        </a>
      </div>
    );
  }

  const key: TKey = variant === "done" ? "promo.done" : "promo.deck";
  return (
    <a className="kl-card" href={kurdolingoUrl(place)} target="_blank" rel="noopener">
      <KurdolingoMark size={40} />
      <span className="kl-card-copy">
        <strong>Kurdolingo</strong>
        <span>{t(key)}</span>
      </span>
      <span className="kl-card-cta">{t("promo.cta")} →</span>
    </a>
  );
}
