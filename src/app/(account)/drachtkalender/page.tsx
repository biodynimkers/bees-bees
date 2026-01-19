import DrachtkalenderSection from '@/components/shared/DrachtkalenderSection';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default function DrachtkalenderPage() {
  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <h1 className="platform-hero__title">Drachtkalender</h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.9)', marginTop: '12px' }}>
              Bloeiperiodes van belangrijke bijenplanten door het jaar heen
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[
        { label: 'Account', href: '/account' },
        { label: 'Drachtkalender' }
      ]} />

      <section className="home-features">
        <div className="container">
          <div className="info-box info-box--warning" style={{ marginBottom: 'var(--s-10)' }}>
            <p>
              <strong>Let op:</strong> Dit is een algemene drachtkalender voor België/Nederland. 
              De exacte bloeiperiodes kunnen variëren per locatie en weersomstandigheden.
            </p>
          </div>
          <DrachtkalenderSection />
        </div>
      </section>
    </div>
  );
}
