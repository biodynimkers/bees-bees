import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          {/* Logo & Tagline */}
          <div className="footer__brand">
            <Link href="/" className="nav__logo">
              <img src="/assets/logo-footer.png" alt="BEES Platform" className="nav__logo-image" />
              <span className="nav__logo-text">Biodynamische Imkers Vlaanderen</span>
            </Link>
          </div>
          
          {/* Navigation Columns */}
          <div className="footer__column">
            <h4 className="footer__heading">Platform</h4>
            <nav className="footer__nav">
              <Link href="/platform" className="footer__link">Overzicht</Link>
              <Link href="/contact" className="footer__link">Contact</Link>
            </nav>
          </div>

          <div className="footer__column">
            <h4 className="footer__heading">Account</h4>
            <nav className="footer__nav">
              <Link href="/auth/login" className="footer__link">Inloggen</Link>
              <Link href="/auth/register" className="footer__link">Registreren</Link>
              <Link href="/account" className="footer__link">Mijn account</Link>
            </nav>
          </div>

          <div className="footer__column">
            <h4 className="footer__heading">Contact</h4>
            <nav className="footer__nav">
              <a href="mailto:info@bees-platform.be" className="footer__link">info@bees-platform.be</a>
              <a href="https://www.biodynimkers.be" target="_blank" rel="noopener noreferrer" className="footer__link">biodynimkers.be</a>
            </nav>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">© {currentYear} BEES Platform. Alle rechten voorbehouden.</p>
          <div className="footer__legal">
            <Link href="#">Privacy</Link>
            <Link href="#">Cookies</Link>
            <Link href="#">Voorwaarden</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
