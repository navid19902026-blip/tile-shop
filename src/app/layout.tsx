import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import Providers from "@/components/providers";
import { RTL_LOCALES, type Locale } from "@/i18n/routing";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  title: {
    default: "پارسیان سرام | فروشگاه آنلاین کاشی و سرامیک",
    template: "%s | پارسیان سرام",
  },
  description:
    "پارسیان سرام (Parsian Ceram)؛ فروشگاه آنلاین کاشی و سرامیک با ارسال به سراسر ایران و صادرات به قفقاز.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body className={`${vazirmatn.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
