"use client";

import { useI18n, type TKey } from "@/lib/i18n";

const N = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Faq() {
  const { t } = useI18n();
  const items = N.map((n) => ({ q: t(`faq.q${n}` as TKey), a: t(`faq.a${n}` as TKey) }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };

  return (
    <section className="container section faq" id="faq">
      <div className="faq-grid">
        <div>
          <span className="mono accent-text">{t("faq.kicker" as TKey)}</span>
          <h2 className="h2">{t("faq.title" as TKey)}</h2>
        </div>
        <div className="faq-list">
          {items.map((i, k) => (
            <details key={k} className="faq-item">
              <summary>
                <span className="mono faq-n">{String(k + 1).padStart(2, "0")}</span>
                <span className="faq-q">{i.q}</span>
                <span className="faq-plus" aria-hidden />
              </summary>
              <p>{i.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
