import Archive from "@/components/Archive";
import Flagships from "@/components/Flagships";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Marquee from "@/components/Marquee";
import Preloader from "@/components/Preloader";
import Preowned from "@/components/Preowned";
import RecordSection from "@/components/RecordSection";
import Services from "@/components/Services";
import Showroom from "@/components/Showroom";
import Visit from "@/components/Visit";

export default function Home() {
  return (
    <>
      <a
        className="fixed left-4 -top-24 z-[9000] bg-veloce text-white px-[1.2rem] py-[0.7rem] font-mono text-[0.8rem] tracking-[0.1em] uppercase transition-[top] duration-300 focus:top-4"
        href="#showroom"
      >
        Skip to content
      </a>
      <Preloader />
      <Hero />
      <Marquee />
      <Manifesto />
      <Showroom />
      <Flagships />
      <Preowned />
      <Services />
      <RecordSection />
      <Archive />
      <Visit />
    </>
  );
}
