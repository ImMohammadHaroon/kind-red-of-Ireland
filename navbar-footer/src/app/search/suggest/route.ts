import { search } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/catalog";
import type { Article } from "@/lib/types";

/**
 * Stands in for Shopify's /search/suggest section endpoint.
 *
 * predictive-search.js parses the response as HTML, pulls out
 * `#shopify-section-predictive-search` and injects its innerHTML, then wires up
 * the `.js-search-tab` / `.js-search-panel` pairs. The markup below therefore
 * has to match the class names section-predictive-search.scss.css styles.
 */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const results = search(query);
  const escaped = escapeHtml(query);

  const total = results.products.length + results.articles.length + results.pages.length;
  const body = total === 0 ? noResults(escaped) : resultsMarkup(results, escaped);

  return new Response(
    `<div id="shopify-section-predictive-search" class="shopify-section">${body}</div>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  );
}

function resultsMarkup(
  results: ReturnType<typeof search>,
  query: string,
): string {
  const firstActive = results.products.length
    ? "products"
    : results.articles.length
      ? "journal"
      : "pages";

  const tab = (name: string, label: string, count: number) =>
    `<button type="button" class="button search-tab js-search-tab${
      name === firstActive ? " active" : ""
    }" data-tab="${name}"${count === 0 ? " disabled" : ""}>${label} (${count})</button>`;

  const panel = (name: string, inner: string) =>
    `<div class="search-panel js-search-panel" data-tab="${name}"><div>${inner}</div></div>`;

  return `
    <div id="predictive-search-results">
      <div class="search-autocomplete__tabs">
        ${tab("products", "Products", results.products.length)}
        ${tab("journal", "Journal", results.articles.length)}
        ${tab("pages", "Pages", results.pages.length)}
      </div>

      ${panel(
        "products",
        `<div class="search-autocomplete__products">${results.products
          .slice(0, 8)
          .map(productCard)
          .join("")}</div>`,
      )}

      ${panel(
        "journal",
        results.articles.slice(0, 6).map(articleItem).join("") ||
          '<div class="no-results">No journal entries found.</div>',
      )}

      ${panel(
        "pages",
        `<div class="search-autocomplete__pages">${
          results.pages
            .map(
              (page) =>
                `<div class="search-page-item"><div class="search-page-item__title"><a href="${page.href}">${escapeHtml(
                  page.label,
                )}</a></div></div>`,
            )
            .join("") || '<div class="no-results">No pages found.</div>'
        }</div>`,
      )}

      <div class="search-autocomplete__view-all">
        <a href="/search?q=${encodeURIComponent(query)}&type=product" class="second-button text-cta js-search-view-all">View all results</a>
      </div>
    </div>
  `;
}

function productCard(product: CatalogProduct): string {
  const image = product.image;
  return `
    <div class="product-grid-item js-product-grid-item">
      <div class="product-grid-item__image js-product-grid-item-image">
        <a href="${product.href}">
          ${image ? `<img src="${image.src}" alt="${escapeHtml(image.alt)}" loading="lazy" class="fade-in" />` : ""}
        </a>
      </div>
      <div class="product-grid-item__content d-flex">
        <div class="product-grid-item__content-left">
          <h4 class="product-grid-item__title medium-text"><a href="${product.href}">${escapeHtml(
            product.title,
          )}</a></h4>
          <div class="product-grid-item__price small-text">${escapeHtml(product.price)}</div>
        </div>
      </div>
    </div>
  `;
}

function articleItem(article: Article): string {
  return `
    <div class="search-article-item">
      <div class="search-article-item__image">
        <a href="${article.href}">
          ${
            article.image
              ? `<img src="${article.image.src}" alt="${escapeHtml(article.image.alt)}" loading="lazy" class="fade-in" />`
              : ""
          }
        </a>
      </div>
      <div class="search-article-item__details">
        <div class="search-article-item__title h6"><a href="${article.href}">${escapeHtml(article.title)}</a></div>
        <a href="${article.href}" class="button text-cta">Read</a>
      </div>
    </div>
  `;
}

function noResults(query: string): string {
  return `
    <div id="predictive-search-results">
      <div class="no-results">No results for &ldquo;${query}&rdquo;.</div>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
