const AOS = (() => {
    const defaultSettings = {
        offset: 120,
        duration: 400,
        easing: "ease",
        delay: 0,
        disable: false,
        once: true,
        startEvent: "DOMContentLoaded",
        throttleDelay: 99,
        debounceDelay: 50,
        disableMutationObserver: false,
    };

    let elements = [];
    let initialized = false;

    // Merge default settings with user options
    const mergeSettings = (defaults, options) => ({ ...defaults,
        ...options
    });

    // Initialize AOS
    const initAOS = (refresh = false) => {
        if (refresh && initialized) return elements;

        initialized = true;
        elements = collectElements();
        refreshAOS();

        // Add attributes to <body> for global settings
        document.body.setAttribute("data-aos-duration", defaultSettings.duration);
        document.body.setAttribute("data-aos-delay", defaultSettings.delay);
        document.body.setAttribute("data-aos-easing", defaultSettings.easing);

        // Trigger animations immediately for elements in the viewport
        refreshAnimation();

        return elements;
    };

    // Collect all elements with data-aos attribute
    const collectElements = () => {
        return [...document.querySelectorAll("[data-aos]")].map((el) => ({
            node: el,
            position: calculateOffset(el),
        }));
    };

    // Calculate the offset position of an element
    const calculateOffset = (element, offset = defaultSettings.offset) => {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY - offset;
    };

    // Apply animation based on the position of the element
    const applyAnimation = (element, threshold) => {
        if (window.scrollY + window.innerHeight > threshold) {
            element.node.classList.add("aos-animate");
        } else if (!defaultSettings.once) {
            element.node.classList.remove("aos-animate");
        }
    };

    // Refresh all element positions
    const refreshAOS = () => {
        elements.forEach((element) => {
            element.position = calculateOffset(element.node, defaultSettings.offset);
        });
    };

    // Refresh animations based on scroll position
    const refreshAnimation = () => {
        elements.forEach((element) => {
            const threshold = element.position;
            applyAnimation(element, threshold);
        });
    };

    // Observe DOM mutations and refresh elements
    const observeMutation = () => {
        const observer = new MutationObserver(() => {
            refreshAOS();
            refreshAnimation(); // Re-check animations on DOM change
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    };

    // Debounce function
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Throttle function
    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return (...args) => {
            if (!lastRan) {
                func(...args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if (Date.now() - lastRan >= limit) {
                        func(...args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    // Main initialization function
    const init = (options = {}) => {
        const settings = mergeSettings(defaultSettings, options);

        if (settings.disable) return;

        document.addEventListener(settings.startEvent, () => initAOS(true));

        window.addEventListener("resize", debounce(() => {
            refreshAOS();
            refreshAnimation();
        }, settings.debounceDelay));

        window.addEventListener("scroll", throttle(refreshAnimation, settings.throttleDelay));

        if (!settings.disableMutationObserver) {
            observeMutation();
        }
    };

    return {
        init,
        refresh: initAOS,
        refreshHard: refreshAOS,
    };
})();

// Initialize AOS with default settings
AOS.init();