import content from "@/data/content";
import { Logo } from "@/components/icons";
import SearchOverlay from "@/sections/search/SearchOverlay";
import AnnouncementBar from "./AnnouncementBar";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";

const { headerMenu } = content;

export default function Header() {
  return (
    <div id="shopify-section-header" className="shopify-section">
      <div className="top top--no-mobile-sticky-header js-top">
        <AnnouncementBar />

        <header className="header">
          <div className="header__background js-header-background" />
          <div className="container">
            <div className="header__d-flex d-flex align-items-center">
              <ul className="header__menu d-flex align-items-center">
                {headerMenu.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <a
                      href={link.href}
                      className={`text-cta ${link.hasMegamenu ? "js-open-megamenu" : ""}`.trim()}
                      data-index={link.index ?? undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="header__logo">
                <a href="/">
                  <Logo />
                </a>
              </div>

              <ul className="header__right d-flex align-items-center">
                <li>
                  <a href="#" className="text-cta js-open-search">
                    Search
                  </a>
                </li>
                <li>
                  <a href="/apps/wishlist" className="text-cta">
                    Saved (<span className="js-wishlist-counter">0</span>)
                  </a>
                </li>
                <li className="header__account">
                  <a href="/account/login" className="text-cta">
                    Account
                  </a>
                </li>
                <li className="header__cart">
                  <a href="/cart" className="text-cta js-open-drawer-cart">
                    Bag{" "}
                    <span className="js-cart-counter" data-counter="0">
                      (0)
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <MegaMenu />
        </header>
      </div>

      <MobileMenu />

      <ul className="mobile-bar">
        <li>
          <a href="#" className="text-cta js-open-search">
            Search
          </a>
        </li>
        <li>
          <a href="#" className="text-cta js-toggle-menu">
            Menu
          </a>
        </li>
        <li>
          <a href="/cart" className="text-cta js-open-drawer-cart">
            Bag{" "}
            <span className="js-cart-counter" data-counter="0">
              (0)
            </span>
          </a>
        </li>
      </ul>

      <SearchOverlay />
    </div>
  );
}
