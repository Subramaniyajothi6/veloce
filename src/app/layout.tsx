import type { Metadata, Viewport } from "next";
import { Anton, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VELOCE Motors — Performance Automobiles, Curated",
  description:
    "VELOCE Motors sources, certifies and delivers the world's most wanted performance automobiles. Munich · Dubai · Oslo, since 1987.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

/**
 * Minimal root: fonts, global CSS and the `js` class gate. The marketing chrome
 * (nav, footer, cursor, effects) lives in the `(site)` route-group layout so the
 * `/admin` panel renders on its own clean shell.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${manrope.variable} ${grotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* gates reveal/clip/cursor CSS so content stays visible without JS */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
