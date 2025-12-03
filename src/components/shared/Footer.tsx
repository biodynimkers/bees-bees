"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section footer__section--main">
            <h4 className="footer__title">Bees Platform</h4>
            <p className="footer__text">
              Moderne digitale oplossing voor professioneel bijenbeheer.
              Ontwikkeld door imkers, voor imkers.
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Platform</h4>
            <nav className="footer__nav">
              <Link href="/" className="footer__link">
                Home
              </Link>
              <Link href="/about" className="footer__link">
                Over Ons
              </Link>
              <Link href="/account/apiaries" className="footer__link">
                Mijn Kasten
              </Link>
            </nav>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Contact</h4>
            <a href="mailto:info@bees.be" className="footer__link">
              info@bees.be
            </a>
            <p className="footer__text">Biodyn Imkers vzw</p>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Bees Platform — Alle rechten voorbehouden
          </p>
        </div>
      </div>
    </footer>
  );
}
