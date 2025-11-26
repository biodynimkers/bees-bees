"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer__container">
      <div className="footer__section">
        <h4 className="footer__title">Bees</h4>
        <p className="footer__text">
          Professioneel bijenkasten beheer voor moderne imkers
        </p>
      </div>

      <div className="footer__section">
        <h4 className="footer__title">Navigatie</h4>
        <nav className="footer__nav">
          <Link href="/" className="footer__link">
            Home
          </Link>
          <Link href="/about" className="footer__link">
            Over Ons
          </Link>
          <Link href="/account/apiaries" className="footer__link">
            Bijenkasten
          </Link>
        </nav>
      </div>

      <div className="footer__section">
        <h4 className="footer__title">Contact</h4>
        <p className="footer__text">info@bees.be</p>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          © {currentYear} Bees. Alle rechten voorbehouden.
        </p>
      </div>
    </div>
  );
}
