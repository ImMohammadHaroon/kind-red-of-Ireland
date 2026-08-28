import content from "@/data/content";
import { ArrowIcon } from "@/components/icons";

const { localization, megamenus, mobileMenu } = content;

/**
 * Two-step drawer menu for small screens, driven by mobile-menu.js: the first
 * step lists the top level, the second slides in the matching megamenu by
 * `data-index`. Index 100 is reserved for the country switcher.
 */
export default function MobileMenu() {
  return (
    <div className="mobile-menu">
      <div className="mobile-menu__d-flex d-flex" data-lenis-prevent>
        <div className="mobile-menu__first-step js-mobile-menu-first-step">
          <ul className="mobile-menu__linklist">
            {mobileMenu.primary.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a
                  href={link.href}
                  className={`h3 ${link.hasMegamenu ? "js-open-mobile-megamenu" : ""}`.trim()}
                  data-index={link.index ?? undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="mobile-menu__bottom-linklist">
            {mobileMenu.secondary.map((link, i) => (
              <li key={`${link.href}-${i}`}>
                <a
                  href={link.href}
                  className={`text-cta ${link.hasMegamenu ? "js-open-mobile-megamenu" : ""}`.trim()}
                  data-index={link.index ?? undefined}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="mobile-menu__second-step js-mobile-menu-second-step">
          {megamenus.map((menu) => (
            <div
              className="mobile-megamenu-item js-mobile-megamenu-item"
              data-index={menu.index ?? undefined}
              key={menu.index ?? menu.title.label}
            >
              <div className="mobile-megamenu-item__top-left-link">
                <a href={menu.title.href} className="h6 js-close-mobile-megamenu">
                  <ArrowIcon />
                  {menu.title.label}
                </a>
              </div>
              <div className="mobile-megamenu-columns d-flex">
                {menu.columns.map((column) => (
                  <div className="mobile-megamenu-column" key={column.heading}>
                    <div className="mobile-megamenu-column__heading h4">{column.heading}</div>
                    <ul className="mobile-megamenu-column__menu medium-text">
                      {column.links.map((link) => (
                        <li key={`${link.href}-${link.label}`}>
                          <a href={link.href}>{link.label}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Country switcher, opened from the "Country: ..." row above. */}
          <div className="mobile-megamenu-item js-mobile-megamenu-item" data-index="100">
            <div className="mobile-megamenu-item__top-left-link">
              <a href="#" className="h6 js-close-mobile-megamenu">
                <ArrowIcon />
                {" Menu"}
              </a>
            </div>
            <localization-form>
              <form method="post" action="/localization" acceptCharset="UTF-8" className="shopify-localization-form">
                <div className="discloure">
                  <button
                    type="button"
                    className="d-none disclosure__button text-cta"
                    aria-expanded="false"
                    aria-controls="MobileCountryList"
                  >
                    {localization.label}
                  </button>
                  <div className="disclosure__animation">
                    <ul id="MobileCountryList" role="list" className="disclosure__list" data-lenis-prevent>
                      {localization.countries.map((country) => (
                        <li className="disclosure__item" tabIndex={-1} key={country.code}>
                          <a href="#" data-value={country.code} className="text-cta">
                            {country.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <input type="hidden" name="country_code" value="PK" />
                </div>
              </form>
            </localization-form>
          </div>
        </div>
      </div>
      <div className="mobile-menu__close text-cta js-close-mobile-menu">Close</div>
    </div>
  );
}
