import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export default function AdminPage() {
  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">Admin</span>
            <h1 className="platform-hero__title">Beheerder Dashboard</h1>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Admin' }]} />

      <section className="home-features">
        <div className="container">
          <div className="home-features__grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '1200px', margin: '0 auto' }}>
            <Link href="/admin/users" className="feature-card">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '8px', color: 'rgb(14, 97, 93)' }}>
                Gebruikers
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(14, 97, 93, 0.7)' }}>
                Beheer alle gebruikers en hun rechten
              </p>
            </Link>

            <Link href="/admin/apiaries" className="feature-card">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '8px', color: 'rgb(14, 97, 93)' }}>
                Bijenstanden
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(14, 97, 93, 0.7)' }}>
                Overzicht van alle bijenstanden
              </p>
            </Link>

            <Link href="/admin/hives" className="feature-card">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '8px', color: 'rgb(14, 97, 93)' }}>
                Behuizingen
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(14, 97, 93, 0.7)' }}>
                Overzicht van alle bijenbehuizingen
              </p>
            </Link>

            <Link href="/admin/observations" className="feature-card">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '8px', color: 'rgb(14, 97, 93)' }}>
                Waarnemingen
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(14, 97, 93, 0.7)' }}>
                Alle geregistreerde waarnemingen
              </p>
            </Link>

            <Link href="/admin/stats" className="feature-card">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '8px', color: 'rgb(14, 97, 93)' }}>
                Statistieken
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(14, 97, 93, 0.7)' }}>
                Platform statistieken en analyses
              </p>
            </Link>

            <Link href="/admin/extras" className="feature-card">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '8px', color: 'rgb(14, 97, 93)' }}>
                Extra's
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(14, 97, 93, 0.7)' }}>
                Beheer hero afbeelding en content
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
