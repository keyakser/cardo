"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, type Favorite } from "./supabase";
import type { Card } from "./types";

type Ctx = {
  user: User | null;
  ready: boolean;
  isAdmin: boolean;
  token: () => Promise<string | null>;
  favorites: Favorite[];
  isFav: (c: Card) => boolean;
  toggleFav: (c: Card, lang: string) => Promise<void>;
  removeFavs: (ids: string[]) => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);
const keyOf = (c: { ku: string; meaning: string }) => `${c.ku}|${c.meaning}`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!supabase);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const loadFavs = useCallback(async () => {
    if (!supabase || !user) return setFavorites([]);
    const { data } = await supabase.from("favorites").select("*").order("created_at", { ascending: false });
    setFavorites((data as Favorite[]) || []);
  }, [user]);

  useEffect(() => {
    loadFavs();
  }, [loadFavs]);

  useEffect(() => {
    if (!supabase || !user) return setIsAdmin(false);
    supabase.rpc("is_admin").then(({ data }) => setIsAdmin(data === true));
  }, [user]);

  async function token() {
    if (!supabase) return null;
    return (await supabase.auth.getSession()).data.session?.access_token ?? null;
  }

  const isFav = (c: Card) => favorites.some((f) => keyOf(f) === keyOf(c));

  async function toggleFav(c: Card, lang: string) {
    if (!supabase || !user) return;
    const existing = favorites.find((f) => keyOf(f) === keyOf(c));
    if (existing) {
      setFavorites((fs) => fs.filter((f) => f.id !== existing.id));
      await supabase.from("favorites").delete().eq("id", existing.id);
    } else {
      const { data } = await supabase
        .from("favorites")
        .upsert(
          {
            ku: c.ku,
            pos: c.pos,
            meaning: c.meaning,
            example_ku: c.example_ku,
            example_tr: c.example_tr,
            note: c.note || "",
            lang,
          },
          { onConflict: "user_id,ku,meaning" },
        )
        .select()
        .single();
      if (data) setFavorites((fs) => [data as Favorite, ...fs]);
    }
  }

  async function removeFavs(ids: string[]) {
    if (!supabase || !ids.length) return;
    setFavorites((fs) => fs.filter((f) => !ids.includes(f.id)));
    await supabase.from("favorites").delete().in("id", ids);
  }

  return (
    <AuthCtx.Provider value={{ user, ready, isAdmin, token, favorites, isFav, toggleFav, removeFavs }}>{children}</AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
