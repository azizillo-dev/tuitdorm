import type { Metadata } from "next";
import { Source_Serif_4, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "TATU - Yotoqxonalar Boshqaruv Tizimi",
  description: "Muhammad al-Xorazmiy nomidagi Toshkent axborot texnologiyalari universiteti yotoqxonalar davomatini nazorat qilish rasmiy axborot tizimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${sourceSerif.variable} ${inter.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans bg-page text-main antialiased selection:bg-accent/20 selection:text-ink">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
