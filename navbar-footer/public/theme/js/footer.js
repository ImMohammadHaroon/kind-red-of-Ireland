document.addEventListener("DOMContentLoaded", () => {

    function slideToggle(element, duration = 300) {
        if (window.getComputedStyle(element).display === "none") {
            return slideDown(element, duration);
        } else {
            return slideUp(element, duration);
        }
    }

    function slideUp(element, duration = 300) {
        element.style.height = element.offsetHeight + "px";
        element.offsetHeight;
        element.style.transitionProperty = "height, margin, padding";
        element.style.transitionDuration = duration + "ms";
        element.style.boxSizing = "border-box";
        element.style.overflow = "hidden";
        element.style.height = 0;
        element.style.paddingTop = 0;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;

        window.setTimeout(() => {
            element.style.display = "none";
            element.style.removeProperty("height");
            element.style.removeProperty("padding-top");
            element.style.removeProperty("padding-bottom");
            element.style.removeProperty("margin-top");
            element.style.removeProperty("margin-bottom");
            element.style.removeProperty("overflow");
            element.style.removeProperty("transition-duration");
            element.style.removeProperty("transition-property");
        }, duration);
    }

    function slideDown(element, duration = 300) {
        element.style.removeProperty("display");
        let display = window.getComputedStyle(element).display;

        if (display === "none") display = "block";
        element.style.display = display;

        const height = element.offsetHeight;
        element.style.height = 0;
        element.style.paddingTop = 0;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;
        element.offsetHeight;
        element.style.transitionProperty = "height, margin, padding";
        element.style.transitionDuration = duration + "ms";
        element.style.height = height + "px";
        element.style.overflow = "hidden";

        window.setTimeout(() => {
            element.style.removeProperty("height");
            element.style.removeProperty("overflow");
            element.style.removeProperty("transition-duration");
            element.style.removeProperty("transition-property");
        }, duration);
    }

    const toggles = document.querySelectorAll(".js-toggle-mobile-menu");

    toggles.forEach(toggle => {
        toggle.addEventListener("click", function() {
            if (window.innerWidth >= 768) return;

            this.classList.toggle("active");

            const parent = this.closest("[data-mobile-menu-parent]") || this.parentElement;
            const content = parent.querySelector(".js-mobile-menu-content");

            if (content) {
                slideToggle(content, 300);
            }
        });
    });

});