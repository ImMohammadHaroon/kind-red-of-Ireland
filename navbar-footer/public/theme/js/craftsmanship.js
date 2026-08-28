(function() {
    // Rewrite a Shopify CDN image URL to request a small rendition.
    // Thumbnails render at ~60-90px; without this the browser downloads the
    // full-size carousel image (up to 1512px) for every thumbnail.
    function thumbUrl(url, w) {
        try {
            const u = new URL(url, window.location.href);
            u.searchParams.set("width", String(w));
            return u.toString();
        } catch (e) {
            return url;
        }
    }

    function initCraftsmanshipSection(section) {
        if (!section || section.dataset.craftsmanshipInitialized === "true") return;
        section.dataset.craftsmanshipInitialized = "true";

        const track = section.querySelector(".craftsmanship__d-flex");
        if (!track) return;

        function getItems() {
            return Array.from(track.querySelectorAll(".js-craftsmanship-item"));
        }

        let items = getItems();
        if (!items.length) return;

        function getMediaSources() {
            items = getItems();
            return items.map((item) => {
                const media = item.querySelector(".js-craftsmanship-media");
                if (!media) return null;

                const img = media.querySelector("img");
                if (img) return {
                    type: "image",
                    el: img
                };

                const video = media.querySelector("video");
                if (video) return {
                    type: "video",
                    el: video
                };

                return null;
            });
        }

        let mediaSources = getMediaSources();
        let total = items.length;
        let currentIndex = 0;

        function updateThumbsActive(index) {
            section
                .querySelectorAll(".craftsmanship__thumb.is-active")
                .forEach((el) => el.classList.remove("is-active"));

            section
                .querySelectorAll(`.craftsmanship__thumb[data-index="${index}"]`)
                .forEach((el) => el.classList.add("is-active"));
        }

        function updateCounters(index) {
            section
                .querySelectorAll(".craftsmanship__counter")
                .forEach((el) => (el.textContent = `${index + 1} / ${total}`));
        }

        function goTo(index) {
            items = getItems();
            total = items.length;

            if (index < 0 || index >= total) return;
            currentIndex = index;

            items.forEach((item) => item.classList.remove("active"));
            items[index].classList.add("active");

            updateThumbsActive(index);
            updateCounters(index);
        }

        function rebuildThumbs() {
            items = getItems();
            total = items.length;
            mediaSources = getMediaSources();

            items.forEach((item) => {
                const media = item.querySelector(".js-craftsmanship-media");
                if (!media) return;

                media.querySelectorAll(".craftsmanship__thumbs").forEach((el) => el.remove());

                const bar = document.createElement("div");
                bar.className = "craftsmanship__thumbs";

                const thumbsList = document.createElement("div");
                thumbsList.className = "craftsmanship__thumbs-list";

                mediaSources.forEach((source, srcIndex) => {
                    if (!source) return;

                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "craftsmanship__thumb";
                    btn.dataset.index = String(srcIndex);

                    let thumb;

                    if (source.type === "image") {
                        thumb = document.createElement("img");
                        thumb.loading = "lazy";
                        thumb.decoding = "async";
                        thumb.alt = source.el.alt || "";
                        const full = source.el.currentSrc || source.el.src;
                        if (full) thumb.src = thumbUrl(full, 240);
                    } else {
                        thumb = document.createElement("video");
                        thumb.muted = true;
                        thumb.playsInline = true;
                        thumb.preload = "metadata";
                        if (source.el.poster) {
                            // Use the poster frame rather than pulling the video again
                            thumb.poster = thumbUrl(source.el.poster, 240);
                        }
                        thumb.src = source.el.currentSrc || source.el.src;
                    }

                    btn.appendChild(thumb);
                    if (srcIndex === currentIndex) btn.classList.add("is-active");
                    btn.addEventListener("click", () => goTo(srcIndex));

                    thumbsList.appendChild(btn);
                });

                bar.appendChild(thumbsList);
                if (total > 1) {
                    const counter = document.createElement("div");
                    counter.className = "craftsmanship__counter text-cta";
                    counter.textContent = `1 / ${total}`;
                    bar.appendChild(counter);
                }
                media.appendChild(bar);
            });

            goTo(Math.min(currentIndex, total - 1));
        }

        function findBlockElById(blockId) {
            return (
                section.querySelector(`[data-block-id="${blockId}"]`) ||
                section.querySelector(`[data-shopify-editor-block-id="${blockId}"]`) ||
                section.querySelector(`#shopify-block-${blockId}`)
            );
        }

        function selectByBlockId(blockId) {
            if (!blockId) return;

            items = getItems();
            total = items.length;

            const blockEl = findBlockElById(blockId);
            if (!blockEl) return;

            const item = blockEl.closest(".js-craftsmanship-item");
            if (!item) return;

            const index = items.indexOf(item);
            if (index === -1) return;

            const thumbsCount = section.querySelectorAll(".craftsmanship__thumb").length;
            if (thumbsCount !== total * total) {
                rebuildThumbs();
            }

            goTo(index);
        }

        section._craftsmanshipApi = {
            goTo,
            rebuildThumbs,
            selectByBlockId,
            refresh() {
                rebuildThumbs();
            },
        };

        rebuildThumbs();
        goTo(0);
    }

    function initCraftsmanship(root = document) {
        root.querySelectorAll(".craftsmanship").forEach(initCraftsmanshipSection);
    }

    document.addEventListener("DOMContentLoaded", () => initCraftsmanship());
    document.addEventListener("shopify:section:load", (e) => initCraftsmanship(e.target));

    document.addEventListener("shopify:block:select", (e) => {
        const blockId = e.detail && e.detail.blockId;
        const blockEl = e.target;

        const section =
            (blockEl && blockEl.closest && blockEl.closest(".craftsmanship")) ||
            (blockEl && blockEl.closest && blockEl.closest("[data-section-id]") ?.querySelector ?.(".craftsmanship"));

        if (!section) return;

        initCraftsmanshipSection(section);
        if (section._craftsmanshipApi) section._craftsmanshipApi.selectByBlockId(blockId);
    });

    document.addEventListener("shopify:section:reorder", () => initCraftsmanship());
})();