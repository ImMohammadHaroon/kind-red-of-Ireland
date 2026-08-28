import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="container">
        <div className="page-header">
          <h1 className="page-header__title h3">Page not found</h1>
        </div>

        <div className="stub-page">
          <p className="medium-text">
            We could not find that page. It may not have been part of the saved copy this site was
            rebuilt from.
          </p>
          <ul className="stub-page__links">
            <li>
              <a href="/" className="text-cta">
                Back to home
              </a>
            </li>
            <li>
              <a href="/collections/all" className="text-cta">
                Shop all
              </a>
            </li>
            <li>
              <a href="/search" className="text-cta">
                Search the site
              </a>
            </li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
