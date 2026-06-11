"use client";

import { usePathname } from "next/navigation";
import GlobalEffects from "./GlobalEffects";

/** Remounts the document-level effects on every route change so
 *  reveal/parallax/etc. re-bind to the new page's DOM. */
export default function RouteEffects() {
  const pathname = usePathname();
  return <GlobalEffects key={pathname} />;
}
