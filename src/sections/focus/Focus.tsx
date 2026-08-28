import content from "@/data/content";
import { Rich, ThemeImage } from "@/components/Media";

const { focus } = content;

export default function Focus() {
  return (
    <div className="shopify-section">
      <div className="focus" data-aos="fade-in">
        <div className="container">
          <a href={focus.href} className="focus__link">
            <div className="focus__media">
              <ThemeImage image={focus.image} sizes="50vw" />
            </div>
            <div className="focus__content">
              <Rich as="h2" className="focus__heading h5" html={focus.headingHtml} />
              <span className="focus__button button text-cta">{focus.buttonLabel}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
