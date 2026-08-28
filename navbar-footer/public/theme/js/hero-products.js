window.initHeroProducts = function(root = document) {
    root.querySelectorAll(".js-hero-products").forEach((item) => {
        if (item.dataset.heroInited === "true") return;
        item.dataset.heroInited = "true";

        const content = item.querySelector(".js-hero-products-content");
        if (!content) return;

        let initWidth = null;
        let t2 = null;

        function open() {
            item.classList.add("active");
            clearTimeout(t2);
            t2 = setTimeout(function() {
                item.classList.add("active-2");
            }, 50);

            if (initWidth === null) {
                initWidth = item.offsetWidth + "px";
            }

            const contentWidth = content.scrollWidth + "px";
            item.style.width = contentWidth;
        }

        function close() {
            item.classList.remove("active", "active-2");
            clearTimeout(t2);

            if (initWidth !== null) {
                item.style.width = initWidth;
            }
        }

        item.addEventListener("mouseenter", () => {
            open();
        });

        item.addEventListener("mouseleave", () => {
            close();
        });

        item.addEventListener("click", (e) => {
            if (window.innerWidth >= 992) return;

            if (item.classList.contains("active-2")) {
                close();
            } else {
                open();
            }
        });
    });

    if (window.innerWidth < 992) {
        const h = window.outerHeight - 58 + "px";
        const elements = document.querySelectorAll(".hero__media img, .hero__media video");

        elements.forEach((el) => {
            el.style.height = h;
            el.style.objectFit = "cover";
        });
    }

    if (!window.__heroProductsClickRedirectBound) {
        window.__heroProductsClickRedirectBound = true;

        document.addEventListener("click", function(e) {
            const link = e.target.closest(".js-hero-product-link");
            if (!link) return;

            e.preventDefault();

            const redirectUrl = link.getAttribute("data-href");
            if (!redirectUrl) return;

            window.location.href = redirectUrl;
        });
    }

    if (!window.__heroSplitProductsClickBlockBound) {
        window.__heroSplitProductsClickBlockBound = true;

        document.addEventListener("click", function(e) {
            const wrapper = e.target.closest(".js-split-products");
            if (!wrapper) return;

            e.preventDefault();
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initHeroProducts();
});