"use client";

import { useEffect, useState } from "react";

/* first paint is the preloader's moment — the wipe only plays on client navigations */
let hasNavigated = false;

/** Re-mounts on every navigation: red wipe out + content rise in. */
export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => hasNavigated);
  useEffect(() => {
    hasNavigated = true;
  }, []);

  if (!animate) return <>{children}</>;
  return (
    <>
      <div className="page-slices" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <i key={i} style={{ animationDelay: `${0.05 + i * 0.05}s` }} />
        ))}
      </div>
      <div
        className="page-enter"
        onAnimationEnd={(e) => {
          /* a filled transform would make this the containing block for every
             position:fixed descendant (archive preview) — drop it once done */
          if (e.target === e.currentTarget)
            e.currentTarget.classList.remove("page-enter");
        }}
      >
        {children}
      </div>
    </>
  );
}
