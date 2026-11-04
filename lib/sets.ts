import type { Card, Deck } from "./types";

// Ready-made sets: 10 topics × 3 levels × 10 words. Word data lives in
// public/sets/<id>.json; this file holds names, colours and topic aliases.

export const SET_LANGS = ["en", "tr", "de", "fr", "es", "it", "pt", "ru", "ar", "fa", "zh", "ja", "ko"] as const;
export type SetLang = (typeof SET_LANGS)[number];
export type SetWord = { ku: string; ex: string; mean: Record<SetLang, string>; exTr: Record<SetLang, string> };
export type SetData = { id: string; levels: Record<"beginner" | "intermediate" | "advanced", SetWord[]> };

type Meta = { id: string; color: "blue" | "pink" | "olive" | "orange"; name: Record<string, string>; aliases: string[] };

export const SETS: Meta[] = [
  {
    id: "professions",
    color: "blue",
    name: { en: "Professions", tr: "Meslekler", ku: "Pîşe", de: "Berufe", fr: "Métiers", es: "Profesiones", it: "Professioni", pt: "Profissões", ru: "Профессии", ar: "المهن", fa: "مشاغل", zh: "职业", ja: "職業", ko: "직업" },
    aliases: ["jobs", "job", "profession", "occupations", "occupation", "work", "meslek", "iş", "işler", "pîşeyên", "kar", "beruf", "métier", "profession", "profesión", "trabajos", "professione", "lavori", "profissão", "trabalhos", "профессия", "работа", "مهنة", "شغل", "مشاغل", "شغل‌ها", "工作", "仕事", "직업들"],
  },
  {
    id: "family",
    color: "pink",
    name: { en: "Family", tr: "Aile", ku: "Malbat", de: "Familie", fr: "Famille", es: "Familia", it: "Famiglia", pt: "Família", ru: "Семья", ar: "العائلة", fa: "خانواده", zh: "家庭", ja: "家族", ko: "가족" },
    aliases: ["family members", "relatives", "aile üyeleri", "akrabalar", "endamên malbatê", "xizm", "familienmitglieder", "verwandte", "membres de la famille", "miembros de la familia", "membri della famiglia", "membros da família", "члены семьи", "родственники", "أفراد العائلة", "أسرة", "اعضای خانواده", "家人", "亲属", "家族のメンバー", "가족 구성원"],
  },
  {
    id: "fruits",
    color: "olive",
    name: { en: "Fruits", tr: "Meyveler", ku: "Fêkî", de: "Obst", fr: "Fruits", es: "Frutas", it: "Frutta", pt: "Frutas", ru: "Фрукты", ar: "الفواكه", fa: "میوه‌ها", zh: "水果", ja: "果物", ko: "과일" },
    aliases: ["fruit", "meyve", "fêkiyan", "mêwe", "früchte", "frucht", "fruit", "fruta", "frutti", "fruta", "фрукт", "فاكهة", "فواكه", "میوه", "フルーツ", "과일들"],
  },
  {
    id: "vegetables",
    color: "orange",
    name: { en: "Vegetables", tr: "Sebzeler", ku: "Zebze", de: "Gemüse", fr: "Légumes", es: "Verduras", it: "Verdure", pt: "Legumes", ru: "Овощи", ar: "الخضروات", fa: "سبزیجات", zh: "蔬菜", ja: "野菜", ko: "채소" },
    aliases: ["vegetable", "veggies", "sebze", "zebzeyan", "légume", "verdura", "hortalizas", "ortaggi", "verdura", "vegetais", "овощ", "خضار", "خضروات", "سبزی", "سبزی‌ها", "야채"],
  },
  {
    id: "school",
    color: "orange",
    name: { en: "School objects", tr: "Okul nesneleri", ku: "Tiştên dibistanê", de: "Schulsachen", fr: "Fournitures scolaires", es: "Útiles escolares", it: "Materiale scolastico", pt: "Material escolar", ru: "Школьные вещи", ar: "أدوات المدرسة", fa: "لوازم مدرسه", zh: "学习用品", ja: "学用品", ko: "학용품" },
    aliases: ["school", "school supplies", "school things", "classroom", "stationery", "okul", "okul eşyaları", "okul malzemeleri", "kırtasiye", "sınıf", "dibistan", "schule", "schulmaterial", "école", "escuela", "útiles", "scuola", "escola", "школа", "канцелярия", "مدرسة", "أدوات مدرسية", "مدرسه", "学校", "文具", "학교"],
  },
  {
    id: "hobbies",
    color: "pink",
    name: { en: "Hobbies", tr: "Hobiler", ku: "Hobî", de: "Hobbys", fr: "Loisirs", es: "Aficiones", it: "Hobby", pt: "Hobbies", ru: "Хобби", ar: "الهوايات", fa: "سرگرمی‌ها", zh: "爱好", ja: "趣味", ko: "취미" },
    aliases: ["hobby", "leisure", "free time", "hobi", "boş zaman", "freizeit", "hobby", "passe-temps", "pasatiempos", "hobbies", "passatempos", "увлечения", "هواية", "سرگرمی", "业余爱好", "ホビー"],
  },
  {
    id: "sports",
    color: "olive",
    name: { en: "Sports", tr: "Sporlar", ku: "Werziş", de: "Sport", fr: "Sports", es: "Deportes", it: "Sport", pt: "Esportes", ru: "Спорт", ar: "الرياضة", fa: "ورزش‌ها", zh: "运动", ja: "スポーツ", ko: "스포츠" },
    aliases: ["sport", "spor", "sporlar", "werzişan", "sportarten", "deporte", "esporte", "desporto", "виды спорта", "رياضة", "ورزش", "体育", "운동"],
  },
  {
    id: "arts",
    color: "blue",
    name: { en: "Arts", tr: "Sanat dalları", ku: "Huner", de: "Kunst", fr: "Arts", es: "Artes", it: "Arti", pt: "Artes", ru: "Искусство", ar: "الفنون", fa: "هنرها", zh: "艺术", ja: "芸術", ko: "예술" },
    aliases: ["art", "the arts", "art forms", "sanat", "sanatlar", "hunerên", "künste", "art", "arte", "arte", "искусства", "فن", "فنون", "هنر", "美术", "アート", "미술"],
  },
  {
    id: "furniture",
    color: "orange",
    name: { en: "Furniture", tr: "Mobilyalar", ku: "Mobîlya", de: "Möbel", fr: "Meubles", es: "Muebles", it: "Mobili", pt: "Móveis", ru: "Мебель", ar: "الأثاث", fa: "مبلمان", zh: "家具", ja: "家具", ko: "가구" },
    aliases: ["furnishings", "household items", "mobilya", "ev eşyaları", "kelûpelên malê", "einrichtung", "mobilier", "mobiliario", "arredamento", "mobília", "أثاث", "اثاثیه", "インテリア"],
  },
  {
    id: "clothes",
    color: "pink",
    name: { en: "Clothes", tr: "Elbiseler", ku: "Cil û berg", de: "Kleidung", fr: "Vêtements", es: "Ropa", it: "Vestiti", pt: "Roupas", ru: "Одежда", ar: "الملابس", fa: "لباس‌ها", zh: "衣服", ja: "服", ko: "옷" },
    aliases: ["clothing", "outfits", "garments", "elbise", "giysiler", "giysi", "kıyafetler", "kıyafet", "cil", "kincan", "kleider", "kleidungsstücke", "habits", "vestimenta", "abbigliamento", "vestuário", "одежды", "ملابس", "لباس", "服装", "衣類", "의류"],
  },
];

