"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useI18n, type TKey } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/lib/toast";

// Landing page of the reset e-mail: Supabase signs the user in from the link,
// then they choose a new password here.
export default function ResetPasswordPage() {
  const { t } = useI18n();
  const { user, ready } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);

  // Give the link a moment to turn into a session before calling it expired.
  useEffect(() => {
    if (!ready || user) return;
    const id = setTimeout(() => setExpired(true), 2500);
    return () => clearTimeout(id);
  }, [ready, user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(error.message);
    toast(t("auth.passwordSaved" as TKey));
    router.replace("/profile");
  }

  return (
    <main className="container page auth">
      <div className="panel auth-card">
        <h1 className="h2">{t("auth.resetTitle" as TKey)}</h1>
        {user ? (
          <form onSubmit={save} className="stack">
            <p className="muted">{user.email}</p>
            <input
              className="field"
              type="password"
              required
              minLength={6}
              placeholder={t("auth.newPassword" as TKey)}
              aria-label={t("auth.newPassword" as TKey)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              autoFocus
            />
            {error && <p className="error">{error}</p>}
            <button className="btn primary block" disabled={busy}>
              {busy ? "…" : t("auth.savePassword" as TKey)}
            </button>
          </form>
        ) : expired ? (
          <>
            <p className="error">{t("auth.linkInvalid" as TKey)}</p>
            <Link href="/login?mode=forgot" className="btn primary block">
              {t("auth.sendLink" as TKey)}
            </Link>
          </>
        ) : (
          <p className="muted">…</p>
        )}
      </div>
    </main>
  );
}
