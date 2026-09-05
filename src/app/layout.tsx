import type { Metadata } from "next";
import { JetBrains_Mono, Mukta } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { getTranslations } from "@/features/i18n/server";
import { Providers } from "@/providers/providers";

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mukta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();

  return {
    title: `${t("ui.brand.name")} ${t("ui.brand.admin")}`,
    description: t("ui.brand.adminDescription"),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, catalogue } = await getTranslations();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        mukta.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers catalogue={catalogue} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
