import content from "@/data/content";
import { Rich } from "@/components/Media";

export default function Mission() {
  return (
    <div className="shopify-section">
      <div className="mission" data-aos="fade-in">
        <div className="container">
          <Rich as="h2" className="mission__content" html={content.mission.headingHtml} />
        </div>
      </div>
    </div>
  );
}
