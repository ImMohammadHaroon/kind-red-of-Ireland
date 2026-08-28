import type { CraftsmanshipItem } from "@/lib/types";
import { Rich, ThemeImage, ThemeVideo } from "@/components/Media";

/**
 * Editorial blocks that pair a tall image (or video) with a heading, an inset
 * media panel and a CTA. craftsmanship.js sizes the panels to match.
 */
export default function Craftsmanship({ items }: { items: CraftsmanshipItem[] }) {
  if (!items.length) return null;

  return (
    <div className="shopify-section">
      <div className="craftsmanship" data-aos="fade-in">
        <div className="craftsmanship__d-flex d-flex">
          {items.map((item, i) => (
            <div
              className="shopify-block craftsmanship__item js-craftsmanship-item"
              style={item.background ? { background: item.background } : undefined}
              key={i}
            >
              <div className="shopify-block craftsmanship__media js-craftsmanship-media">
                <ThemeImage
                  image={item.media.image}
                  sizes="50vw"
                  style={
                    item.media.objectPosition
                      ? { objectPosition: item.media.objectPosition }
                      : undefined
                  }
                />
                <ThemeVideo video={item.media.video} />
              </div>

              <div className="shopify-block craftsmanship__content">
                <div className="shopify-block">
                  <Rich as="h2" className="craftsmanship__content-heading" html={item.headingHtml} />
                </div>

                <div className="shopify-block craftsmanship__content-media">
                  <ThemeImage image={item.contentMedia.image} sizes="50vw" />
                  <ThemeVideo video={item.contentMedia.video} />
                </div>

                <div className="shopify-block">
                  <Rich className="craftsmanship__content-description" html={item.descriptionHtml} />
                </div>

                {item.button && (
                  <div className="shopify-block">
                    <div className="craftsmanship__content-button">
                      <a href={item.button.href} className="button text-cta">
                        {item.button.label}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
