import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ProductCard from "@/components/ProductCard";
import { ThemeImage } from "@/components/Media";
import content from "@/data/content";
import { buildPayload, readCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: `Shopping Cart | ${content.meta.siteName}` };

/**
 * drawer-cart.js re-fetches this page and lifts `.js-cart-upsell-products` out
 * of it to refresh the drawer's suggestions, so that block must stay present.
 */
export default async function CartPage() {
  const cart = buildPayload(await readCart());

  return (
    <PageShell>
      <div className="container">
        <div className="page-header">
          <h1 className="page-header__title h3">Shopping Cart</h1>
        </div>

        {cart.items.length === 0 ? (
          <p className="page-empty medium-text">
            {content.cart.emptyText}{" "}
            <a href={content.cart.emptyButton.href} className="text-cta">
              {content.cart.emptyButton.label}
            </a>
          </p>
        ) : (
          <div className="cart-page">
            <ul className="cart-page__items">
              {cart.items.map((item) => (
                <li className="cart-page__item d-flex" key={item.key}>
                  <div className="cart-page__item-image">
                    <a href={item.url}>
                      <ThemeImage image={item.image ? { src: item.image, alt: item.product_title } : null} />
                    </a>
                  </div>
                  <div className="cart-page__item-details">
                    <h2 className="h6">
                      <a href={item.url}>{item.product_title}</a>
                    </h2>
                    <div className="small-text">{item.variant_title}</div>
                    <div className="small-text">Quantity: {item.quantity}</div>
                  </div>
                  <div className="cart-page__item-price h6">{formatMoney(item.final_line_price)}</div>
                </li>
              ))}
            </ul>

            <div className="cart-page__summary">
              <div className="cart__subtotal d-flex h6">
                <div className="subtotal__title">Subtotal</div>
                <div className="subtotal__price">{formatMoney(cart.total_price)}</div>
              </div>
              <div className="cart__taxes-info">Shipping and taxes calculated at checkout</div>
              <a href="/checkout" className="second-button text-cta">
                Secure checkout
              </a>
            </div>
          </div>
        )}

        <div className="cart-upsell-block">
          <div className="cart-upsell__title h6">{content.cart.upsell.title}</div>
          <div className="cart-upsell__products js-cart-upsell-products">
            {content.cart.upsell.products.map((product) => (
              <ProductCard product={product} key={`${product.href}-${product.title}`} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
