import type { Metadata } from "next";
import StubPage from "@/components/StubPage";
import content from "@/data/content";

type Params = { params: Promise<{ handle: string }> };

function titleFor(handle: string): string {
  return handle.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  return { title: `${titleFor(handle)} | ${content.meta.siteName}` };
}

export default async function PolicyPage({ params }: Params) {
  const { handle } = await params;

  return (
    <StubPage
      title={titleFor(handle)}
      kind="policy"
      links={[{ label: "Contact us", href: "/pages/contact" }, { label: "Back to home", href: "/" }]}
    />
  );
}
