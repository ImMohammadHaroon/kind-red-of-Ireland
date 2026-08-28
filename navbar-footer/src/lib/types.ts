/** Shapes of the content extracted from the mirror by scripts/extract-content.mjs. */

export type Img = { src: string; alt: string };

export type Link = { label: string; href: string };

export type NavLink = Link & {
  index: string | null;
  hasMegamenu: boolean;
};

export type Announcement = { id: string | null; html: string };

export type Country = { code: string; label: string };

export type MegaMenuColumn = { heading: string; links: Link[] };

export type MegaMenuBanner = { href: string; label: string; image: Img | null };

export type MegaMenu = {
  index: string | null;
  blockId: string | null;
  title: Link;
  columns: MegaMenuColumn[];
  banners: MegaMenuBanner[];
};

export type ProductSize = {
  label: string;
  variantId: string;
  price: number;
  available: boolean;
  soldOut: boolean;
  featuredImage: string | null;
};

export type Product = {
  href: string;
  title: string;
  price: string;
  image: Img | null;
  hoverImage: Img | null;
  gallery: string[];
  sizes: ProductSize[];
};

export type Video = {
  src: string;
  poster: string | null;
  width: number;
  height: number;
};

export type CraftsmanshipItem = {
  background: string | null;
  media: { image: Img | null; objectPosition: string | null; video: Video | null };
  headingHtml: string;
  contentMedia: { image: Img | null; video: Video | null };
  descriptionHtml: string;
  button: Link | null;
};

export type Article = {
  href: string;
  title: string;
  image: Img | null;
  tags: string[];
  date: string | null;
  descriptionHtml: string;
};

export type Content = {
  meta: {
    title: string;
    description: string;
    siteName: string;
    favicon: string;
    moneyFormat: string;
  };
  announcements: Announcement[];
  localization: { label: string; countries: Country[] };
  headerMenu: NavLink[];
  megamenus: MegaMenu[];
  mobileMenu: { primary: NavLink[]; secondary: NavLink[] };
  popularSearches: Link[];
  cart: {
    upsell: { title: string; products: Product[] };
    emptyText: string;
    emptyButton: Link;
    categories: { href: string; label: string; image: Img | null }[];
  };
  hero: {
    image: Img | null;
    video: Video | null;
    contentClass: string;
    headingHtml: string;
    descriptionHtml: string;
    buttons: Link[];
  };
  mission: { headingHtml: string };
  productTabs: {
    tabs: { index: string; label: string; active: boolean }[];
    panels: { index: string; active: boolean; products: Product[] }[];
  };
  craftsmanshipTop: CraftsmanshipItem[];
  craftsmanshipBottom: CraftsmanshipItem[];
  menswear: {
    desktopImage: Img | null;
    mobileImage: Img | null;
    topHeadingHtml: string;
    bottomHeadingHtml: string;
    button: Link | null;
    buttonAlignment: "left" | "right";
    products: { href: string; image: Img | null }[];
  };
  bridal: {
    href: string;
    images: Img[];
    headingHtml: string;
    descriptionHtml: string;
    buttonLabel: string;
  };
  focus: { href: string; image: Img | null; headingHtml: string; buttonLabel: string };
  news: { heading: string; descriptionHtml: string; articles: Article[] };
  instagram: {
    href: string;
    heading: string;
    profile: string;
    images: { index: string; image: Img }[];
  };
  footer: {
    backgroundImage: Img | null;
    menus: { heading: string; links: (Link & { external: boolean })[] }[];
    newsletter: { heading: string; description: string };
    copyright: string;
    policyLinks: Link[];
  };
};
