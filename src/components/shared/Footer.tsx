import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/assets/logo-footer.png" alt="Logo" className="footer__logo-image" />
              <span className="text-small">Biodynamische Imkers Vlaanderen</span>
            </div>
            <p className="footer__tagline">
              Digitaal imkeren voor de moderne bijhouder.
            </p>
          </div>
          
          <div className="footer__links">
            <div className="footer__column">
              <h3 className="heading-tertiary">Platform</h3>
              <nav className="footer__nav">
                <Link href="/vision" className="footer__link">Onze Visie</Link>
                <Link href="/platform" className="footer__link">Hoe het werkt</Link>
                <Link href="/about" className="footer__link">Over ons</Link>
              </nav>
            </div>
            
            <div className="footer__column">
              <h3 className="heading-tertiary">Account</h3>
              <nav className="footer__nav">
                <Link href="/auth/register" className="footer__link">Registreren</Link>
                <Link href="/auth/login" className="footer__link">Inloggen</Link>
              </nav>
            </div>
            
            <div className="footer__column">
              <h3 className="heading-tertiary">Contact</h3>
              <nav className="footer__nav">
                <Link href="/contact" className="footer__link">Contact</Link>
                <a href="mailto:info@bees-platform.be" className="footer__link">Email</a>
              </nav>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {currentYear} BEES Platform. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
}
