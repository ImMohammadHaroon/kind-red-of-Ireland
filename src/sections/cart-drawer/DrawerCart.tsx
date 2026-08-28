import content from "@/data/content";
import ProductCard from "@/components/ProductCard";
import { ThemeImage } from "@/components/Media";
import { CloseIcon } from "@/components/icons";

const { cart } = content;

/**
 * Cart drawer. The <drawer-cart> custom element is upgraded by drawer-cart.js,
 * which fills `.js-cart-items` from the /cart endpoints and toggles
 * `.drawer-cart__content--empty` on `.js-cart-content`.
 */
export default function DrawerCart() {
  return (
    <div id="shopify-section-drawer-cart" className="shopify-section">
      <drawer-cart>
        <div className="drawer-cart js-drawer-cart">
          <div className="drawer-cart__background-close js-close-drawer-cart" />
          <div className="drawer-cart__content drawer-cart__content--empty js-cart-content">
            <div className="cart-upsell js-cart-upsell" data-lenis-prevent>
              <div className="cart-upsell__title h6">{cart.upsell.title}</div>
              <div className="cart-upsell__products js-cart-upsell-products">
                {cart.upsell.products.map((product) => (
                  <ProductCard product={product} key={`${product.href}-${product.title}`} />
                ))}
              </div>
            </div>

            <div className="drawer-cart__empty" data-lenis-prevent>
              <div className="drawer-cart__top">
                <div className="drawer-cart__heading h6">Shopping Cart</div>
                <div className="drawer-cart__heading-close js-close-drawer-cart">
                  <CloseIcon />
                </div>
                <div className="drawer-cart__empty-text-with-button d-flex align-items-center">
                  <div className="drawer-cart__empty-text">{cart.emptyText}</div>
                  <div className="drawer-cart__empty-button">
                    <a href={cart.emptyButton.href} className="button text-cta">
                      {cart.emptyButton.label}
                    </a>
                  </div>
                </div>
              </div>

              <div className="drawer-cart__empty-bottom">
                <div className="drawer-cart__bottom-collections">
                  <div className="splide js-drawer-cart-bottom-collections">
                    <div className="splide__track">
                      <ul className="splide__list">
                        {cart.categories.map((category) => (
                          <li className="splide__slide" key={category.label}>
                            <div className="drawer-cart-category-image">
                              <a href={category.href}>
                                <p>
                                  <ThemeImage image={category.image} sizes="25vw" />
                                </p>
                                <span className="h6">{category.label}</span>
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="drawer-cart__not-empty js-drawer-cart-not-empty" data-lenis-prevent>
              <div className="not-empty-cart__top">
                <div className="drawer-cart__heading h6">Shopping Cart</div>
                <div className="drawer-cart__heading-close js-close-drawer-cart">
                  <CloseIcon />
                </div>
                <ul className="header-cart__items js-cart-items" />
              </div>

              <div className="not-empty-cart__bottom js-drawer-cart-bottom">
                <div className="cart__subtotal d-flex h6">
                  <div className="subtotal__title">Subtotal</div>
                  <div className="subtotal__price js-subtotal-price">Rs.0.00</div>
                </div>
                <div className="cart__add-note-button">
                  <a href="#" className="second-button text-cta js-add-cart-note" data-action="add">
                    + Add order note
                  </a>
                  <a href="#" className="second-button text-cta d-none js-add-cart-note" data-action="edit">
                    + Edit order note
                  </a>
                </div>

                <div className="cart__taxes-info">Shipping and taxes calculated at checkout</div>

                <form method="post" action="/cart" id="cart_form" acceptCharset="UTF-8" className="shopify-cart-form">
                  <button type="submit" name="checkout" className="second-button text-cta">
                    Secure checkout
                  </button>
                </form>
              </div>

              <div className="order-note-modal js-order-note-modal">
                <div className="order-note-modal__content">
                  <div className="order-note-modal__header">
                    <div className="order-note-modal__title h5">Order Note</div>
                    <button className="button text-cta order-note-modal__cancel js-close-order-note" type="button">
                      Cancel
                    </button>
                  </div>
                  <div className="order-note-modal__body">
                    <textarea
                      className="order-note-modal__textarea js-order-note-textarea"
                      placeholder="Type message"
                      data-initial-note=""
                    />
                  </div>
                  <div className="order-note-modal__footer">
                    <button className="second-button text-cta js-confirm-order-note" type="button">
                      Confirm message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </drawer-cart>
    </div>
  );
}
