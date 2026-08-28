import content from "@/data/content";
import type { Article, Link, Product, ProductSize } from "@/lib/types";

export type CatalogProduct = Product & { handle: string };

export type Variant = {
  variantId: string;
  size: ProductSize;
  product: CatalogProduct;
};

function handleOf(href: string): string {
  const parts = href.split("?")[0].split("/").filter(Boolean);
  return parts[parts.length - 1] ?? href;
}

/** Every distinct product on the page: the four tab panels plus the cart upsell. */
export const products: CatalogProduct[] = (() => {
  const byHandle = new Map<string, CatalogProduct>();

  const sources: Product[] = [
    ...content.productTabs.panels.flatMap((panel) => panel.products),
    ...content.cart.upsell.products,
  ];

  for (const product of sources) {
    const handle = handleOf(product.href);
    if (!byHandle.has(handle)) byHandle.set(handle, { ...product, handle });
  }

  return [...byHandle.values()];
})();

export const productsByHandle = new Map(products.map((p) => [p.handle, p]));

/** Variant lookup used by the cart endpoints. */
export const variants = new Map<string, Variant>(
  products.flatMap((product) =>
    product.sizes.map((size) => [size.variantId, { variantId: size.variantId, size, product }] as const),
  ),
);

export const articles: (Article & { handle: string })[] = content.news.articles.map((article) => ({
  ...article,
  handle: handleOf(article.href),
}));

/**
 * Collections are only known by the links the navigation exposes; the mirror
 * has no per-collection product lists, so a collection page shows the full
 * catalogue under the collection's own title.
 */
export const collections: Map<string, string> = (() => {
  const map = new Map<string, string>();

  const consider = (link: Link) => {
    if (!link.href.startsWith("/collections/")) return;
    const handle = handleOf(link.href);
    if (!map.has(handle)) map.set(handle, link.label);
  };

  content.headerMenu.forEach(consider);
  content.megamenus.forEach((menu) => {
    consider(menu.title);
    menu.columns.forEach((column) => column.links.forEach(consider));
    menu.banners.forEach((banner) => consider({ label: banner.label, href: banner.href }));
  });
  content.footer.menus.forEach((menu) => menu.links.forEach(consider));
  content.cart.categories.forEach((category) => consider({ label: category.label, href: category.href }));
  consider(content.cart.emptyButton);

  return map;
})();

/** Content pages referenced by the navigation, used by search suggestions. */
export const pages: Map<string, string> = (() => {
  const map = new Map<string, string>();

  const consider = (link: Link) => {
    if (!link.href.startsWith("/pages/")) return;
    const handle = handleOf(link.href);
    if (!map.has(handle)) map.set(handle, link.label);
  };

  content.headerMenu.forEach(consider);
  content.megamenus.forEach((menu) => {
    consider(menu.title);
    menu.columns.forEach((column) => column.links.forEach(consider));
    menu.banners.forEach((banner) => consider({ label: banner.label, href: banner.href }));
  });
  content.footer.menus.forEach((menu) => menu.links.forEach(consider));

  return map;
})();

/** Case-insensitive substring match across titles, used by both search routes. */
export function search(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { products: [], articles: [], pages: [] };

  const matches = (value: string) => value.toLowerCase().includes(q);

  return {
    products: products.filter((p) => matches(p.title)),
    articles: articles.filter((a) => matches(a.title) || matches(a.tags.join(" "))),
    pages: [...pages.entries()]
      .filter(([, label]) => matches(label))
      .map(([handle, label]) => ({ handle, label, href: `/pages/${handle}` })),
  };
}
