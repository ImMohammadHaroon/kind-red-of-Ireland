document.addEventListener("DOMContentLoaded", function() {
    const triggers = document.querySelectorAll(".js-open-mobile-megamenu");
    const closeButtons = document.querySelectorAll(".js-close-mobile-megamenu");

    const toggleMenuBtns = document.querySelectorAll(".js-toggle-menu");
    const closeMenuBtns = document.querySelectorAll(".js-close-mobile-menu");

    const firstStep = document.querySelector(".js-mobile-menu-first-step");
    const secondStep = document.querySelector(".js-mobile-menu-second-step");
    const items = document.querySelectorAll(".js-mobile-megamenu-item");

    if (!firstStep || !secondStep) return;

    const TRANSITION_MS = 300;

    function lockScroll() {
        if (window.lenis) {
            window.lenis.stop();
        } else {
            document.body.style.overflow = "hidden";
        }
    }

    function unlockScroll() {
        if (window.lenis) {
            window.lenis.start();
        } else {
            document.body.style.overflow = "";
        }
    }

    function resetMegamenu() {
        firstStep.style.transition = `transform ${TRANSITION_MS}ms ease`;
        secondStep.style.transition = `transform ${TRANSITION_MS}ms ease`;

        firstStep.style.transform = "translateX(0)";
        secondStep.style.transform = "translateX(0)";

        setTimeout(() => {
            secondStep.style.display = "none";
            items.forEach(item => item.classList.add("d-none"));
        }, TRANSITION_MS);
    }

    function openMobileMenu() {
        document.body.classList.add("open-mobile-menu");
        lockScroll();
    }

    function closeMobileMenu() {
        document.body.classList.remove("open-mobile-menu");
        unlockScroll();
        resetMegamenu();
    }

    toggleMenuBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();

            const isOpen = document.body.classList.contains("open-mobile-menu");
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    });

    closeMenuBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            closeMobileMenu();
        });
    });

    triggers.forEach(trigger => {
        trigger.addEventListener("click", (event) => {
            event.preventDefault();

            const index = trigger.getAttribute("data-index");
            if (!index) return;

            secondStep.style.display = "block";

            secondStep.offsetHeight;

            firstStep.style.transition = `transform ${TRANSITION_MS}ms ease`;
            secondStep.style.transition = `transform ${TRANSITION_MS}ms ease`;

            firstStep.style.transform = "translateX(-100%)";
            secondStep.style.transform = "translateX(-100%)";

            items.forEach(item => item.classList.add("d-none"));

            const activeItem = document.querySelector(
                `.js-mobile-megamenu-item[data-index="${index}"]`
            );

            if (activeItem) {
                activeItem.classList.remove("d-none");
            }
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            resetMegamenu();
        });
    });
});