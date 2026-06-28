import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Noise from "@/components/Noise";
import RouteEffects from "@/components/RouteEffects";
import ScrollProgress from "@/components/ScrollProgress";
import ToTop from "@/components/ToTop";

/** Marketing chrome shared by every public page. Kept out of the root layout so
 *  the /admin panel renders without the nav, footer, custom cursor and effects. */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
    </>
  );
}
