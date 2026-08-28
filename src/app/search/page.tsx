import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ProductCard from "@/components/ProductCard";
import { Rich, ThemeImage } from "@/components/Media";
import content from "@/data/content";
import { search } from "@/lib/catalog";

export const metadata: Metadata = { title: `Search | ${content.meta.siteName}` };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = search(q);
  const total = results.products.length + results.articles.length + results.pages.length;

  return (
    <PageShell>
      <div className="container">
        <div className="page-header">
          <h1 className="page-header__title h3">Search</h1>
          <form className="search-page__form" action="/search" method="get">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Type to search"
              className="search-page__input h5"
              autoComplete="off"
            />
            <button type="submit" className="second-button text-cta">
              Search
            </button>
          </form>
        </div>

        {!q ? (
          <div className="search-page__prompt">
            <div className="header-popular-categories__title text-cta">Popular searches</div>
            <ul className="popular-searches">
              {content.popularSearches.map((item) => (
                <li className="popular-searches__item" key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <p className="search-page__count small-text">
              {total} result{total === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
            </p>

            {results.products.length > 0 && (
              <section className="search-page__group">
                <h2 className="h6">Products</h2>
                <div className="product-grid">
                  {results.products.map((product) => (
                    <ProductCard product={product} key={product.handle} />
                  ))}
                </div>
              </section>
            )}

            {results.articles.length > 0 && (
              <section className="search-page__group">
                <h2 className="h6">Journal</h2>
                <div className="article-grid">
                  {results.articles.map((article) => (
                    <div className="article-grid-item" key={article.handle}>
                      <div className="article-grid-item__image">
                        <a href={article.href}>
                          <ThemeImage image={article.image} sizes="25vw" />
                        </a>
                      </div>
                      <div className="article-grid-item__content">
                        <h5 className="article-grid-item__title">
                          <a href={article.href}>{article.title}</a>
                        </h5>
                        <Rich
                          className="article-grid-item__description medium-text"
                          html={article.descriptionHtml}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {results.pages.length > 0 && (
              <section className="search-page__group">
                <h2 className="h6">Pages</h2>
                <div className="search-autocomplete__pages">
                  {results.pages.map((page) => (
                    <div className="search-page-item" key={page.handle}>
                      <div className="search-page-item__title">
                        <a href={page.href}>{page.label}</a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {total === 0 && <div className="no-results">Nothing matched that search.</div>}
          </>
        )}
      </div>
    </PageShell>
  );
}
