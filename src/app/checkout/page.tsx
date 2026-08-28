import type { Metadata } from "next";
import CheckoutForm from "@/sections/checkout/CheckoutForm";
import { Logo } from "@/components/icons";
import content from "@/data/content";
import { buildPayload, readCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: `Checkout | ${content.meta.siteName}` };

/**
 * Checkout deliberately drops the site chrome — no megamenu, no cart drawer, no
 * marketing footer — because Shopify's hosted checkout does the same: a logo,
 * the step breadcrumb, the form, and the order summary, with only policy links
 * underneath. Keeping the storefront header here would invite shoppers back out
 * of the funnel mid-purchase.
 */
export default async function CheckoutPage() {
  const cart = buildPayload(await readCart());
  const empty = cart.items.length === 0;

  // The localization labels carry a currency suffix, e.g. "Ireland (EUR €)",
  // which belongs in the currency switcher rather than an address field.
  const countries = content.localization.countries.map((country) => ({
    code: country.code,
    label: country.label.replace(/\s*\([^)]*\)\s*$/, ""),
  }));
  const defaultCountry =
    countries.find((c) => content.localization.label.includes(c.label))?.code ?? "IE";

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="checkout-header__inner">
          <a href="/" className="checkout-header__logo" aria-label={content.meta.siteName}>
            <Logo />
          </a>
          <nav className="checkout-steps very-small-text" aria-label="Checkout progress">
            <a href="/cart">Cart</a>
            <span aria-hidden="true">/</span>
            <span aria-current="step">Information</span>
            <span aria-hidden="true">/</span>
            <span className="checkout-steps__pending">Shipping</span>
            <span aria-hidden="true">/</span>
            <span className="checkout-steps__pending">Payment</span>
          </nav>
        </div>
      </header>

      <main className="checkout-main">
        {empty ? (
          <div className="checkout-empty">
            <h1 className="h3">Your cart is empty</h1>
            <p className="medium-text">There is nothing to check out yet.</p>
            <a href="/collections/all" className="second-button text-cta">
              Continue shopping
            </a>
          </div>
        ) : (
          <div className="checkout-grid">
            <div className="checkout-grid__form">
              <h1 className="checkout-title h3">Checkout</h1>
              <CheckoutForm countries={countries} defaultCountry={defaultCountry} />
            </div>

            <aside className="checkout-summary" aria-label="Order summary">
              <h2 className="checkout-summary__title h6">Order summary</h2>

              <ul className="checkout-summary__items">
                {cart.items.map((item) => (
                  <li className="checkout-summary__item" key={item.key}>
                    <div className="checkout-summary__thumb">
                      {item.image && <img src={item.image} alt="" loading="lazy" />}
                      <span className="checkout-summary__qty very-small-text">{item.quantity}</span>
                    </div>
                    <div className="checkout-summary__details">
                      <a href={item.url} className="checkout-summary__name medium-text">
                        {item.product_title}
                      </a>
                      <span className="checkout-summary__variant very-small-text">
                        {item.variant_title}
                      </span>
                    </div>
                    <div className="checkout-summary__price medium-text">
                      {formatMoney(item.final_line_price)}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="checkout-summary__totals">
                <div className="checkout-summary__row medium-text">
                  <span>Subtotal</span>
                  <span>{formatMoney(cart.total_price)}</span>
                </div>
                <div className="checkout-summary__row medium-text">
                  <span>Shipping</span>
                  <span className="checkout-summary__muted">Calculated at checkout</span>
                </div>
                <div className="checkout-summary__row checkout-summary__row--total h6">
                  <span>Total</span>
                  <span>{formatMoney(cart.total_price)}</span>
                </div>
                <p className="checkout-summary__note very-small-text">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>

      <footer className="checkout-footer">
        <ul className="checkout-footer__links very-small-text">
          {content.footer.policyLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <p className="checkout-footer__copy very-small-text">{content.footer.copyright}</p>
      </footer>
    </div>
  );
}