const norm = (s: string) =>
  s
    .toLocaleLowerCase()
    .normalize("NFC")
    .replace(/[.,!?¿¡:;"'«»“”()[\]{}…。、！？]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const INDEX = new Map<string, string>();
for (const s of SETS) for (const a of [...Object.values(s.name), ...s.aliases, s.id]) INDEX.set(norm(a), s.id);

/** Returns the ready-made set id for a topic like "Aile" or "fruits", or null. */
export function matchSet(topic: string): string | null {
  return INDEX.get(norm(topic)) ?? null;
}

export const setName = (id: string, lang: string) => {
  const s = SETS.find((x) => x.id === id);
  return s ? s.name[lang] || s.name.en : id;
};

/** Explanation language for set cards (Kurmanji and Swedish UIs fall back to English). */
export const setLang = (lang: string): SetLang => ((SET_LANGS as readonly string[]).includes(lang) ? (lang as SetLang) : "en");

export const wordArt = (setId: string, level: string, index: number) => `/sets/art/${setId}/${level}-${index + 1}.svg`;

export function wordToCard(w: SetWord, lang: string, img?: string): Card {
  const l = setLang(lang);
  return { ku: w.ku, pos: "", meaning: w.mean[l] || w.mean.en, example_ku: w.ex, example_tr: w.exTr[l] || w.exTr.en, note: "", img };
}

/** Builds a deck of `count` words, starting with the chosen level and topping up from the others. */
export function deckFromSet(data: SetData, level: string, lang: string, count: number, uiLang = lang): Deck {
  const order = ["beginner", "intermediate", "advanced"] as const;
  const first = order.includes(level as (typeof order)[number]) ? (level as (typeof order)[number]) : "beginner";
  const words = [first, ...order.filter((o) => o !== first)]
    .flatMap((lv) => data.levels[lv].map((w, i) => ({ w, img: wordArt(data.id, lv, i) })))
    .slice(0, count);
  return { title: setName(data.id, uiLang === "ku" ? "ku" : lang), lang, level: first, cards: words.map(({ w, img }) => wordToCard(w, lang, img)) };
}
