"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/lib/toast";
import type { Card } from "@/lib/types";

export default function FavButton({ card, lang }: { card: Card; lang: string }) {
  const { user, isFav, toggleFav } = useAuth();
  const { t } = useI18n();
  const toast = useToast();
  const router = useRouter();
  if (!supabase) return null;

  const on = !!user && isFav(card);
  const label = !user ? t("fav.login") : on ? t("fav.remove") : t("fav.add");

  return (
    <button
      className={`fav ${on ? "on" : ""}`}
      aria-pressed={on}
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        if (!user) return router.push(`/login?next=${encodeURIComponent(location.pathname + location.hash)}`);
        toggleFav(card, lang);
        toast(on ? t("toast.removed") : t("toast.saved"));
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M12 20.5s-7.5-4.6-9.5-9.3C1 7.6 3.4 4 7 4c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.6 0 6 3.6 4.5 7.2-2 4.7-9.5 9.3-9.5 9.3z" />
      </svg>
    </button>
  );
}
