"use client";

import { useI18n } from "@/lib/i18n";

// Plain-language privacy notice and terms of use. Turkish for the Turkish UI,
// English for every other language.

type Section = { h: string; p: string[] };
type Doc = { title: string; updated: string; intro: string; sections: Section[] };

const EN: Doc = {
  title: "Privacy & Terms",
  updated: "Last updated: 4 November 2026",
  intro:
    "Cardo is a free tool by Kurdolingo for learning Kurdish with flashcards. This page explains, in plain words, what we collect, why, who processes it, and the rules for using Cardo.",
  sections: [
    {
      h: "What we collect",
      p: [
        "Without an account: nothing that identifies you. Your language and light/dark choice are kept in your own browser (local storage). When you make cards we log the request type, chosen languages, number of cards and how long it took, without linking it to you, so we can see how Cardo is used.",
        "With an account: your email address, the display name you choose, the words you save as favorites, the decks you create while signed in, and the same usage log linked to your account.",
        "When you report a mistake: the card's word, translation and example, the reason and note you write, and the page you were on.",
      ],
    },
    {
      h: "Photos, topics and texts you send",
      p: [
        "To make cards, the photo (shrunk in your browser), topic or text you give is sent to Meta's Muse AI model through the Meta Model API. Cardo does not store your photos or texts. Meta processes them under its own terms; while Cardo uses Meta's free credits, Meta may use this content to improve its products. Don't send photos of people, documents or anything private.",
      ],
    },
    {
      h: "Who processes your data",
      p: [
        "Vercel hosts the website. Supabase stores accounts, favorites, decks, usage logs and reports. Meta (Meta Model API) generates cards. Google Fonts serves the typefaces. We don't sell your data and don't use advertising or tracking cookies.",
      ],
    },
    {
      h: "Your choices",
      p: [
        "You can remove favorites any time on your profile. To delete your account and everything linked to it, or to get a copy of your data, email info@kurdolingo.com from the address you signed up with. We reply within 30 days.",
      ],
    },
    {
      h: "Using Cardo",
      p: [
        "Cards are written by AI and can contain mistakes. Ready-made sets are reviewed over time, but always check important words with a teacher. Use the report button to help us fix errors.",
        "Use Cardo for learning. Don't upload illegal, hateful or private content, don't try to break or overload the service, and don't resell generated content as your own product. You may share decks and downloaded cards freely for personal and classroom use.",
        "Cardo is provided as is, free of charge, without guarantees. We may change or pause features. If these terms change, we update the date at the top of this page.",
        "Children under 13 should use Cardo with a parent or teacher.",
      ],
    },
    { h: "Contact", p: ["Kurdolingo · info@kurdolingo.com"] },
  ],
};

const TR: Doc = {
  title: "Gizlilik ve Koşullar",
  updated: "Son güncelleme: 4 Kasım 2026",
  intro:
    "Cardo, Kurdolingo'nun Kürtçe kelime kartlarıyla öğrenme için ücretsiz aracıdır. Bu sayfa neyi, neden topladığımızı, kimlerin işlediğini ve Cardo'yu kullanma kurallarını sade bir dille anlatır.",
  sections: [
    {
      h: "Ne topluyoruz",
      p: [
        "Hesap olmadan: seni tanımlayan hiçbir şey. Dil ve açık/koyu tema tercihin kendi tarayıcında (yerel depolama) saklanır. Kart ürettiğinde, Cardo'nun nasıl kullanıldığını görmek için istek türünü, seçilen dilleri, kart sayısını ve süreyi seninle ilişkilendirmeden kaydederiz.",
        "Hesapla: e-posta adresin, seçtiğin görünen ad, favorilere eklediğin kelimeler, giriş yapmışken oluşturduğun desteler ve hesabına bağlı aynı kullanım kaydı.",
        "Hata bildirdiğinde: kartın kelimesi, çevirisi ve örneği, seçtiğin neden ve yazdığın not, bulunduğun sayfa.",
      ],
    },
    {
      h: "Gönderdiğin fotoğraf, konu ve metinler",
      p: [
        "Kart üretmek için verdiğin fotoğraf (tarayıcında küçültülür), konu ya da metin, Meta Model API üzerinden Meta'nın Muse yapay zekâ modeline gönderilir. Cardo fotoğraflarını ve metinlerini saklamaz. Meta bunları kendi koşullarına göre işler; Cardo, Meta'nın ücretsiz kredisini kullandığı sürece Meta bu içeriği ürünlerini geliştirmek için kullanabilir. İnsanların, belgelerin ya da özel bir şeyin fotoğrafını gönderme.",
      ],
    },
    {
      h: "Verilerini kimler işliyor",
      p: [
        "Site Vercel'de barındırılır. Hesaplar, favoriler, desteler, kullanım kayıtları ve hata bildirimleri Supabase'te saklanır. Kartları Meta (Meta Model API) üretir. Yazı tiplerini Google Fonts sunar. Verilerini satmayız; reklam ya da takip çerezi kullanmayız.",
      ],
    },
    {
      h: "Seçimlerin",
      p: [
        "Favorilerini istediğin zaman profilinden kaldırabilirsin. Hesabını ve ona bağlı her şeyi sildirmek ya da verilerinin bir kopyasını almak için kayıt olduğun adresten info@kurdolingo.com adresine yaz. 30 gün içinde yanıt veririz.",
      ],
    },
    {
      h: "Cardo'yu kullanma koşulları",
      p: [
        "Kartları yapay zekâ yazar ve hata içerebilir. Hazır setler zamanla gözden geçirilir; yine de önemli kelimeleri bir öğretmenle kontrol et. Hataları düzeltmemize yardım etmek için bildirme butonunu kullan.",
        "Cardo'yu öğrenmek için kullan. Yasa dışı, nefret içeren ya da özel içerik yükleme; hizmeti bozmaya ya da aşırı yüklemeye çalışma; üretilen içeriği kendi ürünün gibi satma. Desteleri ve indirdiğin kartları kişisel kullanım ve derslerde serbestçe paylaşabilirsin.",
        "Cardo ücretsizdir ve olduğu gibi, garanti verilmeden sunulur. Özellikleri değiştirebilir ya da durdurabiliriz. Koşullar değişirse bu sayfanın başındaki tarihi güncelleriz.",
        "13 yaşından küçükler Cardo'yu bir ebeveyn ya da öğretmenle kullanmalıdır.",
      ],
    },
    { h: "İletişim", p: ["Kurdolingo · info@kurdolingo.com"] },
  ],
};

export default function PrivacyPage() {
  const { lang } = useI18n();
  const doc = lang === "tr" ? TR : EN;
  return (
    <main className="container page narrow legal" lang={lang === "tr" ? "tr" : "en"} dir="ltr">
      <h1 className="h2">{doc.title}</h1>
      <p className="mono muted">{doc.updated}</p>
      <p className="lead">{doc.intro}</p>
      {doc.sections.map((s) => (
        <section key={s.h}>
          <h2 className="h3">{s.h}</h2>
          {s.p.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      ))}
    </main>
  );
}
