document.addEventListener("mouseenter", onEnter, true);
document.addEventListener("mouseleave", onLeave, true);

const ENTER_DELAY = 200;
const LEAVE_DELAY = 200;

const MS_PER_PX = 4;
const MIN_MS = 150;
const MAX_MS = 1200;

const state = new WeakMap();

function getState(el) {
    let s = state.get(el);
    if (!s) {
        s = {
            enterTimeout: null,
            leaveTimeout: null,
            anim: null
        };
        state.set(el, s);
    }
    return s;
}

function getClosestHoverItem(event) {
    const t = event.target;
    if (!t || t.nodeType !== 1) return null;
    return t.closest(".js-product-grid-item-hover");
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function stopHeightTransition(el) {
    el.style.transition = "none";
    const h = el.getBoundingClientRect().height;
    el.style.height = h + "px";
    el.offsetHeight;
    el.style.transition = "";
}

function cancelHeightAnimation(sizes, s) {
    if (!s || !s.anim) return;

    sizes.removeEventListener("transitionend", s.anim.onEnd);
    s.anim = null;

    stopHeightTransition(sizes);
    sizes.style.overflow = "hidden";
}

function animateHeight(el, toPx, s, onDone) {
    cancelHeightAnimation(el, s);

    const from = el.getBoundingClientRect().height;
    const delta = Math.abs(toPx - from);
    const duration = clamp(Math.round(delta * MS_PER_PX), MIN_MS, MAX_MS);

    el.style.overflow = "hidden";
    el.style.transition = `height ${duration}ms ease`;
    el.style.height = from + "px";

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            el.style.height = toPx + "px";
        });
    });

    const onEnd = (e) => {
        if (e.propertyName !== "height") return;
        el.removeEventListener("transitionend", onEnd);
        el.style.transition = "";
        s.anim = null;
        if (onDone) onDone();
    };

    s.anim = {
        onEnd
    };
    el.addEventListener("transitionend", onEnd);
}

function onEnter(event) {
    const productItem = getClosestHoverItem(event);
    if (!productItem) return;
    if (productItem.contains(event.relatedTarget)) return;

    const sizes = productItem.querySelector(".js-product-grid-item-sizes");
    if (!sizes) return;

    const s = getState(productItem);

    clearTimeout(s.leaveTimeout);
    clearTimeout(s.enterTimeout);

    cancelHeightAnimation(sizes, s);

    if (sizes.dataset.open === "true") return;

    s.enterTimeout = setTimeout(() => {
        if (!productItem.matches(":hover")) return;

        sizes.dataset.open = "true";
        productItem.classList.add("is-hover");

        sizes.style.height = "0px";
        sizes.style.overflow = "hidden";
        sizes.offsetHeight;

        const target = sizes.scrollHeight;

        animateHeight(sizes, target, s, () => {
            if (sizes.dataset.open === "true") {
                sizes.style.height = "auto";
                sizes.style.overflow = "";
            }
        });
    }, ENTER_DELAY);
}

function onLeave(event) {
    const productItem = getClosestHoverItem(event);
    if (!productItem) return;
    if (productItem.contains(event.relatedTarget)) return;

    const sizes = productItem.querySelector(".js-product-grid-item-sizes");
    if (!sizes) return;

    const s = getState(productItem);

    clearTimeout(s.enterTimeout);
    clearTimeout(s.leaveTimeout);

    cancelHeightAnimation(sizes, s);

    if (sizes.dataset.open !== "true") {
        if (!productItem.matches(":hover")) productItem.classList.remove("is-hover");
        return;
    }

    s.leaveTimeout = setTimeout(() => {
        if (productItem.matches(":hover")) return;

        sizes.dataset.open = "false";

        if (sizes.style.height === "auto" || getComputedStyle(sizes).height === "auto") {
            stopHeightTransition(sizes);
        }

        animateHeight(sizes, 0, s, () => {
            sizes.style.overflow = "";
            if (!productItem.matches(":hover") && sizes.dataset.open !== "true") {
                productItem.classList.remove("is-hover");
            }
        });
    }, LEAVE_DELAY);
}

document.addEventListener("click", onGridArrowClick, true);

