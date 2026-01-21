import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdminCard from '@/components/admin/AdminCard';

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
          <div className="home-features__grid">
            <AdminCard
              href="/admin/users"
              title="Gebruikers"
              description="Beheer alle gebruikers en hun rechten"
            />
            <AdminCard
              href="/admin/apiaries"
              title="Bijenstanden"
              description="Overzicht van alle bijenstanden"
            />
            <AdminCard
              href="/admin/hives"
              title="Behuizingen"
              description="Overzicht van alle bijenbehuizingen"
            />
            <AdminCard
              href="/admin/observations"
              title="Waarnemingen"
              description="Alle geregistreerde waarnemingen"
            />
            <AdminCard
              href="/admin/stats"
              title="Statistieken"
              description="Platform statistieken en analyses"
            />
            <AdminCard
              href="/admin/extras"
              title="Extra's"
              description="Beheer hero afbeelding en content"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
