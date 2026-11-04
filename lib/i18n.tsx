"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { en, type Dict } from "./locales/en";
import { de } from "./locales/de";
import { fr } from "./locales/fr";
import { es } from "./locales/es";
import { it } from "./locales/it";
import { pt } from "./locales/pt";
import { ru } from "./locales/ru";
import { ar } from "./locales/ar";
import { fa } from "./locales/fa";
import { zh } from "./locales/zh";
import { ja } from "./locales/ja";
import { ko } from "./locales/ko";
import { EXTRA, type ExtraKey } from "./locales/extra";

export type UiLang = "en" | "tr" | "ku" | "de" | "fr" | "es" | "it" | "pt" | "ru" | "ar" | "fa" | "zh" | "ja" | "ko";
export const UI_LANGS: { code: UiLang; label: string; name: string }[] = [
  { code: "ku", label: "KU", name: "Kurdî" },
  { code: "tr", label: "TR", name: "Türkçe" },
  { code: "en", label: "EN", name: "English" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "es", label: "ES", name: "Español" },
  { code: "it", label: "IT", name: "Italiano" },
  { code: "pt", label: "PT", name: "Português" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "ar", label: "AR", name: "العربية" },
  { code: "fa", label: "FA", name: "فارسی" },
  { code: "zh", label: "ZH", name: "中文" },
  { code: "ja", label: "JA", name: "日本語" },
  { code: "ko", label: "KO", name: "한국어" },
];
export const RTL_LANGS: UiLang[] = ["ar", "fa"];




