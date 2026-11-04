"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useI18n, type TKey } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

function nextUrl() {
  const n = new URLSearchParams(location.search).get("next") || "/profile";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/profile";
}

export default function LoginPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    if (user) router.replace(nextUrl());
  }, [user, router]);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("mode") === "forgot") setMode("forgot");
  }, []);

  if (!supabase)
    return (
      <main className="container page center">
        <p className="muted">{t("auth.off")}</p>
      </main>
    );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMsg(null);
    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/reset-password` });
      setBusy(false);
      return setMsg(error ? { kind: "error", text: error.message } : { kind: "info", text: t("auth.linkSent" as TKey) });
    }
    const res =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { display_name: name.trim() } } });
    setBusy(false);
    if (res.error) return setMsg({ kind: "error", text: res.error.message });
    if (mode === "signup" && !res.data.session) {
      setMsg({ kind: "info", text: t("auth.check") });
      setMode("signin");
    }
  }

  return (
    <main className="container page auth">
      <div className="panel auth-card">
        <h1 className="h2">{mode === "signin" ? t("auth.welcome") : mode === "signup" ? t("auth.join") : t("auth.resetTitle" as TKey)}</h1>
        <p className="muted">{mode === "forgot" ? t("auth.resetSub" as TKey) : t("auth.sub")}</p>
        <form onSubmit={submit} className="stack">
          {mode === "signup" && (
            <input className="field" placeholder={t("auth.name")} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          )}
          <input
            className="field"
            type="email"
            required
            placeholder={t("auth.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {mode !== "forgot" && (
          <input
            className="field"
            type="password"
            required
            minLength={6}
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />
          )}
          {msg && <p className={msg.kind === "error" ? "error" : "info"}>{msg.text}</p>}
          <button className="btn primary block" disabled={busy}>
            {busy ? "…" : mode === "signin" ? t("auth.signin") : mode === "signup" ? t("auth.signup") : t("auth.sendLink" as TKey)}
          </button>
          {mode === "signup" && (
            <p className="muted small consent">
              {t("auth.consent" as TKey)} <Link href="/privacy">{t("legal.nav" as TKey)}</Link>
            </p>
          )}
        </form>
        {mode === "signin" && (
          <button
            className="link-btn"
            onClick={() => {
              setMode("forgot");
              setMsg(null);
            }}
          >
            {t("auth.forgot" as TKey)}
          </button>
        )}
        <button
          className="link-btn"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setMsg(null);
          }}
        >
          {mode === "signin" ? t("auth.toSignup") : mode === "signup" ? t("auth.toSignin") : t("auth.back" as TKey)}
        </button>
      </div>
    </main>
  );
}
