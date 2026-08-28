function pickVideoSource(video) {
    const sources = Array.from(video.querySelectorAll("source[data-src]"));
    if (!sources.length) return null;
    const candidates = sources
        .map((s) => ({
            url: s.dataset.src,
            type: s.getAttribute("type") || ""
        }))
        .filter((c) => c.url);
    if (!candidates.length) return null;
    // Only progressive MP4s — skip HLS (m3u8) so the browser can't escalate to the top bitrate
    const mp4s = candidates
        .filter((c) => c.type.indexOf("mpegURL") === -1 && /\.mp4/i.test(c.url))
        .map((c) => {
            const m = c.url.match(/(\d{3,4})p/);
            return {
                url: c.url,
                h: m ? parseInt(m[1], 10) : 0
            };
        })
        .sort((a, b) => a.h - b.h);
    if (!mp4s.length) return candidates[0].url;
    // Smallest rendition that covers the rendered width, hard-capped at 720p —
    // these are muted ambience loops, never full-quality playback surfaces.
    const rect = video.getBoundingClientRect();
    const neededH = Math.max(Math.min((rect.width || 0) / 1.9, 720), 360);
    for (let i = 0; i < mp4s.length; i++) {
        if (mp4s[i].h >= neededH) return mp4s[i].url;
    }
    return mp4s[mp4s.length - 1].url;
}

function activateLazyVideo(video) {
    video.controls = false;
    const chosen = pickVideoSource(video);
    if (chosen) {
        video.querySelectorAll("source[data-src]").forEach((s) => s.remove());
        video.src = chosen;
        video.load();
    }
}

function initializeObservers() {
    const images = document.querySelectorAll(".fade-in:not([data-observed])");
    const lazyVideos = document.querySelectorAll('.js-lazy-video:not([data-observed])');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                imageObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    images.forEach((img) => {
        img.setAttribute('data-observed', 'true');
        imageObserver.observe(img);
    });

    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const video = entry.target;

                    activateLazyVideo(video);

                    const playVideo = () => {
                        const promise = video.play();
                        if (promise && typeof promise.catch === "function") {
                            promise.catch(() => {});
                        }
                    };

                    video.addEventListener("loadedmetadata", playVideo, {
                        once: true
                    });
                    video.addEventListener("canplay", playVideo, {
                        once: true
                    });

                    videoObserver.unobserve(video);
                }
            });
        });

        lazyVideos.forEach(video => {
            video.setAttribute('data-observed', 'true');
            videoObserver.observe(video);
        });

    } else {
        lazyVideos.forEach((video) => {
            activateLazyVideo(video);
            video.setAttribute("data-observed", "true");
        });
    }
}

document.addEventListener("DOMContentLoaded", initializeObservers);
document.addEventListener("shopify:section:load", initializeObservers);
document.addEventListener("shopify:section:select", initializeObservers);
document.addEventListener("shopify:block:select", initializeObservers);