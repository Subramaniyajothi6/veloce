import type { Metadata, Viewport } from "next";
import { Anton, Manrope, Space_Grotesk } from "next/font/google";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Noise from "@/components/Noise";
import RouteEffects from "@/components/RouteEffects";
import ScrollProgress from "@/components/ScrollProgress";
import ToTop from "@/components/ToTop";
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
      <body>
        <Noise />
        <ScrollProgress />
        <Cursor />
        <Nav />
        <main id="top" className="relative z-[2]">
          {children}
        </main>
        <Footer />
        <ToTop />
        <RouteEffects />
      </body>
    </html>
  );
}
