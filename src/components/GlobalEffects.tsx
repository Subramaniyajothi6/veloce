"use client";

import { useArchivePreview } from "@/hooks/useArchivePreview";
import { useCounters } from "@/hooks/useCounters";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useManifestoFill } from "@/hooks/useManifestoFill";
import { useMarqueeSkew } from "@/hooks/useMarqueeSkew";
import { useParallax } from "@/hooks/useParallax";
import { useReveal } from "@/hooks/useReveal";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/** Mounts all document-level effects once the page markup exists. */
export default function GlobalEffects() {
  useReveal();
  useCounters();
  useParallax();
  useManifestoFill();
  useHorizontalScroll();
  useMagnetic();
  useSmoothScroll();
  useMarqueeSkew();
  useArchivePreview();
  return null;
}
