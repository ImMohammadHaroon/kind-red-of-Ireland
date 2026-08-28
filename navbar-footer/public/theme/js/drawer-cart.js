class Cart extends HTMLElement {
    constructor() {
        super();
        this.handleToggleDrawerCart();
        this.handleQuantityFields();
        this.handleAddToCart();
        this.drawerCartBottomCollectionsCarousel();
        this.initUpsellRelocation();
        this.cartNote();
    }

    handleToggleDrawerCart() {
        document.querySelectorAll('.js-open-drawer-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const drawer = document.querySelector('.js-drawer-cart');
                if (!drawer) return;

                drawer.classList.add('display');
                if (window.lenis) {
                    window.lenis.stop();
                } else {
                    document.body.style.overflow = "hidden";
                }

                setTimeout(() => {
                    drawer.classList.add('active');
                }, 50);
            });
        });

        document.querySelectorAll('.js-close-drawer-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const drawer = document.querySelector('.js-drawer-cart');
                if (!drawer) return;

                drawer.classList.add('closing');

                setTimeout(() => {
                    drawer.classList.remove('active', 'closing', 'display');
                    if (window.lenis) {
                        window.lenis.start();
                    } else {
                        document.body.style.overflow = "visible";
                    }
                }, 300);
            });
        });
    }

    handleQuantityFields() {
        const self = this;
        document.body.addEventListener('click', (event) => {
            const target = event.target.closest('.js-change-quantity');
            if (!target) return;

            event.preventDefault();

            target.classList.add('loading');

            const variantId = parseInt(target.getAttribute('data-variant-id'), 10);
            let quantity = parseInt(target.getAttribute('data-quantity'), 10);
            const container = target.closest('.js-quantity-fields');

            container.querySelector('.js-quantity-minus').setAttribute('data-quantity', quantity - 1);
            container.querySelector('.js-quantity-plus').setAttribute('data-quantity', quantity + 1);

            const cartItem = container.closest('.js-cart-item');
            cartItem.style.height = `${cartItem.offsetHeight}px`;

            var formData = new FormData();
            formData.append("updates[" + variantId + "]", quantity);

            fetch(window.Shopify.routes.root + 'cart/update.js', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(response => {
                    document.querySelectorAll('.js-change-quantity').forEach(el => el.classList.remove('loading'));
                    const subtotalElement = document.querySelector('.js-subtotal-price');
                    if (subtotalElement) {
                        subtotalElement.innerHTML = Shopify.formatMoney(response.total_price);
                    }

                    if (quantity < 1) {
                        cartItem.classList.add('hide-item');
                        setTimeout(() => {
                            cartItem.classList.add('hidden');
                            if (response.total_price === 0) {
                                document.querySelector('.js-cart-content').classList.add('drawer-cart__content--empty');
                            }
                        }, 300);
                    } else {
                        container.querySelector('.js-quantity-field-input').value = quantity;
                    }

                    document.querySelectorAll('.js-cart-counter').forEach(cartCounter => {
                        cartCounter.innerHTML = '(' + response.item_count + ')';
                        cartCounter.setAttribute('data-counter', response.item_count);
                    });

                    self.refreshCartUpsellProducts();
                })
                .catch(error => {
                    alert(error.message || 'Error');
                    document.querySelectorAll('.js-change-quantity').forEach(el => el.classList.remove('loading'));
                });
        });
    }

    handleAddToCart() {
        const self = this;
        document.body.addEventListener("click", function(event) {
            const target = event.target.closest(".js-add-to-cart");
            if (!target) return;

            event.preventDefault();

            const optionColorLabel = target.getAttribute('data-option-color') || '';
            const optionColorValue = target.getAttribute('data-option-color-value') || '';

            const optionColorHTML =
                optionColorLabel && optionColorValue ?
                `<div class="cart-item__option">${optionColorLabel} ${optionColorValue}</div>` :
                '';

            target.getAttribute("data-adding-text") && (target.innerHTML = target.getAttribute("data-adding-text"));
            target.classList.add("loading");

            let id = null;
            let quantity = 1;

            const variantIdAttr = target.getAttribute("data-variant-id");

            if (variantIdAttr) {
                id = parseInt(variantIdAttr, 10);
            } else {
                let productId = target.getAttribute("data-product-id");
                let productElement = document.querySelector(`.js-product[data-product-id='${productId}']`);

                quantity = productElement ?.querySelector(".js-quantity-field") ?.value || 1;
                if (isNaN(quantity) || !quantity) quantity = 1;

                id = productElement ?
                    parseInt(productElement.querySelector(`#product-select-${productId}`) ?.value, 10) :
                    null;
            }

            let image = target.getAttribute("data-featured-image") || response.image;

            let formData = {
                'items': [{
                    'id': parseInt(id, 10),
                    'quantity': parseInt(quantity, 10)
                }]
            };

            fetch(window.Shopify.routes.root + 'cart/add.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(async response => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        const error = new Error(errorData.description || 'Something went wrong');
                        error.status = response.status;
                        throw error;
                    }
                    return response.json();
                })
                .then(response => {
                    response = response.items.find(item => item.id === parseInt(id, 10));
                    let variantId = response.variant_id;
                    let cartItem = document.querySelector(`.js-cart-item[data-variant-id='${variantId}']:not(.hidden)`);

                    if (cartItem) {
                        let quantityField = cartItem.querySelector(".js-quantity-field-input");
                        let quantityMinus = cartItem.querySelector(".js-quantity-minus");
                        let quantityPlus = cartItem.querySelector(".js-quantity-plus");

                        quantityField.value = response.quantity;
                        quantityMinus.setAttribute("data-quantity", response.quantity - 1);
                        quantityPlus.setAttribute("data-quantity", response.quantity + 1);
                    } else {
                        let quantityMinus = response.quantity - 1;
                        let quantityPlus = response.quantity + 1;
                        if (response.image) {
                            const img = new Image();
                            img.src = response.image;
                        }

                        const titleCaseLikeLiquid = (str = "") => {
                            const words = String(str).toLowerCase().split(/\s+/).filter(Boolean);

                            return words
                                .map((w) => {
                                    const firstChar = w.slice(0, 1);
                                    const rest = w.slice(1);

                                    if (firstChar === "'" || firstChar === '"' || firstChar === "(" || firstChar === "[") {
                                        const firstLetter = rest.slice(0, 1).toUpperCase();
                                        const rest2 = rest.slice(1).toLowerCase();
                                        return `${firstChar}${firstLetter}${rest2}`;
                                    }

                                    return w.slice(0, 1).toUpperCase() + w.slice(1).toLowerCase();
                                })
                                .join(" ");
                        };

                        let item = `
          <li class="cart-item d-flex js-cart-item" data-variant-id="${response.variant_id}">
            <div class="cart-item__image">
              <a href="${response.url}">
                <img src="${image}" width="668px" height="768px" alt="${response.product_title}" />
              </a>
            </div>

            <div class="cart-item__details d-flex">
              <div class="cart-item__top d-flex">
                <div class="cart-item__top-left">
                  <div class="cart-item__title h6">
                    <a href="${response.url}">${titleCaseLikeLiquid(response.product_title)}</a>
                  </div>

                  ${(response.options_with_values || [])
                    .filter(option => option.name !== 'Title')
                    .map(option => `<div class="cart-item__option">${option.name}: ${option.value}</div>`)
                    .join('')}

                  ${optionColorHTML}
                </div>

                <div class="cart-item__top-right">
                  <div class="cart-item__price">${Shopify.formatMoney(response.final_price)}</div>
                </div>
              </div>

              <div class="cart-product__quantity-and-delete d-flex align-items-center js-quantity-fields">
                <div class="cart-product__quantity-field">
                  <div class="quantity-field__minus">
                    <a href="#" class="js-change-quantity js-quantity-minus" data-variant-id="${response.variant_id}" data-quantity="${Math.max(0, response.quantity - 1)}">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.66667 5.66602H3.33333C3.14924 5.66602 3 5.81525 3 5.99935C3 6.18344 3.14924 6.33268 3.33333 6.33268H8.66667C8.85076 6.33268 9 6.18344 9 5.99935C9 5.81525 8.85076 5.66602 8.66667 5.66602Z" fill="black"/>
                      </svg>
                    </a>
                  </div>

                  <input type="text" value="${response.quantity}" class="quantity-field__input js-quantity-field-input" disabled="disabled" />

                  <div class="quantity-field__plus">
                    <a href="#" class="js-change-quantity js-quantity-plus" data-variant-id="${response.variant_id}" data-quantity="${response.quantity + 1}">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0001 5.66602H6.33339V1.99935C6.33339 1.81525 6.18415 1.66602 6.00006 1.66602C5.81596 1.66602 5.66672 1.81525 5.66672 1.99935V5.66602H2.00006C1.81596 5.66602 1.66672 5.81525 1.66672 5.99935C1.66339 6.087 1.69817 6.1718 1.76208 6.23187C1.82599 6.29195 1.91278 6.32142 2.00006 6.31268H5.66672V9.99935C5.66672 10.1834 5.81596 10.3327 6.00006 10.3327C6.18415 10.3327 6.33339 10.1834 6.33339 9.99935V6.33268H10.0001C10.1842 6.33268 10.3334 6.18344 10.3334 5.99935C10.3334 5.81525 10.1842 5.66602 10.0001 5.66602Z" fill="black"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <div class="cart-item__delete">
                  <a href="#" class="button text-cta js-change-quantity" data-variant-id="${response.variant_id}" data-quantity="0">Remove</a>
                </div>
              </div>
            </div>
          </li>`;

                        document.querySelector(".js-cart-items").insertAdjacentHTML("beforeend", item);
                        if (typeof initializeObservers === "function") {
                            initializeObservers();
                        }
                    }

                    document
                        .querySelectorAll(".js-product-grid-item-hover")
                        .forEach((hover) => {
                            hover.classList.remove("is-active", "is-open");
                        });

                    return fetch(window.Shopify.routes.root + 'cart.js').then(response => response.json());
                })
                .then(cart => {
                    document.querySelectorAll(".js-change-quantity").forEach(el => el.classList.remove("loading"));
                    const subtotalElement = document.querySelector('.js-subtotal-price');
                    if (subtotalElement) {
                        subtotalElement.innerHTML = Shopify.formatMoney(cart.total_price);
                    }

                    document.querySelector(".js-cart-content") ?.classList.remove("drawer-cart__content--empty");
                    document.querySelectorAll('.js-cart-counter').forEach(cartCounter => {
                        cartCounter.innerHTML = '(' + cart.item_count + ')';
                        cartCounter.setAttribute('data-counter', cart.item_count);
                    });
                    document.querySelector('.js-drawer-cart') ?.classList.add('display');
                    setTimeout(() => {
                        document.querySelector('.js-drawer-cart') ?.classList.add('active');
                    }, 50);
                    if (window.lenis) {
                        window.lenis.stop();
                    } else {
                        document.body.style.overflow = "hidden";
                    }
                    document.querySelectorAll('.js-add-to-cart').forEach(button => {
                        const originalText = button.getAttribute('data-original-text');
                        button.textContent = originalText;
                    });
                    self.refreshCartUpsellProducts();
                })
                .catch(async (error) => {
                    let message = 'Unexpected error';

                    try {
                        const text = await error.text();
                        const json = JSON.parse(text);
                        if (json && json.description) {
                            message = json.description;
                        }
                    } catch (e) {
                        message = error.message || 'Something went wrong';
                    }

                    alert(message);
                    window.location.reload();
                });
        });
    }

    refreshCartUpsellProducts() {
        const host = this;
        const target = host.querySelector('.js-cart-upsell-products');
        if (!target) return;

        target.querySelectorAll('.js-cart-upsell-loader').forEach(el => el.remove());

        const loader = document.createElement('div');
        loader.className = 'js-cart-upsell-loader cart-upsell__loader';
        loader.innerHTML = `
      <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40"
        enable-background="new 0 0 40 40" xml:space="preserve">
        <path opacity="0.35" fill="#000"
          d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
          s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z
          M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
          c0-6.425,5.209-11.634,11.634-11.634
          c6.425,0,11.633,5.209,11.633,11.634
          C31.834,26.541,26.626,31.749,20.201,31.749z"/>
        <path fill="#000"
          d="M26.013,10.047l1.654-2.866
          c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
          C22.32,8.481,24.301,9.057,26.013,10.047z">
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="0.5s"
            repeatCount="indefinite"/>
        </path>
      </svg>
    `;

        target.prepend(loader);

        fetch(window.Shopify.routes.root + 'cart', {
                credentials: 'same-origin'
            })
            .then(res => res.text())
            .then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const fresh = doc.querySelector('.js-cart-upsell-products');

                if (fresh) {
                    target.innerHTML = fresh.innerHTML;
                    if (typeof initializeObservers === 'function') initializeObservers();
                }
            })
            .catch(err => {
                console.error('[Cart Upsell] refresh error:', err);
            })
            .finally(() => {
                target.querySelectorAll('.js-cart-upsell-loader').forEach(el => el.remove());
            });
    }

    drawerCartBottomCollectionsCarousel() {
        const carousels = this.querySelectorAll('.js-drawer-cart-bottom-collections');
        if (!carousels.length) return;

        carousels.forEach((element, index) => {
            if (element.__splideInstance) return;

            const uniqueClass = `js-drawer-cart-bottom-collections-${String(index + 1).padStart(2, '0')}`;
            element.classList.add(uniqueClass);

            const splide = new Splide(element, {
                type: 'slide',
                drag: 'free',
                gap: '16px',
                perPage: 3,
                perMove: 1,
                rewind: false,
                arrows: false,
                pagination: false,
                trimSpace: true,
                focus: 0,
                breakpoints: {
                    767: {
                        perPage: 2,
                        gap: '16px'
                    },
                    992: {
                        perPage: 3,
                        gap: '16px'
                    }
                }
            });

            splide.mount();
            element.__splideInstance = splide;
        });
    }

    initUpsellRelocation() {
        const upsell = this.querySelector('.js-cart-upsell');
        if (!upsell) return;

        const origParent = upsell.parentNode;
        const origNext = upsell.nextSibling;

        const mq = window.matchMedia('(max-width: 991px)');

        const apply = () => {
            if (mq.matches) {
                const notEmpty = this.querySelector('.js-drawer-cart-not-empty');
                const bottom = notEmpty ?.querySelector('.js-drawer-cart-bottom');
                if (!notEmpty || !bottom) return;

                if (upsell.parentNode !== notEmpty || upsell.nextSibling !== bottom) {
                    notEmpty.insertBefore(upsell, bottom);
                }
            } else {
                if (origNext && origNext.parentNode === origParent) {
                    origParent.insertBefore(upsell, origNext);
                } else {
                    origParent.appendChild(upsell);
                }
            }
        };

        apply();
        if (mq.addEventListener) mq.addEventListener('change', apply);
        else mq.addListener(apply);
    }

    cartNote() {
        const modal = document.querySelector('.js-order-note-modal');
        if (!modal) return;

        const textarea = modal.querySelector('.js-order-note-textarea');
        const closeButtons = modal.querySelectorAll('.js-close-order-note');
        const confirmButton = modal.querySelector('.js-confirm-order-note');

        const openButtons = document.querySelectorAll('.js-add-cart-note');

        let isAnimating = false;

        const getInitialNote = () => textarea.getAttribute('data-initial-note') || '';

        const setInitialNote = (value) => {
            textarea.setAttribute('data-initial-note', value || '');
        };

        const toggleAddEditButtons = (noteValue) => {
            const hasNote = !!(noteValue && noteValue.trim().length);

            const addBtn = document.querySelector('.js-add-cart-note[data-action="add"]');
            const editBtn = document.querySelector('.js-add-cart-note[data-action="edit"]');

            if (addBtn && editBtn) {
                addBtn.classList.toggle('d-none', hasNote);
                editBtn.classList.toggle('d-none', !hasNote);
                return;
            }

            const buttons = [...openButtons];
            if (buttons.length >= 2) {
                buttons[0].classList.toggle('d-none', hasNote);
                buttons[1].classList.toggle('d-none', !hasNote);
            }
        };

        const openModal = () => {
            if (isAnimating) return;
            isAnimating = true;

            textarea.value = getInitialNote();

            modal.classList.remove('closing');
            modal.classList.add('display');

            setTimeout(() => {
                modal.classList.add('active');
                isAnimating = false;
                textarea.focus();
            }, 50);
        };

        const closeModal = () => {
            if (isAnimating) return;
            isAnimating = true;

            modal.classList.add('closing');

            setTimeout(() => {
                modal.classList.remove('active', 'closing', 'display');
                isAnimating = false;
            }, 300);
        };

        openButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });

        closeButtons.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        }));

        confirmButton ?.addEventListener('click', (e) => {
            e.preventDefault();
            if (isAnimating) return;

            const newNote = textarea.value || '';

            fetch('/cart/update.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        note: newNote
                    })
                })
                .then(() => {
                    setInitialNote(newNote);

                    toggleAddEditButtons(newNote);

                    document.querySelectorAll('.js-cart-note-value').forEach(el => (el.textContent = newNote));

                    closeModal();
                })
                .catch(console.error);
        });
    }
}

customElements.define('drawer-cart', Cart);