function onGridArrowClick(e) {
    const t = e.target;
    if (!t || t.nodeType !== 1) return;

    const prevBtn = t.closest(".js-previous-product-image");
    const nextBtn = t.closest(".js-next-product-image");
    if (!prevBtn && !nextBtn) return;

    const a = t.closest("a");
    if (!a) return;

    const raw = (a.getAttribute("data-images") || "").trim();
    const images = raw ? raw.split(",").map(s => s.trim()).filter(Boolean) : [];

    const hoverImg = a.querySelector("img.hover");

    if (!hoverImg || images.length === 0) {
        if (prevBtn) prevBtn.remove();
        if (nextBtn) nextBtn.remove();
        return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    if (a.dataset.galleryIndex == null) a.dataset.galleryIndex = "-1";
    if (!a.dataset.galleryOriginalSrc) a.dataset.galleryOriginalSrc = hoverImg.getAttribute("src") || "";
    if (!a.dataset.galleryHoverSrc) a.dataset.galleryHoverSrc = hoverImg.getAttribute("src") || "";

    let idx = parseInt(a.dataset.galleryIndex, 10);
    if (Number.isNaN(idx)) idx = -1;

    const dir = nextBtn ? 1 : -1;

    if (dir > 0) {
        idx = idx + 1;
        if (idx > images.length - 1) idx = -1;
    } else {
        idx = idx - 1;
        if (idx < -1) idx = images.length - 1;
    }

    a.dataset.galleryIndex = String(idx);

    showGridImageLoader(a);

    const url = idx === -1 ? a.dataset.galleryHoverSrc : images[idx];
    if (!url) {
        hideGridImageLoader(a);
        return;
    }

    const pre = new Image();
    pre.decoding = "async";
    pre.src = url;

    const done = () => {
        hideGridImageLoader(a);

        hoverImg.setAttribute("src", url);
        hoverImg.removeAttribute("srcset");
        hoverImg.removeAttribute("sizes");

        preloadNeighbors(a);
    };

    if (pre.complete && pre.naturalWidth > 0) {
        done();
    } else {
        pre.onload = done;
        pre.onerror = () => {
            hideGridImageLoader(a);
        };
    }
}

function showGridImageLoader(a) {
    if (!a) return;

    let loader = a.querySelector(".js-grid-image-loader");
    if (!loader) {
        loader = document.createElement("div");
        loader.className = "js-grid-image-loader product-grid-image-loader";
        a.appendChild(loader);
    }

    loader.classList.add("is-active");
    a.classList.add("is-loading-image");
}

function hideGridImageLoader(a) {
    if (!a) return;
    const loader = a.querySelector(".js-grid-image-loader");
    if (loader) loader.classList.remove("is-active");
    a.classList.remove("is-loading-image");
}

document.addEventListener("mouseenter", onGridImageEnter, true);

function onGridImageEnter(e) {
    const t = e.target;
    if (!t || t.nodeType !== 1) return;

    const imageWrap = t.closest(".js-product-grid-item-image");
    if (!imageWrap) return;

    const a = imageWrap.closest("a[data-images]") || imageWrap.querySelector("a[data-images]");
    if (!a) return;

    const raw = (a.getAttribute("data-images") || "").trim();
    if (!raw) return;

    const hoverImg = a.querySelector("img.hover");
    if (!hoverImg) {
        const prevBtn = a.querySelector(".js-previous-product-image");
        const nextBtn = a.querySelector(".js-next-product-image");
        if (prevBtn) prevBtn.remove();
        if (nextBtn) nextBtn.remove();
        return;
    }

    const images = raw.split(",").map(s => s.trim()).filter(Boolean);
    if (!images.length) {
        const prevBtn = a.querySelector(".js-previous-product-image");
        const nextBtn = a.querySelector(".js-next-product-image");
        if (prevBtn) prevBtn.remove();
        if (nextBtn) nextBtn.remove();
        return;
    }

    if (a.dataset.hoverPreloaded === "true") return;
    a.dataset.hoverPreloaded = "true";

    preloadNeighbors(a);
}

function preloadNeighbors(a) {
    const raw = (a.getAttribute("data-images") || "").trim();
    const images = raw ? raw.split(",").map(s => s.trim()).filter(Boolean) : [];
    if (!images.length) return;

    const hoverSrc = a.dataset.galleryHoverSrc || "";
    if (!hoverSrc) return;

    let idx = parseInt(a.dataset.galleryIndex, 10);
    if (Number.isNaN(idx)) idx = -1;

    const total = images.length + 1;

    const toPos = (i) => (i === -1 ? 0 : i + 1);
    const toIdx = (p) => (p === 0 ? -1 : p - 1);

    const pos = toPos(idx);

    const nextPos = (pos + 1) % total;
    const prevPos = (pos - 1 + total) % total;

    const nextIdx = toIdx(nextPos);
    const prevIdx = toIdx(prevPos);

    const nextUrl = nextIdx === -1 ? hoverSrc : images[nextIdx];
    const prevUrl = prevIdx === -1 ? hoverSrc : images[prevIdx];

    if (nextUrl) preloadUrlOnce(a, "next", nextUrl);
    if (prevUrl) preloadUrlOnce(a, "prev", prevUrl);
}

function preloadUrlOnce(a, key, url) {
    const safeKey = (key + "_" + url).replace(/[^a-zA-Z0-9_]/g, "_");
    const flag = "preloaded_" + safeKey;

    if (a.dataset[flag] === "true") return;
    a.dataset[flag] = "true";

    const img = new Image();
    img.decoding = "async";
    img.src = url;
}

(() => {
    let activeHover = null;
    let placeholder = null;
    let activateTimeout = null;

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.js-open-mobile-add-to-cart');

        if (trigger) {
            e.preventDefault();

            const productItem = trigger.closest('.js-product-grid-item');
            if (!productItem) return;

            const hover = productItem.querySelector('.js-product-grid-item-hover');
            if (!hover) return;

            if (activeHover && hover === activeHover) {
                closeActive();
                return;
            }

            if (activeHover) {
                closeActive();
            }

            openHover(hover);
            return;
        }

        if (activeHover && !e.target.closest('.js-product-grid-item-hover')) {
            e.preventDefault();

            closeActive();
        }
    });

    function openHover(hover) {
        placeholder = document.createElement('div');
        placeholder.className = 'js-hover-placeholder';
        hover.parentNode.insertBefore(placeholder, hover);

        document.body.appendChild(hover);

        hover.classList.add('is-open');
        document.body.classList.add('mobile-hover-open');

        clearTimeout(activateTimeout);
        activateTimeout = setTimeout(() => {
            hover.classList.add('is-active');
        }, 50);

        activeHover = hover;
    }

    function closeActive() {
        if (!activeHover || !placeholder) return;

        clearTimeout(activateTimeout);

        activeHover.classList.remove('is-active');

        const hoverToClose = activeHover;
        const placeholderToUse = placeholder;

        activeHover = null;
        placeholder = null;

        setTimeout(() => {
            hoverToClose.classList.remove('is-open');
            document.body.classList.remove('mobile-hover-open');
            placeholderToUse.replaceWith(hoverToClose);
        }, 300);
    }
})();