import type { Product } from "@/lib/types";
import { ThemeImage } from "./Media";
import { ArrowIcon, PlusIcon, WishlistIcon } from "./icons";

/**
 * The `.product-grid-item` card. Class names and data attributes are kept
 * exactly as the theme emitted them: product-grid-item.js drives the gallery
 * arrows and hover panel, and drawer-cart.js listens for `.js-add-to-cart`.
 */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-grid-item js-product-grid-item">
      <div className="product-grid-item__image js-product-grid-item-image">
        <a href={product.href} data-images={product.gallery.join(",")}>
          <p className="product-grid-item__previous js-previous-product-image">
            <ArrowIcon />
          </p>
          <p className="product-grid-item__next js-next-product-image">
            <ArrowIcon />
          </p>

          <ThemeImage image={product.image} sizes="25vw" />
          <ThemeImage image={product.hoverImage} className="hover" sizes="25vw" />
        </a>

        <div className="product-grid-item__hover js-product-grid-item-hover">
          <div className="product-grid-item__add-to-cart">
            <p className="text-cta d-none d-lg-block">Add to bag +</p>
            <p className="text-cta d-lg-none">Select size</p>
          </div>
          <div className="product-grid-item__sizes js-product-grid-item-sizes">
            <ul className="sizes__list d-flex">
              {product.sizes.map((size) => (
                <li className={size.soldOut ? "sold-out" : ""} key={size.variantId}>
                  <a
                    href="#"
                    className="text-cta js-add-to-cart"
                    data-featured-image={size.featuredImage ?? undefined}
                    data-variant-id={size.variantId}
                    data-available={String(size.available)}
                    data-price={size.price}
                    data-original-text={size.label}
                    data-adding-text="Adding..."
                  >
                    {size.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="product-grid-item__content d-flex">
        <div className="product-grid-item__content-left">
          <h4 className="product-grid-item__title medium-text">
            <a href={product.href}>{product.title}</a>
          </h4>
          <div className="product-grid-item__price small-text">{product.price}</div>
        </div>
        <div className="product-grid-item__content-right">
          <div className="product-grid-item__wishlist">
            <a href="#">
              <WishlistIcon />
            </a>
          </div>
          <div className="product-grid-item__mobile-add-to-cart">
            <a href="#" className="js-open-mobile-add-to-cart">
              <PlusIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
