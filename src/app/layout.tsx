import type { Metadata, Viewport } from "next";
import { Anton, Manrope, Space_Grotesk } from "next/font/google";
import { DEFAULT_OG_IMAGE } from "@/lib/og";
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

// Absolute base for OpenGraph/canonical URLs. On Vercel this resolves to the
// stable production domain automatically; set NEXT_PUBLIC_SITE_URL to pin a
// custom domain. Falls back to localhost in local dev.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const siteTitle = "VELOCE Motors — Performance Automobiles, Curated";
const siteDescription =
  "VELOCE Motors sources, certifies and delivers the world's most wanted performance automobiles. Munich · Dubai · Oslo, since 1987.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "VELOCE Motors",
    title: siteTitle,
    description: siteDescription,
    url: "/",
    locale: "en_US",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [DEFAULT_OG_IMAGE.url],
  },
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
