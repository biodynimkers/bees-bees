import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">404</span>
            <h1 className="platform-hero__title">Pagina niet gevonden</h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.9)', marginTop: '12px', marginBottom: '24px' }}>
              De opgevraagde pagina bestaat niet of is verplaatst.
            </p>
            <Link href="/" className="btn btn--secondary">
              Terug naar home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
