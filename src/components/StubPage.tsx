import PageShell from "./PageShell";

/**
 * Used for routes the navigation links to but the saved mirror never captured
 * (editorial pages, policies, account). It states that plainly instead of
 * inventing copy, and keeps the visitor moving.
 */
export default function StubPage({
  title,
  kind,
  links = [],
}: {
  title: string;
  kind: string;
  links?: { label: string; href: string }[];
}) {
  return (
    <PageShell>
      <div className="container">
        <div className="page-header">
          <h1 className="page-header__title h3">{title}</h1>
        </div>

        <div className="stub-page">
          <p className="medium-text">
            This {kind} is part of the live Kindred of Ireland site, but its content was not included
            in the saved copy this rebuild was made from — only the homepage was captured.
          </p>

          {links.length > 0 && (
            <ul className="stub-page__links">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-cta">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageShell>
  );
}
