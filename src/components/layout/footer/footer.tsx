import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Voor Imkers",
      description:
        "Digitaal imkeren voor de moderne bijhouder. Eenvoudig, overzichtelijk, effectief.",
    },
    {
      title: "Platform",
      links: [
        { href: "/vision", label: "Onze Visie" },
        { href: "/platform", label: "Hoe het werkt" },
        { href: "/auth/register", label: "Registreren" },
        { href: "/auth/login", label: "Inloggen" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/about", label: "Over ons" },
        {
          href: "mailto:info@bees-platform.be",
          label: "Contact",
          external: true,
        },
      ],
    },
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          {footerSections.map((section, index) => (
            <div key={index} className="footer-section">
              <h3 className="footer-section-title">{section.title}</h3>

              {section.description && (
                <p className="footer-section-description">
                  {section.description}
                </p>
              )}

              {section.links && (
                <nav
                  className="footer-links"
                  aria-label={`${section.title} links`}
                >
                  {section.links.map((link) =>
                    link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        className="footer-link"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="footer-link"
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </nav>
              )}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {currentYear} Voor Imkers Platform &middot; Alle rechten
            voorbehouden
          </p>
        </div>
      </div>
    </footer>
  );
}
