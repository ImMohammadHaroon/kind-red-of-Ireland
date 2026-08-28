import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import StubPage from "@/components/StubPage";
import { Rich, ThemeImage } from "@/components/Media";
import content from "@/data/content";
import { articles } from "@/lib/catalog";

type Params = { params: Promise<{ blog: string; article: string }> };

export function generateStaticParams() {
  return articles.map((article) => {
    const segments = article.href.split("/").filter(Boolean);
    return { blog: segments[1] ?? "news", article: article.handle };
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { article: handle } = await params;
  const article = articles.find((a) => a.handle === handle);
  return {
    title: `${article?.title ?? "Journal"} | ${content.meta.siteName}`,
    description: article?.descriptionHtml.replace(/<[^>]*>/g, "").trim(),
  };
}

/**
 * The mirror kept each article's headline, tag, date, hero image and standfirst
 * from the homepage carousel, but not the body copy, so that is what is shown.
 */
export default async function ArticlePage({ params }: Params) {
  const { blog, article: handle } = await params;
  const article = articles.find((a) => a.handle === handle);

  if (!article) {
    return <StubPage title="Journal" kind="article" links={[{ label: "All stories", href: `/blogs/${blog}` }]} />;
  }

  return (
    <PageShell>
      <article className="article-page">
        <div className="article-page__media">
          <ThemeImage image={article.image} sizes="100vw" eager />
        </div>

        <div className="container">
          <div className="article-page__header">
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
            <h1 className="article-page__title h3">{article.title}</h1>
            <Rich className="article-page__standfirst h6" html={article.descriptionHtml} />
          </div>

          <div className="article-page__body medium-text">
            <p>
              The full text of this story is part of the live site and was not included in the saved
              copy this rebuild was made from.
            </p>
            <p>
              <a href={`/blogs/${blog}`} className="text-cta">
                Read the other stories
              </a>
            </p>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
