import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import ProductCard from "@/components/ProductCard";
import { ThemeImage } from "@/components/Media";
import { WishlistIcon } from "@/components/icons";
import content from "@/data/content";
import { products, productsByHandle } from "@/lib/catalog";

type Params = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ handle: product.handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const product = productsByHandle.get(handle);
  if (!product) return { title: `Not found | ${content.meta.siteName}` };
  return { title: `${product.title} | ${content.meta.siteName}` };
}

export default async function ProductPage({ params }: Params) {
  const { handle } = await params;
  const product = productsByHandle.get(handle);
  if (!product) notFound();

  // The card's primary and hover shots are not part of `gallery`, so prepend them.
  const gallery = [
    product.image?.src,
    product.hoverImage?.src,
    ...product.gallery,
  ].filter((src, i, all): src is string => Boolean(src) && all.indexOf(src) === i);

  const related = products.filter((p) => p.handle !== product.handle).slice(0, 4);

  return (
    <PageShell>
      <div className="container">
        <div className="product-page">
          <div className="product-page__media">
            {gallery.map((src) => (
              <ThemeImage image={{ src, alt: product.title }} sizes="50vw" key={src} />
            ))}
          </div>

          <div className="product-page__details">
            <h1 className="product-page__title h3">{product.title}</h1>
            <div className="product-page__price h6">{product.price}</div>

            <div className="product-page__sizes">
              <div className="text-cta product-page__sizes-label">Select size</div>
              <ul className="product-page__size-list d-flex">
                {product.sizes.map((size) => (
                  <li className={size.soldOut ? "sold-out" : ""} key={size.variantId}>
                    <a
                      href="#"
                      className="text-cta js-add-to-cart"
                      data-featured-image={size.featuredImage ?? undefined}
                      data-variant-id={size.variantId}
                      data-available={String(size.available)}
                      data-price={size.price}
                      data-original-text={size.label}
                      data-adding-text="Adding..."
                    >
                      {size.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="product-page__actions">
              <a href="#" className="second-button text-cta product-page__wishlist">
                <WishlistIcon />
                <span>Save</span>
              </a>
            </div>

            <p className="product-page__note small-text">
              Handmade to order in Ireland. Select a size above to add this piece to your bag.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="product-page__related">
            <h2 className="h6">You may also like</h2>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard product={item} key={item.handle} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
