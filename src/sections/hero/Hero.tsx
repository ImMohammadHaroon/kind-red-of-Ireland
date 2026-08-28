import content from "@/data/content";
import { Rich, ThemeImage, ThemeVideo } from "@/components/Media";
import HeroHeaderScheme from "./HeroHeaderScheme";

const { hero } = content;

export default function Hero() {
  return (
    <div className="shopify-section">
      <div className="hero" data-aos="fade-in">
        <div className="hero__media">
          <ThemeImage image={hero.image} className="d-none d-md-block" sizes="100vw" eager />
          <ThemeVideo video={hero.video} className="d-md-none" />
        </div>

        <div className={hero.contentClass}>
          <Rich as="h1" className="hero__heading" html={hero.headingHtml} />
          <Rich className="hero__description" html={hero.descriptionHtml} />

          <div className="hero__buttons">
            {hero.buttons.map((button) => (
              <a href={button.href} className="button text-cta" key={button.href}>
                {button.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <HeroHeaderScheme />
    </div>
  );
}
