"use client";

import { useEffect } from "react";

/**
 * Loads the original theme's vanilla scripts once React has hydrated.
 *
 * They are appended manually rather than through next/script because execution
 * order matters: splide must exist before the carousels mount, option-selection
 * must run after moneyFormat is defined, and several files declare top-level
 * `const`s or call customElements.define, so a second pass would throw.
 * Setting `async = false` on injected scripts preserves insertion order.
 */
/*
 * These stay under public/ because they are fetched by URL at runtime, not
 * bundled, so unlike the stylesheets they cannot live inside the section
 * folders. The section each one drives is noted instead.
 */
const SCRIPTS = [
  // Globals the rest depend on.
  "/js/theme-runtime.js", //            our shim: window.Shopify + late DOMContentLoaded
  "/theme/js/splide.min.js", //         carousel library
  "/theme/js/option-selection.js", //   needs moneyFormat from the shim

  // sections/header
  "/theme/js/announcement.js",
  "/theme/js/header.js",
  "/theme/js/mobile-menu.js",

  // sections/search
  "/theme/js/predictive-search.js",

  // sections/cart-drawer
  "/theme/js/drawer-cart.js",

  // sections/product-tabs, craftsmanship, latest-news, footer
  "/theme/js/product-tabs.js",
  "/theme/js/craftsmanship.js",
  "/theme/js/latest-news.js",
  "/theme/js/footer.js",

  // Site-wide behaviour: scroll reveals, smooth scroll, lazy images.
  "/theme/js/aos.js",
  "/theme/js/lenis.js",
  "/theme/js/lazyload.js",
  "/theme/js/localization.js",

  // Shared components: product cards, hero product hotspots, wishlist, dates.
  "/theme/js/product-grid-item.js",
  "/theme/js/hero-products.js",
  "/theme/js/wishlist.js",
  "/theme/js/article-date.js",
];

// Module scope, not a ref: StrictMode mounts effects twice in development and
// these scripts are not safe to evaluate more than once.
let injected = false;

export default function ThemeScripts() {
  useEffect(() => {
    if (injected) return;
    injected = true;

    for (const src of SCRIPTS) {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.dataset.themeScript = "true";
      script.onerror = () => console.error(`[theme] failed to load ${src}`);
      document.body.appendChild(script);
    }
  }, []);

  return null;
}
