if (!window.__tabsInitialized) {
    window.__tabsInitialized = true;

    document.addEventListener("DOMContentLoaded", function() {
        if (window.innerWidth > 991) {
            initCarousels();
            initTabs();
        } else {
            initTabs();
        }
    });

    function initCarousels() {
        document.querySelectorAll(".js-products-carousel").forEach((element, index) => {
            if (!element.__splideInstance) {
                const uniqueClass = `js-products-carousel-${String(index + 1).padStart(2, "0")}`;
                element.classList.add(uniqueClass);

                const splide = new Splide(element, {
                    type: 'slide',
                    drag: 'free',
                    gap: '16px',
                    perPage: 3,
                    rewind: false,
                    arrows: false,
                    pagination: false,
                    breakpoints: {
                        767: {
                            perPage: 1,
                            gap: '12px'
                        },
                        991: {
                            perPage: 2,
                            gap: '12px'
                        },
                        1298: {
                            perPage: 3,
                            gap: '16px'
                        },
                        1440: {
                            perPage: 3,
                            gap: '16px'
                        }
                    }
                });

                splide.mount();

                element.__splideInstance = splide;
            }
        });
        document.querySelectorAll(".js-products-carousel-with-left-heading").forEach((element, index) => {
            if (!element.__splideInstance) {
                const uniqueClass = `js-products-carousel-with-left-heading-${String(index + 1).padStart(2, "0")}`;
                element.classList.add(uniqueClass);

                const splide = new Splide(element, {
                    type: 'slide',
                    drag: 'free',
                    gap: '16px',
                    perPage: 6,
                    rewind: false,
                    arrows: false,
                    pagination: false,
                    breakpoints: {
                        767: {
                            perPage: 2,
                            gap: '12px'
                        },
                        991: {
                            perPage: 3,
                            gap: '12px'
                        },
                        1298: {
                            perPage: 4,
                            gap: '16px'
                        },
                        1440: {
                            perPage: 6,
                            gap: '16px'
                        }
                    }
                });

                splide.mount();

                element.__splideInstance = splide;
            }
        });
    }

    function destroyCarousels() {
        document.querySelectorAll(".js-products-carousel, .js-products-carousel-with-left-heading").forEach(element => {
            if (element.__splideInstance) {
                element.__splideInstance.destroy();
                element.__splideInstance = null;
            }
        });
    }

    function initTabs() {
        document.querySelectorAll(".js-tab-link").forEach(tabLink => {
            tabLink.addEventListener("click", function(event) {
                event.preventDefault();

                setActiveTab(this);
            });
        });
    }

    function setActiveTab(tabLink) {
        const tabsContainer = tabLink.closest(".js-product-tabs");

        if (tabsContainer) {
            tabsContainer.querySelectorAll(".js-tab-link").forEach(link => link.classList.remove("active"));
            tabLink.classList.add("active");

            const index = tabLink.getAttribute("data-index");
            tabsContainer.querySelectorAll(".js-tab").forEach(tab => tab.classList.remove("active"));
            const activeTab = tabsContainer.querySelector(`.js-tab[data-index="${index}"]`);

            if (activeTab) {
                activeTab.classList.add("active");
                if (window.innerWidth > 991) {
                    refreshCarouselInTab(activeTab);
                }
            }
        }
    }

    function refreshCarouselInTab(tab) {
        const carousel = tab.querySelector(".js-products-carousel, .js-products-carousel-with-left-heading");
        if (carousel && carousel.__splideInstance) {
            carousel.__splideInstance.destroy();
            carousel.__splideInstance.mount();
        } else if (carousel) {
            initCarousels();
        }
    }

    if (Shopify.designMode) {
        document.addEventListener('shopify:section:load', function(event) {
            destroyCarousels();
            initCarousels();
            refreshTabs(event);
        });
        document.addEventListener('shopify:section:unload', function() {
            destroyCarousels();
            initCarousels();
        });
        document.addEventListener('shopify:section:select', function(event) {
            refreshTabs(event);
        });
        document.addEventListener('shopify:section:deselect', function() {
            destroyCarousels();
            initCarousels();
        });
        document.addEventListener('shopify:block:select', function(event) {
            const blockId = event.detail.blockId;
            const activeBlock = document.querySelector(`[data-block-id="${blockId}"]`);
            if (activeBlock) {
                const tabLink = document.querySelector(`.js-tab-link[data-block-id="${blockId}"]`);
                if (tabLink) {
                    setActiveTab(tabLink);
                }
            }
        });
        document.addEventListener('shopify:block:deselect', function() {
            destroyCarousels();
            initCarousels();
        });
    }

    function refreshTabs(event) {
        const section = event.target.closest(".js-product-tabs");
        if (section) {
            const activeTabLink = section.querySelector(".js-tab-link.active");
            if (activeTabLink) {
                setActiveTab(activeTabLink);
            } else {
                const firstTabLink = section.querySelector(".js-tab-link");
                if (firstTabLink) {
                    setActiveTab(firstTabLink);
                }
            }
        }
    }
}