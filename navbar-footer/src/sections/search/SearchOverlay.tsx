import content from "@/data/content";
import { CloseIcon } from "@/components/icons";

const { popularSearches } = content;

/**
 * Full-screen search overlay, rendered by the header.
 *
 * The <predictive-search> custom element is upgraded by predictive-search.js,
 * which debounces the input, fetches /search/suggest and injects the returned
 * fragment into `#predictive-search`.
 */
export default function SearchOverlay() {
  return (
    <div className="header-search js-header-search">
      <div className="header-search__background-close js-search-background-close" />
      <div className="header-search__content d-flex" data-lenis-prevent>
        <predictive-search>
          <div className="header-search__close text-cta js-search-close">
            <CloseIcon />
          </div>
          <form action="/search">
            <input type="hidden" name="type" value="product" />
            <input
              type="text"
              className="header-search__input h5 js-header-search-input"
              autoComplete="off"
              name="q"
              defaultValue=""
              placeholder="Type to search"
            />
          </form>

          <div className="header-search__popular-searches js-header-popular-searches">
            <div className="header-popular-categories__title text-cta">Popular searches</div>
            <ul className="popular-searches">
              {popularSearches.map((search) => (
                <li className="popular-searches__item" key={search.href}>
                  <a href={search.href}>{search.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div id="predictive-search" tabIndex={-1} />
        </predictive-search>
      </div>
    </div>
  );
}
