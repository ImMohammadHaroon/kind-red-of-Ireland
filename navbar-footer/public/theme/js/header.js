(() => {
    const topEl = document.querySelector('.js-top');
    if (!topEl) return;

    const toggleActive = () => {
        if (window.scrollY > 50) {
            topEl.classList.add('active');
        } else {
            topEl.classList.remove('active');
        }
    };

    toggleActive();

    window.addEventListener('scroll', toggleActive);
})();

document.addEventListener("DOMContentLoaded", function() {
    const topBar = document.querySelector(".js-top");
    const megamenu = document.querySelector(".js-megamenu");
    const items = document.querySelectorAll(".js-megamenu-item");
    const triggers = document.querySelectorAll(".js-open-megamenu");

    if (!topBar || !megamenu || !items.length || !triggers.length) return;

    let hideTimeout = null;
    const itemsArray = Array.from(items);

    function setTranslateForItems(activeDataIndex, animate = false) {
        const activePos = itemsArray.findIndex(
            item => item.getAttribute("data-index") === activeDataIndex
        );
        if (activePos === -1) return;

        const offset = activePos * -100;

        if (!animate) {
            itemsArray.forEach(item => {
                item.style.transition = "none";
                item.style.transform = `translateX(${offset}%)`;
            });

            void megamenu.offsetHeight;

            itemsArray.forEach(item => {
                item.style.transition = "";
            });
        } else {
            itemsArray.forEach(item => {
                item.style.transform = `translateX(${offset}%)`;
            });
        }
    }

    function openMegamenu(activeDataIndex) {
        clearTimeout(hideTimeout);

        const activeItem = itemsArray.find(
            item => item.getAttribute("data-index") === activeDataIndex
        );
        if (!activeItem) return;

        const height = activeItem.scrollHeight;
        const alreadyOpen = megamenu.classList.contains("is-open");

        setTranslateForItems(activeDataIndex, alreadyOpen);

        megamenu.style.height = height + "px";
        megamenu.classList.add("is-open");
    }

    function closeMegamenu(immediate = false) {
        clearTimeout(hideTimeout);

        if (immediate) {
            megamenu.style.height = "0px";
            megamenu.classList.remove("is-open");
            return;
        }

        hideTimeout = setTimeout(() => {
            megamenu.style.height = "0px";
            megamenu.classList.remove("is-open");
        }, 700);
    }

    triggers.forEach(trigger => {
        trigger.addEventListener("mouseenter", () => {
            const index = trigger.getAttribute("data-index");
            if (!index) return;
            openMegamenu(index);
        });

        trigger.addEventListener("mouseleave", () => {
            closeMegamenu(false);
        });
    });

    megamenu.addEventListener("mouseleave", () => {
        closeMegamenu(false);
    });

    megamenu.addEventListener("mouseenter", () => {
        clearTimeout(hideTimeout);
    });

    topBar.addEventListener("mouseleave", () => {
        closeMegamenu(true);
    });

    topBar.addEventListener("mouseenter", () => {
        clearTimeout(hideTimeout);
    });

    const isDesignMode =
        typeof window.Shopify !== "undefined" && window.Shopify.designMode;

    function getIndexFromBlockId(blockId) {
        if (!blockId) return null;

        const item = document.querySelector(
            `.js-megamenu-item[data-block-id="${blockId}"][data-index]`
        );
        if (item) return item.getAttribute("data-index");

        return null;
    }

    if (isDesignMode) {
        document.addEventListener("shopify:block:select", (event) => {
            const blockId = event.detail ?.blockId;
            if (!blockId) return;

            const index = getIndexFromBlockId(blockId);
            if (index == null) return;

            openMegamenu(index);

            const bg = document.querySelector(".js-header-background");
            if (bg) {
                bg.style.height = "100%";
            }
        });

        document.addEventListener("shopify:block:deselect", () => {
            closeMegamenu(true);

            const bg = document.querySelector(".js-header-background");
            if (bg) {
                bg.style.height = "0px";
            }
        });

        document.addEventListener("shopify:section:deselect", () => {
            closeMegamenu(true);

            const bg = document.querySelector(".js-header-background");
            if (bg) {
                bg.style.height = "0px";
            }
        });
    }
});