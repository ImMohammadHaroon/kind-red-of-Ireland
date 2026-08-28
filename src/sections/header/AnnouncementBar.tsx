import content from "@/data/content";
import { Rich } from "@/components/Media";

const { announcements, localization } = content;

/**
 * The rotating strip above the header, plus the country/currency switcher.
 * Driven by announcement.js (Splide carousel) and localization.js.
 */
export default function AnnouncementBar() {
  return (
    <div className="header__announcement">
      <div className="announcement__background" style={{ background: "#33301f" }} />
      <div className="container">
        <div className="splide js-announcement-carousel">
          <div className="splide__track">
            <ul className="splide__list">
              {announcements.map((item, i) => (
                <li className="splide__slide" key={item.id ?? i} data-block-id={item.id ?? undefined}>
                  <Rich className="slide-item" html={item.html} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <localization-form>
        <form
          method="post"
          action="/localization"
          id="localization_form"
          acceptCharset="UTF-8"
          className="shopify-localization-form"
        >
          <div className="disclosure">
            <button
              type="button"
              className="disclosure__button text-cta"
              aria-expanded="false"
              aria-controls="CountryList"
            >
              {localization.label}
            </button>
            <div className="disclosure__animation">
              <ul id="CountryList" role="list" className="disclosure__list" hidden data-lenis-prevent>
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
  );
}
