import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div>
            <h3 className="footer__section-title">Voor Imkers</h3>
            <p className="footer__description">
              Digitaal imkeren voor de moderne bijhouder. Eenvoudig,
              overzichtelijk, effectief.
            </p>
          </div>

          <div>
            <h3 className="footer__section-title">Platform</h3>
            <nav className="footer__links">
              <Link href="/vision" className="footer__link">
                Onze Visie
              </Link>
              <Link href="/platform" className="footer__link">
                Hoe het werkt
              </Link>
              <Link href="/auth/register" className="footer__link">
                Registreren
              </Link>
              <Link href="/auth/login" className="footer__link">
                Inloggen
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="footer__section-title">Support</h3>
            <nav className="footer__links">
              <Link href="/about" className="footer__link">
                Over ons
              </Link>
              <a href="mailto:info@bees-platform.be" className="footer__link">
                Contact
              </a>
            </nav>
          </div>
        </div>

        <div className="footer__bottom">
          © {currentYear} Voor Imkers Platform · Alle rechten voorbehouden
        </div>
      </div>
    </footer>
  );
}
