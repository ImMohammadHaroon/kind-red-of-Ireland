import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { Rich, ThemeImage } from "@/components/Media";
import content from "@/data/content";
import { articles } from "@/lib/catalog";

type Params = { params: Promise<{ blog: string }> };

const BLOG_TITLES: Record<string, string> = {
  news: "Stories",
  "kindred-spirits": "Kindred Spirits",
};

function titleFor(blog: string): string {
  return BLOG_TITLES[blog] ?? blog.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function generateStaticParams() {
  return Object.keys(BLOG_TITLES).map((blog) => ({ blog }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { blog } = await params;
  return { title: `${titleFor(blog)} | ${content.meta.siteName}` };
}

export default async function BlogPage({ params }: Params) {
  const { blog } = await params;

  return (
    <PageShell>
      <div className="container">
        <div className="page-header">
          <h1 className="page-header__title h3">{titleFor(blog)}</h1>
          <Rich className="page-header__note medium-text" html={content.news.descriptionHtml} />
        </div>

        <div className="article-grid">
          {articles.map((article) => (
            <div className="article-grid-item" key={article.handle}>
              <div className="article-grid-item__image">
                <a href={article.href}>
                  <ThemeImage image={article.image} sizes="25vw" />
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
                <h2 className="article-grid-item__title h5">
                  <a href={article.href}>{article.title}</a>
                </h2>
                <Rich
                  className="article-grid-item__description medium-text"
                  html={article.descriptionHtml}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
