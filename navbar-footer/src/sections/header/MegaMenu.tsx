import content from "@/data/content";
import { ThemeImage } from "@/components/Media";

const { megamenus } = content;

/**
 * Desktop dropdown. header.js opens it by adding `is-open` and sliding the
 * panels horizontally, keying off the `data-index` on each item.
 */
export default function MegaMenu() {
  return (
    <div className="megamenu d-flex js-megamenu">
      {megamenus.map((menu) => (
        <div
          className="megamenu-item js-megamenu-item"
          data-index={menu.index ?? undefined}
          data-block-id={menu.blockId ?? undefined}
          key={menu.index ?? menu.title.label}
        >
          <div className="megamenu-item__bottom-left-link">
            <a href={menu.title.href} className="h3">
              {menu.title.label}
            </a>
          </div>
          <div className="container">
            <div className="megamenu-columns d-flex">
              {menu.columns.map((column) => (
                <div className="megamenu-column" key={column.heading}>
                  <div className="megamenu-column__heading h6">{column.heading}</div>
                  <ul className="megamenu-column__menu medium-text">
                    {column.links.map((link) => (
                      <li key={`${link.href}-${link.label}`}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {menu.banners.map((banner) => (
                <div className="megamenu-column megamenu-column--banner" key={banner.label || banner.href}>
                  <a href={banner.href}>
                    <ThemeImage image={banner.image} sizes="50vw" />
                    <p className="h6">{banner.label}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
