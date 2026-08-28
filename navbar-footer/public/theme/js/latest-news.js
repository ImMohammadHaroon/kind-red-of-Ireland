if (!window.__articlesCarouselInitialized) {
    window.__articlesCarouselInitialized = true;

    document.addEventListener("DOMContentLoaded", function() {
        if (window.innerWidth > 991) {
            initArticleCarousels();
        }
    });

    function initArticleCarousels() {
        document.querySelectorAll(".js-articles-carousel").forEach((element, index) => {
            if (!element.__splideInstance) {
                const uniqueClass = `js-articles-carousel-${String(index + 1).padStart(2, "0")}`;
                element.classList.add(uniqueClass);

                const splide = new Splide(element, {
                    type: "slide",
                    drag: "free",
                    gap: "16px",
                    perPage: 3,
                    rewind: false,
                    arrows: false,
                    pagination: false,
                    breakpoints: {
                        767: {
                            perPage: 1,
                            gap: "12px"
                        },
                        991: {
                            perPage: 2,
                            gap: "12px"
                        },
                        1298: {
                            perPage: 3,
                            gap: "16px"
                        },
                        1440: {
                            perPage: 3,
                            gap: "16px"
                        }
                    }
                });

                splide.mount();
                element.__splideInstance = splide;
            }
        });
    }

    function destroyArticleCarousels() {
        document.querySelectorAll(".js-articles-carousel").forEach(element => {
            if (element.__splideInstance) {
                element.__splideInstance.destroy(true);
                element.__splideInstance = null;
            }
        });
    }

    if (Shopify.designMode) {
        document.addEventListener("shopify:section:load", function() {
            destroyArticleCarousels();
            initArticleCarousels();
        });

        document.addEventListener("shopify:section:unload", function() {
            destroyArticleCarousels();
        });

        document.addEventListener("shopify:section:select", function() {
            destroyArticleCarousels();
            initArticleCarousels();
        });

        document.addEventListener("shopify:section:deselect", function() {
            destroyArticleCarousels();
            initArticleCarousels();
        });

        document.addEventListener("shopify:block:select", function() {
            destroyArticleCarousels();
            initArticleCarousels();
        });

        document.addEventListener("shopify:block:deselect", function() {
            destroyArticleCarousels();
            initArticleCarousels();
        });
    }
}