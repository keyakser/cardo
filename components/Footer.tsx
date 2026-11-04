"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { UI_LANGS, useI18n, type TKey } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { KurdolingoMark, kurdolingoUrl } from "./KurdolingoPromo";
import { CardoWordmark } from "./CardoLogo";

export default function Footer() {
  const { t, lang, setLang } = useI18n();
  const { user, isAdmin } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="Cardo">
              <CardoWordmark height={34} />
            </Link>
            <span className="mono footer-kind">Kurdish Cards</span>
            <p className="muted">{t("footer.tagline")}</p>
            <a className="footer-kl" href={kurdolingoUrl("footer")} target="_blank" rel="noopener">
              <KurdolingoMark size={26} />
              <span>
                <strong>{t("foot.by")}</strong>
                <span className="muted"> · kurdolingo.com</span>
              </span>
            </a>
          </div>

          <nav className="footer-col" aria-label={t("footer.app")}>
            <span className="mono footer-head">{t("footer.app")}</span>
            <Link href="/#create">{t("nav.create")}</Link>
            <Link href="/sets">{t("nav.sets")}</Link>
            <Link href="/alphabet">{t("alpha.nav" as TKey)}</Link>
            {supabase &&
              (user ? (
                <>
                  <Link href="/profile">{t("nav.profile")}</Link>
                  {isAdmin && <Link href="/admin">{t("nav.admin")}</Link>}
                </>
              ) : (
                <Link href="/login">{t("nav.login")}</Link>
              ))}
          </nav>

          <nav className="footer-col" aria-label="Kurdolingo">
            <span className="mono footer-head">Kurdolingo</span>
            <a href={kurdolingoUrl("footer-learn")} target="_blank" rel="noopener">
              {t("footer.learn")}
            </a>
            <a href={kurdolingoUrl("footer-visit")} target="_blank" rel="noopener">
              {t("promo.cta")} ↗
            </a>
          </nav>

          <div className="footer-col">
            <span className="mono footer-head">{t("footer.lang")}</span>
            <div className="footer-langs">
              {UI_LANGS.map((l) => (
                <button key={l.code} className={l.code === lang ? "on" : ""} onClick={() => setLang(l.code)} lang={l.code} dir="auto">
                  {l.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom mono">
          <span>
            © {year} Kurdolingo. {t("footer.rights")}
          </span>
          <span>{t("foot.note")}</span>
          <span>{t("hero.badge")}</span>
          <Link href="/privacy">{t("legal.nav" as TKey)}</Link>
        </div>
      </div>
    </footer>
  );
}
