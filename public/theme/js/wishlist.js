(function() {
    const TARGET_SELECTOR = ".js-wishlist-counter";

    const SOURCE_SELECTOR = "wk-counter span.wk-counter";

    let sourceTextObserver = null;
    let sourceReplaceObserver = null;

    const getSource = () => document.querySelector(SOURCE_SELECTOR);

    const getTargets = () =>
        Array.from(document.querySelectorAll(TARGET_SELECTOR));

    const readValue = (el) => (el ? (el.textContent || "").trim() : "");

    function updateTargets() {
        const source = getSource();
        const value = readValue(source);

        if (!source) return;

        const targets = getTargets();
        if (!targets.length) return;

        targets.forEach((t) => {
            if (t.textContent !== value) t.textContent = value;
        });
    }

    function disconnectObservers() {
        if (sourceTextObserver) {
            sourceTextObserver.disconnect();
            sourceTextObserver = null;
        }
        if (sourceReplaceObserver) {
            sourceReplaceObserver.disconnect();
            sourceReplaceObserver = null;
        }
    }

    function attachToCurrentSource() {
        const source = getSource();
        if (!source) return;

        updateTargets();

        if (sourceTextObserver) sourceTextObserver.disconnect();
        sourceTextObserver = new MutationObserver(() => updateTargets());
        sourceTextObserver.observe(source, {
            characterData: true,
            childList: true,
            subtree: true,
        });

        if (sourceReplaceObserver) sourceReplaceObserver.disconnect();
        sourceReplaceObserver = new MutationObserver(() => {
            const current = getSource();
            if (current !== source) attachToCurrentSource();
            updateTargets();
        });

        sourceReplaceObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function boot() {
        const waitObserver = new MutationObserver(() => {
            const source = getSource();
            if (source) {
                waitObserver.disconnect();
                attachToCurrentSource();
            }
        });

        waitObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        if (getSource()) {
            waitObserver.disconnect();
            attachToCurrentSource();
        }
    }

    document.addEventListener("DOMContentLoaded", boot);

    window.__syncWishlistCounter = function() {
        disconnectObservers();
        attachToCurrentSource();
    };
})();

(function() {
    const PDP_ROOT = ".js-product";
    const PDP_CUSTOM = ".product__wishlist .js-add-to-wishlist";
    const PDP_WK = "wishlist-button-product button.wk-button";

    const GRID_ROOT = ".js-product-grid-item";
    const GRID_CUSTOM = ".product-grid-item__wishlist a";
    const GRID_WK = "wishlist-button-collection button.wk-button";

    const BOUND_ATTR = "data-wk-proxy-bound";

    const readBool = (v) => v === "true" || v === true;

    function getWkButton(root) {
        if (!root) return null;
        if (root.matches(PDP_ROOT)) return root.querySelector(PDP_WK);
        if (root.matches(GRID_ROOT)) return root.querySelector(GRID_WK);
        return null;
    }

    function getCustomButton(root) {
        if (!root) return null;
        if (root.matches(PDP_ROOT)) return root.querySelector(PDP_CUSTOM);
        if (root.matches(GRID_ROOT)) return root.querySelector(GRID_CUSTOM);
        return null;
    }

    function reflectState(root) {
        const custom = getCustomButton(root);
        const wk = getWkButton(root);
        if (!custom || !wk) return;

        const isActive =
            wk.classList.contains("wk-selected") ||
            wk.getAttribute("aria-pressed") === "true" ||
            (wk.getAttribute("aria-label") || "").toLowerCase().includes("in wishlist") ||
            readBool(wk.getAttribute("data-selected"));

        custom.classList.toggle("is-active", !!isActive);
    }

    function clickWkWithRetry(root) {
        let tries = 0;
        const maxTries = 40; // ~2s

        const tick = () => {
            const wk = getWkButton(root);
            if (wk) {
                wk.click();
                // po kliknięciu WK może chwilę aktualizować stan
                setTimeout(() => reflectState(root), 50);
                setTimeout(() => reflectState(root), 250);
                return;
            }
            tries++;
            if (tries < maxTries) setTimeout(tick, 50);
        };

        tick();
    }

    function bindRoot(root) {
        if (!root) return;

        const custom = getCustomButton(root);
        if (!custom) return;

        if (custom.getAttribute(BOUND_ATTR) === "1") return;
        custom.setAttribute(BOUND_ATTR, "1");

        custom.addEventListener("click", function(e) {
            e.preventDefault();
            clickWkWithRetry(root);
        });

        const mo = new MutationObserver(() => reflectState(root));
        mo.observe(root, {
            subtree: true,
            childList: true,
            attributes: true
        });

        reflectState(root);
    }

    function bindAll(container = document) {
        container.querySelectorAll(PDP_ROOT).forEach(bindRoot);
        container.querySelectorAll(GRID_ROOT).forEach(bindRoot);
    }

    function boot() {
        bindAll(document);

        const domObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (!(node instanceof Element)) continue;

                    if (node.matches ?.(PDP_ROOT) || node.matches ?.(GRID_ROOT)) bindRoot(node);
                    node.querySelectorAll ?.(PDP_ROOT).forEach(bindRoot);
                    node.querySelectorAll ?.(GRID_ROOT).forEach(bindRoot);

                    if (
                        node.matches ?.("wishlist-button-product, wishlist-button-collection") ||
                        node.querySelector ?.("wishlist-button-product, wishlist-button-collection")
                    ) {
                        const pdp = node.closest ?.(PDP_ROOT);
                        const grid = node.closest ?.(GRID_ROOT);
                        if (pdp) bindRoot(pdp);
                        if (grid) bindRoot(grid);
                    }
                }
            }
        });

        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, {
            once: true
        });
    } else {
        boot();
    }
})();