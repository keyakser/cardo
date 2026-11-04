"use client";

import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { ToastProvider } from "@/lib/toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}
