/**
 * Runtime bridge between the original Shopify theme scripts and this Next.js app.
 *
 * Loaded first, ahead of every theme script. It provides two things the theme
 * assumes are already present on the page:
 *
 *  1. The `Shopify` global and `moneyFormat`, which Liquid used to inline.
 *  2. A working `DOMContentLoaded`. The theme scripts register their setup on
 *     that event, but they are injected after React hydrates, by which point it
 *     has long since fired. Listeners added late are queued onto a microtask
 *     instead of being silently dropped.
 */
(function () {
  "use strict";

  var shopify = (window.Shopify = window.Shopify || {});
  shopify.designMode = false;
  shopify.routes = shopify.routes || { root: "/" };
  shopify.locale = "en";
  shopify.country = "PK";
  shopify.currency = shopify.currency || { active: "PKR", rate: "1.0" };
  shopify.shop = "kindred-of-ireland.myshopify.com";

  // option-selection.js reads this at load time to build Shopify.formatMoney.
  if (typeof window.moneyFormat === "undefined") {
    window.moneyFormat = "Rs.{{amount}}";
  }

  var nativeAdd = document.addEventListener.bind(document);

  document.addEventListener = function (type, listener, options) {
    var alreadyLoaded = document.readyState !== "loading";
    var isReadyEvent = type === "DOMContentLoaded";

    if (isReadyEvent && alreadyLoaded && listener) {
      var handler = typeof listener === "function" ? listener : listener.handleEvent;
      if (typeof handler !== "function") return;

      Promise.resolve().then(function () {
        try {
          handler.call(typeof listener === "function" ? document : listener, new Event(type));
        } catch (err) {
          console.error("[theme-runtime] deferred DOMContentLoaded handler failed", err);
        }
      });
      return;
    }

    return nativeAdd(type, listener, options);
  };
})();
