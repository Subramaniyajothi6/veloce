"use client";

import { useEffect, useState } from "react";
import { smoothTo } from "@/lib/scroll";

export default function ToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => smoothTo(0)}
      aria-label="Back to top"
      className={`fixed right-[1.3rem] bottom-[1.3rem] z-[900] w-[46px] h-[46px] rounded-full border border-line bg-[rgba(12,12,13,0.7)] backdrop-blur-[10px] grid place-items-center transition-[opacity,translate,background-color,border-color] duration-[0.4s] ease-out-expo hover:bg-veloce hover:border-veloce ${
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-[10px] pointer-events-none"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-[17px] h-[17px] stroke-white stroke-2 fill-none [stroke-linecap:round] [stroke-linejoin:round]"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
