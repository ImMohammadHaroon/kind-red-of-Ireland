import content from "@/data/content";
import NewsletterForm from "./NewsletterForm";
import { ThemeImage } from "@/components/Media";

const { footer } = content;

export default function Footer() {
  return (
    <div id="shopify-section-footer" className="shopify-section">
      <footer className="footer" data-aos="fade-in">
        <div className="footer__background-image">
          <ThemeImage image={footer.backgroundImage} className="d-none d-md-block" sizes="100vw" />
        </div>

        <div className="container">
          <div className="footer__d-flex d-flex">
            <div className="footer__container">
              <div className="footer__background-content">
                <div className="footer__top d-flex">
                  {footer.menus.map((menu) => (
                    <div className="footer__menu-block" key={menu.heading}>
                      <h5 className="footer__menu-heading js-toggle-mobile-menu">{menu.heading}</h5>
                      <ul className="footer__menu small-text js-mobile-menu-content">
                        {menu.links.map((link) => (
                          <li key={`${link.href}-${link.label}`}>
                            <a
                              href={link.href}
                              target={link.external ? "_blank" : undefined}
                              rel={link.external ? "noreferrer" : undefined}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="footer__newsletter">
                    <h5 className="footer__newsletter-heading">{footer.newsletter.heading}</h5>
                    <div className="footer__newsletter-description small-text">
                      {footer.newsletter.description}
                    </div>
                    <div className="footer-newsletter__form">
                      <NewsletterForm />
                    </div>
                  </div>
                </div>

                <div className="copyright d-flex small-text">
                  <div className="copyright__text">{footer.copyright}</div>
                  <ul className="copyright__menu">
                    {footer.policyLinks.map((link) => (
                      <li key={link.href}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