const tr: Dict = {
  "nav.create": "Oluştur",
  "nav.profile": "Kartlarım",
  "nav.login": "Giriş yap",
  "theme.toggle": "Açık / koyu mod",
  "lang.toggle": "Dili değiştir",

  "hero.kicker": "Kürtçe için yapay zekâ kartları",
  "hero.title1": "Kürtçeyi",
  "hero.title2": "etrafındaki dünyadan öğren.",
  "hero.lead":
    "Bir fotoğraf çek, bir konu seç ya da bir metin yapıştır. Cardo onu çalışabileceğin, kaydedebileceğin ve paylaşabileceğin kartlara dönüştürür.",
  "hero.cta": "Fotoğrafla başla",
  "hero.cta2": "Bir konu dene",
  "hero.badge": "Meta Muse ile çalışır",

  "how.title": "Üç adım. Ders kitabı yok.",
  "how.1t": "Fotoğraf çek",
  "how.1d": "Mutfağının, sokağının, masanın fotoğrafını çek — ya da sadece bir konu yaz.",
  "how.2t": "Üret",
  "how.2d": "Meta Muse kelimeleri bulur ve gerçek örnek cümlelerle Kürtçe kartlar yazar.",
  "how.3t": "Öğren ve kaydet",
  "how.3d": "Desteni çalış, favorilerini kaydet ve JPG, PDF ya da CSV olarak indir.",

  "why.title": "Yapay zekânın unuttuğu bir dil için.",
  "why.body":
    "Kürtçeyi milyonlarca insan konuşuyor ama neredeyse hiçbir dil uygulaması desteklemiyor. Cardo standart Latin alfabesini kullanır ve her kelimeyi senin dilinde açıklar.",
  "why.s1": "Açıklama dili",
  "why.s2": "Oluşturma yolu",
  "why.s3": "Denemek için gereken hesap",

  "create.title": "Desteni oluştur",
  "create.sub": "Bir kaynak seç. Kartların saniyeler içinde hazır.",
  "tab.photo": "Fotoğraf",
  "tab.topic": "Konu",
  "tab.text": "Metin",
  "photo.take": "Fotoğraf çek ya da yükle",
  "photo.hint": "Mutfağın, sokağın, masan — her şey olur.",
  "photo.change": "Fotoğrafı değiştir",
  "photo.focus": "İsteğe bağlı: neye odaklanalım? (ör. yemekler)",
  "photo.error": "Bu görsel açılamadı. JPEG ya da PNG dene.",
  "topic.placeholder": "ör. Kafede çay sipariş etmek",
  "text.placeholder":
    "Kürtçe bir metin yapıştır (şarkı, haber, hikâye) — ya da Kürtçe kelimelerini öğrenmek istediğin herhangi bir metin.",
  "opt.explain": "Açıklama dili",
  "opt.level": "Seviye",
  "opt.cards": "Kart",
  "level.beginner": "Başlangıç",
  "level.intermediate": "Orta",
  "level.advanced": "İleri",
  "btn.make": "Kartları oluştur",
  "btn.making": "Kartların hazırlanıyor…",
  "wait": "Meta Muse kartlarını yazıyor. Bu genelde 10–20 saniye sürer.",
  "err.generic": "Bir şeyler ters gitti.",
  "err.timeout": "Yapay zekâ çok uzun sürdü. Lütfen tekrar dene.",
  "topics": "Mutfak|Aile|Pazarda|Hava durumu|Selamlaşma|Vücut",

  "deck.cards": "{n} kart",
  "deck.share": "Paylaş",
  "deck.copied": "Link kopyalandı ✓",
  "deck.new": "Yeni deste",
  "deck.study": "Çalış",
  "deck.all": "Tüm kartlar",
  "deck.missing": "Bu deste linki bozuk ya da boş.",
  "study.flip": "Çevirmek için dokun",
  "study.again": "Tekrar",
  "study.got": "Bildim",
  "study.learned": "{n} / {total} öğrenildi",
  "study.done": "Te qedand! Desteyi bitirdin.",
  "study.restart": "Yeniden çalış",

  "fav.add": "Favorilere ekle",
  "fav.remove": "Favorilerden çıkar",
  "fav.login": "Favorilere eklemek için giriş yap",

  "auth.signin": "Giriş yap",
  "auth.signup": "Hesap oluştur",
  "auth.welcome": "Tekrar hoş geldin",
  "auth.join": "Cardo'ya katıl",
  "auth.sub": "Favori kelimelerini kaydet, istediğin zaman indir.",
  "auth.name": "Adın",
  "auth.email": "E-posta",
  "auth.password": "Şifre (en az 6 karakter)",
  "auth.toSignup": "Hesabın yok mu? Oluştur",
  "auth.toSignin": "Zaten hesabın var mı? Giriş yap",
  "auth.check": "Hesabını onaylamak için e-postanı kontrol et, sonra giriş yap.",
  "auth.off": "Hesaplar henüz kurulmadı.",

  "profile.title": "Kartlarım",
  "profile.since": "Üyelik: {d}",
  "profile.name": "Görünen ad",
  "profile.save": "Kaydet",
  "profile.saved": "Kaydedildi ✓",
  "profile.signout": "Çıkış yap",
  "profile.favs": "Favoriler",
  "profile.empty": "Henüz favorin yok. Bir deste oluştur ve saklamak istediğin kelimelerde ♡'ye dokun.",
  "profile.all": "Tümünü seç",
  "profile.selected": "{n} seçili",
  "profile.download": "İndir",
  "profile.delete": "Kaldır",
  "profile.confirm": "{n} kelime favorilerden kaldırılsın mı?",

  "foot.note": "Yapay zekâ ile üretilen kartlarda hata olabilir.",
  "foot.by": "Bir Kurdolingo projesi",
  "hero.l1": "Kürtçe'yi gördüğün",
  "hero.l2": "her şeyden",
  "hero.l3": "öğren.",
  "hero.t1": "Kürtçeyi",
  "hero.t2a": "gördüğün",
  "hero.t2b": "her şeyden öğren.",
  "hero.scroll": "Kaydırarak gez",
  "hero.series": "Yapay zekâ kartları · Hawar Latin alfabesi · 5 açıklama dili",
  "hero.made": "Kurdolingo yaptı, çoğunlukla çay eşliğinde",
  "hero.flip": "Çevirmek için bir baskıya dokun",
  "nav.kurdolingo": "Kurdolingo",
  "nav.admin": "Admin",
  "nav.signout": "Çıkış yap",
  "nav.menu": "Hesap menüsü",
  "promo.kicker": "Kurdolingo ekibinden",
  "promo.title": "Kartlardan fazlasına hazır mısın?",
  "promo.body": "Kurdolingo, Kürtçe öğrenmenin adresi: adım adım dersler, akıllı sözlük ve öğrenen bir topluluk.",
  "promo.cta": "Kurdolingo'yu ziyaret et",
  "promo.deck": "Bu kartlar harika bir başlangıç. Kürtçeyi Kurdolingo'da adım adım öğren.",
  "promo.done": "Hız kesme — Kürtçe öğrenmeye Kurdolingo'da devam et.",
  "promo.wait": "Cardo, Kürtçe öğrenme platformu Kurdolingo'nun ücretsiz bir aracıdır.",
  "toast.saved": "Favorilere eklendi ♥",
  "toast.removed": "Favorilerden çıkarıldı",
  "toast.copied": "Link kopyalandı",
  "toast.ready": "Desten hazır!",
  "toast.nameSaved": "Ad kaydedildi",
  "study.keys": "Klavye: Boşluk çevirir · ← tekrar · → bildim",
  "profile.tab.favs": "Favoriler",
  "profile.tab.decks": "Destelerim",
  "profile.stats.decks": "Oluşturulan deste",
  "profile.stats.cards": "Üretilen kart",
  "profile.decksEmpty": "Giriş yapmışken oluşturduğun desteler burada görünür.",
  "profile.open": "Aç",
  "admin.title": "Admin paneli",
  "admin.denied": "Bu sayfa sadece adminler içindir.",
  "admin.refresh": "Yenile",
  "admin.users": "Kullanıcı",
  "admin.users7d": "Son 7 günde {n} yeni",
  "admin.gens": "Üretilen deste",
  "admin.gens24": "Son 24 saatte {n}",
  "admin.cards": "Üretilen kart",
  "admin.success": "Başarı oranı",
  "admin.avg": "Ort. üretim süresi",
  "admin.anon": "%{n} misafir",
  "admin.favs": "Kaydedilen favori",
  "admin.daily": "Günlük deste · son 14 gün",
  "admin.byMode": "Kaynağa göre",
  "admin.byLang": "Açıklama diline göre",
  "admin.byUi": "Site diline göre",
  "admin.recent": "Son hareketler",
  "admin.userList": "Kullanıcılar",
  "admin.search": "Ad ya da e-posta ile ara",
  "admin.col.user": "Kullanıcı",
  "admin.col.joined": "Katılım",
  "admin.col.decks": "Deste",
  "admin.col.cards": "Kart",
  "admin.col.favs": "Favori",
  "admin.col.last": "Son aktiflik",
  "admin.guest": "Misafir",
  "admin.failed": "başarısız",
  "admin.badge": "admin",
};

