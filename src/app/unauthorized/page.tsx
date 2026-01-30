import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">403</span>
            <h1 className="platform-hero__title">Geen toegang</h1>
            <p
              className="platform-hero__intro"
              style={{ marginBottom: '1.5rem' }}
            >
              Je hebt geen toegang tot deze pagina. Neem contact op met de
              beheerder als je denkt dat dit een fout is.
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
