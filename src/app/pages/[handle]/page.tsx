import type { Metadata } from "next";
import StubPage from "@/components/StubPage";
import content from "@/data/content";
import { pages } from "@/lib/catalog";

type Params = { params: Promise<{ handle: string }> };

function titleFor(handle: string): string {
  return (
    pages.get(handle) ?? handle.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  return { title: `${titleFor(handle)} | ${content.meta.siteName}` };
}

export default async function ContentPage({ params }: Params) {
  const { handle } = await params;

  return (
    <StubPage
      title={titleFor(handle)}
      kind="page"
      links={[
        { label: "Shop all", href: "/collections/all" },
        { label: "Read the journal", href: "/blogs/news" },
        { label: "Back to home", href: "/" },
      ]}
    />
  );
}
