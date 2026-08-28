import content from "@/data/content";
import ProductCard from "@/components/ProductCard";

const { productTabs } = content;

/**
 * Tabbed product carousels. product-tabs.js handles the tab switching and
 * mounts a Splide instance per `.js-products-carousel` on desktop widths.
 */
export default function ProductTabs() {
  return (
    <div className="shopify-section">
      <div className="product-tabs js-product-tabs" data-aos="fade-in">
        <div className="container">
          <ul className="product-tabs__tabs">
            {productTabs.tabs.map((tab) => (
              <li key={tab.index}>
                <a
                  href="#"
                  className={`text-cta ${tab.active ? "active" : ""} js-tab-link`.replace(/\s+/g, " ").trim()}
                  data-index={tab.index}
                >
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="tabs">
            {productTabs.panels.map((panel) => (
              <div
                className={`tab ${panel.active ? "active" : ""} js-tab`.replace(/\s+/g, " ").trim()}
                data-index={panel.index}
                key={panel.index}
              >
                <div className="splide js-products-carousel">
                  <div className="splide__track">
                    <ul className="splide__list">
                      {panel.products.map((product, i) => (
                        <li className="splide__slide" key={`${product.href}-${i}`}>
                          <ProductCard product={product} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
