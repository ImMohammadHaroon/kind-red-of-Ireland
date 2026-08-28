function initializeAnnouncementCarousels() {
    document.querySelectorAll(".js-announcement-carousel").forEach((element, index) => {
        if (element.classList.contains('is-initialized')) {
            return;
        }

        const uniqueClass = `announcement-carousel-${String(index + 1).padStart(2, "0")}`;
        element.classList.add(uniqueClass, 'is-initialized');

        const splide = new Splide(element, {
            direction: "ttb",
            height: "32px",
            autoplay: !Shopify.designMode,
            type: "loop",
            perPage: 1,
        });

        splide.mount();
        element.splideInstance = splide;
    });
}

function handleBlockSelect(event) {
    const blockId = event.detail.blockId;
    const blockElement = document.querySelector(`[data-block-id="${blockId}"]`);

    if (blockElement) {
        const carouselElement = blockElement.closest(".js-announcement-carousel");
        if (carouselElement && carouselElement.splideInstance) {
            const slideIndex = Array.from(carouselElement.querySelectorAll(".splide__slide"))
                .findIndex(slide => slide.contains(blockElement));

            if (slideIndex !== -1) {
                carouselElement.splideInstance.go(slideIndex);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", initializeAnnouncementCarousels);
document.addEventListener("shopify:section:load", initializeAnnouncementCarousels);
document.addEventListener("shopify:section:select", initializeAnnouncementCarousels);
document.addEventListener("shopify:block:select", handleBlockSelect);