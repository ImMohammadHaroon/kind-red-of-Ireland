(function() {
    const ITEM_SELECTOR = '.js-time-ago';
    const BLOG_ROW_SELECTOR = '.js-blog-row';
    const SWITCH_DAYS = 100;

    const LOCALE = 'en';

    const rtf = new Intl.RelativeTimeFormat(LOCALE, {
        numeric: 'auto'
    });

    function getOrdinal(n) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    function formatFullDate(d) {
        const day = getOrdinal(d.getDate());
        const month = d.toLocaleString(LOCALE, {
            month: 'long'
        });
        const year = d.getFullYear();
        return `${day} of ${month} ${year}`;
    }

    function formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays > SWITCH_DAYS) return formatFullDate(date);

        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffSeconds < 60) return rtf.format(-diffSeconds, 'second');
        if (diffMinutes < 60) return rtf.format(-diffMinutes, 'minute');
        if (diffHours < 24) return rtf.format(-diffHours, 'hour');
        return rtf.format(-diffDays, 'day');
    }

    function updateTimeAgo(root = document) {
        root.querySelectorAll(ITEM_SELECTOR).forEach((el) => {
            const raw = el.dataset.date;
            if (!raw) return;

            const date = new Date(raw);
            if (Number.isNaN(date.getTime())) return;

            el.textContent = formatTimeAgo(date);
        });
    }

    let rafId = 0;

    function scheduleUpdate() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            rafId = 0;
            updateTimeAgo(document);
        });
    }

    function observe(el) {
        if (!el) return null;
        const obs = new MutationObserver(scheduleUpdate);
        obs.observe(el, {
            childList: true,
            subtree: true
        });
        return obs;
    }

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, {
                once: true
            });
        } else {
            fn();
        }
    }

    let blogObserver = null;
    let bodyObserver = null;

    function initObservers() {
        updateTimeAgo(document);

        const blogRow = document.querySelector(BLOG_ROW_SELECTOR);
        if (blogObserver) blogObserver.disconnect();
        blogObserver = observe(blogRow);

        if (!bodyObserver) {
            bodyObserver = observe(document.body);
        }
    }

    onReady(() => {
        initObservers();

        document.addEventListener('shopify:section:load', initObservers);
        document.addEventListener('shopify:section:reorder', initObservers);
        document.addEventListener('shopify:section:select', initObservers);
        document.addEventListener('shopify:section:deselect', initObservers);
    });
})();