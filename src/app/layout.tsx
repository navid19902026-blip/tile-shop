import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import "./globals.css";
import Providers from "@/components/providers";
import { RTL_LOCALES, type Locale } from "@/i18n/routing";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const SITE_DESCRIPTION: Record<Locale, string> = {
  fa: "پارسیان سرام (Parsian Ceram)؛ فروشگاه آنلاین کاشی و سرامیک با ارسال به سراسر ایران و صادرات به قفقاز.",
  en: "Parsian Ceram — an online tile and ceramic store shipping nationwide across Iran and exporting to the Caucasus.",
  az: "Parsian Ceram — bütün İran ərazisinə çatdırılma və Qafqaza ixracat edən onlayn kafel və keramika mağazası.",
  ka: "Parsian Ceram — ონლაინ ფილისა და კერამიკის მაღაზია მიწოდებით მთელ ირანში და ექსპორტით კავკასიაში.",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const brand = t("nav.brand");
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
    title: {
      default: brand,
      template: `%s | ${brand}`,
    },
    description: SITE_DESCRIPTION[locale] ?? SITE_DESCRIPTION.en,
  };
}

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
