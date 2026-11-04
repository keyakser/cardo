"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n, type TKey } from "@/lib/i18n";
import LangMenu from "./LangMenu";
import { CardoWordmark } from "./CardoLogo";
import { supabase } from "@/lib/supabase";

function ThemeToggle({ label }: { label: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as "light" | "dark") || "light");
  }, []);

  function flip() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("kc-theme", next);
    } catch {}
    setTheme(next);
  }

  return (
    <button className="icon-btn" onClick={flip} aria-label={label} title={label}>
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}

function UserMenu() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!user) return null;
  const name = (user.user_metadata?.display_name as string) || user.email || "";

  return (
    <div className="menu" ref={ref}>
      <button className="avatar-btn" onClick={() => setOpen((o) => !o)} aria-label={t("nav.menu")} aria-expanded={open}>
        {name.slice(0, 1).toUpperCase()}
      </button>
      {open && (
        <div className="menu-pop wide" role="menu" onClick={() => setOpen(false)}>
          <span className="menu-head">{user.email}</span>
          <Link role="menuitem" href="/profile">
            {t("nav.profile")}
          </Link>
          {isAdmin && (
            <Link role="menuitem" href="/admin">
              {t("nav.admin")}
            </Link>
          )}
          <button
            role="menuitem"
            onClick={async () => {
              await supabase?.auth.signOut();
              router.push("/");
            }}
          >
            {t("nav.signout")}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { t } = useI18n();
  const { user } = useAuth();

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="brand" aria-label="Cardo">
          <CardoWordmark height={32} />
        </Link>

        <nav className="header-nav">
          <Link href="/#create" className="nav-link hide-sm">
            {t("nav.create")}
          </Link>
          <Link href="/sets" className="nav-link">
            {t("nav.sets")}
          </Link>
          <Link href="/alphabet" className="nav-link hide-sm">
            {t("alpha.nav" as TKey)}
          </Link>
          {!user && (
            <Link href="/#how" className="nav-link">
              {t("nav.how" as TKey)}
            </Link>
          )}
          {supabase &&
            (user ? (
              <Link href="/profile" className="nav-link hide-sm">
                {t("nav.profile")}
              </Link>
            ) : (
              <Link href="/login" className="nav-link">
                {t("nav.login")}
              </Link>
            ))}
          <LangMenu />
          <ThemeToggle label={t("theme.toggle")} />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
