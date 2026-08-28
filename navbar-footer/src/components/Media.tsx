import type { Img, Video } from "@/lib/types";

/**
 * Plain <img> rather than next/image: the theme's `fade-in` class is what
 * lazyload.js observes to add `show`, and several stylesheets target the bare
 * element inside its wrapper.
 */
export function ThemeImage({
  image,
  className = "",
  sizes,
  eager = false,
  style,
}: {
  image: Img | null;
  className?: string;
  sizes?: string;
  eager?: boolean;
  style?: React.CSSProperties;
}) {
  if (!image) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      alt={image.alt}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      className={`fade-in ${className}`.trim()}
      style={style}
    />
  );
}

/**
 * Mirrors the theme's lazy-video markup: the source lives on `data-src` until
 * lazyload.js promotes it once the element scrolls into view.
 */
export function ThemeVideo({
  video,
  className = "",
}: {
  video: Video | null;
  className?: string;
}) {
  if (!video) return null;
  return (
    <video
      poster={video.poster ?? undefined}
      className={`js-lazy-video ${className}`.trim()}
      width={video.width}
      height={video.height}
      playsInline
      muted
      loop
      autoPlay
    >
      <source data-src={video.src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

/** Rich text captured from the mirror, which keeps <em>/<p>/<span> intact. */
export function Rich({
  html,
  as: Tag = "div",
  className,
  ...rest
}: {
  html: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
} & Record<string, unknown>) {
  const Component = Tag as React.ElementType;
  return <Component className={className} dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
}
