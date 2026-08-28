"use client";

import { useEffect } from "react";

const CLASS_DESKTOP = "header-colors--reversed-desktop";
const CLASS_MOBILE = "header-colors--reversed-mobile";
const BREAKPOINT = 768;

/**
 * Port of the inline script the hero section shipped with. The hero artwork is
 * dark, so the header switches to its light-on-dark palette - but only once AOS
 * has revealed the hero, otherwise the swap flashes during load.
 */
export default function HeroHeaderScheme() {
  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const applyHeaderScheme = () => {
      const isMobile = window.innerWidth < BREAKPOINT;
      document.body.classList.remove(CLASS_DESKTOP, CLASS_MOBILE);
      document.body.classList.add(isMobile ? CLASS_MOBILE : CLASS_DESKTOP);
    };

    let observer: MutationObserver | undefined;

    const start = () => {
      applyHeaderScheme();
      window.addEventListener("resize", applyHeaderScheme);
    };

    if (hero.classList.contains("aos-animate")) {
      start();
    } else {
      observer = new MutationObserver(() => {
        if (hero.classList.contains("aos-animate")) {
          observer?.disconnect();
          start();
        }
      });
      observer.observe(hero, { attributes: true, attributeFilter: ["class"] });
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", applyHeaderScheme);
      document.body.classList.remove(CLASS_DESKTOP, CLASS_MOBILE);
    };
  }, []);

  return null;
}
