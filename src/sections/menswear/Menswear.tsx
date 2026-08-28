import content from "@/data/content";
import { Rich, ThemeImage } from "@/components/Media";

const { menswear } = content;

export default function Menswear() {
  return (
    <div className="shopify-section">
      <div className="menswear" data-aos="fade-in">
        <div className="menswear__media">
          <ThemeImage image={menswear.desktopImage} className="d-none d-md-block" sizes="100vw" />
          <ThemeImage image={menswear.mobileImage} className="d-md-none" sizes="100vw" />
        </div>

        <div className="menswear__top-wrapper">
          <div className="container">
            <Rich as="h3" className="menswear__top-heading" html={menswear.topHeadingHtml} />

            <div
              className={`hero__products ${
                menswear.products.length > 1 ? "hero__products--more-than-one" : ""
              } js-hero-products`
                .replace(/\s+/g, " ")
                .trim()}
            >
              <div className="hero__products-absolute-right js-hero-products-content">
                {menswear.products.map((product, i) => (
                  <div className="hero-product" key={`${product.href}-${i}`}>
                    <a href={product.href}>
                      <ThemeImage image={product.image} sizes="25vw" />
                    </a>
                  </div>
                ))}
                <div className="hero-products__open-more" />
              </div>
            </div>
          </div>
        </div>

        <div className="menswear__bottom-wrapper">
          <Rich as="h2" className="menswear__bottom-heading" html={menswear.bottomHeadingHtml} />
        </div>

        {menswear.button && (
          <div className={`menswear__bottom-button menswear__bottom-button--${menswear.buttonAlignment}`}>
            <a href={menswear.button.href} className="button text-cta">
              {menswear.button.label}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
