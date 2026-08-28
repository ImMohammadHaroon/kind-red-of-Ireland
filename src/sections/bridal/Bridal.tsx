import content from "@/data/content";
import { Rich, ThemeImage } from "@/components/Media";

const { bridal } = content;

export default function Bridal() {
  return (
    <div className="shopify-section">
      <div className="bridal" data-aos="fade-in">
        <a href={bridal.href} className="bridal__link">
          <div className="bridal__media d-flex">
            {bridal.images.map((image, i) => (
              <div className="bridal-media__item" key={i}>
                <p>
                  <ThemeImage image={image} sizes="50vw" />
                </p>
              </div>
            ))}
          </div>

          <div className="container">
            <div className="bridal-text-block d-flex">
              <Rich as="h2" className="bridal-text-block__heading" html={bridal.headingHtml} />
              <div className="bridal-text-block__content">
                <Rich className="bridal-text-block__description h6" html={bridal.descriptionHtml} />
                <span className="bridal-text-block__button button text-cta">{bridal.buttonLabel}</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