const ku: Dict = {
  "nav.create": "Çêke",
  "nav.profile": "Kartên min",
  "nav.login": "Têkeve",
  "theme.toggle": "Moda ronî / tarî",
  "lang.toggle": "Zimên biguherîne",

  "hero.kicker": "Kartên zîrekiya çêkirî ji bo Kurdî",
  "hero.title1": "Kurdî hîn bibe",
  "hero.title2": "ji dinyaya li dora xwe.",
  "hero.lead":
    "Wêneyekî bikişîne, mijarekê hilbijêre an nivîsekê bi cih bike. Cardo wê dike kartên ku tu dikarî bixwînî, tomar bikî û parve bikî.",
  "hero.cta": "Bi wêneyekî dest pê bike",
  "hero.cta2": "Mijarekê biceribîne",
  "hero.badge": "Bi Meta Muse dixebite",

  "how.title": "Sê gav. Bê pirtûka dersê.",
  "how.1t": "Bikişîne",
  "how.1d": "Wêneyê metbexa xwe, kolana xwe, maseya xwe bikişîne — an tenê mijarekê binivîse.",
  "how.2t": "Çêke",
  "how.2d": "Meta Muse peyvan dibîne û bi hevokên mînak kartên Kurdî dinivîse.",
  "how.3t": "Hîn bibe û biparêze",
  "how.3d": "Kartên xwe bixwîne, yên bijare tomar bike û wek JPG, PDF an CSV daxe.",

  "why.title": "Ji bo zimanekî ku zîrekiya çêkirî ji bîr kir.",
  "why.body":
    "Bi milyonan kes bi Kurdî diaxivin, lê hema hema tu sepana fêrbûnê piştgiriya wê nake. Cardo alfabeya latînî ya standard bi kar tîne û her peyvê bi zimanê te rave dike.",
  "why.s1": "Zimanên ravekirinê",
  "why.s2": "Rêyên çêkirinê",
  "why.s3": "Hesab ji bo ceribandinê",

  "create.title": "Desteya xwe çêke",
  "create.sub": "Çavkaniyekê hilbijêre. Kartên te di çend çirkeyan de amade ne.",
  "tab.photo": "Wêne",
  "tab.topic": "Mijar",
  "tab.text": "Nivîs",
  "photo.take": "Wêneyekî bikişîne an bar bike",
  "photo.hint": "Metbexa te, kolana te, maseya te — her tişt.",
  "photo.change": "Wêneyê biguherîne",
  "photo.focus": "Bijarte: em li ser çi bisekinin? (mînak: xwarin)",
  "photo.error": "Ev wêne venebû. JPEG an PNG biceribîne.",
  "topic.placeholder": "mînak: Li qehwexaneyê çay xwestin",
  "text.placeholder":
    "Nivîseke Kurdî bi cih bike (stran, nûçe, çîrok) — an her nivîsa ku tu dixwazî peyvên wê yên Kurdî hîn bibî.",
  "opt.explain": "Zimanê ravekirinê",
  "opt.level": "Ast",
  "opt.cards": "Kart",
  "level.beginner": "Destpêk",
  "level.intermediate": "Navîn",
  "level.advanced": "Pêşketî",
  "btn.make": "Kartan çêke",
  "btn.making": "Kartên te tên amadekirin…",
  "wait": "Meta Muse kartên te dinivîse. Ev bi gelemperî 10–20 çirke dikişîne.",
  "err.generic": "Tiştek xelet çû.",
  "err.timeout": "Zîrekiya çêkirî pir dirêj kişand. Ji kerema xwe dîsa biceribîne.",
  "topics": "Metbex|Malbat|Li bazarê|Hewa|Silavkirin|Laş",

  "deck.cards": "{n} kart",
  "deck.share": "Parve bike",
  "deck.copied": "Girêdan hate kopîkirin ✓",
  "deck.new": "Desteya nû",
  "deck.study": "Bixwîne",
  "deck.all": "Hemû kart",
  "deck.missing": "Ev girêdana desteyê xera ye an vala ye.",
  "study.flip": "Ji bo zivirandinê bitikîne",
  "study.again": "Dîsa",
  "study.got": "Min zanî",
  "study.learned": "{n} / {total} hate hînbûn",
  "study.done": "Te qedand! Te deste qedand.",
  "study.restart": "Dîsa bixwîne",

  "fav.add": "Li bijareyan zêde bike",
  "fav.remove": "Ji bijareyan derxe",
  "fav.login": "Ji bo tomarkirina bijareyan têkeve",

  "auth.signin": "Têkeve",
  "auth.signup": "Hesab çêke",
  "auth.welcome": "Dîsa bi xêr hatî",
  "auth.join": "Tevlî Cardo bibe",
  "auth.sub": "Peyvên xwe yên bijare tomar bike û kengê bixwazî daxe.",
  "auth.name": "Navê te",
  "auth.email": "E-name",
  "auth.password": "Şîfre (herî kêm 6 tîp)",
  "auth.toSignup": "Hesabê te tune? Çêke",
  "auth.toSignin": "Hesabê te heye? Têkeve",
  "auth.check": "Ji bo pejirandina hesabê xwe e-nameya xwe kontrol bike, paşê têkeve.",
  "auth.off": "Hesab hîn nehatine sazkirin.",

  "profile.title": "Kartên min",
  "profile.since": "Endam ji {d}",
  "profile.name": "Navê xuyayî",
  "profile.save": "Tomar bike",
  "profile.saved": "Hate tomarkirin ✓",
  "profile.signout": "Derkeve",
  "profile.favs": "Bijare",
  "profile.empty": "Hîn tu bijareyên te tune. Desteyekê çêke û li ser peyvên ku tu dixwazî biparêzî ♡ bitikîne.",
  "profile.all": "Hemûyan hilbijêre",
  "profile.selected": "{n} hatin hilbijartin",
  "profile.download": "Daxe",
  "profile.delete": "Rake",
  "profile.confirm": "{n} peyv ji bijareyan werin rakirin?",

  "foot.note": "Dibe ku di kartên bi zîrekiya çêkirî de xelet hebin.",
  "foot.by": "Projeyeke Kurdolingo",
  "hero.l1": "Kurdî",
  "hero.l2": "ji her tiştê tu dibînî",
  "hero.l3": "hîn bibe.",
  "hero.t1": "Kurdî",
  "hero.t2a": "ji her tiştî",
  "hero.t2b": "hîn bibe.",
  "hero.scroll": "Ji bo gerê bikişîne",
  "hero.series": "Kartên zîrekiya çêkirî · Alfabeya Hawar · 5 zimanên ravekirinê",
  "hero.made": "Kurdolingo çêkir, bi piranî bi çayê",
  "hero.flip": "Ji bo zivirandinê li çapekê bitikîne",
  "nav.kurdolingo": "Kurdolingo",
  "nav.admin": "Rêveber",
  "nav.signout": "Derkeve",
  "nav.menu": "Menuya hesabê",
  "promo.kicker": "Ji çêkerên Kurdolingo",
  "promo.title": "Tu ji bo zêdetirî kartan amade yî?",
  "promo.body": "Kurdolingo navenda hînbûna Kurdî ye: dersên gav bi gav, ferhengeke zîrek û civakeke fêrxwazan.",
  "promo.cta": "Serdana Kurdolingo bike",
  "promo.deck": "Ev kart destpêkeke baş in. Kurdî li ser Kurdolingo gav bi gav hîn bibe.",
  "promo.done": "Bêhna xwe bernede — li ser Kurdolingo hînbûna Kurdî bidomîne.",
  "promo.wait": "Cardo amûreke belaş a Kurdolingo ye, platforma hînbûna Kurdî.",
  "toast.saved": "Li bijareyan hate zêdekirin ♥",
  "toast.removed": "Ji bijareyan hate derxistin",
  "toast.copied": "Girêdan hate kopîkirin",
  "toast.ready": "Desteya te amade ye!",
  "toast.nameSaved": "Nav hate tomarkirin",
  "study.keys": "Klavye: Valahî dizivirîne · ← dîsa · → min zanî",
  "profile.tab.favs": "Bijare",
  "profile.tab.decks": "Desteyên min",
  "profile.stats.decks": "Desteyên çêkirî",
  "profile.stats.cards": "Kartên çêkirî",
  "profile.decksEmpty": "Desteyên ku tu dema têketî çêdikî dê li vir xuya bibin.",
  "profile.open": "Veke",
  "admin.title": "Panela rêveberiyê",
  "admin.denied": "Ev rûpel tenê ji bo rêveberan e.",
  "admin.refresh": "Nû bike",
  "admin.users": "Bikarhêner",
  "admin.users7d": "{n} nû di 7 rojan de",
  "admin.gens": "Desteyên çêkirî",
  "admin.gens24": "{n} di 24 saetan de",
  "admin.cards": "Kartên çêkirî",
  "admin.success": "Rêjeya serkeftinê",
  "admin.avg": "Dema navînî",
  "admin.anon": "%{n} mêvan",
  "admin.favs": "Bijareyên tomarkirî",
  "admin.daily": "Deste her roj · 14 rojên dawî",
  "admin.byMode": "Li gorî çavkaniyê",
  "admin.byLang": "Li gorî zimanê ravekirinê",
  "admin.byUi": "Li gorî zimanê malperê",
  "admin.recent": "Çalakiyên dawî",
  "admin.userList": "Bikarhêner",
  "admin.search": "Bi nav an e-nameyê bigere",
  "admin.col.user": "Bikarhêner",
  "admin.col.joined": "Tevlîbûn",
  "admin.col.decks": "Deste",
  "admin.col.cards": "Kart",
  "admin.col.favs": "Bijare",
  "admin.col.last": "Çalakiya dawî",
  "admin.guest": "Mêvan",
  "admin.failed": "bi ser neket",
  "admin.badge": "rêveber",
};

const DICTS: Record<UiLang, Dict> = { en, tr, ku, de, fr, es, it, pt, ru, ar, fa, zh, ja, ko };
export type TKey = keyof Dict | ExtraKey;

type Ctx = { lang: UiLang; setLang: (l: UiLang) => void; t: (k: TKey, vars?: Record<string, string | number>) => string };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<UiLang>("en");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("kc-lang");
    } catch {}
    const nav = navigator.language.slice(0, 2);
    const pick = (saved && saved in DICTS ? saved : nav in DICTS ? nav : "en") as UiLang;
    setLangState(pick);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
  }, [lang]);

  function setLang(l: UiLang) {
    setLangState(l);
    try {
      localStorage.setItem("kc-lang", l);
    } catch {}
  }

  function t(k: TKey, vars?: Record<string, string | number>) {
    let s =
      (k in en ? DICTS[lang][k as keyof Dict] ?? en[k as keyof Dict] : EXTRA[lang]?.[k as ExtraKey] ?? EXTRA.en[k as ExtraKey]) ?? k;
    if (vars) for (const [key, v] of Object.entries(vars)) s = s.replace(`{${key}}`, String(v));
    return s;
  }

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n outside I18nProvider");
  return ctx;
}
