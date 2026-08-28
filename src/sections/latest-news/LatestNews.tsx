import content from "@/data/content";
import { Rich, ThemeImage } from "@/components/Media";

const { news } = content;

/**
 * Blog carousel. The date spans are left empty on purpose: article-date.js
 * fills them with a relative time ("3 days ago") or a long date once loaded.
 */
export default function LatestNews() {
  return (
    <div className="shopify-section">
      <div className="latest-blog-posts" data-aos="fade-in">
        <div className="container">
          <div className="latest-blog-posts__top">
            <h2 className="latest-blog-posts__heading">{news.heading}</h2>
            <Rich className="latest-blog-posts__description medium-text" html={news.descriptionHtml} />
          </div>

          <div className="latest-blog-posts__articles">
            <div className="splide js-articles-carousel">
              <div className="splide__track">
                <ul className="splide__list">
                  {news.articles.map((article, i) => (
                    <li className="splide__slide" key={`${article.href}-${i}`}>
                      <div className="article-grid-item">
                        <div className="article-grid-item__image">
                          <a href={article.href}>
                            <ThemeImage image={article.image} sizes="20vw" />
                          </a>
                        </div>

                        <div className="article-grid-item__content">
                          <ul className="article-grid-item__tags">
                            {article.tags.map((tag) => (
                              <li className="h6 medium-text" key={tag}>
                                <i>{tag}</i>
                              </li>
                            ))}
                            <li className="article-date very-small-text">
                              <span className="js-time-ago" data-date={article.date ?? undefined} />
                            </li>
                          </ul>
                          <h5 className="article-grid-item__title">
                            <a href={article.href}>{article.title}</a>
                          </h5>
                          <Rich
                            className="article-grid-item__description medium-text"
                            html={article.descriptionHtml}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
