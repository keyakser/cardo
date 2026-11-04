import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const sans = Geist({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cardokurdish.vercel.app"),
  title: "Cardo: Kurdish Cards",
  description:
    "Everything has a Kurdish name. Turn any photo, topic or text into Kurdish flashcards, study 300 illustrated words, and export cards as JPG, PDF or CSV. By Kurdolingo, built with Meta Muse.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#12110f" },
  ],
};

// Set the theme before first paint so there is no light/dark flash.
const themeScript = `try{var t=localStorage.getItem('kc-theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
