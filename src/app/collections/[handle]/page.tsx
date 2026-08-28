import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ProductCard from "@/components/ProductCard";
import content from "@/data/content";
import { collections, products } from "@/lib/catalog";

type Params = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return [...collections.keys()].map((handle) => ({ handle }));
}

function titleFor(handle: string): string {
  return (
    collections.get(handle) ??
    handle.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  return { title: `${titleFor(handle)} | ${content.meta.siteName}` };
}

/**
 * The mirror captured the homepage only, so it carries no per-collection product
 * lists. Every collection therefore shows the full extracted catalogue, with a
 * note making that explicit rather than implying a filtered result.
 */
export default async function CollectionPage({ params }: Params) {
  const { handle } = await params;
  const title = titleFor(handle);

  return (
    <PageShell>
      <div className="container">
        <div className="page-header">
          <h1 className="page-header__title h3">{title}</h1>
          <p className="page-header__note small-text">
            Showing all {products.length} pieces captured from the homepage. Per-collection listings
            were not part of the saved site.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product.handle} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
