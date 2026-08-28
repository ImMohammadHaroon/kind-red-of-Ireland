import content from "@/data/content";
import { ThemeImage } from "@/components/Media";

const { instagram } = content;

/** The marquee needs the tile strip repeated to fill its width without gaps. */
const REPEATS = 4;

export default function Instagram() {
  return (
    <div className="shopify-section">
      <div className="instagram" data-aos="fade-in">
        <a href={instagram.href} target="_blank" rel="noreferrer">
          <div className="instagram__center-text-block">
            <h4 className="instagram__heading">{instagram.heading}</h4>
            <div className="instagram__profile-title text-cta">{instagram.profile}</div>
          </div>

          <div className="instagram-media d-flex">
            {Array.from({ length: REPEATS }).flatMap((_, pass) =>
              instagram.images.map((tile) => (
                <div className="instagram-media__item" data-index={tile.index} key={`${pass}-${tile.index}`}>
                  <ThemeImage image={tile.image} sizes="25vw" />
                </div>
              )),
            )}
          </div>
        </a>
      </div>
    </div>
  );
}
